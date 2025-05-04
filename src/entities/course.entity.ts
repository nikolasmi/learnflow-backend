import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Category } from "./category.entity";
import { User } from "./user.entity";
import { Lesson } from "./lesson.entity";
import { Purchase } from "./purchase.entity";

@Index("fk_course_category_id", ["categoryId"], {})
@Index("fk_course_user_id", ["userId"], {})
@Entity("course")
export class Course {
  @PrimaryGeneratedColumn({ type: "int", name: "course_id", unsigned: true })
  courseId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "short_description", length: 255 })
  shortDescription: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("decimal", { name: "price", unsigned: true, precision: 10, scale: 2 })
  price: string;

  // @Column("varchar", { name: "thumbnail_url", length: 255 })
  // thumbnailUrl: string;

  // @Column("varchar", { name: "video_url", length: 255 })
  // videoUrl: string;

  @Column("int", { name: "category_id", unsigned: true })
  categoryId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("datetime", { name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.course)
  comments: Comment[];

  @ManyToOne(() => Category, (category) => category.courses, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @ManyToOne(() => User, (user) => user.courses, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Purchase, (purchase) => purchase.course)
  purchases: Purchase[];
}
