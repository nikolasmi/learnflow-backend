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

@Index("fk_purchase_user_id", ["userId"], {})
@Index("fk_purchase_course_id", ["courseId"], {})
@Entity("purchase")
export class Purchase {
  @PrimaryGeneratedColumn({ type: "int", name: "purchase_id", unsigned: true })
  purchaseId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "course_id", unsigned: true })
  courseId: number;

  @Column("datetime", { name: "purchased_at", default: () => "'now()'" })
  purchasedAt: Date;

  @Column("double", {name: "price", unsigned: true})
  price: number

  @ManyToOne(() => Course, (course) => course.purchases, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "courseId" }])
  course: Course;

  @ManyToOne(() => User, (user) => user.purchases, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
