import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { Course } from "./course.entity";
import { Purchase } from "./purchase.entity";
import { Wishlist } from "./wishlist";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;
  
  @Column("varchar", { name: "surname", length: 255 })
  surname: string;
  
  @Column("varchar", { name: "phone", length: 20 })
  phone: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

}
