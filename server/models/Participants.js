const mongoose = require("mongoose");

const Participants = new mongoose.Schema({
  class:{
    type: String,
    required: true,
    enum: ["science, arts, commercial"]
  },
  participants:{
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("Participants", Participants)