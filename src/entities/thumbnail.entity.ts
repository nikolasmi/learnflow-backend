import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";

@Index("fk_thumbnail_course_id", ["courseId"], {})
@Entity("thumbnail")
export class Thumbnail {
  @PrimaryGeneratedColumn({ type: "int", name: "thumbnail_id", unsigned: true })
  thumbnailId: number;

  @Column("int", { name: "course_id", unsigned: true })
  courseId: number;

  @Column("varchar", { name: "image_path", length: 255 })
  imagePath: string;

  @ManyToOne(() => Course, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "courseId" }])
  course: Course;
}
