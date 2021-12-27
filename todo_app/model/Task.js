const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  taskname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  },
  userid: {
    type: String
  },
  username: {
    type: String
  }
});

// export model user with TaskSchema
module.exports = mongoose.model("tasks", TaskSchema);