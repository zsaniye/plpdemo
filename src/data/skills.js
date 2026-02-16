// Skills Repository - Flat skills list with proficiency levels
// Sources: Self-assessed, Manager-assessed, Certification, LMS, Peer-review

const skills = [
  // Marketing Skills
  { id: 'sk-001', skill: 'SEO Techniques', domain: 'Marketing', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-002', skill: 'Content Marketing Strategy', domain: 'Marketing', source: 'Certification', proficiencyLevel: 'Intermediate' },
  { id: 'sk-003', skill: 'Social Media Marketing', domain: 'Marketing', source: 'Self', proficiencyLevel: 'Intermediate' },
  { id: 'sk-004', skill: 'Email Marketing Automation', domain: 'Marketing', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-005', skill: 'Marketing Analytics', domain: 'Marketing', source: 'Certification', proficiencyLevel: 'Advanced' },
  { id: 'sk-006', skill: 'Brand Management', domain: 'Marketing', source: 'Manager', proficiencyLevel: 'Intermediate' },
  { id: 'sk-007', skill: 'Digital Advertising (PPC)', domain: 'Marketing', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-008', skill: 'Influencer Marketing', domain: 'Marketing', source: 'Peer-review', proficiencyLevel: 'Beginner' },
  { id: 'sk-009', skill: 'Conversion Rate Optimization', domain: 'Marketing', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-010', skill: 'Marketing Copywriting', domain: 'Marketing', source: 'Self', proficiencyLevel: 'Advanced' },
  { id: 'sk-011', skill: 'AI-Powered Content Generation', domain: 'Marketing', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-012', skill: 'Prompt Engineering for Marketing', domain: 'Marketing', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-013', skill: 'AI-Driven Customer Segmentation', domain: 'Marketing', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-014', skill: 'Generative AI for Ad Creatives', domain: 'Marketing', source: 'Certification', proficiencyLevel: 'Beginner' },
  { id: 'sk-015', skill: 'AI Personalization Strategies', domain: 'Marketing', source: 'Self', proficiencyLevel: 'Intermediate' },

  // Sales Skills
  { id: 'sk-016', skill: 'Consultative Selling', domain: 'Sales', source: 'Manager', proficiencyLevel: 'Advanced' },
  { id: 'sk-017', skill: 'Sales Pipeline Management', domain: 'Sales', source: 'Self', proficiencyLevel: 'Intermediate' },
  { id: 'sk-018', skill: 'Negotiation Techniques', domain: 'Sales', source: 'Certification', proficiencyLevel: 'Advanced' },
  { id: 'sk-019', skill: 'CRM Proficiency (Salesforce)', domain: 'Sales', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-020', skill: 'Account Planning', domain: 'Sales', source: 'Manager', proficiencyLevel: 'Intermediate' },
  { id: 'sk-021', skill: 'Solution Selling', domain: 'Sales', source: 'Certification', proficiencyLevel: 'Advanced' },
  { id: 'sk-022', skill: 'Sales Forecasting', domain: 'Sales', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-023', skill: 'Cold Outreach & Prospecting', domain: 'Sales', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-024', skill: 'Objection Handling', domain: 'Sales', source: 'Self', proficiencyLevel: 'Intermediate' },
  { id: 'sk-025', skill: 'AI-Powered Lead Scoring', domain: 'Sales', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-026', skill: 'Generative AI for Sales Enablement', domain: 'Sales', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-027', skill: 'AI-Assisted Proposal Writing', domain: 'Sales', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-028', skill: 'Conversational AI for Sales', domain: 'Sales', source: 'Certification', proficiencyLevel: 'Intermediate' },

  // Customer Support Skills
  { id: 'sk-029', skill: 'Customer Communication', domain: 'Customer Support', source: 'Self', proficiencyLevel: 'Advanced' },
  { id: 'sk-030', skill: 'Ticket Management & Triage', domain: 'Customer Support', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-031', skill: 'Conflict Resolution', domain: 'Customer Support', source: 'Manager', proficiencyLevel: 'Advanced' },
  { id: 'sk-032', skill: 'Technical Troubleshooting', domain: 'Customer Support', source: 'Certification', proficiencyLevel: 'Intermediate' },
  { id: 'sk-033', skill: 'Knowledge Base Management', domain: 'Customer Support', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-034', skill: 'SLA Compliance', domain: 'Customer Support', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-035', skill: 'Customer Satisfaction Measurement', domain: 'Customer Support', source: 'Certification', proficiencyLevel: 'Intermediate' },
  { id: 'sk-036', skill: 'Omnichannel Support', domain: 'Customer Support', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-037', skill: 'AI Chatbot Configuration', domain: 'Customer Support', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-038', skill: 'Generative AI for Response Drafting', domain: 'Customer Support', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-039', skill: 'AI Sentiment Analysis', domain: 'Customer Support', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-040', skill: 'AI-Powered Ticket Routing', domain: 'Customer Support', source: 'Certification', proficiencyLevel: 'Beginner' },

  // Account Management Skills
  { id: 'sk-041', skill: 'Client Relationship Management', domain: 'Account Management', source: 'Manager', proficiencyLevel: 'Advanced' },
  { id: 'sk-042', skill: 'Upselling & Cross-selling', domain: 'Account Management', source: 'Self', proficiencyLevel: 'Intermediate' },
  { id: 'sk-043', skill: 'Contract Management', domain: 'Account Management', source: 'Certification', proficiencyLevel: 'Intermediate' },
  { id: 'sk-044', skill: 'Revenue Retention Strategies', domain: 'Account Management', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-045', skill: 'Strategic Account Planning', domain: 'Account Management', source: 'Manager', proficiencyLevel: 'Advanced' },
  { id: 'sk-046', skill: 'Stakeholder Mapping', domain: 'Account Management', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-047', skill: 'Quarterly Business Reviews', domain: 'Account Management', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-048', skill: 'AI-Driven Account Health Scoring', domain: 'Account Management', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-049', skill: 'Generative AI for Client Reports', domain: 'Account Management', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-050', skill: 'AI Churn Prediction', domain: 'Account Management', source: 'Certification', proficiencyLevel: 'Beginner' },

  // Gen AI Foundation Skills
  { id: 'sk-051', skill: 'Generative AI Fundamentals', domain: 'Gen AI', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-052', skill: 'Prompt Engineering', domain: 'Gen AI', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-053', skill: 'Large Language Models (LLMs)', domain: 'Gen AI', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-054', skill: 'AI Ethics & Responsible AI', domain: 'Gen AI', source: 'Certification', proficiencyLevel: 'Intermediate' },
  { id: 'sk-055', skill: 'AI Tools & Platforms', domain: 'Gen AI', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-056', skill: 'Data Literacy for AI', domain: 'Gen AI', source: 'LMS', proficiencyLevel: 'Intermediate' },
  { id: 'sk-057', skill: 'AI Use Case Identification', domain: 'Gen AI', source: 'Manager', proficiencyLevel: 'Intermediate' },
  { id: 'sk-058', skill: 'AI-Augmented Decision Making', domain: 'Gen AI', source: 'Self', proficiencyLevel: 'Beginner' },
  { id: 'sk-059', skill: 'RAG (Retrieval-Augmented Generation)', domain: 'Gen AI', source: 'LMS', proficiencyLevel: 'Beginner' },
  { id: 'sk-060', skill: 'AI Workflow Automation', domain: 'Gen AI', source: 'Self', proficiencyLevel: 'Intermediate' },
];

export default skills;

export const domains = [...new Set(skills.map(s => s.domain))];
export const sources = ['Self', 'Manager', 'Certification', 'LMS', 'Peer-review'];
export const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced'];
