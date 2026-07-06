import { api } from './client';
import { BLOGS } from '@/data/blogs';
import type { Blog } from '@/data/blogs';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

export const blogApi = {
  list: (limit?: number): Promise<Blog[]> => {
    if (USE_MOCK) return Promise.resolve(limit ? BLOGS.slice(0, limit) : BLOGS);
    return api.get('/blogs', { limit });
  },
  get: (slug: string): Promise<Blog> => {
    if (USE_MOCK) {
      const b = BLOGS.find(x => x.slug === slug);
      return b ? Promise.resolve(b) : Promise.reject(new Error('Not found'));
    }
    return api.get(`/blogs/${slug}`);
  },
};
