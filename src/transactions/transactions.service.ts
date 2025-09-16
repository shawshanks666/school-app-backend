import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderStatus, OrderStatusDocument } from 'src/payments/schemas/order-status.schema';
import { QueryTransactionDto } from './query-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(OrderStatus.name)
    private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  /**
   * Fetches a paginated, sorted, and filtered list of all transactions.
   */
  async findAll(queryDto: QueryTransactionDto) {
    // --- FIX: Ensure page and limit are valid numbers to prevent NaN ---
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const { schoolId, status, sortBy, order } = queryDto;
    
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    // --- Build the core matching and joining stages ---
    const pipeline: any[] = [];

    // Stage 1: Join with the 'orders' collection first
    pipeline.push({
      $lookup: {
        from: 'orders',
        localField: 'collect_id',
        foreignField: '_id',
        as: 'orderDetails',
      },
    });

    // Stage 2: Deconstruct the joined array
    pipeline.push({ $unwind: '$orderDetails' });

    // Stage 3: Build the match stage to filter results
    const matchStage: any = {};
    if (schoolId) {
      matchStage['orderDetails.school_id'] = schoolId;
    }
    if (status) {
      matchStage['status'] = status;
    }

    // Apply the match stage only if there are filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // --- Use $facet for efficient pagination and counting ---
    pipeline.push({
      $facet: {
        // Sub-pipeline for the actual data
        data: [
          { $sort: { [sortBy]: sortOrder } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              collect_id: '$_id',
              custom_order_id: '$_id',
              school_id: '$orderDetails.school_id',
              gateway: '$orderDetails.gateway_name',
              order_amount: '$order_amount',
              transaction_amount: '$transaction_amount',
              status: '$status',
              createdAt: '$createdAt',
            },
          },
        ],
        // Sub-pipeline to get the total count
        totalCount: [{ $count: 'count' }],
      },
    });

    const result = await this.orderStatusModel.aggregate(pipeline);

    const data = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }

  /**
   * Finds the status of a single transaction by its ID.
   */
  async findStatusById(id: string): Promise<{ status: string }> {
    const transaction = await this.orderStatusModel
      .findById(id)
      .select('status -_id')
      .lean()
      .exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }

    return transaction;
  }
}

