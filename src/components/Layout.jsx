import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Users,
  Award,
  Library,
  Route,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: BookOpen },
  { to: "/content", label: "Content Library", icon: Library },
  { to: "/skills", label: "Skills Repository", icon: Award },
  { to: "/learners", label: "Learner Profiles", icon: Users },
  { to: "/learning-path", label: "Learning Path", icon: Route },
];

export default function Layout() {
  const { selectedLearner, profiles, setSelectedLearnerId } = useApp();
  const [showSwitcher, setShowSwitcher] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            <h1 className="text-xl font-bold tracking-tight">
              Personalized Learning Path Demo
            </h1>
          </div>

          {/* Learner Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowSwitcher(!showSwitcher)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-3 py-2 transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {selectedLearner?.identity.name}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl z-50 py-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Switch Learner
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedLearnerId(p.id);
                      setShowSwitcher(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 flex items-center justify-between ${
                      p.id === selectedLearner?.id ? "bg-indigo-50 font-medium" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.identity.name}</div>
                      <div className="text-xs text-gray-500">
                        {p.identity.jobTitle} &middot; {p.type}
                      </div>
                    </div>
                    {p.id === selectedLearner?.id && (
                      <span className="text-indigo-600 text-xs font-bold">Active</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 -mb-px">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-white text-white"
                      : "border-transparent text-white/70 hover:text-white hover:border-white/50"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t text-center text-xs text-gray-500 py-3">
        Personalized Learning Path Generator &mdash; LMS Integration Demo
      </footer>
    </div>
  );
}
