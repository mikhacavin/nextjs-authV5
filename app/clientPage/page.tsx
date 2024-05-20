"use client";
import { useSession } from "next-auth/react";
import React from "react";

export default function Page() {
  const { data: session } = useSession();
  console.log("hey from client");

  if (!session || !session.user)
    return (
      <div className="text-red-500 p-5">
        You need to login first to view this client page
      </div>
    );
  return <div>uhh client page and protecteddd</div>;
}
