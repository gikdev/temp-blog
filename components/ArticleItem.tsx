import Link from "next/link";

interface ArticleItemProps {
  id: string;
  title: string;
  category: string;
}

export default function ArticleItem({ category, id, title }: ArticleItemProps) {
  return (
    <Link
      key={id}
      href={`/${id}`}
      className="
        text-neutral-100 hover:text-sky-400
        font-poppins
        flex items-center
        hover:before:content-['>>>'] hover:before:pe-1
      "
    >
      <span>{title}</span>
      <span className="text-xs text-neutral-400 ms-auto">
        #{category.replaceAll(" ", "_")}
      </span>
    </Link>
  );
}
