import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Send,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  Video,
  Headphones,
  ExternalLink,
  Clock,
  Target,
  User,
  Zap,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Settings,
  Key,
  AlertCircle,
  X,
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

const suggestedPrompts = [
  { label: "Feature Launch", text: "I have an upcoming feature launch and need to prepare my team with the right skills for a successful go-to-market strategy." },
  { label: "AI Upskilling", text: "I want to upskill in AI and generative AI tools to become more effective in my current role." },
  { label: "Leadership Growth", text: "I'm preparing for a leadership role and need to develop management and strategic thinking skills." },
  { label: "Skill Gap Closure", text: "I want to close my skill gaps and get to an advanced level in my core job competencies." },
];

function buildSystemPrompt(learner, allSkills, allContent) {
  const learnerSkills = learner.skills || [];
  const transcript = learner.learnerTranscript || [];
  const goals = learner.learningGoals || {};
  const prefs = learner.learningPreferences || {};

  const contentSummary = allContent.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    domain: c.domain,
    contentType: c.contentType,
    format: c.format,
    duration: c.duration,
    level: c.level,
    provider: c.provider,
    skills: c.skills,
  }));

  return `You are a Personalized Learning Path Advisor for an enterprise Learning Management System (LMS). Your role is to have a natural, helpful conversation with learners to understand their goals, assess their current skills, and generate a tailored learning path from the organization's content library.

## Active Learner Profile
- Name: ${learner.identity?.name || "Unknown"}
- Job Title: ${learner.identity?.jobTitle || "Unknown"}
- Job Family: ${learner.identity?.jobFamily || "Unknown"}
- Department: ${learner.identity?.department || "Unknown"}
- Type: ${learner.type || "Employee"}

## Current Skills
${learnerSkills.length > 0 ? learnerSkills.map((s) => `- ${s.skill}: ${s.proficiencyLevel} (Source: ${s.source})`).join("\n") : "No skills on record."}

## Learning Transcript (Completed & In-Progress)
${transcript.length > 0 ? transcript.map((t) => `- "${t.courseTitle}" by ${t.provider} — ${t.status}${t.score ? ` (Score: ${t.score})` : ""}`).join("\n") : "No transcript entries."}

## Learning Goals
Short-term: ${(goals.shortTerm || []).join("; ") || "None specified"}
Long-term: ${(goals.longTerm || []).join("; ") || "None specified"}

## Learning Preferences
- Preferred content types: ${(prefs.contentTypes || []).join(", ") || "Any"}
- Session duration: ${prefs.sessionDuration || "Flexible"}
- Languages: ${(prefs.languages || []).join(", ") || "English"}

## Available Content Library
${JSON.stringify(contentSummary, null, 1)}

## Your Conversation Approach
1. **Discovery Phase**: Start by greeting the learner by first name. Understand what they want to achieve — ask about their current challenges, upcoming projects, or career aspirations. Be conversational and warm.
2. **Skills Assessment**: Based on their goal, reference their current skill profile. Identify gaps between where they are and where they need to be. Share your observations naturally.
3. **Learning Path Generation**: When you have enough context (usually after 1-2 exchanges), generate a personalized learning path. You MUST select content ONLY from the Available Content Library above — never invent or hallucinate content.

## Learning Path Output Format
When you generate a learning path, include it as a JSON block wrapped in \`\`\`json ... \`\`\` fences at the end of your message. Use this exact structure:

\`\`\`json
{
  "learningPath": {
    "goal": "The learner's stated goal",
    "skillGaps": ["Skill 1", "Skill 2"],
    "targetDomains": ["Domain1", "Domain2"],
    "phases": [
      {
        "phase": 1,
        "title": "Phase title",
        "description": "Brief phase description",
        "items": ["content-001", "content-004"]
      },
      {
        "phase": 2,
        "title": "Phase title",
        "description": "Brief phase description",
        "items": ["content-002", "content-003"]
      },
      {
        "phase": 3,
        "title": "Phase title",
        "description": "Brief phase description",
        "items": ["content-008"]
      }
    ]
  }
}
\`\`\`

## Rules
- ONLY use content IDs from the Available Content Library. Never make up content.
- Prioritize content that addresses identified skill gaps.
- Factor in the learner's preferred content types and session duration.
- Exclude content the learner has already completed.
- Organize items into 2-3 phases: Foundations first, then intermediate skill-building, then advanced application.
- Keep your conversational text concise — aim for 2-4 paragraphs before the JSON block.
- If the learner's goal is vague, ask a clarifying question instead of guessing.
- You can have a multi-turn conversation. Only output the JSON learning path when you're confident you understand their needs.`;
}

