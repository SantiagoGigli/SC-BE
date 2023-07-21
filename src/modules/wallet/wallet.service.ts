import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { parseWeiToEth } from 'src/helpers';
import { CurrencyBody, FavoriteBody } from 'src/interfaces';
import { Wallet } from 'src/schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  async getWalletsFromAPI() {
    const response = await lastValueFrom(
      this.httpService.get(
        `https://api.etherscan.io/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=${process.env.API_KEY}`,
      ),
    );

    if (!response) throw new Error('Wallets not Found');

    const parsedResponse: Wallet[] = response.data.result.map(
      (item: Wallet) => {
        return {
          account: item.account,
          balance: parseWeiToEth(item.balance),
        };
      },
    );

    parsedResponse.map(async (wallet: Wallet) => {
      const createdWallets = new this.walletModel(wallet);
      await createdWallets.save();
    });

    Promise.all(parsedResponse);

    return parsedResponse;
  }

  async getWalletsFromDB() {
    const response: Wallet[] = await this.walletModel.find();

    if (!response) throw new Error('DB wallets not Found');

    return response;
  }

  async getWalletFromDB(address: string) {
    const response: Wallet[] = await this.walletModel.findOne({
      account: address,
    });

    if (!response) throw new Error('DB wallet not Found');

    return response;
  }

  async setWalletAsFavorite(address: string, body: FavoriteBody) {
    const { isFavorite } = body;

    const response = await this.walletModel.findOneAndUpdate(
      { account: address },
      { isFavorite: isFavorite },
      { new: true },
    );

    if (!response) throw new Error('Can not set wallet as favorite');

    const responseWallets: Wallet[] = await this.walletModel.find();

    if (!responseWallets) throw new Error('DB wallets not Found');

    return responseWallets;
  }

  async changeCurrency(address: string, body: CurrencyBody) {
    const { amount, currency } = body;

    const response = await this.walletModel.findOneAndUpdate(
      { account: address },
      { balance: amount, currency: currency },
      { new: true },
    );

    if (!response) throw new Error('Can not set wallet as favorite');

    const responseWallet: Wallet[] = await this.walletModel.findOne({
      account: address,
    });

    if (!responseWallet) throw new Error('DB wallet not Found');

    return responseWallet;
  }
}
