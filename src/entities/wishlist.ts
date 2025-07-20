import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Course } from "./course.entity";

@Index("fk_wishlist_user_id", ["userId"], {})
@Index("fk_wishlist_course_id", ["courseId"], {})
@Entity("wishlist")
export class Wishlist {
  @PrimaryGeneratedColumn({ type: "int", name: "wishlist_id", unsigned: true })
  wishlistId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "course_id", unsigned: true })
  courseId: number;

  @ManyToOne(() => User, (user) => user.wishlist, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @ManyToOne(() => Course, (course) => course.wishlist, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "courseId" }])
  course: Course;
}