export default function AIAssistant() {
  const { selectedLearner, skills, content, profiles, setSelectedLearnerId } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingText, isStreaming]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  function saveApiKey(key) {
    setApiKey(key);
    if (key) {
      localStorage.setItem("openai_api_key", key);
    } else {
      localStorage.removeItem("openai_api_key");
    }
  }

  function parsePathFromText(text) {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (!jsonMatch) return null;
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (!parsed.learningPath) return null;
      const lp = parsed.learningPath;
      const contentMap = {};
      content.forEach((c) => { contentMap[c.id] = c; });

      const phases = (lp.phases || []).map((p, idx) => {
        const colors = ["emerald", "blue", "purple"];
        const items = (p.items || [])
          .map((id) => contentMap[id])
          .filter(Boolean);
        return { ...p, items, color: colors[idx] || "emerald" };
      });

      const allItems = phases.flatMap((p) => p.items);
      const totalHours = allItems.reduce((sum, c) => {
        const hrs = parseInt(c.duration) || 1;
        return sum + hrs;
      }, 0);

      return {
        learnerName: selectedLearner?.identity?.name || "Learner",
        goal: lp.goal || "",
        generatedAt: new Date().toISOString(),
        skillGaps: lp.skillGaps || [],
        targetDomains: lp.targetDomains || [],
        phases,
        totalItems: allItems.length,
        estimatedDuration: totalHours + " hours",
      };
    } catch {
      return null;
    }
  }

  function getDisplayText(text) {
    return text.replace(/```json\s*[\s\S]*?```/g, "").trim();
  }

  const sendMessage = useCallback(async (userText) => {
    if (!apiKey) {
      setShowSettings(true);
      setError("Please enter your OpenAI API key to use the AI Assistant.");
      return;
    }
    setError(null);
    setIsStreaming(true);
    setStreamingText("");

    const systemPrompt = buildSystemPrompt(selectedLearner, skills, content);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...newMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: apiMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4096,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error?.message || `API error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              setStreamingText(fullText);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      const path = parsePathFromText(fullText);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullText, path },
      ]);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I encountered an error: ${err.message}. Please check your API key and try again.` },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
      abortRef.current = null;
    }
  }, [apiKey, messages, selectedLearner, skills, content]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    setInput("");
    sendMessage(text);
  }

  function handleSuggestion(text) {
    if (isStreaming) return;
    sendMessage(text);
  }

  function handleReset() {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setIsStreaming(false);
    setStreamingText("");
    setInput("");
    setError(null);
  }

  const isEmployee = selectedLearner?.type === "Employee";
  const learnerSkills = selectedLearner?.skills || [];
  const beginnerSkills = learnerSkills.filter((s) => s.proficiencyLevel === "Beginner");

  const streamingPath = streamingText ? parsePathFromText(streamingText) : null;
  const streamingDisplayText = streamingText ? getDisplayText(streamingText) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Learning Assistant
          </h2>
          <p className="text-gray-600 mt-1">
            Describe your goal and get a personalized learning path powered by AI
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            apiKey
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          {apiKey ? <Settings className="w-4 h-4" /> : <Key className="w-4 h-4" />}
          {apiKey ? "Settings" : "Set API Key"}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              OpenAI API Configuration
            </h3>
            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            {apiKey && (
              <button
                onClick={() => saveApiKey("")}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your API key is stored locally in your browser and sent directly to OpenAI. It is never stored on any server.
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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

          {/* Quick Goals */}
          {messages.length === 0 && !isStreaming && (
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-gray-700">Quick Start</h3>
              </div>
              <div className="space-y-2">
                {suggestedPrompts.map((sp) => (
                  <button
                    key={sp.label}
                    onClick={() => handleSuggestion(sp.text)}
                    className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="text-sm font-medium text-gray-800 group-hover:text-indigo-700">
                      {sp.label}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                      {sp.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Chat + Results */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border flex flex-col min-h-[600px]">
            {/* Chat Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.length === 0 && !isStreaming && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Hi {selectedLearner?.identity.name.split(" ")[0]}! What would you like to learn?
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Describe your learning goal and I'll create a personalized path using
                    your profile, skills, and available content.
                  </p>
                  {!apiKey && (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Key className="w-4 h-4" />
                      Set your OpenAI API key to get started
                    </button>
                  )}
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.role === "user" && (
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-lg">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  )}
                  {msg.role === "assistant" && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl">
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            {getDisplayText(msg.content)}
                          </p>
                        </div>
                      </div>
                      {msg.path && <PathResult path={msg.path} />}
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming state */}
              {isStreaming && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-2xl">
                      {streamingDisplayText ? (
                        <p className="text-sm text-gray-800 whitespace-pre-line">
                          {streamingDisplayText}
                          <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />
                        </p>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          Analyzing your profile and finding the best learning path...
                        </div>
                      )}
                    </div>
                  </div>
                  {streamingPath && <PathResult path={streamingPath} />}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              {messages.length > 0 && !isStreaming && (
                <div className="flex justify-center mb-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Start a new conversation
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    !apiKey
                      ? "Set your OpenAI API key first..."
                      : messages.length > 0
                      ? "Ask a follow-up or refine your learning goal..."
                      : "Describe your learning goal (e.g., prepare for a feature launch)..."
                  }
                  disabled={isStreaming || !apiKey}
                  className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming || !apiKey}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Path Result Component ---------- */

const phaseStyles = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    accent: "text-emerald-700",
    icon: "bg-emerald-100 text-emerald-700",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    accent: "text-blue-700",
    icon: "bg-blue-100 text-blue-700",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    accent: "text-purple-700",
    icon: "bg-purple-100 text-purple-700",
  },
};

function PathResult({ path }) {
  return (
    <div className="space-y-4 mt-2">
      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5" />
          <h3 className="font-bold">Your Personalized Learning Path</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/10 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold">{path.totalItems}</div>
            <div className="text-xs text-white/80">Items</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold">{path.estimatedDuration}</div>
            <div className="text-xs text-white/80">Duration</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold">{path.skillGaps.length}</div>
            <div className="text-xs text-white/80">Skill Gaps</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold">{path.phases.length}</div>
            <div className="text-xs text-white/80">Phases</div>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      {path.skillGaps.length > 0 && (
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-semibold">Targeted Skill Gaps</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {path.skillGaps.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Phases */}
      {path.phases.map((phase) => {
        const styles = phaseStyles[phase.color] || phaseStyles.emerald;
        return (
          <div key={phase.phase} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full ${styles.icon} flex items-center justify-center text-xs font-bold`}>
                {phase.phase}
              </span>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{phase.title}</h4>
                <p className="text-xs text-gray-500">{phase.description}</p>
              </div>
            </div>
            {phase.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.items.map((item) => {
                  const Icon = typeIcons[item.contentType] || BookOpen;
                  const tColor = typeColors[item.contentType] || "bg-gray-100 text-gray-700";
                  return (
                    <div
                      key={item.id}
                      className={`${styles.bg} ${styles.border} border rounded-lg p-3`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tColor}`}>
                          <Icon className="w-3 h-3" />
                          {item.contentType}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </span>
                      </div>
                      <h5 className="font-semibold text-sm text-gray-900 mb-1">{item.title}</h5>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                      {item.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.skills.slice(0, 3).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 bg-white/70 rounded text-xs text-gray-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
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
                            className={`inline-flex items-center gap-1 font-medium ${styles.accent}`}
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
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 text-center">
                No matching content for this phase.
              </div>
            )}
          </div>
        );
      })}

      <div className="text-xs text-gray-400 text-center pt-1">
        Path generated on {new Date(path.generatedAt).toLocaleString()}
      </div>
    </div>
  );
}
