const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    transaction: Number,
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

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;