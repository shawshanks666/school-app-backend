// src/payments/schemas/order-status.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from './order.schema';

export type OrderStatusDocument = HydratedDocument<OrderStatus>;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  collect_id: Order;

  @Prop() // [cite: 32]
  order_amount: number;

  @Prop() // [cite: 32]
  transaction_amount: number;

  @Prop() // [cite: 32]
  payment_mode: string;

  @Prop() // [cite: 32]
  payment_details: string;

  @Prop() // [cite: 32]
  bank_reference: string;

  @Prop() // [cite: 32]
  payment_message: string;

  @Prop() // [cite: 32]
  status: string;

  @Prop() // [cite: 32]
  error_message: string;

  @Prop() // [cite: 32]
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);