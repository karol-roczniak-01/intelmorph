import { signOutAction } from "@/actions/auth-actions";
import getRowByColumn from "@/actions/get-row-by-column";
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { UserDetails } from "@/types";
import { createClient } from "@/utils/supabase/server"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data, imageUrl } = await getRowByColumn<UserDetails>({
    table: 'users',
    column: 'id',
    value: user.id,
    withImage: true,
    storageBucket: 'avatars'
  });
  
  return (
    <SidebarProvider>
      <AppSidebar 
        userData={{ data, imageUrl }}
        userAuthEmail={user.email || ''}
      />
      <SidebarInset>
        <Header path="Home">
          <ThemeSwitcher />
          {!user && (
            <div className="flex gap-2">
              <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant={"default"}>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </Header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-card" />
            <div className="aspect-video rounded-xl bg-card" />
            <div className="aspect-video rounded-xl bg-card" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-card md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
