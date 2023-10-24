import { allPosts } from 'contentlayer/generated';

export function getAllTags(): { name: string; count: number }[] {
  return sortByCount(countEach(extractTags(excludeDraft(allPosts))));
}

function excludeDraft<T extends { draft: boolean }>(arr: T[]) {
  return arr.filter((post) => post.draft !== true);
}

function extractTags<T extends { tags: string[] }>(arr: T[]) {
  return arr.flatMap((post) => post.tags);
}

function countEach(tags: string[]) {
  const counts = tags.reduce(
    (acc, tag) => {
      if (acc[tag]) {
        acc[tag] += 1;
      } else {
        acc[tag] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function sortByCount(tags: { name: string; count: number }[]) {
  return tags.sort((a, b) => b.count - a.count);
}