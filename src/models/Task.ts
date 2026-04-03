import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  dueDate?: Date;
  createdBy: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    dueDate: { type: Date, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false },
);

taskSchema.index({ project: 1, createdAt: -1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
