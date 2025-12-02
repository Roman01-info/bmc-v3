
export interface BMCData {
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  preview: string; // A short text preview (e.g. from Value Propositions)
  data: BMCData;
}

export interface RiskItem {
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  probability: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface MarketingStrategy {
  tagline: string;
  topChannels: string[];
  growthHack: string;
}

export interface RolePlan {
  role: string;
  tasks: string[];
}

export interface DepartmentPlan {
  department: string;
  roles: RolePlan[];
}

export interface AnalysisResult {
  overallScore: number;
  executiveSummary: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  suggestions: string[];
  segmentAnalysis: {
    segment: string;
    feedback: string;
    score: number;
  }[];
  // New Features
  riskAnalysis: RiskItem[];
  kpis: string[]; // Key Metrics to track
  marketingStrategy: MarketingStrategy;
  elevatorPitch: string;
  departmentalActionPlan: DepartmentPlan[]; // Updated Field for Action Plan page
}

export enum AppState {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ACTION_PLAN = 'ACTION_PLAN', // New State
}

export const BMC_LABELS: Record<keyof BMCData, { label: string; description: string; icon: string }> = {
  keyPartners: { label: "মূল অংশীদার (Key Partners)", description: "আপনার সরবরাহকারী বা পার্টনার কারা?", icon: "Handshake" },
  keyActivities: { label: "মূল কার্যক্রম (Key Activities)", description: "ব্যবসা চালাতে কী কী কাজ করতে হবে?", icon: "Activity" },
  keyResources: { label: "মূল সম্পদ (Key Resources)", description: "ব্যবসাটির জন্য কী কী রিসোর্স প্রয়োজন?", icon: "Box" },
  valuePropositions: { label: "মূল্য প্রস্তাবনা (Value Propositions)", description: "গ্রাহক কেন আপনার পণ্য কিনবে?", icon: "Gift" },
  customerRelationships: { label: "গ্রাহক সম্পর্ক (Customer Relationships)", description: "গ্রাহকদের সাথে সম্পর্ক কেমন হবে?", icon: "Heart" },
  channels: { label: "চ্যানেল (Channels)", description: "পণ্য বা সেবা কীভাবে গ্রাহকের কাছে পৌঁছাবে?", icon: "Truck" },
  customerSegments: { label: "গ্রাহক বিভাগ (Customer Segments)", description: "আপনার লক্ষ্য গ্রাহক কারা?", icon: "Users" },
  costStructure: { label: "ব্যয় কাঠামো (Cost Structure)", description: "প্রধান খরচগুলো কী কী?", icon: "CreditCard" },
  revenueStreams: { label: "আয়ের উৎস (Revenue Streams)", description: "টাকা কীভাবে আসবে?", icon: "DollarSign" },
};
