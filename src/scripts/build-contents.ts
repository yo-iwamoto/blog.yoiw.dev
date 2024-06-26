import fs from "node:fs";
import path from "node:path";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { z } from "zod";
import { transformArticleHtml } from "../lib/transform-article-html";

async function parseMarkdown(markdownString: string) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdownString)
    .then((vfile) => vfile.value.toString());
}

const frontMatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.string().transform((tags) =>
    tags
      .slice(1, -1)
      .split(",")
      .map((tag) => tag.trim()),
  ),
});

async function getAllEntries() {
  const entries = await Promise.all(
    fs.readdirSync("contents/posts").map(async (fileName) => {
      const file = fs.readFileSync(
        path.join("contents/posts", fileName),
        "utf-8",
      );
      const [, frontMatterString, body] = file.split("---\n");
      const frontMatterObject: { [key in string]: string } = {};
      for (const line of frontMatterString.split("\n")) {
        const [key, value] = line.split(": ");
        if (key === "") continue;

        frontMatterObject[key] = value;
      }
      const meta = frontMatterSchema.parse(frontMatterObject);
      const rawContent = await parseMarkdown(body);
      const content = transformArticleHtml(rawContent);
      return { content, meta };
    }),
  );

  const sorted = entries.sort((a, b) => {
    const aTime = new Date(a.meta.publishedAt).getTime();
    const bTime = new Date(b.meta.publishedAt).getTime();

    return bTime - aTime;
  });

  return sorted;
}

async function main() {
  const allEntries = await getAllEntries();
  fs.writeFileSync(
    "src/data/contents.json",
    `${JSON.stringify(allEntries, null, 2)}\n`,
    "utf-8",
  );
}

main();
