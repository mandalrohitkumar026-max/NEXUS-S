import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ShieldAlert, Plus, Download, FileText, Beaker } from 'lucide-react';
import { ABLATION_STUDY_DATA, RESEARCH_NOTEBOOK_ENTRIES } from '../../data/researchData';
import { ResearchNotebookEntry } from '../../types/experiment';

export const ResearchView: React.FC = () => {
  const [subTab, setSubTab] = useState<'ablation' | 'emergent' | 'notebook'>('ablation');
  const [notebookEntries, setNotebookEntries] = useState<ResearchNotebookEntry[]>(RESEARCH_NOTEBOOK_ENTRIES);

  // New hypothesis modal / form state
  const [showNewHypothesis, setShowNewHypothesis] = useState(false);
  const [hypTitle, setHypTitle] = useState('');
  const [hypText, setHypText] = useState('');
  const [hypExpTag, setHypExpTag] = useState('EXP-COMM-CUSTOM-01');
  const [hypObserved, setHypObserved] = useState('');
  const [hypConclusion, setHypConclusion] = useState('');

  const handleCreateHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hypTitle || !hypText) return;

    const newEntry: ResearchNotebookEntry = {
      id: `hyp-${Date.now().toString().slice(-4)}`,
      hypothesisNumber: notebookEntries.length + 18,
      title: hypTitle,
      hypothesisText: hypText,
      experimentTag: hypExpTag,
      configSummary: '12 agents, urban obstacle arena, MAPPO decentralized.',
      observedResult: hypObserved || 'Initial validation complete in synthetic simulation.',
      conclusion: hypConclusion || 'Hypothesis holds under tested simulation parameters.',
      confidenceRating: 'HIGH',
      date: new Date().toISOString().split('T')[0],
      author: 'Swarm Intelligence Group',
    };

    setNotebookEntries([newEntry, ...notebookEntries]);
    setShowNewHypothesis(false);
    setHypTitle('');
    setHypText('');
    setHypObserved('');
    setHypConclusion('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              RESEARCH LAB // ABLATION STUDIES & EXPERIMENT NOTEBOOK
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            Systematic component ablations, emergent pattern recognition, and reproducible scientific notes
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex border border-[#242b38] rounded bg-[#141820] p-0.5 text-[10px]">
          <button
            onClick={() => setSubTab('ablation')}
            className={`px-3 py-1 rounded transition-colors ${
              subTab === 'ablation' ? 'bg-[#1e2430] text-amber-300 font-bold' : 'text-[#8b949e] hover:text-[#e6edf3]'
            }`}
          >
            ABLATION LAB
          </button>
          <button
            onClick={() => setSubTab('emergent')}
            className={`px-3 py-1 rounded transition-colors ${
              subTab === 'emergent' ? 'bg-[#1e2430] text-cyan-300 font-bold' : 'text-[#8b949e] hover:text-[#e6edf3]'
            }`}
          >
            EMERGENT BEHAVIORS
          </button>
          <button
            onClick={() => setSubTab('notebook')}
            className={`px-3 py-1 rounded transition-colors ${
              subTab === 'notebook' ? 'bg-[#1e2430] text-emerald-300 font-bold' : 'text-[#8b949e] hover:text-[#e6edf3]'
            }`}
          >
            NOTEBOOK ({notebookEntries.length})
          </button>
        </div>
      </div>

      {/* 1. Ablation Study Lab */}
      {subTab === 'ablation' && (
        <div className="space-y-4">
          <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
            <div className="border-b border-[#1e2430] pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#e6edf3]">SYSTEMATIC ABLATION MATRIX</h3>
                <p className="text-[10px] text-[#8b949e]">
                  Measuring degradation when individual decentralized intelligence components are removed
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#141820] text-amber-400 border border-[#242b38]">
                PEER-REVIEW STANDARD
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-[#242b38] bg-[#141820] text-[#8b949e] uppercase text-[10px]">
                    <th className="p-2.5">Ablation Condition</th>
                    <th className="p-2.5">Area Coverage</th>
                    <th className="p-2.5">Energy Reserve</th>
                    <th className="p-2.5">Survival Rate</th>
                    <th className="p-2.5">Targets Found</th>
                    <th className="p-2.5">Relative Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2430]">
                  {ABLATION_STUDY_DATA.map((item, idx) => {
                    const isBaseline = idx === 0;
                    return (
                      <tr key={idx} className="hover:bg-[#141820] transition-colors">
                        <td className="p-2.5">
                          <span className={`font-bold ${isBaseline ? 'text-amber-400' : 'text-[#e6edf3]'}`}>
                            {item.condition}
                          </span>
                          <span className="block text-[9px] text-[#545d68]">{item.description}</span>
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-emerald-400">{item.coveragePercent}%</span>
                            <div className="w-16 bg-[#141820] h-1.5 rounded overflow-hidden">
                              <div className="bg-emerald-500 h-full" style={{ width: `${item.coveragePercent}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2.5 font-mono text-[#cbd5e1]">{item.energyPercent}%</td>
                        <td className="p-2.5 font-bold">
                          <span className={item.survivalRate < 50 ? 'text-rose-400' : 'text-emerald-400'}>
                            {item.survivalRate}%
                          </span>
                        </td>
                        <td className="p-2.5 text-cyan-400 font-bold">{item.targetsFound} / 3</td>
                        <td className="p-2.5">
                          {isBaseline ? (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px]">
                              CONTROL (1.0x)
                            </span>
                          ) : (
                            <span className="text-rose-400 font-bold text-[10px]">
                              &minus;{(92.4 - item.coveragePercent).toFixed(1)}% Cov
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Emergent Behaviors Panel */}
      {subTab === 'emergent' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ROLE SPECIALIZATION</span>
            </div>
            <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
              Without any explicit role assignment in code or central supervisor, agents naturally segregate into scouts, repeaters, and power-conservators based purely on local state gradients.
            </p>
            <div className="text-[9px] text-[#545d68] pt-2 border-t border-[#1e2430]">
              Empirical Confidence: 89% &bull; Replicable across 94/100 trials
            </div>
          </div>

          <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC RELAY CHAINING</span>
            </div>
            <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
              When forward scouts detect radio disconnection from the base charging station, intermediary nodes autonomously halt their exploratory trajectory to act as stationary repeater bridges.
            </p>
            <div className="text-[9px] text-[#545d68] pt-2 border-t border-[#1e2430]">
              Empirical Confidence: 84% &bull; Observed in corridors &gt; 120m
            </div>
          </div>

          <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRONTIER SELF-PARTITIONING</span>
            </div>
            <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
              Combined artificial potential repulsion and local information-gain heuristics cause the swarm perimeter to expand radially outward with near-zero trajectory intersection.
            </p>
            <div className="text-[9px] text-[#545d68] pt-2 border-t border-[#1e2430]">
              Empirical Confidence: 92% &bull; Overlap reduction: 34.2%
            </div>
          </div>
        </div>
      )}

      {/* 3. Research Notebook */}
      {subTab === 'notebook' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#e6edf3]">ACADEMIC RESEARCH HYPOTHESIS NOTEBOOK</h3>
            <button
              onClick={() => setShowNewHypothesis(!showNewHypothesis)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW HYPOTHESIS</span>
            </button>
          </div>

          {/* New Hypothesis Form */}
          {showNewHypothesis && (
            <form onSubmit={handleCreateHypothesis} className="bg-[#101318] border border-amber-500/40 rounded p-4 space-y-3">
              <span className="font-bold text-amber-300 block text-xs">LOG SCIENTIFIC HYPOTHESIS</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={hypTitle}
                    onChange={e => setHypTitle(e.target.value)}
                    placeholder="e.g. Asymmetric Lidar FOV Impact on Boundary Convergence"
                    className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Experiment Tag</label>
                  <input
                    type="text"
                    value={hypExpTag}
                    onChange={e => setHypExpTag(e.target.value)}
                    className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">Hypothesis Formulation</label>
                <textarea
                  required
                  rows={2}
                  value={hypText}
                  onChange={e => setHypText(e.target.value)}
                  placeholder="State the measurable theoretical hypothesis..."
                  className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Observed Result</label>
                  <input
                    type="text"
                    value={hypObserved}
                    onChange={e => setHypObserved(e.target.value)}
                    placeholder="Empirical data outcome..."
                    className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Scientific Conclusion</label>
                  <input
                    type="text"
                    value={hypConclusion}
                    onChange={e => setHypConclusion(e.target.value)}
                    placeholder="Implications for decentralized robotics..."
                    className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewHypothesis(false)}
                  className="px-3 py-1 rounded bg-[#141820] text-[#8b949e] border border-[#242b38]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-amber-500 text-black font-bold hover:bg-amber-400"
                >
                  Save Entry
                </button>
              </div>
            </form>
          )}

          {/* Entries list */}
          <div className="space-y-3">
            {notebookEntries.map(entry => (
              <div key={entry.id} className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2430] pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400 text-sm">
                      HYPOTHESIS #{entry.hypothesisNumber}
                    </span>
                    <span className="text-[#e6edf3] font-bold">{entry.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#141820] border border-[#242b38] text-cyan-300">
                    {entry.experimentTag}
                  </span>
                </div>

                <div className="bg-[#0d1015] p-2.5 rounded border border-[#1b202a] text-[#cbd5e1] leading-relaxed">
                  <span className="text-[#8b949e] font-bold block text-[10px] uppercase mb-0.5">
                    Hypothesis Statement:
                  </span>
                  &ldquo;{entry.hypothesisText}&rdquo;
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                  <div>
                    <span className="text-amber-400 font-bold block text-[10px]">OBSERVED RESULT:</span>
                    <p className="text-[#cbd5e1]">{entry.observedResult}</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold block text-[10px]">CONCLUSION:</span>
                    <p className="text-[#cbd5e1]">{entry.conclusion}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-[#545d68] pt-2 border-t border-[#1e2430]">
                  <span>Recorded: {entry.date} &bull; Author: {entry.author}</span>
                  <span className="text-emerald-400 font-bold">CONFIDENCE: {entry.confidenceRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
