import mongoose from 'mongoose';

const CommentModel = new mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    _id: String,
    fullName: String,
  },
  todo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TodoModel',
  },
});
export default mongoose.model('CommentModel', CommentModel);
