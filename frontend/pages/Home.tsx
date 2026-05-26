import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../services/api/content';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/ui/Loader';
import { motion } from 'motion/react';
import { Sparkles, FileText } from 'lucide-react';

const Home: React.FC = () => {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await contentService.getAll();
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleDeleteContent = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      try {
        await contentService.delete(id);
        setContent(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        console.error('Failed to delete content', err);
        alert(err?.response?.data?.message || err?.message || 'Failed to delete content.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
      <header className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-black border border-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8"
        >
          <Sparkles className="w-3 h-3 text-[#eee1ba]" />
          <span>Knowledge Repository</span>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.85] mb-8"
            >
              The architecture of <br />
              <Link to="/document" className="text-black bg-[#eee1ba]/40 hover:bg-[#eee1ba] dark:bg-[#eee1ba]/80 dark:hover:bg-[#eee1ba] px-3 py-1 rounded-2xl transition-all duration-300 inline-block mt-2 font-black">
                modern learning.
              </Link>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-semibold max-w-xl cursor-pointer hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              <Link to="/document" className="block focus:outline-none">
                WorkSpace Nexus is a structured document system designed for developers 
                and teams who value clarity, speed, and precision in documentation.
              </Link>
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-6 p-6 bg-white dark:bg-[#15181e] rounded-3xl border border-slate-100 dark:border-[#2d323f] shadow-sm transition-colors duration-300"
          >
            <div className="flex -space-x-3">
              {['A', 'B', 'C'].map((char, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-[#15181e] bg-black text-[#eee1ba] flex items-center justify-center text-xs font-black">
                  {char}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-black text-slate-900 dark:text-white leading-tight">Join 2.5k+ active users</p>
              <p className="text-slate-400 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-0.5">Monthly readers & builders</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Feature Grid Banner for a gorgeous layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-8 bg-slate-50 dark:bg-[#15181e] rounded-3xl border border-slate-100 dark:border-[#2d323f] transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-black text-[#eee1ba] rounded-2xl flex items-center justify-center font-black text-lg mb-6 shadow-sm">
            01
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Structured Workspaces</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Organize documents in dedicated, beautiful workspaces designed for high-focus writing.</p>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-[#15181e] rounded-3xl border border-slate-100 dark:border-[#2d323f] transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-black text-[#eee1ba] rounded-2xl flex items-center justify-center font-black text-lg mb-6 shadow-sm">
            02
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Markdown Publisher</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Write inside of an immersive engine with instant local draft saving and version support.</p>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-[#15181e] rounded-3xl border border-slate-100 dark:border-[#2d323f] transition-all hover:shadow-md">
          <div className="w-12 h-12 bg-black text-[#eee1ba] rounded-2xl flex items-center justify-center font-black text-lg mb-6 shadow-sm">
            03
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Collaborative Hub</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Share, search, and access your repository on any screen, fully updated in real-time.</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (Array.isArray(content) && content.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.map((item) => (
            <ContentCard 
              key={item.id} 
              content={item} 
              onDelete={isAdmin ? () => handleDeleteContent(item.id, item.title) : undefined} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-[#15181e] rounded-3xl border border-dashed border-slate-200 dark:border-[#2d323f]">
          <div className="w-16 h-16 bg-white dark:bg-[#1f242e] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileText className="text-slate-400 dark:text-slate-300 w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">No Documents Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-8">
            Start by creating a workspace where you can publish clean, structured documentation.
          </p>
          <Link 
            to="/document" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-[#eee1ba] text-[#eee1ba] dark:text-black hover:bg-slate-800 dark:hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm"
          >
            Create Your First Workspace
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
