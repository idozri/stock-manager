import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserStocksRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
