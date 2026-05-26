import React from 'react';
import { File, Hash, Clock } from 'lucide-react';

interface EditorStatsProps {
  stats: {
    words: number;
    characters: number;
    readingTime: number;
  };
}

export const EditorStats: React.FC<EditorStatsProps> = ({ stats }) => {
  return (
    <div className="flex items-center gap-6 px-6 py-2 bg-white border-t border-slate-200 text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] dark:bg-[#11141a] dark:border-slate-800 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <File size={12} className="text-slate-300 dark:text-slate-650" /> 
        <span>{stats?.words || 0} Words</span>
      </div>
      <div className="flex items-center gap-2">
        <Hash size={12} className="text-slate-300 dark:text-slate-650" /> 
        <span>{stats?.characters || 0} Characters</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={12} className="text-slate-300 dark:text-slate-650" /> 
        <span>{stats?.readingTime || 0} Min Read</span>
      </div>
    </div>
  );
};
