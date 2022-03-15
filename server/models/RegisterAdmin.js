const mongoose = require("mongoose");


const AdminSchema = new mongoose.Schema({
  timeId:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required: true
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
  gender:{
    type:String,
    enum: ["male", "female"],
    required: true
  },
  date:{
    type: String,
    required: true
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


module.exports = mongoose.model("admin", AdminSchema);