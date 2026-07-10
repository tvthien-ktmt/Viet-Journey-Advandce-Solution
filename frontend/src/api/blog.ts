import { api } from './client';
import { BLOGS } from '@/data/blogs';
import type { Blog } from '@/data/blogs';


export const blogApi = {
  list: (limit?: number): Promise<Blog[]> => {
    return api.get<{ content: Blog[] }>('/blogs', { params: { size: limit || 10 } }).then(res => res.content || (res as unknown as Blog[]));
  },
  get: (slug: string): Promise<Blog> => {
    return api.get<Blog>(`/blogs/slug/${slug}`);
  },
};
