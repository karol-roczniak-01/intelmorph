"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Home,
  Inbox,
  Link,
  Newspaper,
  Podcast,
  Search,
  Image as FigureImage,
  Eye,
  Headphones,
  BookHeadphones,
  LibraryBig,
  Gem,
  Heart,
  Star
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { PodcastDetails, UserDetails } from "@/types"
import { NavMain } from "./nav-main"
import { NavItems} from "./nav-items"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userId: string;
  userData: UserDetails | null;
  userFile: string | null;
  userAuthEmail: string | null;

  podcastData: PodcastDetails[] | null;
  podcastFile: string | null;
}

export function AppSidebar({ 
  userId, 
  userData, 
  userFile, 
  userAuthEmail, 

  podcastData,
  podcastFile,
  ...props }
: AppSidebarProps) {
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        <NavItems 
          userId={userId} 
          podcastData={podcastData}
          podcastFile={podcastFile}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          userData={userData}
          userFile={userFile}
          userAuthEmail={userAuthEmail || ''}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
