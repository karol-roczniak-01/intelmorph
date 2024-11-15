"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export const CONFIG = {
  CATEGORIES: [
    // Academic
    'literature',
    'history',
    'philosophy',
    'mathematics',
    // Default
    'default'
 ] as const,

  LANGUAGE_CODES: {
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'polish': 'pl',
    'dutch': 'nl',
    'greek': 'el',
    'ukrainian': 'uk',
    'czech': 'cs',
    'swedish': 'sv',
    'danish': 'da',
    'norwegian': 'no',
    'portuguese': 'pt',
    'russian': 'ru',
    'japanese': 'ja',
    'korean': 'ko',
    'chinese': 'zh',
    'arabic': 'ar',
    'hindi': 'hi',
    'turkish': 'tr'
  } as const,
};

export interface ItemUser {
  id: string;
  first_name: string;
  last_name: string;
}

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  language: string;
  created_at: string;
  users: ItemUser;
}

interface GridConfig {
  category?: string;
  title?: string;
  showAuthor?: boolean;
  showDate?: boolean;
  showLanguage?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  maxDescriptionLength?: number;
  maxTags?: number;
  onAuthorClick?: (userId: string) => void;
  onItemClick?: (itemId: string) => void;
}

interface GridProps<T extends BaseItem> {
  data: T[] | any | null;
  file: string | null;
  config?: GridConfig;
}

const getCategoryConfig = (category: string) => {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
  return CONFIG.CATEGORIES[normalizedCategory as keyof typeof CONFIG.CATEGORIES];
};

const getLanguageCode = (language: string): string => {
  const normalizedLanguage = language.toLowerCase();
  return CONFIG.LANGUAGE_CODES[normalizedLanguage as keyof typeof CONFIG.LANGUAGE_CODES] || language;
};

const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

const ItemsGrid = <T extends BaseItem>({ 
  data, 
  file,
  config = {} 
}: GridProps<T>) => {
  const router = useRouter();
  
  const {
    category = '',
    title = '',
    showAuthor = true,
    showDate = true,
    showLanguage = true,
    showCategory = true,
    showTags = true,
    maxDescriptionLength = 150,
    maxTags = 2,
  } = config;

  if (!data || data.length === 0) {
    return <div>No items found</div>;
  }

  const formatTags = (tags: string) => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    if (tagArray.length <= maxTags) {
      return tagArray;
    }
    
    return [...tagArray.slice(0, maxTags), `+${tagArray.length - maxTags}`];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const gridClass = `grid grid-cols-2 sm:grid-cols-2 md:grid-cold-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`;

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-2xl font-semibold'>
        {title}
      </p>
      <div className={gridClass}>
        {data.map((item: any) => (
          <Card   
            image={file}
            key={item.id}
            onClick={() => router.push(`dashboard/${category}/${item.id}`)}
          >
            <div className='flex flex-col gap-2'>
              <CardHeader>
                {(showAuthor || showDate) && (
                  <div className='flex justify-between flex-wrap'>
                    {showAuthor && (
                      <div className='flex gap-1 items-center flex-wrap'>
                        <span className='text-sm text-muted-foreground'>
                          By
                        </span>
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`dashboard/profile/${item.users.id}`)
                          }}  
                          className="text-sm text-muted-foreground text-left hover:underline hover:text-primary"
                        >
                          {item.users.first_name} {item.users.last_name}
                        </span>
                      </div>
                    )}
                    {showDate && (
                      <span className="text-sm text-muted-foreground text-right">
                        {formatDate(item.created_at)}
                      </span>
                    )}
                  </div>
                )}
                <CardTitle>
                  {item.title}
                </CardTitle>
                <CardDescription>
                  {truncateText(item.description, maxDescriptionLength)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2 w-fit">
                  {showLanguage && (
                    <Badge
                      className='uppercase w-fit'
                      variant={'secondary'}
                    >
                      {getLanguageCode(item.language)}
                    </Badge>
                  )}
                  {showCategory && (
                    <Badge
                      className={`capitalize w-fit ${getCategoryConfig(item.category)}`}
                      variant={'secondary'}
                    >
                      <span>{item.category}</span>
                    </Badge>
                  )}
                  {showTags && formatTags(item.tags).map((tag, index) => (
                    <Badge
                      key={index}
                      variant={'outline'}
                      className={'capitalize'}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItemsGrid;