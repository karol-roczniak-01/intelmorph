import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }
  
  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          {!user ? (
            <Button asChild size="sm" variant={"outline"}>
              <Link href="/">Home</Link>
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant={"outline"}>
                <Link href="/">Home</Link>
              </Button>
              <Button asChild size="sm" variant={"default"}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
      {children}
    </div>
  );
}
