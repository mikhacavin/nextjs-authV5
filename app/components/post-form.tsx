// this is a client component
"use client";

import Image from "next/image";
import Link from "next/link";
import { useFormState } from "react-dom";

// Define the shape of the form errors
interface FormErrors {
  title?: string[];
  content?: string[];
  image?: string[];
}

// Define the shape of the form state
interface FormState {
  errors: FormErrors;
}

// Define the props that the PostForm component expects
interface PostFormProps {
  formAction: any; // The action to perform when the form is submitted
  initialData: {
    // The initial data for the form fields
    title: string;
    content: string;
    image: string;
    imageOld: string;
    fileId: string;
  };
}

// The formAction is the action to perform when the form is submitted. We use it as a props because
// we will use this for create and edit page which both page doesn't have the same action
// The initialData is the initial data for the form fields.
export default function PostForm({ formAction, initialData }: PostFormProps) {
  // Initialize the form state and action
  const [formState, action] = useFormState<FormState>(formAction, {
    errors: {},
  });

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">
        {initialData.title ? "Update" : "Create"} Post
      </h1>
      <form action={action}>
        <div className="w-96">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData.title}
              className="rounded p-2 w-full text-black"
            />
            {formState.errors.title && (
              <div className="text-red-500">
                {formState.errors.title?.join(", ")}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={initialData.content}
              className="rounded p-2 w-full text-black"
            ></textarea>
            {formState.errors.content && (
              <div className="text-red-500">
                {formState.errors.content?.join(", ")}
              </div>
            )}
          </div>
          <div className="mb-4">
            {initialData.imageOld ? (
              <div>
                <p className={`m-0 max-w-[30ch] text-sm opacity-60`}>
                  <Image
                    src={initialData.imageOld.toString()}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                    alt={initialData.title}
                    priority={true}
                  />
                </p>
                <label htmlFor="image" className="block mb-2">
                  <p>Change Image?</p>
                </label>
              </div>
            ) : (
              <label htmlFor="image" className="block mb-2">
                <p>Image</p>
              </label>
            )}

            <input
              type="file"
              id="image"
              name="image"
              className="rounded p-2 w-full text-white"
            />
            {formState.errors.image && (
              <div className="text-red-500">
                {formState.errors.image?.join(", ")}
              </div>
            )}
          </div>
          <input
            type="hidden"
            id="fileId"
            name="fileId"
            defaultValue={initialData.fileId}
          />
          <div className="mb-4">
            <button
              type="submit"
              className="bg-white px-4 py-2 rounded mr-2 text-black"
            >
              Save
            </button>
            <Link
              href={"/middlewareProtected"}
              className="bg-transparent px-4 py-2 rounded"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
