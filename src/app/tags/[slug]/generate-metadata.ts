import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  return {
    title: `「${slug}」に関する記事一覧 | blog.yo-iwamoto.me`,
    alternates: {
      canonical: `/posts/${slug}`,
    },
  } satisfies Metadata;
}
