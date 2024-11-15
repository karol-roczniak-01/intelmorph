import getRow from "@/actions/get-row";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { PodcastDetails } from "@/types";
import { createClient } from "@/utils/supabase/server"
import Link from "next/link";
import { redirect } from "next/navigation";
import PageContent from "../components/podcast-info";
import ActionButton from "@/components/action-button";

// Fix 1: Remove the await from the params type
export default async function Podcast({
  params,
}: {
  params: { id: string }  // Remove Promise type
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fix 2: Remove the await from params.id
  const { data: podcastData, file: podcastFile } = await getRow<PodcastDetails>({
    table: 'podcasts',
    column: 'id',
    value: params.id,  // Remove await
    withFile: true,
    storageBucket: 'podcast_covers'
  });

  return (
    <div>
      <Header parentPath="Dashboard" parentPathLink="/dashboard" childPath="Podcast">
        <div className="flex gap-2 items-center">
          <ActionButton 
            userId={user.id}
            itemId={podcastData?.id || ''}
            itemUserId={podcastData?.user_id || ''}
            table='backed_podcasts'
            actionType='back'
          />
          <ActionButton 
            userId={user.id}
            itemId={podcastData?.id || ''}
            itemUserId={podcastData?.user_id || ''}
            table='liked_podcasts'
            actionType='like'
          />
        </div>
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
      <PageContent 
        podcastData={podcastData}
        podcastFile={podcastFile}
      />
    </div>
  )
}