import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight, Trash2 } from 'lucide-react';

interface ContentCardProps {
  content: any;
  onDelete?: () => void;
}

const ContentCard = ({ content, onDelete }: ContentCardProps) => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative">
    {content.image && (
      <div className="aspect-[16/9] overflow-hidden">
        <img src={content.image} alt={content.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    )}
    <div className="p-6">
      <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
        <span>{content.category || 'General'}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {content.title}
      </h3>
      <p className="text-slate-500 text-sm mb-6 line-clamp-3">
        {content.excerpt}
      </p>
      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Calendar size={14} />
          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3">
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200/40 cursor-pointer"
              title="Permanently delete this public story/article"
            >
              <Trash2 size={14} />
            </button>
          )}
          <Link to={`/content/${content.slug}`} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Read Story <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default ContentCard;
