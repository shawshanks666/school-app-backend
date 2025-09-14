import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments') // Changed route from 'payment' to 'payments'
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt')) // Protect this route
  @Post('create-payment')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPaymentOrder(createPaymentDto);
  }

  @Post('webhook') // This route MUST NOT be protected
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() payload: any) {
    // We don't wait for the promise to resolve to send back a quick 200 OK
    // This is best practice for webhooks to avoid timeouts from the sender.
    this.paymentsService.handleWebhook(payload);
    return { received: true };
  }
}
