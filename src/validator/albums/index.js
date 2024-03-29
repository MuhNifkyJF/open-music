const InvariantError = require("../../exception/InvariantError");
const { AlbumPayloadSchema } = require("./schema");

const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { albumsValidator };
