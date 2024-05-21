// this is a server action
"use server";

// Import the database client and the Post type from Prisma

import type { Post } from "@prisma/client";

// Import the revalidatePath and redirect functions from Next.js
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Import the Zod library for validation
import { z } from "zod";
import { db } from "../db";
import { DeleteFile, uploadImage } from "./imageUpload";
import ImageKit from "imagekit";

const MAX_FILE_SIZE = 1024 * 1024 * 20;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

// Define a schema for the post using Zod
const postSchema = z.object({
  // the title must be a string between 3 and 255 characters
  title: z.string().min(3).max(255),
  // the content must be a string between 10 and 4000 characters
  content: z.string().min(10).max(4000),
  image: z.any(),
});

// Define an interface for the form state
interface PostFormState {
  errors: {
    title?: string[];
    content?: string[];
    image?: string[];
    _form?: string[];
  };
}

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// Define an asynchronous function to create a post
export async function createPost(
  formState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  // Validate the form data against the post schema
  // If the form data does not match the schema, the safeParse method returns an object
  // with a success property of false and an error property containing the validation errors.
  // If the form data matches the schema, the safeParse method returns an object
  // with a success property of true and a data property containing the validated data.
  const result = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    image: formData.get("image"),
  });

  // If validation fails, return the errors
  if (!result.success) {
    return {
      // The flatten method is used to convert the validation errors into a flat object structure
      // that can be easily displayed in the form.
      errors: result.error.flatten().fieldErrors,
    };
  }

  let post: Post;
  try {
    const response = await uploadImage(formData);

    if (!response.url) {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }

    // If validation passes, create a new post in the database
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        image: response.url,
        fileId: response.fileId,
      },
    });
  } catch (error: unknown) {
    // If there's an error, return it
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  // Revalidate the path and redirect to the home page
  revalidatePath("/middlewareProtected");
  redirect("/middlewareProtected");
}

export async function updatePost(
  id: string,
  formState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const image = formData.get("image") as unknown as File;
  if (image.size > 0) {
    const result = postSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      image: formData.get("image"),
    });
    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    let post: Post;

    try {
      const response = await uploadImage(formData);
      const deleteOldImage = await DeleteFile(formData.get("fileId") as string);
      if (!response.url) {
        return {
          errors: {
            _form: ["Something went wrong"],
          },
        };
      }

      post = await db.post.update({
        where: { id },
        data: {
          title: result.data.title,
          content: result.data.content,
          image: response.url,
          fileId: response.fileId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          errors: {
            _form: [error.message],
          },
        };
      } else {
        return {
          errors: {
            _form: ["Something went wrong"],
          },
        };
      }
    }
  } else {
    console.log("masuk data tanpa update image");
    const result = postSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    let post: Post;

    try {
      post = await db.post.update({
        where: { id },
        data: {
          title: result.data.title,
          content: result.data.content,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          errors: {
            _form: [error.message],
          },
        };
      } else {
        return {
          errors: {
            _form: ["Something went wrong"],
          },
        };
      }
    }
  }

  revalidatePath("/");
  redirect("/middlewareProtected");
}

export async function deletePost(
  id: string,
  fileId: string
): Promise<PostFormState> {
  let post: Post;
  try {
    await DeleteFile(fileId as string);
    post = await db.post.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  revalidatePath("/");
  redirect("/middlewareProtected");
}
