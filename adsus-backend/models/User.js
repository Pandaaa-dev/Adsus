const mongoose = require("mongoose");

// THIS IS THE ONLY MONGO DB MODEL. THE OTHERS ARE MYSQL MODELS SO THEYRE CLASS BASED AND THIS IS SCHEMA BASED

let UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    account_status: {
      type: String,
      default: "Active",
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
      require: true,
    },
    points: {
      type: Number,
      require: true,
      default: 0
    },
    ads_played: {
      type: Number,
      required: true,
      default: 0
    },
    role: {
      type: Number,
      required: true,
      default: 1
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
