import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { Order } from './schemas/order.schema';
import { OrderStatus } from './schemas/order-status.schema';
import { WebhookLog } from './schemas/webhook-log.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLog>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createPaymentOrder(createPaymentDto: CreatePaymentDto) {
    const { amount, callback_url } = createPaymentDto;
    const schoolId = this.configService.get<string>('SCHOOL_ID');
    const pgKey = this.configService.get<string>('PG_KEY');
    const apiKey = this.configService.get<string>('API_KEY');

    // 1. Create the JWT payload for the 'sign' field
    const jwtPayload = {
      school_id: schoolId,
      amount: amount.toString(),
      callback_url: callback_url,
    };

    const sign = jwt.sign(jwtPayload, pgKey);

    // 2. Create the main request body for the payment gateway
    const requestBody = {
      school_id: schoolId,
      amount: amount.toString(),
      callback_url,
      sign,
    };

    // 3. Set up the request headers
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const paymentApiUrl =
      'https://dev-vanilla.edviron.com/erp/create-collect-request';

    try {
      // 4. Send the request to the external payment gateway
      const response = await firstValueFrom(
        this.httpService.post(paymentApiUrl, requestBody, { headers }),
      );

      const gatewayResponseData = response.data;
      this.logger.log('Gateway Response Data:', gatewayResponseData);

      // Check if the expected data is present (with corrected casing)
      if (
        !gatewayResponseData ||
        !gatewayResponseData.collect_request_id ||
        !gatewayResponseData.collect_request_url
      ) {
        this.logger.error(
          'Invalid response structure from payment gateway',
          gatewayResponseData,
        );
        throw new InternalServerErrorException(
          'Received an invalid response from the payment provider.',
        );
      }
      const gatewayOrderId = gatewayResponseData.collect_request_id;

      // 5. Save order details to our database
      const newOrder = new this.orderModel({
        school_id: schoolId,
        trustee_id: '65b0e552dd31950a9b41c5ba',
        gateway_name: 'EdvironVanilla',
        order_amount: amount,
        student_info: {
          name: 'Placeholder Student',
          id: 'N/A',
          email: 'placeholder@example.com',
        },
      });
      await newOrder.save();

      const newOrderStatus = new this.orderStatusModel({
        collect_id: newOrder._id,
        order_amount: amount,
        status: 'INITIATED',
        gateway_order_id: gatewayOrderId,
      });
      await newOrderStatus.save();

      // 6. Return the payment link from the response (with corrected casing)
      return { payment_url: gatewayResponseData.collect_request_url };
    } catch (error) {
      this.logger.error('Error creating payment request:');
      this.logger.error(error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Failed to create payment request with the provider.',
      );
    }
  }

  async handleWebhook(payload: any) {
    await this.webhookLogModel.create({ payload });

    const orderInfo = payload.order_info;
    if (!orderInfo || !orderInfo.order_id) {
      this.logger.warn('Webhook received with invalid payload', payload);
      return;
    }

    const gatewayOrderId = orderInfo.order_id;
    await this.orderStatusModel.findOneAndUpdate(
      { gateway_order_id: gatewayOrderId },
      {
        status: orderInfo.status,
        transaction_amount: orderInfo.transaction_amount,
        bank_reference: orderInfo.bank_reference,
        payment_mode: orderInfo.payment_mode,
        payment_details: orderInfo.payemnt_details,
        payment_message: orderInfo.Payment_message,
        payment_time: new Date(orderInfo.payment_time),
        error_message: orderInfo.error_message,
      },
    );

    return { received: true };
  }
}

