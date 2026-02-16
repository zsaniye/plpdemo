import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  UserCircle,
  Mail,
  Briefcase,
  Building,
  MapPin,
  Users,
  Award,
  BookOpen,
  Settings,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const proficiencyColors = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function LearnerProfiles() {
  const { profiles, selectedLearnerId, setSelectedLearnerId } = useApp();
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    transcript: true,
    preferences: true,
    goals: true,
  });

  const learner = profiles.find((p) => p.id === selectedLearnerId) || profiles[0];
  const isEmployee = learner.type === "Employee";

  function toggleSection(section) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Learner Profiles</h2>
        <p className="text-gray-600 mt-1">
          Detailed learner profiles for personalized path generation
        </p>
      </div>

      {/* Learner Selector */}
      <div className="flex gap-2 flex-wrap">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedLearnerId(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              p.id === selectedLearnerId
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p.identity.name}
            <span className="ml-2 text-xs opacity-75">({p.type})</span>
          </button>
        ))}
      </div>

      {/* Identity & Current Role */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {learner.identity.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">{learner.identity.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    learner.type === "Employee"
                      ? "bg-indigo-100 text-indigo-700"
                      : learner.type === "Customer"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {learner.type}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <InfoRow icon={Mail} label="Email" value={learner.identity.email} />
                <InfoRow icon={Briefcase} label="Job Title" value={learner.identity.jobTitle} />
                <InfoRow icon={Award} label="Job Family" value={learner.identity.jobFamily} />
                <InfoRow icon={Building} label="Department" value={learner.identity.department} />
                <InfoRow icon={MapPin} label="Location" value={learner.identity.location} />
                {learner.identity.manager && (
                  <InfoRow icon={Users} label="Manager" value={learner.identity.manager} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {isEmployee && learner.skills.length > 0 && (
        <CollapsibleSection
          title="Skills"
          icon={Award}
          expanded={expandedSections.skills}
          onToggle={() => toggleSection("skills")}
          count={learner.skills.length}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">
                  <th className="px-5 py-3">Skill</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Proficiency Level</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {learner.skills.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {s.skill}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{s.source}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proficiencyColors[s.proficiencyLevel]
                        }`}
                      >
                        {s.proficiencyLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      )}

      {/* Learner Transcript */}
      {isEmployee && learner.learnerTranscript.length > 0 && (
        <CollapsibleSection
          title="Learner Transcript"
          icon={BookOpen}
          expanded={expandedSections.transcript}
          onToggle={() => toggleSection("transcript")}
          count={learner.learnerTranscript.length}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">
                  <th className="px-5 py-3">Course Title</th>
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-5 py-3">Format</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Credits</th>
                  <th className="px-5 py-3">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {learner.learnerTranscript.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {t.courseTitle}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {t.provider}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {t.format}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {t.duration}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {t.score ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {t.credits}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {t.completionDate ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      )}

      {/* Learning Preferences */}
      <CollapsibleSection
        title="Learning Preferences"
        icon={Settings}
        expanded={expandedSections.preferences}
        onToggle={() => toggleSection("preferences")}
      >
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PrefItem
            label="Languages"
            value={learner.learningPreferences.languages.join(", ")}
          />
          <PrefItem
            label="Preferred Content Types"
            value={learner.learningPreferences.contentTypes.join(", ")}
          />
          <PrefItem
            label="Session Duration"
            value={learner.learningPreferences.sessionDuration}
          />
          <PrefItem
            label="Assessment Style"
            value={learner.learningPreferences.assessmentStyle}
          />
        </div>
      </CollapsibleSection>

      {/* Learning Goals */}
      {isEmployee && (
        <CollapsibleSection
          title="Learning Goals"
          icon={Target}
          expanded={expandedSections.goals}
          onToggle={() => toggleSection("goals")}
        >
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                Short-Term Goals
              </div>
              {learner.learningGoals.shortTerm.length > 0 ? (
                <ul className="space-y-2">
                  {learner.learningGoals.shortTerm.map((g, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Target className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No goals set</p>
              )}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                Long-Term Goals
              </div>
              {learner.learningGoals.longTerm.length > 0 ? (
                <ul className="space-y-2">
                  {learner.learningGoals.longTerm.map((g, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Target className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No goals set</p>
              )}
            </div>
          </div>
        </CollapsibleSection>
      )}

      {!isEmployee && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <strong>Note:</strong> {learner.type} learners have a basic profile with
          identity information only. Skills, transcript, and goals are available for
          employee learners.
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, expanded, onToggle, count, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-2 text-left hover:bg-gray-50 transition-colors"
      >
        <Icon className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold flex-1">{title}</h3>
        {count !== undefined && (
          <span className="text-sm text-gray-500">{count} items</span>
        )}
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expanded && <div className="border-t">{children}</div>}
    </div>
  );
}

function PrefItem({ label, value }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
