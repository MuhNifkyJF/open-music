const { nanoid } = require("nanoid");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");

class OpenMusicService {
  constructor() {
    this._album = [];
    this._song = [];
  }

  addAlbum({ name, year }) {
    const id = nanoid(16);

    const newMusics = { id, name, year };

    this._album.push(newMusics);

    const isSuccess = this._album.filter((music) => music.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    return id;
  }

  getAlbums() {
    return this._album;
  }

  getAlbumById(id) {
    const album = this._album.filter((x) => x.id === id)[0];
    if (!album) {
      throw new NotFoundError("Album tidak ditemukan");
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    const index = this._album.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }

    this._album[index] = {
      ...this._album[index],
      name,
      year,
    };
  }

  deleteAlbumById(id) {
    const index = this._album.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
    this._album.splice(index, 1);
  }

  addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);

    const newSong = { id, title, year,performer, genre,  duration, albumId };

    this._song.push(newSong);
    const isSuccess = this._song.filter((song) => song.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError("Musik gagal ditambahkan");
    }
    return id;
  }

  getSongs() {
    return this._song;
  }

  getSongById(id) {
    const songs = this._song.filter((song) => song.id === id)[0];

    if (!songs) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
    return songs;
  }
  editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const index = this._song.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui Lagu. Id tidak ditemukan");
    }

    this._song[index] = {
      ...this._song[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this._song.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal menghapus catatan. Id tidak ditemukan");
    }
    this._song.splice(index, 1);
  }
}

module.exports = OpenMusicService;
