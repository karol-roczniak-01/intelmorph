import getRowByColumn from "@/actions/get-row-by-column";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserDetails } from "@/types";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: userData, image: userImage } = await getRowByColumn<UserDetails>({
    table: 'users',
    column: 'id',
    value: user.id,
    withImage: true,
    storageBucket: 'avatars'
  });
  
  
  return (
    <SidebarProvider>
      <AppSidebar
        userData={userData}
        userImage={userImage}
        userAuthEmail={user.email || ''}
      />
      <SidebarInset>
        <Header parentPath="Dashboard">
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
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}