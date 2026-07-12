import mongoose, { Schema, Document, Model } from 'mongoose';

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ITicketMessage {
  _id?: mongoose.Types.ObjectId;
  sender: 'user' | 'admin';
  senderId?: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  orderId?: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: ITicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema(
  {
    sender: { type: String, enum: ['user', 'admin'], required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } }
);

const TicketSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: String, trim: true, index: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open', index: true },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true },
    messages: [TicketMessageSchema],
  },
  { timestamps: true }
);

TicketSchema.index({ status: 1, updatedAt: -1 });

const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
