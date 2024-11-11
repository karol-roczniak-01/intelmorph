export interface UserDetails {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  image_path: string;
}

export interface PodcastDetails {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  image_path: string;
}