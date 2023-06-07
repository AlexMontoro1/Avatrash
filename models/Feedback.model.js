const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  contentLike: {
    type: String,
    required: true,
    unique: false,
  },
  contentDislike: {
    type: String,
    required: true,
    unique: false,
  },

},
{
  // this second object adds extra properties: `createdAt` and `updatedAt`    
  timestamps: true
},
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;