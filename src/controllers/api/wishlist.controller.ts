import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { WishlistService } from 'src/services/wishlist/wishlist.service';

@Controller('api/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getAll() {
    return this.wishlistService.findAll();
  }

  @Get(':userId')
  async getByUser(@Param('userId') userId: number) {
    return this.wishlistService.findByUser(userId);
  }

  @Post()
  async addToWishlist(
    @Body('userId') userId: number,
    @Body('courseId') courseId: number,
  ) {
    return this.wishlistService.addToWishlist(userId, courseId);
  }

  @Delete(':wishlistId')
  async removeFromWishlistById(@Param('wishlistId') wishlistId: number) {
    return this.wishlistService.removeById(wishlistId);
  }
}
