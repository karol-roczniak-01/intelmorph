"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  Heart, 
  Loader, 
  LucideIcon, 
  Gem,
  Star,
  DoorOpen,
  DollarSign
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip";

export type ActionType = 'like' | 'back' | 'follow' | 'joinOrg';

// Configuration for different button types
type ActionConfig = {
  icon: LucideIcon;
  activeColor: string;
  inactiveColor: string;
  fillColor: string;
  toastSuccess: string;
  tooltipAdd: string;
  tooltipRemove: string;
  tooltipPrefix: string;
  tooltipSuffix: string;
  showValue?: boolean;
  valuePerCount?: number;
}

const ACTION_CONFIGS: Record<string, ActionConfig> = {
  like: {
    icon: Heart,
    activeColor: 'text-red-500',
    inactiveColor: 'text-muted-foreground',
    fillColor: 'fill-transparent',
    toastSuccess: 'Added to favorites!',
    tooltipAdd: 'Add to favorites',
    tooltipRemove: 'Remove from Favorites',
    tooltipPrefix: 'Liked',
    tooltipSuffix: 'users',
  },
  back: {
    icon: Gem,
    activeColor: 'text-sky-500',
    inactiveColor: 'text-muted-foreground',
    fillColor: 'fill-transparent',
    toastSuccess: 'Now backing!',
    tooltipAdd: 'Back the author',
    tooltipRemove: 'Stop backing',
    tooltipPrefix: 'Backed by',
    tooltipSuffix: 'people',
    showValue: true,
    valuePerCount: 0.25
  },
  follow: {
    icon: Star,
    activeColor: 'text-amber-500',
    inactiveColor: 'text-muted-foreground',
    fillColor: 'fill-transparent',
    toastSuccess: 'Following!',
    tooltipAdd: 'Follow',
    tooltipRemove: 'Unfollow',
    tooltipPrefix: 'Followed by',
    tooltipSuffix: 'people'
  },
  joinOrg: {
    icon: DoorOpen,
    activeColor: 'text-purple-500',
    inactiveColor: 'text-muted-foreground',
    fillColor: 'fill-transparent',
    toastSuccess: 'Joined successfully!',
    tooltipAdd: 'Join organization',
    tooltipRemove: 'Leave organization',
    tooltipPrefix: '',
    tooltipSuffix: 'members'
  }
};

interface ActionButtonProps {
  userId: string;
  itemId: string;
  itemUserId: string;
  table: string;
  actionType: keyof typeof ACTION_CONFIGS;
  size?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  userId,
  itemId,
  itemUserId,
  table,
  actionType = 'like',
  size = 18
}) => {
  const router = useRouter();
  const supabase = createClient();

  const safeActionType = Object.keys(ACTION_CONFIGS).includes(actionType) 
    ? actionType 
    : 'like';
  const config = ACTION_CONFIGS[safeActionType];


  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(0);
  
  // Calculate back value if applicable
  const backValue = config.showValue && config.valuePerCount 
  ? (count * config.valuePerCount).toFixed(2)
  : null;

  // Fetch button state for item
  useEffect(() => {
    const fetchItemState = async () => {
      if (!userId || !itemId) return;

      try {
        const { data: itemData } = await supabase
          .from(table)
          .select('item_id')
          .eq('user_id', userId)
          .eq('item_id', itemId)
          .single();

        const { data: countData } = await supabase
          .from(table)
          .select('item_id')
          .eq('item_id', itemId);

        setIsClicked(!!itemData);
        setCount(countData?.length || 0);
      } catch (error) {
        console.error(error)
      }
    };

    fetchItemState();
  }, [userId, itemId, table, supabase]);

  // Button click handler
  const handleButtonAction = async () => {
    if (!userId) {
      toast({
        variant: 'destructive',
        title: 'Please sign in',
        description: 'You need to be signed in to perform this action.'
      });
      return;
    }

    if (userId === itemUserId) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: `It belongs to you, so you are unable to click this button.`
      })
      return;
    }

    setIsLoading(true);

    try {
      if (isClicked) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId)
          .eq('item_id', itemId)
          .single();

        if (error) throw error;

        setIsClicked(false);
        setCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from(table)
          .insert({
            'item_id': itemId,
            'user_id': userId,
            'item_user_id': itemUserId,
          });

        if (error) throw error;

        setIsClicked(true);
        setCount(prev => prev + 1);
        toast({
          title: 'Success!',
          description: config.toastSuccess
        });
      }

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-8 w-8">
        <Loader size={size} className="animate-spin" />
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            className="flex bg-transparent hover:bg-transparent w-8 h-8 p-0 text-primary group aspect-square items-center justify-center"
            onClick={handleButtonAction}
          >
            <Icon
              size={size}
              className={`${
                isClicked 
                  ? `${config.activeColor} ${config.fillColor}` 
                  : `${config.inactiveColor} group-hover:text-primary transition`
              }`}
              strokeWidth={2.5}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="mr-2">
          <div className="flex flex-col gap-1">
            <span>
              {isClicked ? config.tooltipRemove : config.tooltipAdd}
            </span>
            <span className="text-xs">
              {config.tooltipPrefix} {count} {config.tooltipSuffix}
            </span>
            {backValue && (
              <span className="text-xs flex items-center gap-1">
                <DollarSign size={12} />
                {backValue} USD
              </span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ActionButton;