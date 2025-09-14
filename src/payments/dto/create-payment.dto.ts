import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsUrl({}, { message: 'A valid callback URL is required.' })
  @IsNotEmpty()
  callback_url: string;
}
