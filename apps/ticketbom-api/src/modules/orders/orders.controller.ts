import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Authentication, CognitoUser } from '@nestjs-cognito/auth';
import { StartOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Authentication()
  async startOrder(@Body() dto: StartOrderDto, @CognitoUser() user) {
    console.log({ user });
    return this.ordersService.startOrder({
      userId: user.sub,
      tickets: dto.tickets,
    });
  }
}
