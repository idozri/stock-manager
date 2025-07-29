import { IsNotEmpty, IsString } from 'class-validator';
import { StockDto } from './stock.dto';

export class AddUserStocksRequestDto extends StockDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
