const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");
const AuthorizationError = require("../../exception/AuthorizationError");
class PlaylistsService {
  constructor(cacheservice) {
    this._pool = new Pool();
    this.cacheService = cacheservice;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1,$2,$3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    await this.cacheService.delete(`playlist:${owner}`);
    return result.rows[0].id;
  }
  async getPlaylists(owner) {
    try {
      const result = await this.cacheService.get(`playlist:${owner}`);
      return { likes: JSON.parse(result), source: "cache" };
    } catch (error) {
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username FROM playlists
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1 GROUP BY playlists.id, users.username`,
        values: [owner],
      };

      const result = await this._pool.query(query);
      await this.cacheService.set(
        `playlist:${owner}`,
        JSON.stringify(result.rows)
      );

      return {
        playlist: result.rows,
        source: "database",
      };
    }
  }
  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id=$1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus, Id tidak ditemukan");
    }
    await this.cacheService.delete(
      `playlist:${id}`,
      JSON.stringify(result.rowCount)
    );
  }
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Bapa tidak ditemukan");
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}
module.exports = PlaylistsService;
