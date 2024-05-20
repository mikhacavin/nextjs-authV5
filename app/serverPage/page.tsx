import { auth } from "@/auth";
import React from "react";

export default async function page() {
  const session = await auth();

  if (!session || !session.user)
    return (
      <div className="text-red-500 p-5">
        You need to login first to view this server page
      </div>
    );

  return <div>This is a server component (protecteddd) </div>;
}
