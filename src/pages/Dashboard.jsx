import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  Library,
  Award,
  Users,
  Route,
  BookOpen,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const { profiles, skills, content, selectedLearner, generatedPaths } = useApp();

  const employeeCount = profiles.filter((p) => p.type === "Employee").length;
  const externalCount = profiles.filter((p) => p.type !== "Employee").length;
  const pathCount = Object.keys(generatedPaths).length;

  const contentByDomain = content.reduce((acc, c) => {
    acc[c.domain] = (acc[c.domain] || 0) + 1;
    return acc;
  }, {});

  const contentByType = content.reduce((acc, c) => {
    acc[c.contentType] = (acc[c.contentType] || 0) + 1;
    return acc;
  }, {});

  const skillsByDomain = skills.reduce((acc, s) => {
    acc[s.domain] = (acc[s.domain] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Overview of the Personalized Learning Path system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Library}
          label="Learning Content"
          value={content.length}
          desc="Across 4 domains"
          color="bg-blue-500"
          link="/content"
        />
        <StatCard
          icon={Award}
          label="Skills"
          value={skills.length}
          desc={`${Object.keys(skillsByDomain).length} domains covered`}
          color="bg-emerald-500"
          link="/skills"
        />
        <StatCard
          icon={Users}
          label="Learner Profiles"
          value={profiles.length}
          desc={`${employeeCount} employees, ${externalCount} external`}
          color="bg-purple-500"
          link="/learners"
        />
        <StatCard
          icon={Route}
          label="Paths Generated"
          value={pathCount}
          desc="Personalized learning paths"
          color="bg-amber-500"
          link="/learning-path"
        />
      </div>

      {/* Current Learner Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Active Learner</h3>
          </div>
          {selectedLearner && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {selectedLearner.identity.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {selectedLearner.identity.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedLearner.identity.jobTitle} &middot;{" "}
                    {selectedLearner.identity.department}
                  </div>
                  <div className="text-xs text-gray-400">
                    {selectedLearner.identity.location}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <MiniStat
                  icon={Award}
                  label="Skills"
                  value={selectedLearner.skills.length}
                />
                <MiniStat
                  icon={BookOpen}
                  label="Completed"
                  value={
                    selectedLearner.learnerTranscript.filter(
                      (t) => t.status === "Completed"
                    ).length
                  }
                />
                <MiniStat
                  icon={Clock}
                  label="In Progress"
                  value={
                    selectedLearner.learnerTranscript.filter(
                      (t) => t.status === "In Progress"
                    ).length
                  }
                />
              </div>
              {selectedLearner.learningGoals.shortTerm?.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Short-Term Goals
                  </div>
                  {selectedLearner.learningGoals.shortTerm.map((g, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Target className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                      {g}
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/learners"
                className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View Full Profile &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Content Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Content Distribution</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                By Domain
              </div>
              {Object.entries(contentByDomain).map(([domain, count]) => (
                <div key={domain} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{domain}</span>
                    <span className="font-medium">{count} items</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${(count / content.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                By Content Type
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(contentByType).map(([type, count]) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                  >
                    {type}
                    <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded-full">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, desc, color, link }) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div
          className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm font-medium text-gray-700">{label}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
      </div>
    </Link>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <Icon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
