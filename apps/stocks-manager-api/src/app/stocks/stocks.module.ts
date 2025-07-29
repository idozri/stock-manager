import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { FmpApiService } from './fmp-api.service';
import { Stock, StockSchema } from './stock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    ConfigModule,
    HttpModule,
    CacheModule.register({
      ttl: 300, // 5 minutes cache
      max: 100, // maximum 100 cached items
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [StocksController],
  providers: [StocksService, FmpApiService],
  exports: [StocksService, FmpApiService],
})
export class StocksModule {}
