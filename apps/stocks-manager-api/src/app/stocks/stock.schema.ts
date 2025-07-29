import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Stock extends Document {
  @Prop({ type: String, required: true })
  symbol: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: Number, default: 0 })
  changePercent: number;

  @Prop({ type: Number, default: 0 })
  change: number;

  @Prop({ type: String })
  exchange?: string;

  @Prop({ type: Number })
  marketCap?: number;

  @Prop({ type: Number })
  volume?: number;

  @Prop({ type: Date })
  lastUpdated?: Date;
}

// Add a compound index for user-specific queries
export const StockSchema = SchemaFactory.createForClass(Stock);
StockSchema.index({ userId: 1, symbol: 1 }, { unique: true });
