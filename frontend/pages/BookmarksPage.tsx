import React, { useState, useEffect } from 'react';
import { publicService } from '../services/api/public';
import { 
  Bookmark, 
  ArrowLeft, 
  BookOpen,
  Layers,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { WorkspaceHubBookmarks } from '../components/content/WorkspaceHubBookmarks';
import { DocumentNexusBookmarks } from '../components/content/DocumentNexusBookmarks';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'hub' | 'nexus'>('all');

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await publicService.getBookmarks();
      setBookmarks(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to download bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (pageId: string, projectId: string) => {
    try {
      if (!pageId) {
        await publicService.toggleFavorite(projectId);
        setBookmarks(prev => prev.filter(b => b.projectId !== projectId));
      } else {
        await publicService.toggleBookmark(pageId, projectId);
        setBookmarks(prev => prev.filter(b => b.pageId !== pageId));
      }
    } catch (err) {
      console.error("Unbookmark failed:", err);
    }
  };

  // Divide the bookmarks list
  const hubBookmarks = bookmarks.filter(b => b.addedToNexus !== true);
  const nexusBookmarks = bookmarks.filter(b => b.addedToNexus === true);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 min-h-screen pt-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee1ba] dark:border-[#2d323f]/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest text-[#5b4636]/50 dark:text-[#eee1ba]/50 mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span>Saved Reference Library</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            My Saved Bookmarks
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Revisit or manage public document references you have bookmarked across WorkSpace Nexus.
          </p>
        </div>

        <Link
          to="/public-content"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 hover:bg-[#f4ecd8] dark:hover:bg-[#1f242e] text-[#5b4636] dark:text-[#eee1ba] rounded-xl text-xs font-black uppercase tracking-wider transition-colors border border-[#eee1ba]/40 dark:border-[#2d323f]/50 bg-white dark:bg-[#15181e]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explorer</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 border-4 border-[#eee1ba] border-t-[#5b4636] dark:border-[#2d323f] rounded-full"
          />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading references...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl text-center text-sm font-semibold text-red-700 dark:text-red-400">
          {error}
        </div>
      ) : bookmarks.length === 0 ? (
        
        /* Empty Slate */
        <div className="p-16 text-center border-2 border-dashed border-[#eee1ba] dark:border-[#2d323f] rounded-3xl max-w-md mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto opacity-30" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">Your library is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              When exploring public spaces in the Workspace Hub, click on the bookmark icon next to any document page to save it here for fast retrieval.
            </p>
          </div>
          <Link
            to="/public-content"
            className="inline-block px-5 py-2.5 bg-[#5b4636] hover:bg-black dark:bg-[#eee1ba] text-white dark:text-black hover:text-white dark:hover:text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            Explore Public Library
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Navigation Tab Segmented Switcher */}
          <div className="flex bg-[#f4ecd8] dark:bg-[#1e232e] p-1.5 rounded-2xl border border-[#eee1ba] dark:border-[#2d323f] shadow-inner max-w-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all select-none flex items-center justify-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#15181e] text-[#5b4636] dark:text-[#eee1ba] shadow-sm'
                  : 'text-[#5b4636]/60 dark:text-[#eee1ba]/60 hover:opacity-80'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>All ({bookmarks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('hub')}
              className={`flex-1 px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all select-none flex items-center justify-center gap-1.5 ${
                activeTab === 'hub'
                  ? 'bg-white dark:bg-[#15181e] text-[#5b4636] dark:text-[#eee1ba] shadow-sm'
                  : 'text-[#5b4636]/60 dark:text-[#eee1ba]/60 hover:opacity-80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Workspace Hub ({hubBookmarks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('nexus')}
              className={`flex-1 px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all select-none flex items-center justify-center gap-1.5 ${
                activeTab === 'nexus'
                  ? 'bg-white dark:bg-[#15181e] text-[#5b4636] dark:text-[#eee1ba] shadow-sm'
                  : 'text-[#5b4636]/60 dark:text-[#eee1ba]/60 hover:opacity-80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document Nexus ({nexusBookmarks.length})</span>
            </button>
          </div>

          <div className="space-y-10 pt-4">
            {/* Workspace Hub / Starred Projects Part */}
            {(activeTab === 'all' || activeTab === 'hub') && (
              <WorkspaceHubBookmarks 
                bookmarks={hubBookmarks} 
                onRemove={handleRemoveBookmark} 
                hideEmptyState={activeTab === 'all'}
              />
            )}

            {/* Document Nexus / Page Bookmarks Part */}
            {(activeTab === 'all' || activeTab === 'nexus') && (
              <DocumentNexusBookmarks 
                bookmarks={nexusBookmarks} 
                onRemove={handleRemoveBookmark} 
                hideEmptyState={activeTab === 'all'}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

