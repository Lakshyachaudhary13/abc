import React, { useState } from 'react';
import { WebsiteCategory, BudgetRange } from '../types';
import { Sparkles, X, Upload, ArrowRight, CheckCircle2, Cpu, Clock, Layers, DollarSign, Image as ImageIcon } from 'lucide-react';

interface AIEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToForm: (category: WebsiteCategory, requirements: string, budget: BudgetRange, packageTitle: string) => void;
}

export const AIEstimatorModal: React.FC<AIEstimatorModalProps> = ({
  isOpen,
  onClose,
  onApplyToForm
}) => {
  const [mode, setMode] = useState<'text' | 'sketch'>('text');
  
  // Text mode states
  const [category, setCategory] = useState<WebsiteCategory>('college_project');
  const [ideaText, setIdeaText] = useState('');
  const [budget, setBudget] = useState<BudgetRange>('1000-2500');
  
  // Sketch mode states
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/png');
  const [sketchNotes, setSketchNotes] = useState('');

  // Results
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setSketchImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeText = async () => {
    if (!ideaText.trim()) {
      setError('Please describe your idea or requirements');
      return;
    }
    setError(null);
    setLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          requirements: ideaText,
          budget
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult({ type: 'estimate', data: data.analysis });
      }
    } catch (err: any) {
      console.error(err);
      setError('Estimation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSketch = async () => {
    if (!sketchImage) {
      setError('Please select an image/sketch first');
      return;
    }
    setError(null);
    setLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-sketch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sketchImage,
          mimeType,
          userNotes: sketchNotes
        })
      });

      const data = await res.json();
      if (data.result) {
        setAnalysisResult({ type: 'sketch', data: data.result });
      }
    } catch (err: any) {
      console.error(err);
      setError('Sketch analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!analysisResult) return;

    if (analysisResult.type === 'estimate') {
      const est = analysisResult.data;
      const combinedReq = `${ideaText}\n\n[AI Suggested Architecture]\n• Recommended Pages: ${est.recommendedPages?.join(', ')}\n• Features: ${est.keyFeatures?.join('; ')}\n• Tech: ${est.recommendedTechStack?.join(', ')}`;
      onApplyToForm(category, combinedReq, budget, est.recommendedPackage || 'Custom');
    } else {
      const sk = analysisResult.data;
      const combinedReq = `[Sketch Layout: ${sk.detectedType}]\n${sk.layoutStructure}\n\nComponents: ${sk.detectedComponents?.join(', ')}\nNotes: ${sk.developerNotes}`;
      onApplyToForm('other', combinedReq, '1000-2500', sk.suggestedPackage || 'Custom');
    }
    onClose();
  };

  return (
    <div id="ai-estimator-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm bg-orange-600/10 text-orange-500 border border-orange-600/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-white text-lg sm:text-xl">
                AI Website Cost & Blueprint Estimator
              </h3>
              <p className="text-xs text-white/50 font-light">Gemini AI engine for immediate architectural scoping & price ranges</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1.5 rounded-sm bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 bg-[#0A0A0A] p-1 rounded-sm border border-white/10 mb-6">
          <button
            onClick={() => { setMode('text'); setAnalysisResult(null); }}
            className={`flex-1 py-2 rounded-sm text-[11px] uppercase tracking-[0.15em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'text'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Text Idea & Brief
          </button>
          <button
            onClick={() => { setMode('sketch'); setAnalysisResult(null); }}
            className={`flex-1 py-2 rounded-sm text-[11px] uppercase tracking-[0.15em] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'sketch'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Upload Wireframe / Sketch
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-sm text-red-300 text-xs mb-4">
            {error}
          </div>
        )}

        {/* Input Forms */}
        {mode === 'text' && !analysisResult && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WebsiteCategory)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="college_project">🎓 College Project (Major / Minor Viva)</option>
                <option value="portfolio">💼 Student / Developer / Designer Portfolio</option>
                <option value="business">🏢 Local Business / Agency / Clinic</option>
                <option value="shop">🛍️ Shop / Catalogue / Mini E-Commerce</option>
                <option value="personal">👤 Personal Bio / Event / Wedding</option>
                <option value="other">🌐 Custom Web Application</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                Describe your website idea in simple words:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. I need a library management portal where students can search books and reserve them online with RFID simulation..."
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-xs text-white placeholder-white/30 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Target Budget Range:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['500-1000', '1000-2500', '2500-5000'] as const).map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`py-2.5 rounded-sm border font-mono font-bold cursor-pointer transition-all ${
                      budget === b
                        ? 'bg-orange-600/20 border-orange-500 text-white'
                        : 'bg-[#0A0A0A] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    ₹{b}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyzeText}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.2em] py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> Analyzing Architecture with Gemini...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Blueprint & Cost</span>
                </>
              )}
            </button>
          </div>
        )}

        {mode === 'sketch' && !analysisResult && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                Upload Hand-drawn Sketch, Wireframe, or Screenshot:
              </label>

              <div className="border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-sm p-6 text-center bg-[#0A0A0A] cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {sketchImage ? (
                  <div className="space-y-2">
                    <img src={sketchImage} alt="Uploaded sketch" className="max-h-40 mx-auto rounded-sm object-contain" />
                    <p className="text-xs text-orange-400 font-semibold font-mono">Image loaded successfully! Click below to analyze.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-white/40 mx-auto" />
                    <p className="text-xs text-white/70 font-medium">Click or drag an image here</p>
                    <p className="text-[11px] text-white/40 font-light">Supports PNG, JPG, WebP photos of drawings or mockups</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                Any specific notes or details? (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. This is for my college final year project due next week"
                value={sketchNotes}
                onChange={(e) => setSketchNotes(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-xs text-white placeholder-white/30 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleAnalyzeSketch}
              disabled={loading || !sketchImage}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.2em] py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> Analyzing Wireframe with Gemini...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Wireframe Structure</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Display */}
        {analysisResult && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {analysisResult.type === 'estimate' && (
              <div className="space-y-4 text-xs">
                {/* Header summary */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">Recommended Scope</span>
                      <h4 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">{analysisResult.data.projectTitle}</h4>
                    </div>
                    <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2.5 py-1 rounded-sm font-mono font-bold">
                      {analysisResult.data.estimatedPriceRange}
                    </span>
                  </div>

                  <p className="text-white/80 text-xs italic bg-[#141414] p-3 rounded-sm border border-white/10">
                    💬 "{analysisResult.data.consultantAdviceHindi}"
                  </p>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10">
                    <span className="text-white/50 font-medium block mb-1 uppercase tracking-wider text-[10px]">⏱ Turnaround:</span>
                    <span className="text-white font-bold text-sm font-mono">{analysisResult.data.estimatedDelivery}</span>
                  </div>
                  <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10">
                    <span className="text-white/50 font-medium block mb-1 uppercase tracking-wider text-[10px]">📦 Best Matched Tier:</span>
                    <span className="text-orange-400 font-bold">{analysisResult.data.recommendedPackage}</span>
                  </div>
                </div>

                {/* Pages & Key Features */}
                <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 space-y-2">
                  <span className="text-white font-bold uppercase tracking-wider text-[10px] block">📄 Recommended Pages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.data.recommendedPages?.map((page: string, i: number) => (
                      <span key={i} className="bg-white/5 text-white/80 px-2.5 py-1 rounded-sm border border-white/10 text-[11px] font-mono">
                        {page}
                      </span>
                    ))}
                  </div>

                  <span className="text-white font-bold uppercase tracking-wider text-[10px] block pt-2">✨ Included Capabilities:</span>
                  <div className="space-y-1">
                    {analysisResult.data.keyFeatures?.map((feat: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 text-white/70 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleApply}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.15em] py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
                  >
                    <span>Use this in Request Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setAnalysisResult(null)}
                    className="px-4 bg-white/5 hover:bg-white/10 text-white/70 text-xs uppercase tracking-[0.15em] py-3.5 rounded-sm border border-white/10 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {analysisResult.type === 'sketch' && (
              <div className="space-y-4 text-xs">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400 font-bold">Detected Wireframe</span>
                  <h4 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">{analysisResult.data.detectedType}</h4>
                  <p className="text-white/70 text-xs mt-2 font-light">{analysisResult.data.layoutStructure}</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10">
                    <span className="text-white/50 font-medium block mb-1 uppercase tracking-wider text-[10px]">💰 Estimated Budget:</span>
                    <span className="text-orange-400 font-bold font-mono text-sm">{analysisResult.data.estimatedBudget}</span>
                  </div>
                  <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10">
                    <span className="text-white/50 font-medium block mb-1 uppercase tracking-wider text-[10px]">⏱ Estimated Delivery:</span>
                    <span className="text-white font-bold text-sm font-mono">{analysisResult.data.turnaroundTime}</span>
                  </div>
                </div>

                <div className="bg-[#0A0A0A] p-4 rounded-sm border border-white/10 space-y-2">
                  <span className="text-white font-bold uppercase tracking-wider text-[10px] block">🧩 Detected Components:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.data.detectedComponents?.map((comp: string, i: number) => (
                      <span key={i} className="bg-white/5 text-orange-400 px-2.5 py-1 rounded-sm border border-white/10 text-[11px] font-mono">
                        {comp}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-xs pt-2 font-light">
                    <strong className="text-white">Developer Notes:</strong> {analysisResult.data.developerNotes}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleApply}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.15em] py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
                  >
                    <span>Pre-Fill Request with This Layout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setAnalysisResult(null)}
                    className="px-4 bg-white/5 hover:bg-white/10 text-white/70 text-xs uppercase tracking-[0.15em] py-3.5 rounded-sm border border-white/10 transition-colors cursor-pointer"
                  >
                    Try Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
