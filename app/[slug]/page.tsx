import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getArticleData } from "#/lib/articles";

interface Props {
  params: {
    slug: string;
  };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);

  return (
    <section className="mx-auto w-10/12 md:w-2/3 xl:w-1/2 mt-20 flex flex-col gap-5">
      <div className="flex justify-between font-poppins">
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
