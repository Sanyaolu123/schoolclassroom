const mongoose = require("mongoose");

const CreateClassSchema = new mongoose.Schema({
  timeId:{
    type: String,
    required: true
  },
  course:{
    type: String,
    required: true
  },
  topic:{
    type:String,
    required: true
  },
  classInfo:{
    type: String,
    required: true
  },
  LiveStream:{
    type:String,
    enum:["yes", "no"],
    required: true
  },
  teacherLogin:{
    type:String,
    enum:["yes", "no"],
    required:true
  },
  teacher:{
    type:String,
    required: true
  },
  teacherRegNo:{
    type:String,
    required: true
  },
  classDuration:{
    type: String,
    required: true
  },
  Durate:{
    type:String,
    required: true
  },
  document:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required: true
  },
  hashedPassword:{
    type:String,
    required:true
  },
  link: {
    type: String,
    required: true
  },
  expired:{
    type: String,
    required: true,
    enum: ["yes", "no"]
  }
})

module.exports = mongoose.model("Class", CreateClassSchema);