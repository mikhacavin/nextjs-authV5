// Importing the function to fetch posts from the database.

import Link from "next/link";
// Importing a component that handles post deletion.

import { fetchPosts } from "./db/queries/posts";
import PostDelete from "./components/post-delete";
import Image from "next/image";

export default async function Home() {
  const posts = await fetchPosts(); // Fetching the posts from the database.
  const dateOptions: Intl.DateTimeFormatOptions = {
    // Options for formatting dates.
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <main className="flex min-h-screen flex-col items-start p-24">
      <div className="mb-32 grid gap-x-8 gap-y-4 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {posts.map((post) => {
          // Mapping over the posts and rendering each one.
          return (
            <div key={post.id}>
              <div className="mb-4">
                <p className={`m-0 max-w-[30ch] text-sm opacity-60`}>
                  <Image
                    src={post.image?.toString()}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                    alt={post.title}
                    priority={true}
                  />
                </p>
                <Link key={post.id} href={`/posts/${post.id}`} className="">
                  <h2 className={`mb-3 text-2xl font-semibold`}>
                    {post.title}
                  </h2>
                </Link>
                <p className={`m-0 max-w-[30ch] text-sm opacity-60`}>
                  {post.content}
                </p>
              </div>
              <div className="text-sm opacity-30">
                {"Updated at " +
                  post.updatedAt.toLocaleDateString("id-ID", dateOptions)}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-5">
        Build with : NextJS Server Action + Prisma & PostgreSQL + ImageKit{" "}
      </p>
    </main>
  );
}
