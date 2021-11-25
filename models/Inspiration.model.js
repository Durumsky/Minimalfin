const { Schema, model } = require("mongoose");

const inspirationSchema = new Schema(
  {
    text: String,
    tag: String,
    user: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Inspiration = model("Inspiration", inspirationSchema);

module.exports = Inspiration;