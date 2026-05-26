/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// 1. ResponsiveContainer: Centralized viewport-clamped standard margin container
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`w-full max-w-7xl mx-auto spacing-p-adaptive ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// 2. ResponsiveLayout: Handles standard overall page padding & high bounds
export const ResponsiveLayout: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden flex flex-col md:flex-row relative bg-slate-50 dark:bg-[#0f1115] transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 3. ResponsiveGrid: Responsive auto-fitting grid system
export const ResponsiveGrid: React.FC<ResponsiveContainerProps & { cols?: string }> = ({ 
  children, 
  className = '', 
  cols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', 
  ...props 
}) => {
  return (
    <div 
      className={`grid spacing-gap-adaptive ${cols} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// 4. ResponsiveCard: Adaptive background panel holding list elements
export const ResponsiveCard: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`bg-white dark:bg-[#15181e] border border-slate-200 dark:border-[#2d323f]/85 card-adaptive shadow-sm hover:shadow-md transition-all ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// 5. ResponsiveSidebar: Adaptive sidebar container
export const ResponsiveSidebar: React.FC<ResponsiveContainerProps & { isOpen?: boolean; onClose?: () => void }> = ({
  children,
  className = '',
  isOpen = false,
  onClose,
  ...props
}) => {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 sidebar-adaptive bg-white dark:bg-[#15181e] border-r border-slate-200 dark:border-[#2d323f] transform transition-transform duration-300 md:relative md:transform-none md:z-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${className}`}
        {...props}
      >
        {children}
      </aside>
    </>
  );
};

// 6. ResponsiveModal: Converts to bottom drawer on mobile phones automatically
export const ResponsiveModal: React.FC<ResponsiveContainerProps & { isOpen: boolean; onClose: () => void }> = ({
  children,
  className = '',
  isOpen,
  onClose,
  ...props
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer" />
      <div 
        className={`relative bg-white dark:bg-[#15181e] rounded-t-3xl sm:rounded-3xl modal-adaptive shadow-2xl z-10 text-slate-800 dark:text-white transform transition-all max-h-[85vh] overflow-y-auto ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

// 7. ResponsivePanel: Reusable dynamic panels
export const ResponsivePanel: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`w-full bg-slate-50 dark:bg-[#0f1115] spacing-p-adaptive rounded-2xl border border-slate-200/60 dark:border-[#2d323f]/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 8. ResponsiveToolbar: Dynamic wrapped action bar which scrolls horizontally on XS layouts
export const ResponsiveToolbar: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`flex items-center spacing-gap-adaptive p-2 bg-slate-50 dark:bg-[#1c212c] border border-slate-200 dark:border-[#2d323f]/80 rounded-xl overflow-x-auto max-w-full whitespace-nowrap scrollbar-none scroll-smooth ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 9. ResponsiveTable: Secure horizontally scrollable table wrapper
export const ResponsiveTable: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`w-full overflow-x-auto border border-slate-200 dark:border-[#2d323f] table-text-adaptive rounded-2xl bg-white dark:bg-[#15181e] shadow-sm ${className}`}
      {...props}
    >
      <div className="min-w-[640px] w-full">
        {children}
      </div>
    </div>
  );
};
