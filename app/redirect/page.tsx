import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function RedirectPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  
  if (role === "OWNER") {
    redirect("/owner/beranda");
  } else if (role === "KASIR") {
    redirect("/kasir/beranda");
  } else {
    redirect("/customer/beranda");
  }
}
