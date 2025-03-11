const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'An item is required for the conversation'],
    index: true,
  },
  participants: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    required: [true, 'Participants are required'],
    validate: [
      {
        validator: (arr) => arr.length >= 2,
        msg: 'A conversation must have at least two participants',
      },
      {
        validator: (arr) => new Set(arr).size === arr.length,
        msg: 'Participants must be unique',
      },
    ],
    index: true,
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

conversationSchema.index({ item: 1, participants: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);