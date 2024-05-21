// The [id] in the folder name indicates that this is a dynamic route, corresponding to a specific post ID.

import { updatePost } from "@/app/actions/posts";
import { fetchPostById } from "@/app/db/queries/posts";
import Link from "next/link";

interface PostsEditProps {
  params: {
    id: string;
  };
}

// Defining a new page, server component PostsEdit
export default async function PostsEdit({ params }: PostsEditProps) {
  // Receives params as a prop, which includes the id of the post to be edited.
  const { id } = params;

  // Fetches the post from the database
  const post = await fetchPostById(id);

  // binds the id to the updatePost action to create an updateAction,

  return (
    <main className="flex min-h-screen flex-col items-start p-24">
      <div className="mb-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <h1>{post?.title ?? ""}</h1>
        <p>{post?.content ?? ""}</p>
        <p>{post?.createdAt.toString() ?? ""}</p>
      </div>
      <Link href="/" className="bg-white px-4 py-2 rounded text-black">
        Back
      </Link>
    </main>
  );
}
