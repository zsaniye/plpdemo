import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ContentLibrary from "./pages/ContentLibrary";
import SkillsRepository from "./pages/SkillsRepository";
import LearnerProfiles from "./pages/LearnerProfiles";
import LearningPath from "./pages/LearningPath";
import AIAssistant from "./pages/AIAssistant";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<ContentLibrary />} />
            <Route path="skills" element={<SkillsRepository />} />
            <Route path="learners" element={<LearnerProfiles />} />
            <Route path="learning-path" element={<LearningPath />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
