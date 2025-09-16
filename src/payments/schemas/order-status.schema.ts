import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Order } from './order.schema';
import { HydratedDocument } from 'mongoose';

export type OrderStatusDocument = HydratedDocument<OrderStatus>;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  collect_id: Order;

  @Prop({ required: true })
  order_amount: number;

  @Prop()
  transaction_amount: number;

  @Prop()
  payment_mode: string;

  @Prop()
  payment_details: string;

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

  @Prop({ index: true })
  gateway_order_id: string;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

