import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import moment from "moment";
import { remark } from "remark";
import html from "remark-html";
import type { ArticleItem } from "#/types";

const articlesDir = path.join(process.cwd(), "articles");

export function getSortedArticles(): ArticleItem[] {
  const fileNames = fs.readdirSync(articlesDir);

  const allArticlesData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(articlesDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    const matterResult = matter(fileContents);

    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
    };
  });

  const allSortedArticlesData = allArticlesData.sort((a, b) => {
    // "DD-MM-YYYY" → split into parts
    const [dayA, monthA, yearA] = a.date.split("-");
    const [dayB, monthB, yearB] = b.date.split("-");

    // Build proper Date objects (note: month is 0-based in JS)
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    // Newest first (descending order)
    return Number(dateB) - Number(dateA);
  });

  return allSortedArticlesData;
}

export async function getArticleData(id: string) {
  const fullPath = path.join(articlesDir, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    category: matterResult.data.category,
    date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM Do YYYY"),
  };
}
