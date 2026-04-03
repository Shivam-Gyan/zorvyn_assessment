import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['income', 'expense'], required: true, index: true },
    category: { type: String, required: true, trim: true, minlength: 2, maxlength: 80, index: true },
    date: { type: Date, required: true, index: true },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

transactionSchema.index({ createdBy: 1, date: -1 });
transactionSchema.index({ createdBy: 1, type: 1, category: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
