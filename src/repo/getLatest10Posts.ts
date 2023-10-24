import { allPosts } from 'contentlayer/generated';
import type { Post } from 'contentlayer/generated';

export function getLatest10Posts(): Post[] {
  return pickLatest10(sortByPostedAt(allPosts));
}

function sortByPostedAt<T extends { postedAt: string }>(arr: T[]) {
  return arr.sort((a, b) =>
    new Date(a.postedAt) > new Date(b.postedAt) ? -1 : 1,
  );
}

function pickLatest10<T>(arr: T[]) {
  return arr.slice(0, 10);
}