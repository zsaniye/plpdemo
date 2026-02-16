import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Target,
  User,
  Lightbulb,
} from "lucide-react";

const searchTips = [
  { label: "Feature Launch", text: "Prepare my team with the right skills for a successful go-to-market strategy." },
  { label: "AI Upskilling", text: "Upskill in AI and generative AI tools to become more effective in my role." },
  { label: "Leadership Growth", text: "Develop management and strategic thinking skills for a leadership role." },
  { label: "Skill Gap Closure", text: "Close my skill gaps and reach an advanced level in core competencies." },
];

export default function AIAssistant() {
  const { selectedLearner, profiles, setSelectedLearnerId } = useApp();

  const isEmployee = selectedLearner?.type === "Employee";
  const learnerSkills = selectedLearner?.skills || [];
  const beginnerSkills = learnerSkills.filter((s) => s.proficiencyLevel === "Beginner");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI Learning Assistant
        </h2>
        <p className="text-gray-600 mt-1">
          Describe your goal and get a personalized learning path powered by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Learner Context */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-700">Active Learner</h3>
            </div>
            <select
              value={selectedLearner?.id || ""}
              onChange={(e) => setSelectedLearnerId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.identity.name} ({p.type})
                </option>
              ))}
            </select>
            {selectedLearner && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {selectedLearner.identity.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {selectedLearner.identity.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedLearner.identity.jobTitle}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {selectedLearner.identity.jobFamily}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {selectedLearner.type}
                  </span>
                </div>
                {isEmployee && (
                  <>
                    <div className="border-t pt-3">
                      <div className="text-xs font-medium text-gray-500 mb-1.5">Current Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {learnerSkills.map((s) => {
                          const color =
                            s.proficiencyLevel === "Advanced"
                              ? "bg-emerald-50 text-emerald-700"
                              : s.proficiencyLevel === "Intermediate"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700";
                          return (
                            <span key={s.skill} className={`px-1.5 py-0.5 rounded text-xs ${color}`}>
                              {s.skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {beginnerSkills.length > 0 && (
                      <div className="border-t pt-3">
                        <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                          <Target className="w-3 h-3" /> Growth Areas
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {beginnerSkills.map((s) => (
                            <span
                              key={s.skill}
                              className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs"
                            >
                              {s.skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search Tips */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-700">Search Tips</h3>
            </div>
            <div className="space-y-2">
              {searchTips.map((tip) => (
                <div
                  key={tip.label}
                  className="p-2.5 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {tip.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {tip.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Embedded AI Assistant */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex-1">
            <iframe
              src="https://apurplewonderwall.lovable.app/"
              title="AI Learning Assistant"
              className="w-full h-full border-0"
              allow="microphone; camera"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
