const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    image: {
      type: String 
    },
    likedAvatars:[{
      type: Schema.Types.ObjectId,
      ref: "Avatar"
    }],
    role:{
      type:String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
