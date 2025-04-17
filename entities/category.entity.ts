import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @OneToMany(() => Course, (course) => course.category)
  courses: Course[];
}
