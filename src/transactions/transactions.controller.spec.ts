import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { QueryTransactionDto } from './query-transactions.dto';

@UseGuards(AuthGuard('jwt')) // Secure all endpoints in this controller
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query() queryDto: QueryTransactionDto) {
    return this.transactionsService.findAll(queryDto);
  }

  @Get('status/:id')
  findStatusById(@Param('id') id: string) {
    return this.transactionsService.findStatusById(id);
  }
}

