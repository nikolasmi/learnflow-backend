export class EditCourseDto {
  title?: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  //thumbnailUrl?: string;
  categoryId?: number;
  thumbnailId?: number | null
}
