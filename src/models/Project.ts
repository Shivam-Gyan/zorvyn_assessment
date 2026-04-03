import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, versionKey: false },
);

projectSchema.index({ name: 1, owner: 1 }, { unique: true });

export const Project = mongoose.model<IProject>('Project', projectSchema);
