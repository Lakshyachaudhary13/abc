import React, { useState } from 'react';
import { Github, Linkedin, Mail, Download, ExternalLink, Sparkles, CheckCircle2, Code2, Terminal, Award } from 'lucide-react';

export const StudentPortfolioDemo: React.FC<{ onSelectThisDemo?: () => void }> = ({ onSelectThisDemo }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'ai' | 'app'>('all');
  const [showResumeModal, setShowResumeModal] = useState(false);

  const projects = [
    {
      title: 'AI Resume & ATS Checker',
      category: 'ai',
      desc: 'Smart career portal that scans resumes against job descriptions with 94% accuracy score.',
      tech: ['React', 'Python', 'Gemini API', 'Tailwind'],
      demoLink: '#',
      githubLink: '#'
    },
    {
      title: 'Campus Food Delivery App',
      category: 'web',
      desc: 'Real-time hostel canteen ordering system with live status tracking and UPI gateway.',
      tech: ['Node.js', 'Express', 'React', 'MongoDB'],
      demoLink: '#',
      githubLink: '#'
    },
    {
      title: 'Smart Attendance using QR & Geo',
      category: 'app',
      desc: 'Mobile-first attendance portal preventing proxy check-ins with geolocation tagging.',
      tech: ['React Native', 'Firebase', 'GeoLocation'],
      demoLink: '#',
      githubLink: '#'
    },
    {
      title: 'Cryptocurrency Portfolio Tracker',
      category: 'web',
      desc: 'Live crypto ticker dashboard with real-time websocket price charts and profit tracker.',
      tech: ['TypeScript', 'Recharts', 'CoinGecko API'],
      demoLink: '#',
      githubLink: '#'
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div id="student-portfolio-demo" className="bg-slate-950 text-slate-100 font-sans min-h-[600px] rounded-xl overflow-hidden border border-slate-800">
      {/* Demo Nav */}
      <div className="bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
            A
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">Aditya Sharma</span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              B.Tech Final Year CSE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="demo-resume-btn"
            onClick={() => setShowResumeModal(true)}
            className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Resume
          </button>
          {onSelectThisDemo && (
            <button
              id="request-portfolio-like-btn"
              onClick={onSelectThisDemo}
              className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Get Site Like This (₹1,499)
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Open for Software Engineer Roles & Internships
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Hi, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Aditya Sharma</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
          Full Stack Developer building performant web applications with clean code & delightful user interfaces. Winner of Smart India Hackathon 2025.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {['React.js', 'Next.js', 'Node.js', 'TypeScript', 'TailwindCSS', 'PostgreSQL', 'Docker'].map(skill => (
            <span key={skill} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              {skill}
            </span>
          ))}
        </div>

        {/* Projects Filter */}
        <div className="border-t border-slate-800/80 pt-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" /> Featured Projects
              </h2>
              <p className="text-xs text-slate-400">Filter by category to explore live builds</p>
            </div>

            <div className="flex gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['all', 'web', 'ai', 'app'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs px-3 py-1 rounded-md capitalize transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'All (4)' : filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProjects.map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{p.title}</h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{p.desc}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tech.map((t, i) => (
                      <span key={i} className="text-[10px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <a href="#live" onClick={(e) => { e.preventDefault(); alert(`Opening live demo of ${p.title}`); }} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer">
                      <ExternalLink className="w-3 h-3" /> Live Demo
                    </a>
                    <a href="#github" onClick={(e) => { e.preventDefault(); alert(`Opening GitHub code for ${p.title}`); }} className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer">
                      <Github className="w-3 h-3" /> Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" /> Aditya Sharma - Resume
              </h3>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-3 mb-5 font-mono">
              <p className="text-indigo-400 font-bold">🎓 Education: B.Tech CSE (CGPA: 8.9/10)</p>
              <p className="text-slate-300">💼 Experience: Frontend Intern at TechVanguard (6 months)</p>
              <p className="text-slate-300">🏆 Achievements: SIH Hackathon Top 10, 450+ LeetCode Solved</p>
              <p className="text-emerald-400 font-semibold">📞 Contact: aditya.sharma@example.com</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Resume download simulated successfully!');
                  setShowResumeModal(false);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Full PDF
              </button>
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
