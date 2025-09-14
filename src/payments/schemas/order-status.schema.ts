import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Order } from './order.schema';


@Schema({ timestamps: true })
export class OrderStatus extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  collect_id: Order;

  @Prop({ required: true })
  order_amount: number;

  @Prop()
  transaction_amount: number;

  @Prop()
  payment_mode: string;

  @Prop()
  payment_details: string; // The field we added previously

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop()
  error_message: string;

  @Prop()
  payment_time: Date;

  // --- THIS IS THE MISSING FIELD ---
  @Prop({ index: true }) // Added index for faster lookups
  gateway_order_id: string;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

