import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import React from "react";
import { SignIn } from "./components/signin-button";

export default async function Appbar() {
  const session = await auth();
  return (
    <div className="p-2 bg-gradient-to-b from-slate-800 to-slate-600 flex gap-2">
      <Link href={"/"}>Home page</Link>
      <Link href={"/clientPage"}>Client page</Link>
      <Link href={"/serverPage"}>Server page</Link>
      <Link href={"/middlewareProtected"}>middleware protected page</Link>
      <div className="ml-auto">
        {session && session.user ? (
          <div className="flex gap-2">
            <p>{session.user.name}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit">Sign Out</button>
            </form>
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
}
