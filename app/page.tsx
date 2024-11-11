import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="h-full w-full flex flex-col bg-red-100/20">
      <div className="flex items-center h-16 shrink-0 w-full justify-end px-4">
        {!user ? (
          <div className="flex gap-2">
            <Button asChild size="sm" variant={"outline"}>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
