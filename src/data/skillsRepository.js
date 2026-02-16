// Pre-loaded Skills Repository
// Flat structure: Skill, Source, Proficiency Level (Beginner, Intermediate, Advanced)
const skillsRepository = [
  // Gen AI Skills
  { id: "skill-001", skill: "Prompt Engineering", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-002", skill: "Large Language Models (LLMs)", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-003", skill: "AI Content Generation", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-004", skill: "AI-Powered Data Analysis", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-005", skill: "Conversational AI Design", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-006", skill: "AI Ethics & Responsible AI", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-007", skill: "AI Image Generation", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-008", skill: "RAG (Retrieval-Augmented Generation)", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-009", skill: "Fine-Tuning AI Models", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-010", skill: "AI Workflow Automation", source: "Industry Standard", domain: "Gen AI", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },

  // Marketing Skills
  { id: "skill-011", skill: "SEO Techniques", source: "Self", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-012", skill: "Content Marketing Strategy", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-013", skill: "Social Media Marketing", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-014", skill: "Email Marketing Automation", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-015", skill: "Marketing Analytics", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-016", skill: "Brand Management", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-017", skill: "AI-Powered Marketing Campaigns", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-018", skill: "Customer Segmentation", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-019", skill: "A/B Testing", source: "Self", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-020", skill: "Marketing Copywriting", source: "Industry Standard", domain: "Marketing", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },

  // Sales Skills
  { id: "skill-021", skill: "Consultative Selling", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-022", skill: "Sales Pipeline Management", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-023", skill: "CRM Proficiency", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-024", skill: "AI-Assisted Sales Forecasting", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-025", skill: "Negotiation Skills", source: "Self", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-026", skill: "Lead Qualification", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-027", skill: "Sales Presentation", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-028", skill: "AI-Powered Lead Scoring", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-029", skill: "Account-Based Selling", source: "Industry Standard", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-030", skill: "Social Selling", source: "Self", domain: "Sales", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },

  // Customer Support Skills
  { id: "skill-031", skill: "Customer Communication", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-032", skill: "AI Chatbot Management", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-033", skill: "Ticket Triage & Resolution", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-034", skill: "Knowledge Base Management", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-035", skill: "Empathy & Active Listening", source: "Self", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-036", skill: "Conflict Resolution", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-037", skill: "AI Sentiment Analysis", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-038", skill: "Omnichannel Support", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-039", skill: "Customer Feedback Analysis", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-040", skill: "Service Level Agreement (SLA) Management", source: "Industry Standard", domain: "Customer Support", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },

  // Account Management Skills
  { id: "skill-041", skill: "Strategic Account Planning", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-042", skill: "Client Relationship Management", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-043", skill: "Revenue Growth Strategies", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-044", skill: "Contract Negotiation", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-045", skill: "AI-Driven Account Insights", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-046", skill: "Cross-Selling & Upselling", source: "Self", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-047", skill: "Stakeholder Management", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-048", skill: "Customer Success Metrics", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-049", skill: "Renewal Management", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-050", skill: "Business Review Presentations", source: "Industry Standard", domain: "Account Management", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },

  // General / Cross-Domain Skills
  { id: "skill-051", skill: "Data Visualization", source: "Industry Standard", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-052", skill: "Project Management", source: "Industry Standard", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-053", skill: "Business Communication", source: "Self", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-054", skill: "Critical Thinking", source: "Self", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-055", skill: "Change Management", source: "Industry Standard", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-056", skill: "Design Thinking", source: "Industry Standard", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-057", skill: "Agile Methodology", source: "Industry Standard", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-058", skill: "Digital Literacy", source: "Self", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-059", skill: "Emotional Intelligence", source: "Self", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
  { id: "skill-060", skill: "Leadership & Influence", source: "Industry Standard", domain: "General", proficiencyLevels: ["Beginner", "Intermediate", "Advanced"] },
];

export default skillsRepository;
