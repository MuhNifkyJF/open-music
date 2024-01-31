const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exception/NotFoundError");

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistsong(playlistId, songId) {
    await this.verifySong(songId);
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }

    return result.rows[0].id;
  }

  async verifySong(songId) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length > 0)
      throw new NotFoundError("Lagu tidak ditemukan");
  }

  async getPlaylistsongs(playlistId) {
    const query = {
      text: `SELECT playlists.id AS playlist_id, playlists.name AS playlist_name, users.username, songs.id AS song_id, songs.title AS song_title, songs.performer AS song_performer
            FROM playlists
            LEFT JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
            LEFT JOIN songs ON songs.id = playlistsongs.song_id
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("gudu tidak ditemukan");
    }

    const playlistSongs = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].playlist_name,
      username: result.rows[0].username,
      songs: result.rows.map((song) => ({
        id: song.song_id,
        title: song.song_title,
        performer: song.song_performer,
      })),
    };
    return playlistSongs;
  }

  async deletePlaylistsong(songId, playlistId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id",
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal dihapus dalam playlist");
    }
  }
}
module.exports = PlaylistsongsService;
