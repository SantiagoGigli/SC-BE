import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop()
  date: string;

  @Prop()
  from: string;

  @Prop()
  to: string;

  @Prop()
  value: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
