import React from 'react';
import { 
  FolderHeart, 
  Trash2, 
  Layers, 
  ExternalLink, 
  ChevronRight,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface BookmarkItem {
  id: string;
  userId: string;
  projectId: string;
  pageId: string;
  pageTitle: string; // This holds the project title for hub bookmarks
  createdAt: string;
}

interface WorkspaceHubBookmarksProps {
  bookmarks: BookmarkItem[];
  onRemove: (pageId: string, projectId: string) => Promise<void>;
  hideEmptyState?: boolean;
}

export function WorkspaceHubBookmarks({ bookmarks, onRemove, hideEmptyState }: WorkspaceHubBookmarksProps) {
  if (bookmarks.length === 0) {
    if (hideEmptyState) return null;
    return (
      <div className="p-12 text-center border border-dashed border-[#eee1ba] dark:border-[#2d323f]/80 rounded-3xl bg-amber-50/10 dark:bg-[#15181e]/40 space-y-4 max-w-lg mx-auto">
        <FolderHeart className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto opacity-30" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">No Starred Projects</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            You haven't favorited or starred any workspace projects yet. Browse the public Workspace Hub to save your favorite bookshelves.
          </p>
        </div>
        <Link
          to="/public-content"
          className="inline-flex items-center space-x-1 px-4 py-2 bg-[#5b4636] hover:bg-black dark:bg-[#eee1ba] text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
        >
          <span>Find Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Workspace Hub Starred Projects ({bookmarks.length})
        </h3>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Project-Level Stars</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {bookmarks.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group relative bg-[#fdfaf2] dark:bg-[#1a1e28] border border-[#eee1ba]/80 dark:border-[#2d323f]/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-[#5b4636]/30 dark:hover:border-[#eee1ba]/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <Link to={`/listing/read/${b.projectId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100/65 dark:bg-yellow-950/20 text-yellow-600 dark:text-[#eee1ba] flex items-center justify-center shrink-0 shadow-inner">
                      <Layers className="w-5 h-5 text-yellow-600 dark:text-[#eee1ba]" />
                    </div>
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/listing/read/${b.projectId}`}>
                      <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-tight text-sm line-clamp-1 hover:text-[#5b4636] dark:hover:text-yellow-300 transition-colors">
                        {b.pageTitle || "Untitled Workspace Project"}
                      </h4>
                    </Link>
                    <div className="flex items-center space-x-2 mt-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">
                      <Calendar className="w-3 h-3 text-[5b4636]/30 dark:text-yellow-500/30" />
                      <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemove("", b.projectId)}
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                  title="Remove Star Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-[#eee1ba]/30 dark:border-[#2d323f]/40 flex items-center justify-between">
                <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest leading-none border border-yellow-500/10">
                  Workspace Star
                </span>
                <Link
                  to={`/listing/read/${b.projectId}`}
                  className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-[#5b4636] dark:text-[#eee1ba] hover:underline"
                >
                  <span>Open Project</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
