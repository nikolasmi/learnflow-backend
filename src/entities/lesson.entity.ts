import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";

@Index("fk_lesson_course_id", ["courseId"], {})
@Entity("lesson")
export class Lesson {
  @PrimaryGeneratedColumn({ type: "int", name: "lesson_id", unsigned: true })
  lessonId: number;

  @Column("int", { name: "course_id", unsigned: true })
  courseId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "video_url", length: 255 })
  videoUrl: string;
  
  @Column("text", { name: "description" })
  description: string;

  @Column("int", { name: "order_number" })
  orderNumber: number;

  @ManyToOne(() => Course, (course) => course.lessons, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "courseId" }])
  course: Course;
}
