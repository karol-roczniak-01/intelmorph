import getRow from "@/actions/get-row";
import getRows from "@/actions/get-rows";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import DialogProvider from "@/providers/dialog-provider";
import { PodcastDetails, UserDetails } from "@/types";
import { createClient } from "@/utils/supabase/server";
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

  const { data: userData, file: userFile } = await getRow<UserDetails>({
    table: 'users',
    column: 'id',
    value: user.id,
    withFile: true,
    storageBucket: 'avatars'
  });
  
  const { data: podcastData, file: podcastFile } = await getRows<PodcastDetails>({
    table: 'podcasts',
    column: 'user_id',
    value: user.id,
    withFile: true,
    storageBucket: 'podcast_covers'
  });

  return (
    <SidebarProvider>
      <AppSidebar
        //User
        userId={user.id}
        userData={userData}
        userFile={userFile}
        userAuthEmail={user.email || ''}

        //Podcasts
        podcastData={podcastData}
        podcastFile={podcastFile}

        //Papers

      />
      <SidebarInset>
        {children}
      </SidebarInset>
      <Toaster />
      <DialogProvider />
    </SidebarProvider>
  );
}