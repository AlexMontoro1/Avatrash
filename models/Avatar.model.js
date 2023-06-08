const { Schema, model } = require("mongoose");

const avatarSchema = new Schema({
  seed: String,
  flip: Boolean,
  rotate: {
    type: Number,
    min: 0,
    max: 360,
  },
  scale: {
    type: Number,
    min: 0,
    max: 200,
  },
  radius: {
    type: Number,
    min: 0,
    max: 50,
  },
  size: {
    type: Number,
    min: 1,
  },
  backgroundColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  backgroundType: Array,
  backgroundRotation: Array,
  translateX: {
    type: Number,
    min: -100,
    max: 100,
  },
  translateY: {
    type: Number,
    min: -100,
    max: 100,
  },
  clip: Boolean,
  randomizeIds: Boolean,
  accessories: Array,
  accessoriesColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  accessoriesProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  base: Array,
  clothesColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  clothing: Array,
  clothingGraphic: Array,
  eyebrows: Array,
  eyes: Array,
  facialHair: Array,
  facialHairColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  facialHairProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  hairColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  hatColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  mouth: Array,
  nose: Array,
  skinColor: {
    type: Array,
    validate: function (value) {
      const regex = /^(transparent|[a-fA-F0-9]{6})$/;
      return value.every((color) => regex.test(color));
    },
  },
  style: Array,
  top: Array,
  topProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
  },
  name: String,
  json: {
    svg: String
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
},
{   
  timestamps: true
}
);

const Avatar = model("Avatar", avatarSchema);

module.exports = Avatar;
