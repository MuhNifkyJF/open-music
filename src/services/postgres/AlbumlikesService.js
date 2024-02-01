const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");
const ClientError = require("../../exception/ClientError");

class AlbumlikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this.cacheService = cacheService;
  }

  async addAlbumlikes(userId, albumId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO albumlikes VALUES($1,$2,$3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal menyukai album");
    }

    await this.cacheService.delete(`albumlikes:${albumId}`);
  }

  async deleteAlbumlikes(userId, albumId) {
    const query = {
      text: "DELETE FROM albumlikes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal menyukai album");
    }

    await this.cacheService.delete(
      `albumlikes:${albumId}`,
      JSON.stringify(result.rowCount)
    );
  }
  async getAlbumlikes(albumId) {
    try {
        const result = await this.cacheService.get(`albumlikes:${albumId}`);
        return { likes: JSON.parse(result), source: "cache" };
    } catch (error) {
        const query = {
            text: " SELECT * FROM albumlikes WHERE album_id = $1",
            values: [albumId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("Album tidak ditemukan");
        }

        await this.cacheService.set(
            `albumlikes:${albumId}`,
            JSON.stringify(result.rowCount)
        );

        return {
            likes: result.rowCount,
            source: "database",
        };
    }
}

  async verifyAlbumlikes(userId, albumId) {
    const query = {
      text: "SELECT * FROM albumlikes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new ClientError("Anda sudah menyukai album ini");
    }
  }
}

module.exports = AlbumlikesService;
