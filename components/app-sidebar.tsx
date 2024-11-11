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
  LibraryBig
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
import { UserDetails } from "@/types"
import { NavMain } from "./nav-main"
import { NavItems} from "./nav-items"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: UserDetails | null;
  userImage: string | null;
  userAuthEmail: string | null;
}

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },

  ],
  items: [
    {
      title: "Podcasts",
      icon: Podcast,
      subItems: [
        {
          title: "Daily Journal & Reflection",
          url: "#",
        }
      ],
    },
    {
      title: "Papers",
      icon: Newspaper,
      subItems: [
        {
          title: "Career Objectives & Milestones",
          url: "#",
        }
      ],
    },
    {
      title: "References",
      icon: Link,
      subItems: [
        {
          title: "Writing Ideas & Story Outlines",
          url: "#",
        }
      ],
    },
    {
      title: "Figures",
      icon: FigureImage,
      subItems: [
        {
          title: "Household Budget & Expense Tracking",
          url: "#",
        }
      ],
    },
    {
      title: "Reviewed",
      icon: Eye,
      subItems: [
        {
          title: "Trip Planning & Itineraries",
          url: "#",
        }
      ],
    },
    {
      title: "Playlists",
      icon: Headphones,
      subItems: [
        {
          title: "Trip Planning & Itineraries",
          url: "#",
        }
      ],
    },
    {
      title: "Series",
      icon: BookHeadphones,
      subItems: [
        {
          title: "Trip Planning & Itineraries",
          url: "#",
        }
      ],
    },
    {
      title: "Readings",
      icon: LibraryBig,
      subItems: [
        {
          title: "Trip Planning & Itineraries",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ userData, userImage, userAuthEmail, ...props }: AppSidebarProps) {
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={data.items}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          userData={userData}
          userImage={userImage}
          userAuthEmail={userAuthEmail || ''}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
