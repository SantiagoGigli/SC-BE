import { Module } from '@nestjs/common';
import { WalletModule } from './modules/wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    WalletModule,
    TransactionModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
