import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, strict: false }) // strict: false allows storing any object shape
export class WebhookLog extends Document {
  @Prop({ type: Object })
  payload: any;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);