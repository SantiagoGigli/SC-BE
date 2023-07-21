import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/api/:address')
  getWalletTransactions(@Param('address') address: string) {
    try {
      return this.transactionService.getWalletTransactions(address);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Get(':address')
  getWalletTransactionsDB(@Param('address') address: string) {
    try {
      return this.transactionService.getWalletTransactionsDB(address);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
