const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    geoLocation: {
      // You can adapt this structure later (e.g. GeoJSON)
      type: {
        lat: { type: Number },
        lng: { type: Number }
      },
      required: false
    },
    address: {
      type: String
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Pickle'
      }
    ],
    role: {
      type: String,
      enum: ['admin', 'dev', 'user'],
      default: 'user'
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

