import { PodcastDetails, UserDetails } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import getRow from "@/actions/get-row";
import getRows from "@/actions/get-rows";
import UniversalGrid from "@/components/items-grid";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: userData } = await getRow<UserDetails>({
    table: 'users',
    column: 'id',
    value: user.id,
    withFile: false,
  });

  const { data: podcastData, file: podcastFile } = await getRows<PodcastDetails & { users: UserDetails }>({
    table: 'podcasts',
    withFile: true,
    storageBucket: 'podcast_covers',
    joinConfig: {
      table: 'users!podcasts_user_id_fkey',
      column: 'id',
      foreignKey: 'user_id',
      fields: ['id', 'first_name', 'last_name'],
    },
  });

  
  const Greetings = (
    <p className="text-4xl font-bold">
      Hello, {userData?.first_name}
    </p>
  )

  return (
    <div>
      <Header className="hidden md:flex" parentPath="Dashboard">
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
      <div className="h-full w-full flex flex-col md:gap-12 md:px-24 md:py-12 gap-6 p-4">
        {Greetings}
        <UniversalGrid 
          data={podcastData} 
          file={podcastFile}
          config={{
            category: 'podcast',
            title: "Podcasts",
            showAuthor: true,
            showDate: true,
            showLanguage: true,
            showCategory: true,
            showTags: true,
            maxDescriptionLength: 150,
            maxTags: 2,
          }}
        />

      </div>
    </div>
  )
}