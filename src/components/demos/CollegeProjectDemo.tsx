import React, { useState } from 'react';
import { BookOpen, Search, Filter, BookmarkCheck, Clock, UserCheck, ShieldAlert, CheckCircle } from 'lucide-react';

export const CollegeProjectDemo: React.FC<{ onSelectThisDemo?: () => void }> = ({ onSelectThisDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'CSE' | 'ECE' | 'MECH' | 'AI'>('all');
  const [reservedBooks, setReservedBooks] = useState<string[]>(['b-1']);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_books' | 'architecture'>('catalog');

  const books = [
    { id: 'b-1', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen et al.', dept: 'CSE', copies: 4, rack: 'Shelf A-12' },
    { id: 'b-2', title: 'Database System Concepts (Silberschatz)', author: 'Abraham Silberschatz', dept: 'CSE', copies: 7, rack: 'Shelf B-04' },
    { id: 'b-3', title: 'Deep Learning & Neural Networks', author: 'Ian Goodfellow', dept: 'AI', copies: 2, rack: 'Shelf A-09' },
    { id: 'b-4', title: 'Digital Signal Processing (Proakis)', author: 'John G. Proakis', dept: 'ECE', copies: 5, rack: 'Shelf C-02' },
    { id: 'b-5', title: 'Thermodynamics: An Engineering Approach', author: 'Yunus A. Cengel', dept: 'MECH', copies: 3, rack: 'Shelf D-10' },
    { id: 'b-6', title: 'Cloud Computing & Distributed Systems', author: 'Rajkumar Buyya', dept: 'CSE', copies: 6, rack: 'Shelf B-11' },
  ];

  const handleReserve = (id: string) => {
    if (reservedBooks.includes(id)) {
      setReservedBooks(reservedBooks.filter(item => item !== id));
    } else {
      setReservedBooks([...reservedBooks, id]);
    }
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || b.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div id="college-project-demo" className="bg-slate-900 text-slate-100 font-sans min-h-[600px] rounded-xl overflow-hidden border border-slate-800">
      {/* Top Banner */}
      <div className="bg-slate-800/80 px-6 py-3.5 border-b border-slate-700/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">Apex Institute of Technology - Smart Library System</span>
            <p className="text-[11px] text-slate-400">Final Year Major Project #CS-2025-08</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSelectThisDemo && (
            <button
              onClick={onSelectThisDemo}
              className="text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Get Project Like This (₹999)
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-slate-800 bg-slate-950/50 flex gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'catalog' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📚 Book Catalog ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('my_books')}
          className={`py-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'my_books' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🔖 Reserved Books
          <span className="bg-teal-500/20 text-teal-300 text-[10px] px-1.5 py-0.2 rounded-full border border-teal-500/30">
            {reservedBooks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-3 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'architecture' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚙️ Viva Notes & Architecture
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {activeTab === 'catalog' && (
          <div>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by book name or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 overflow-x-auto">
                {(['all', 'CSE', 'AI', 'ECE', 'MECH'] as const).map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`text-xs px-2.5 py-1 rounded transition-all cursor-pointer ${
                      selectedDept === dept ? 'bg-teal-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredBooks.map(b => {
                const isReserved = reservedBooks.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className="bg-slate-800/60 border border-slate-700/70 hover:border-teal-500/40 rounded-xl p-4 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                          {b.dept} Department
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{b.rack}</span>
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{b.title}</h4>
                      <p className="text-xs text-slate-400 mb-3">Author: {b.author}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
                      <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {b.copies} Copies Available
                      </span>

                      <button
                        onClick={() => handleReserve(b.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          isReserved
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-teal-600 hover:bg-teal-500 text-white'
                        }`}
                      >
                        {isReserved ? 'Reserved ✓' : 'Reserve Book'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'my_books' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-teal-400" /> Active Reservations (Return within 14 Days)
            </h3>
            {reservedBooks.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                No books currently reserved. Browse the catalog to reserve books.
              </div>
            ) : (
              <div className="space-y-2.5">
                {books.filter(b => reservedBooks.includes(b.id)).map(b => (
                  <div key={b.id} className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="font-semibold text-sm text-white">{b.title}</h4>
                      <p className="text-xs text-slate-400">Location: {b.rack} • Issue Date: Today</p>
                    </div>
                    <button
                      onClick={() => handleReserve(b.id)}
                      className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs space-y-4 font-mono">
            <div className="text-teal-400 font-bold text-sm">🎓 Faculty Viva & Project Documentation Notes:</div>
            <p className="text-slate-300">
              <span className="text-white font-bold">1. Front-End:</span> React 19 + Tailwind CSS + Lucide Icons for rapid reactive rendering.
            </p>
            <p className="text-slate-300">
              <span className="text-white font-bold">2. State Management:</span> Dynamic array state hooks for instant book filtering & reservation tracking.
            </p>
            <p className="text-slate-300">
              <span className="text-white font-bold">3. Database Schema:</span> Normalized books collection with department indexing and RFID rack mapping.
            </p>
            <div className="p-3 bg-teal-950/60 rounded-lg border border-teal-700/50 text-teal-200 text-[11px]">
              💡 <strong>LC Web Studio Bonus:</strong> When you order this package (₹999–₹1,499), you get the complete Project Report (Word doc), PPT Slides, and 1-on-1 Viva Preparation guide!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
