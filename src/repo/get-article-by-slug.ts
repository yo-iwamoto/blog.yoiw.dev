import { env } from "@/config/env";
import { cdnClient } from "./client";
import type { Content } from "./client";
import { transformArticleHtml } from "@/lib/transform-article-html";
import { cache } from "react";
import { Article } from "@/model/article";

const articleModelUid = "article";

async function getArticleBySlugFn(slug: string): Promise<Article | null> {
  const res = await cdnClient.getFirstContent<
    {
      title: string;
      slug: string;
      tags: { name: string; slug: string }[];
      body: string;
    } & Content
  >({
    appUid: env.newtAppUid,
    modelUid: articleModelUid,
    query: {
      slug,
    },
  });
  if (res === null) return null;

  const article = new Article(
    res.title,
    res.slug,
    res.tags,
    new Date(res._sys.raw.firstPublishedAt),
    transformArticleHtml(res.body),
  );

  return article;
}

export const getArticleBySlug = cache(getArticleBySlugFn);
