require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require('@hapi/inert');
const path = require("path");
const ClientError = require("./exception/ClientError");

// albums
const albums = require("./api/albums");
const { albumsValidator } = require("./validator/albums");
const AlbumsService = require("./services/postgres/AlbumsService");
// songs
const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const { SongsValidator } = require("./validator/songs");
//users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");
// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const AuthenticationsValidator = require("./validator/authentications");
const TokenManager = require("./tokenize/TokenManager");
//playlists
const playlists = require("./api/playlists");
const PlaylistsValidator = require("./validator/playlists");
const PlaylistsService = require("./services/postgres/PlaylistsService");
//playlistsong
const playlistsongs = require("./api/playlistsongs");
const PlaylistsongService = require("./services/postgres/PlaylistsongsService");
const PlaylistsongValidator = require("./validator/playlistsongs");
// Exports
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");
// uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");
//albumlikes
const albumlikes = require("./api/albumlikes");
const AlbumlikesService = require("./services/postgres/AlbumlikesService");
//cache
const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(cacheService);
  const playlistsongService = new PlaylistsongService();
  
  const albumlikesService = new AlbumlikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("playlists_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsongService: playlistsongService,
        playlistService: playlistsService,
        validator: PlaylistsongValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistsongService: playlistsongService,
        playlistService: playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        albumService: albumsService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: albumlikes,
      options: {
        albumsService: albumsService,
        service: albumlikesService,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks dari request
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native seperti 404 etc
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan error seseuai kebutuhan
      console.log(response);
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa intervensi)
    return h.continue;
  });

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
