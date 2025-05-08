// app/actions.ts
"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getBlogPosts() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`SELECT * FROM "BlogPost"`;
  return data;
}

export async function createPost(formData: FormData) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }
  const sql = neon(process.env.DATABASE_URL);

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/register");
  }

  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const image = formData.get("image")?.toString() || "";
  const authorId = user?.id?.toString() || "";
  const authorImage = user?.picture?.toString() || "";
  const authorName = user?.given_name?.toString() || "";

  try {
    await sql`INSERT INTO "BlogPost" ("title", "content", "imageUrl", "authorId", "authorName", "authorImage") 
      VALUES (${title}, ${content}, ${image}, ${authorId}, ${authorName}, ${authorImage})`;

    revalidatePath("/");

    redirect("/dashboard");
  } catch (error) {
    throw error;
  }
}

export async function getUserBlogPosts(userId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`SELECT * FROM "BlogPost" WHERE "authorId" = ${userId}`;
  return data || null;
}

export async function getBlogPost(postId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables."
    );
  }
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`SELECT * FROM "BlogPost" WHERE "id" = ${postId}`;
  return data[0] || null;
}
