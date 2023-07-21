import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Currencies } from 'src/enum';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema()
export class Wallet {
  @Prop()
  balance: number;

  @Prop()
  account: string;

  @Prop({ default: false })
  isFavorite?: boolean;

  @Prop({ enum: Currencies, default: Currencies.ETH })
  currency: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
