import ArticleItem from "#/components/ArticleItem";
import { getSortedArticles } from "#/lib/articles";

export default function HomePage() {
  const articles = getSortedArticles();

  return (
    <section className="mx-auto w-11/12 md:w-1/2 mt-20 flex flex-col gap-16 mb-20">
      <header className="text-center">
        <h1 className="font-oxanium font-bold text-6xl text-neutral-100">Bahrami's Blog</h1>
        <p className="font-oxanium text-3xl text-sky-400">The place where I share my thoughts and knowledge.</p>
      </header>

      <section className="flex flex-col gap-2">
        {articles?.map((a) => (
          <ArticleItem
            key={a.id}
            id={a.id}
            title={a.title}
            category={a.category}
          />
        ))}
      </section>
    </section>
  );
}
