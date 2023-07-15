import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPublic: {
      type: Boolean,
    },
    isDone: {
      type: Boolean,
      required: true,
    },
    user: {
      //Connection between tables
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      require: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    //date of creation and updated
    timestamps: true,
  },
);

export default mongoose.model('TodoModel', TodoSchema);
