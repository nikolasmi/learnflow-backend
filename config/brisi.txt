import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "src/entities/Review";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async createReview(userId: number, petId: number, rating: number, comment: string): Promise<Review> {
    const review = new Review();
    review.userId = userId;
    review.petId = petId;
    review.rating = rating;
    review.comment = comment;

    return await this.reviewRepository.save(review);
  }

  async getAllReviews(petId?: number): Promise<Review[]> {
    try {
      let reviewsQuery = this.reviewRepository.createQueryBuilder('review')
        .leftJoinAndSelect('review.pet', 'pet')
        .leftJoinAndSelect('review.user', 'user')
        .orderBy('review.reviewId', 'DESC');

      if (petId) {
        reviewsQuery = reviewsQuery.where('review.petId = :petId', { petId });
      }

      return await reviewsQuery.getMany(); 
    } catch (error) {
      throw new Error('Failed to fetch reviews');
    }
  }
}
