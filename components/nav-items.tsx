import useUploadDialog from "@/hooks/use-upload-dialog";
import { PodcastDetails } from "@/types";
import { ChevronRight, LucideIcon, MoreHorizontal, Plus, PodcastIcon } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface CategoryData {
  id: string;
  title: string;
}

interface CategoryConfig {
  title: string;
  icon: LucideIcon;
  type: string;
  hasUpload?: boolean;
  getImageSrc?: (file: string | null) => string | null;
  getData?: (props: NavItemsProps) => CategoryData[] | null;
}

const categories: CategoryConfig[] = [
  {
    title: "Podcasts",
    icon: PodcastIcon,
    type: "podcast",
    hasUpload: true,
    getData: (props) => props.podcastData,
    getImageSrc: (file) => file
  }
];

interface NavItemsProps {
  userId: string;
  podcastData: PodcastDetails[] | null;
  podcastFile: string | null;
}

const ITEMS_TO_SHOW = 10;

export function NavItems({ 
  userId, 
  podcastData,
  podcastFile,
  ...props
}: NavItemsProps) {
  const uploadDialog = useUploadDialog();

  const renderSidebarMenuSub = (
    data: CategoryData[],
    type: string,
    imageSrc?: string | null,
  ) => {
    const totalItems = data.length;
    const visibleItems = data.slice(0, ITEMS_TO_SHOW);
    const hasMore = totalItems > ITEMS_TO_SHOW;
    const remainingItems = totalItems - ITEMS_TO_SHOW;

    return (
      <SidebarMenuSub>
        {visibleItems.map((item) => (
          <SidebarMenuSubItem key={item.id || item.title}>
            <SidebarMenuSubButton asChild className="pl-0.5 mr-0">
              <a href={`/dashboard/${type}/${item.id}`}>
                <Avatar className="w-6 h-6 p-0.5">
                  <AvatarImage className="rounded-sm" src={imageSrc || ''} />
                  <AvatarFallback className="rounded-sm">{item.title.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{item.title}</span>
              </a>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
        
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuSubButton asChild className="text-sidebar-foreground/70">
              <a href={`/dashboard/${type}`}>
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>More</span>
                <span>+{remainingItems}</span>
              </a>
            </SidebarMenuSubButton>
          </SidebarMenuItem>
        )}
      </SidebarMenuSub>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Items</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {categories.map((category) => {
            const Icon = category.icon;
            const data = category.getData?.({ userId, podcastData, podcastFile, ...props }) || null;
            const imageSrc = category.getImageSrc?.(podcastFile) || null;

            return (
              <Collapsible key={category.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={category.title}>
                    <a href={`/dashboard/${category.type}`} className="flex items-center">
                      <Icon />
                      <span>{category.title}</span>
                    </a>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                      showOnHover
                    >
                      <ChevronRight />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  {category.hasUpload && (
                    <SidebarMenuAction
                      onClick={() => uploadDialog.onOpen(userId, category.type)}
                      showOnHover
                    >
                      <Plus />
                    </SidebarMenuAction>
                  )}
                  <CollapsibleContent>
                    {data && renderSidebarMenuSub(data, category.type, imageSrc)}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}