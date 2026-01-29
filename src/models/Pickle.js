const mongoose = require('mongoose');

const { Schema } = mongoose;

const pickleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String
    },
    ingredients: [
      {
        type: String,
        trim: true
      }
    ],
    pickleSlug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Pickle = mongoose.model('Pickle', pickleSchema);

module.exports = Pickle;

