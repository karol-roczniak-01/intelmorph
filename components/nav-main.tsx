"use client"

import { type LucideIcon } from "lucide-react"
import {
  Home,
  Search,
  Gem,
  Heart,
  Star
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

const navItems: NavItem[] = [
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
  {
    title: "Supported",
    url: "#",
    icon: Gem,
  },
  {
    title: "Liked",
    url: "#",
    icon: Heart,
  },
  {
    title: "Followed",
    url: "#",
    icon: Star,
  }
]

export function NavMain() {
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}