const { Schema, model } = require("mongoose");

const inspirationSchema = new Schema(
  {
    text: String,
    tag: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Inspiration = model("Inspiration", inspirationSchema);

module.exports = Inspiration;