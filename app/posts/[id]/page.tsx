// The [id] in the folder name indicates that this is a dynamic route, corresponding to a specific post ID.

import { updatePost } from "@/app/actions/posts";
import { fetchPostById } from "@/app/db/queries/posts";
import Image from "next/image";
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
        <p className={`m-0 max-w-[30ch] text-sm opacity-60`}>
          {post?.image ? (
            <Image
              src={post?.image.toString()}
              width="0"
              height="0"
              sizes="100vw"
              className="w-full h-auto"
              alt={post?.title}
              priority={true}
            />
          ) : null}
        </p>
        <p>{post?.content ?? ""}</p>
        <p>{post?.updatedAt.toString() ?? ""}</p>
      </div>
      <Link href="/" className="bg-white px-4 py-2 rounded text-black">
        Back
      </Link>
    </main>
  );
}
