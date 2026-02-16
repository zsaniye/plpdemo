import { createContext, useContext, useState } from "react";
import learnerProfiles from "../data/learnerProfiles";
import skillsRepository from "../data/skillsRepository";
import learningContentRepository from "../data/learningContentRepository";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [profiles, setProfiles] = useState(learnerProfiles);
  const [skills] = useState(skillsRepository);
  const [content] = useState(learningContentRepository);
  const [selectedLearnerId, setSelectedLearnerId] = useState(learnerProfiles[0]?.id);
  const [generatedPaths, setGeneratedPaths] = useState({});

  const selectedLearner = profiles.find((p) => p.id === selectedLearnerId) || profiles[0];

  function updateLearnerProfile(learnerId, updates) {
    setProfiles((prev) =>
      prev.map((p) => (p.id === learnerId ? { ...p, ...updates } : p))
    );
  }

  function generateLearningPath(learnerId) {
    const learner = profiles.find((p) => p.id === learnerId);
    if (!learner) return null;

    const learnerSkillMap = {};
    learner.skills.forEach((s) => {
      learnerSkillMap[s.skill] = s.proficiencyLevel;
    });

    // Find skill gaps: skills at Beginner level or missing from the learner's domain
    const domainSkills = skills.filter(
      (s) => s.domain === learner.identity.jobFamily || s.domain === "Gen AI" || s.domain === "General"
    );

    const skillGaps = domainSkills.filter((ds) => {
      const current = learnerSkillMap[ds.skill];
      return !current || current === "Beginner";
    });

    // Match content to skill gaps, preferences, and goals
    const preferredTypes = learner.learningPreferences.contentTypes;
    const completedTitles = new Set(
      learner.learnerTranscript.filter((t) => t.status === "Completed").map((t) => t.courseTitle)
    );

    const scoredContent = content
      .filter((c) => {
        // Filter by domain relevance
        const domainMatch = c.domain === learner.identity.jobFamily;
        // Filter out already completed
        const notCompleted = !completedTitles.has(c.title);
        return domainMatch && notCompleted;
      })
      .map((c) => {
        let score = 0;

        // Skill gap relevance
        const gapSkillNames = skillGaps.map((g) => g.skill);
        const matchingSkills = c.skills.filter((s) => gapSkillNames.includes(s));
        score += matchingSkills.length * 30;

        // Content type preference match
        if (preferredTypes.includes(c.contentType) || preferredTypes.includes(c.format)) {
          score += 20;
        }

        // Level appropriateness
        const levelMap = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        const avgLearnerLevel =
          learner.skills.length > 0
            ? learner.skills.reduce((sum, s) => sum + (levelMap[s.proficiencyLevel] || 1), 0) / learner.skills.length
            : 1;
        const contentLevel = levelMap[c.level] || 1;
        if (Math.abs(avgLearnerLevel - contentLevel) <= 1) {
          score += 15;
        }

        // Goal alignment
        const allGoals = [
          ...(learner.learningGoals.shortTerm || []),
          ...(learner.learningGoals.longTerm || []),
        ];
        const goalKeywords = allGoals.join(" ").toLowerCase().split(/\s+/);
        const titleWords = c.title.toLowerCase().split(/\s+/);
        const goalMatch = titleWords.some((w) => goalKeywords.includes(w) && w.length > 3);
        if (goalMatch) score += 10;

        return { ...c, relevanceScore: score, matchingSkills };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Build learning path phases
    const beginnerContent = scoredContent.filter((c) => c.level === "Beginner").slice(0, 3);
    const intermediateContent = scoredContent.filter((c) => c.level === "Intermediate").slice(0, 3);
    const advancedContent = scoredContent.filter((c) => c.level === "Advanced").slice(0, 2);

    const path = {
      learnerId,
      learnerName: learner.identity.name,
      generatedAt: new Date().toISOString(),
      skillGaps: skillGaps.map((g) => g.skill),
      phases: [
        {
          phase: 1,
          title: "Foundation",
          description: "Build foundational knowledge in Gen AI for your role",
          items: beginnerContent,
        },
        {
          phase: 2,
          title: "Skill Building",
          description: "Deepen expertise and apply AI skills to real scenarios",
          items: intermediateContent,
        },
        {
          phase: 3,
          title: "Mastery",
          description: "Achieve advanced proficiency and lead AI initiatives",
          items: advancedContent,
        },
      ],
      totalItems: beginnerContent.length + intermediateContent.length + advancedContent.length,
      estimatedDuration: scoredContent
        .slice(0, 8)
        .reduce((sum, c) => {
          const hrs = parseInt(c.duration) || 1;
          return sum + hrs;
        }, 0) + " hours",
    };

    setGeneratedPaths((prev) => ({ ...prev, [learnerId]: path }));
    return path;
  }

  return (
    <AppContext.Provider
      value={{
        profiles,
        skills,
        content,
        selectedLearner,
        selectedLearnerId,
        setSelectedLearnerId,
        updateLearnerProfile,
        generateLearningPath,
        generatedPaths,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
