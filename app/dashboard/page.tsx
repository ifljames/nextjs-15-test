import { buttonVariants } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import React from "react";
import { getUserBlogPosts } from "../actions";
import BlogPostCard from "@/components/general/BlogPostCard";


const DashboardRoute = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = user?.id
    ? ((await getUserBlogPosts(user.id)) as {
        id: string;
        title: string;
        content: string;
        imageUrl: string;
        authorId: string;
        authorName: string;
        authorImage: string;
        updatedAt: Date;
        createdAt: Date;
      }[])
    : [];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium">Your Blog Articles</h2>

        <Link className={buttonVariants()} href="/dashboard/create">
          Create Post
        </Link>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((post) => (
            <BlogPostCard data={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardRoute;
