import type { Metadata } from "next";
import { FeedView } from "@/features/post/components/FeedView";

export const metadata: Metadata = {
  title: "Feed",
  description: "See what people are sharing on socialFast",
};

export default function FeedPage() {
  return <FeedView />;
}
