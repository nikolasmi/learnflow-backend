import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./course.entity";
import { User } from "./user.entity";

@Index("fk_comment_user_id", ["userId"], {})
@Index("fk_comment_course_id", ["courseId"], {})
@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", name: "comment_id", unsigned: true })
  commentId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "course_id", unsigned: true })
  courseId: number;

  @Column("text", { name: "comment" })
  comment: string;

  @Column("int", { name: "rating", unsigned: true })
  rating: number;

  @Column("datetime", { name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @ManyToOne(() => Course, (course) => course.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "courseId" }])
  course: Course;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
