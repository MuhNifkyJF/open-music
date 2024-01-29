/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("playlists", {
    owner: {
      type: "VARCHAR(50)",
      notNull:true
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlists", "owner");
};