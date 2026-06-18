import { useState, useEffect } from 'react';
import { Menu, X, BookOpen, Activity, GitBranch, Settings, ChevronRight, Terminal } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  const navItems = [
    { label: 'Getting Started', id: 'getting-started', icon: Terminal },
    { label: 'Managing Streams', id: 'managing-streams', icon: Activity },
    { label: 'Revenue Splits', id: 'revenue-splits', icon: GitBranch },
    { label: 'Utility Functions', id: 'utility-functions', icon: Settings },
  ];

  // Set up intersection observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          Piper Docs
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -mr-2 text-slate-600 z-50 relative">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="hidden md:flex p-6 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              Piper SDK
            </Link>
          </div>
          
          <div className="p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
              Documentation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 bg-white md:ml-64">
        <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
