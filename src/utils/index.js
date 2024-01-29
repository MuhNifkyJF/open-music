const mapSongsToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({ id, title, year, performer, genre, duration, albumId: album_id });

const mapAlbumsToModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});
const mapDBToModel = ({ playlist_id, song_id }) => ({
  playlistId: playlist_id,
  songId: song_id,
});
module.exports = { mapSongsToModel, mapAlbumsToModel, mapDBToModel };
