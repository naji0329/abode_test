const mongoose = require('mongoose');

const eventSchedma = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true,
  },
  invitees: {
    type: [String],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Event', eventSchedma);