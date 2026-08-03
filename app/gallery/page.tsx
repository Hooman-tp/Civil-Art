import { PROJECTS } from "../../lib/projectsData";
import { getProjectCover } from "../../lib/getProjectImages";
import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "گالری تصاویر | Civil-Art",
  description:
    "مجموعه‌ای از تصاویر پروژه‌های اجراشده Civil-Art در سراسر کشور.",
};

/*
  نکته معماری: خواندن عکس از دیسک (fs) فقط در Server Component ممکن
  است. چون این صفحه به فیلتر تعاملی دسته‌بندی (state) نیاز دارد که
  فقط در Client Component امکان‌پذیر است، این صفحه را به دو بخش
  تقسیم کردیم:
    - page.tsx (همین فایل): سرور — عکس شاخص هر پروژه را از دیسک می‌خواند
    - GalleryClient.tsx: کلاینت — فقط مسئول فیلتر و نمایش است
*/
export default function GalleryPage() {
  const projectsWithCover = PROJECTS.map((p) => ({
    slug: p.slug,
    category: p.category,
    name: p.name,
    coverSrc: getProjectCover(p.slug),
  }));

  return <GalleryClient projects={projectsWithCover} />;
}
