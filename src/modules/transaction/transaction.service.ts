import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { parseTimestamp, parseWeiToEth } from 'src/helpers';
import { Transaction } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getWalletTransactions(address: string) {
    const response = await lastValueFrom(
      this.httpService.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.API_KEY}`,
      ),
    );

    if (!response) throw new Error('Transactions not Found');

    const parsedResponse: Transaction[] = response.data.result.map((item) => {
      return {
        date: parseTimestamp(Number(item.timeStamp)),
        from: item.from,
        to: item.to,
        value: parseWeiToEth(item.value),
      };
    });

    parsedResponse.map(async (transaction: Transaction) => {
      const createdTransaction = new this.transactionModel(transaction);
      await createdTransaction.save();
    });

    Promise.all(parsedResponse);

    return parsedResponse;
  }

  async getWalletTransactionsDB(address: string) {
    const response = await this.transactionModel.find({
      from: address,
    });

    if (!response) throw new Error('Transactions not Found');

    return response;
  }
}
