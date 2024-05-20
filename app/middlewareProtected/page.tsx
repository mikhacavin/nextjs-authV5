import React from "react";

export default function Page() {
  console.log("hey from server and middleware");
  return <div>this page was protected by middleware nextauth</div>;
}
