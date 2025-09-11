// src/payments/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// This defines the structure for the nested student_info object
@Schema({ _id: false })
export class StudentInfo {
  @Prop()
  name: string;

  @Prop()
  id: string;

  @Prop()
  email: string;
}

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true }) // [cite: 16]
  school_id: string;

  @Prop({ required: true }) // [cite: 17]
  trustee_id: string;

  @Prop({ type: StudentInfo }) // [cite: 18]
  student_info: StudentInfo;

  @Prop() // [cite: 24]
  gateway_name: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);