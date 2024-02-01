

exports.up = (pgm) => {
  pgm.addConstraint(
    "albumlikes",
    "fk_albumlikes.user_id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "albumlikes",
    "fk_albumlikes.album_id",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.addConstraint("albumlikes", "fk_albumlikes.user_id");

  pgm.addConstraint("albumlikes", "fk_albumlikes.album_id");
};
