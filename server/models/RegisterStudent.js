const mongoose = require("mongoose");


const StudentSchema = new mongoose.Schema({
  timeId:{
    type:String,
    required:true
  },
  fname: {
    type: String,
    required: true
  },
  mname:{
    type: String,
    required: true
  },
  lname:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  course:{
    type: String,
    required: true
  },
  transfer:{
    type: String,
    enum: ["yes", "no"],
    required: true
  },
  gender:{
    type:String,
    enum: ["male", "female"],
    required: true
  },
  username:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required:true
  }
})


module.exports = mongoose.model("Student", StudentSchema);