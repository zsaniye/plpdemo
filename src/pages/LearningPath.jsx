import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Route,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  Video,
  Headphones,
  ExternalLink,
  Clock,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const typeIcons = {
  Course: BookOpen,
  PDF: FileText,
  Document: FileSpreadsheet,
  Presentation: Presentation,
  Video: Video,
  Audio: Headphones,
};

const phaseColors = [
  { bg: "bg-emerald-50", border: "border-emerald-200", accent: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  { bg: "bg-blue-50", border: "border-blue-200", accent: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  { bg: "bg-purple-50", border: "border-purple-200", accent: "text-purple-700", badge: "bg-purple-100 text-purple-700" },
];

export default function LearningPath() {
  const {
    selectedLearner,
    generateLearningPath,
    generatedPaths,
    profiles,
    setSelectedLearnerId,
  } = useApp();
  const [generating, setGenerating] = useState(false);

  const path = generatedPaths[selectedLearner?.id];

  function handleGenerate() {
    if (!selectedLearner) return;
    setGenerating(true);
    // Simulate a brief delay for UX
    setTimeout(() => {
      generateLearningPath(selectedLearner.id);
      setGenerating(false);
    }, 800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Personalized Learning Path
        </h2>
        <p className="text-gray-600 mt-1">
          AI-generated learning paths tailored to each learner's skills, goals, and preferences
        </p>
      </div>

      {/* Learner Selection & Generate */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Select Learner
            </label>
            <select
              value={selectedLearner?.id || ""}
              onChange={(e) => setSelectedLearnerId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.identity.name} - {p.identity.jobTitle} ({p.type})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedLearner}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-5 md:mt-0"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? "Generating..." : "Generate Learning Path"}
          </button>
        </div>

        {selectedLearner && !path && !generating && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            <AlertCircle className="w-4 h-4" />
            Click "Generate Learning Path" to create a personalized path for{" "}
            <strong>{selectedLearner.identity.name}</strong>
          </div>
        )}
      </div>

      {/* Generated Path */}
      {path && (
        <div className="space-y-6">
          {/* Path Summary */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Route className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                Learning Path for {path.learnerName}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <SummaryStat label="Total Items" value={path.totalItems} />
              <SummaryStat label="Est. Duration" value={path.estimatedDuration} />
              <SummaryStat label="Skill Gaps" value={path.skillGaps.length} />
              <SummaryStat label="Phases" value={path.phases.length} />
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Identified Skill Gaps</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {path.skillGaps.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Phases */}
          {path.phases.map((phase, idx) => {
            const colors = phaseColors[idx] || phaseColors[0];
            return (
              <div key={phase.phase} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full ${colors.badge} flex items-center justify-center text-sm font-bold`}
                  >
                    {phase.phase}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {phase.title}
                    </h3>
                    <p className="text-sm text-gray-600">{phase.description}</p>
                  </div>
                  {idx < path.phases.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-300 ml-auto hidden md:block" />
                  )}
                </div>

                {phase.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.items.map((item) => {
                      const Icon = typeIcons[item.contentType] || BookOpen;
                      return (
                        <div
                          key={item.id}
                          className={`${colors.bg} ${colors.border} border rounded-xl p-4`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}
                            >
                              <Icon className="w-3 h-3" />
                              {item.contentType}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.duration}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          {item.matchingSkills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.matchingSkills.map((s) => (
                                <span
                                  key={s}
                                  className="px-1.5 py-0.5 bg-white/60 rounded text-xs text-gray-700"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{item.provider}</span>
                            {item.url !== "#" && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 font-medium ${colors.accent}`}
                              >
                                Open <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 text-center">
                    No content available for this phase at the moment.
                  </div>
                )}
              </div>
            );
          })}

          {/* Path Generated Info */}
          <div className="text-xs text-gray-400 text-center py-2">
            Path generated on{" "}
            {new Date(path.generatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div className="bg-white/10 rounded-lg p-3 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
}
