"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: {
    data: UserDetails | null;
    imageUrl: string | null;
    error?: string | null;
  };
  userAuthEmail: string | null;
}

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    }
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        }
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        }
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        }
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    }
  ],
}

export function AppSidebar({ userData, userAuthEmail, ...props }: AppSidebarProps) {
  
  // Format user data for NavUser component
  const userForNav = {
    first_name: userData.data?.first_name || 'Jon',
    last_name: userData.data?.last_name || 'Snow',
    avatar: userData.imageUrl || '',
    email: userAuthEmail || 'No email',

  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          userData={userForNav} 
          userAuthEmail={userAuthEmail || ''} 
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
