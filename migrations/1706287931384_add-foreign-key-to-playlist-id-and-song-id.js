/* eslint-disable camelcase */

exports.shorthands = undefined;
exports.up = (pgm) => {
  // menghindari duplikasi data dengan memberi nilai unique antara kedua field
  pgm.addConstraint(
    "playlistsongs",
    "unique_palylist_id_and_song_id",
    "UNIQUE(playlist_id,song_id)"
  );

  //foreign key antara tabel playlistsong dengan tabel playlists
  pgm.addConstraint(
    "playlistsongs",
    "fk_playlistsongs.playlist_id_playlist.id",
    "FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
  //foreign key antara tabel playlistsong dengan tabel songs
  pgm.addConstraint(
    "playlistsongs",
    "fk_playlistsongs.song_id_song.id",
    "FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    "playlistsongs",
    "fk_playlistsongs.playlist_id_playlist.id"
  );
  pgm.dropConstraint("playlistsongs", "fk_playlistsongs.song_id_song.id");
};
