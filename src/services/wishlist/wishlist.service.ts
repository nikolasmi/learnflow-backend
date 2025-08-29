import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/entities/wishlist';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({ relations: ['user', 'course'] });
  }

  async findByUser(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['course'],
    });
  }

  async addToWishlist(userId: number, courseId: number): Promise<Wishlist> {
    const exists = await this.wishlistRepository.findOne({
      where: { userId, courseId },
    });

    if (exists) {
      return exists;
    }

    const wishlistItem = this.wishlistRepository.create({ userId, courseId });
    return this.wishlistRepository.save(wishlistItem);
  }

  async removeFromWishlist(userId: number, courseId: number): Promise<void> {
    await this.wishlistRepository.delete({ userId, courseId });
  }

  async removeById(wishlistId: number): Promise<void> {
    await this.wishlistRepository.delete({ wishlistId });
  }
}
