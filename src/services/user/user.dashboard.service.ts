import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Purchase } from 'src/entities/purchase.entity';
import { Course } from 'src/entities/course.entity';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { Wishlist } from 'src/entities/wishlist';

@Injectable()
export class UserDashboardService {
  constructor(
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Wishlist) private readonly wishlistRepo: Repository<Wishlist>, // Inject wishlist repozitorijum
  ) {}

  async getUserDashboard(userId: number) {
    // Kupovine korisnika
    const purchasedCourses = await this.purchaseRepo.find({
      where: { userId },
      relations: ['course'],
      order: { purchasedAt: 'DESC' },
    });

    // Ukupno potrošeno
    const totalSpent = purchasedCourses.reduce((sum, p) => sum + Number(p.price || 0), 0);

    // Broj komentara korisnika
    const commentCount = await this.commentRepo.count({ where: { user: { userId } } });

    // Kursevi koje je korisnik kreirao
    const createdCourses = await this.courseRepo.find({
      where: { userId },
      relations: ['lessons'],
      order: { createdAt: 'DESC' },
    });

    const courseIds = createdCourses.map(c => c.courseId);

    // Ukupno zarada od sopstvenih kurseva
    let totalEarned = 0;
    if (courseIds.length > 0) {
      const purchasesOfOwnCourses = await this.purchaseRepo.find({
        where: { courseId: In(courseIds) },
      });
      totalEarned = purchasesOfOwnCourses.reduce((sum, p) => sum + Number(p.price || 0), 0);
    }

    // Wishlist korisnika
    const wishlistItems = await this.wishlistRepo.find({
      where: { user: { userId } },
      relations: ['course'],
    });

    return {
      totalPurchases: purchasedCourses.length,
      totalSpent: totalSpent.toFixed(2),
      createdCoursesCount: createdCourses.length,
      comments: commentCount,
      recentPurchases: purchasedCourses.slice(0, 5).map((p) => ({
        title: p.course?.title || '',
        shortDescription: p.course?.shortDescription || '',
        purchasedAt: p.purchasedAt,
        courseId: p.course?.courseId || null,
        thumbnail: p.course?.thumbnail || null,
      })),
      ownCourses: createdCourses.map((c) => ({
        courseId: c.courseId,
        title: c.title,
        shortDescription: c.shortDescription,
        description: c.description,
        price: c.price,
        createdAt: c.createdAt,
        lessonCount: c.lessons.length,
        thumbnailUrl: c.thumbnail,
      })),
      totalEarned: totalEarned.toFixed(2),

      // Dodaj wishlist u odgovor
      wishlist: wishlistItems.map((item) => ({
        courseId: item.course?.courseId || null,
        title: item.course?.title || '',
        shortDescription: item.course?.shortDescription || '',
        thumbnail: item.course?.thumbnail || null,
      })),
    };
  }
}
