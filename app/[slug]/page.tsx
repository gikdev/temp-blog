import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getArticleData } from "#/lib/articles";

interface Props {
  params: {
    slug: string;
  };
}

export default async function Article({ params: { slug } }: Props) {
  const articleData = await getArticleData(slug);

  return (
    <section className="mx-auto max-w-200 w-full mt-20 px-6 flex flex-col gap-5">
      <div className="flex justify-between font-oxanium">
        <Link href="/" className="flex flex-row gap-1 place-items-center">
          <ArrowLeftIcon width={20} />
          <p>Back to home</p>
        </Link>

        <p>{articleData.date.toString()}</p>
      </div>

      <article
        className="article"
        /** biome-ignore lint/security/noDangerouslySetInnerHtml: need to use it */
        dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
      />
    </section>
  );
}
