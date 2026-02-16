import { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Filter,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  Video,
  Headphones,
  ExternalLink,
} from "lucide-react";

const typeIcons = {
  Course: BookOpen,
  PDF: FileText,
  Document: FileSpreadsheet,
  Presentation: Presentation,
  Video: Video,
  Audio: Headphones,
};

const typeColors = {
  Course: "bg-blue-100 text-blue-700",
  PDF: "bg-red-100 text-red-700",
  Document: "bg-green-100 text-green-700",
  Presentation: "bg-orange-100 text-orange-700",
  Video: "bg-purple-100 text-purple-700",
  Audio: "bg-pink-100 text-pink-700",
};

const levelColors = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function ContentLibrary() {
  const { content } = useApp();
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  const domains = ["All", ...new Set(content.map((c) => c.domain))];
  const types = ["All", ...new Set(content.map((c) => c.contentType))];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = content.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchDomain = domainFilter === "All" || c.domain === domainFilter;
    const matchType = typeFilter === "All" || c.contentType === typeFilter;
    const matchLevel = levelFilter === "All" || c.level === levelFilter;
    return matchSearch && matchDomain && matchType && matchLevel;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Learning Content Repository
        </h2>
        <p className="text-gray-600 mt-1">
          Browse Gen AI learning content for Marketing, Sales, Customer Support, and Account Management
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content, skills, or descriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterSelect
              label="Domain"
              value={domainFilter}
              options={domains}
              onChange={setDomainFilter}
            />
            <FilterSelect
              label="Type"
              value={typeFilter}
              options={types}
              onChange={setTypeFilter}
            />
            <FilterSelect
              label="Level"
              value={levelFilter}
              options={levels}
              onChange={setLevelFilter}
            />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Showing {filtered.length} of {content.length} items
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const Icon = typeIcons[item.contentType] || BookOpen;
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        typeColors[item.contentType] || "bg-gray-100"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {item.contentType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        levelColors[item.level]
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{item.domain}</span>
                  <span>&middot;</span>
                  <span>{item.format}</span>
                  <span>&middot;</span>
                  <span>{item.duration}</span>
                </div>
              </div>
              <div className="border-t px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{item.provider}</span>
                {item.url !== "#" && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">No content matches your filters</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === "All" ? `All ${label}s` : opt}
        </option>
      ))}
    </select>
  );
}
