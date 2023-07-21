import { CurrencyBody, FavoriteBody } from 'src/interfaces';
import { WalletService } from './wallet.service';
import {
  Controller,
  Get,
  Patch,
  NotFoundException,
  Param,
  Body,
  Put,
} from '@nestjs/common';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/api')
  getWallets() {
    try {
      return this.walletService.getWalletsFromAPI();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Get()
  getDBWallets() {
    try {
      return this.walletService.getWalletsFromDB();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Get(':address')
  getDBWallet(@Param('address') address: string) {
    try {
      return this.walletService.getWalletFromDB(address);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Patch('/favorite/:address')
  setAsFavorite(@Param('address') address: string, @Body() body: FavoriteBody) {
    try {
      return this.walletService.setWalletAsFavorite(address, body);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Put('/changeCurrency/:address')
  changeCurrency(
    @Param('address') address: string,
    @Body() body: CurrencyBody,
  ) {
    try {
      return this.walletService.changeCurrency(address, body);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
