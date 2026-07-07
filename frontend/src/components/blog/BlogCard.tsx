import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BlogCard = React.memo(({ blog }: { blog: any }) => {
  const navigate = useNavigate();
  return (
    <Card 
      className="overflow-hidden cursor-pointer group border-0 shadow hover:shadow-xl transition-all rounded-xl"
      onClick={() => navigate(`/blog/${blog.slug || blog.id}`)}
    >
      <div className="h-[240px] relative overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-vna-blue hover:bg-white transition-all duration-300">{blog.category}</Badge>
        </div>
      </div>
      <CardContent className="p-6 bg-white rounded-xl">
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-vna-blue transition-colors line-clamp-2 min-h-[56px]">{blog.title}</h3>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2" /> {blog.date}
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-vna-gold transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
});

