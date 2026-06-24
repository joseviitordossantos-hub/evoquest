import { redirect } from "next/navigation";

// Página inicial agora é o login (landing antiga desativada).
export default function Home() {
  redirect("/login");
}
