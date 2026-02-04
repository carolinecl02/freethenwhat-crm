import { redirect } from "next/navigation";

export default function Home() {
  // Send unauthenticated users to login
  redirect("/login");
}
