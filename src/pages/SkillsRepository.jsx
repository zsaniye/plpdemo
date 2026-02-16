import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, Award, Filter } from "lucide-react";

const domainColors = {
  "Gen AI": "bg-violet-100 text-violet-700 border-violet-200",
  Marketing: "bg-blue-100 text-blue-700 border-blue-200",
  Sales: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Customer Support": "bg-amber-100 text-amber-700 border-amber-200",
  "Account Management": "bg-rose-100 text-rose-700 border-rose-200",
  General: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function SkillsRepository() {
  const { skills } = useApp();
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const domains = ["All", ...new Set(skills.map((s) => s.domain))];
  const sources = ["All", ...new Set(skills.map((s) => s.source))];

  const filtered = skills.filter((s) => {
    const matchSearch =
      !search || s.skill.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domainFilter === "All" || s.domain === domainFilter;
    const matchSource = sourceFilter === "All" || s.source === sourceFilter;
    return matchSearch && matchDomain && matchSource;
  });

  const grouped = filtered.reduce((acc, s) => {
    if (!acc[s.domain]) acc[s.domain] = [];
    acc[s.domain].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skills Repository</h2>
        <p className="text-gray-600 mt-1">
          Open-source skills catalog with proficiency levels across domains
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Domains" : d}
                </option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All Sources" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Showing {filtered.length} of {skills.length} skills
        </div>
      </div>

      {/* Skills by Domain */}
      {Object.entries(grouped).map(([domain, domainSkills]) => (
        <div key={domain} className="bg-white rounded-xl shadow-sm border">
          <div className="px-5 py-4 border-b flex items-center gap-2">
            <Award
              className={`w-5 h-5 ${
                domainColors[domain]?.includes("violet")
                  ? "text-violet-600"
                  : domainColors[domain]?.includes("blue")
                  ? "text-blue-600"
                  : domainColors[domain]?.includes("emerald")
                  ? "text-emerald-600"
                  : domainColors[domain]?.includes("amber")
                  ? "text-amber-600"
                  : domainColors[domain]?.includes("rose")
                  ? "text-rose-600"
                  : "text-gray-600"
              }`}
            />
            <h3 className="text-lg font-semibold">{domain}</h3>
            <span className="text-sm text-gray-500 ml-auto">
              {domainSkills.length} skills
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">
                  <th className="px-5 py-3">Skill</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Proficiency Levels</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {domainSkills.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {s.skill}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {s.source}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        {s.proficiencyLevels.map((level) => (
                          <span
                            key={level}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              level === "Beginner"
                                ? "bg-emerald-100 text-emerald-700"
                                : level === "Intermediate"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">No skills match your filters</p>
        </div>
      )}
    </div>
  );
}
