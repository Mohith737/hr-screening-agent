const SOFTWARE_ENGINEER = {
  strategyId: "software_engineer_default",
  roleTitle: "Software Engineer",
  mustHaves: ["problem solving", "technical reasoning", "communication of technical concepts", "learning ability"],
  weights: { roleFit: 0.30, experience: 0.25, problemSolving: 0.25, communication: 0.10, intent: 0.10 },
  rubricHints: "Evaluate depth of technical answers, structured reasoning, ability to explain complexity clearly, and evidence of real project work. Penalize vague answers without examples. Reward candidates who explain their thinking process."
};

const SALES_HR = {
  strategyId: "sales_hr_default",
  roleTitle: "Sales/HR",
  mustHaves: ["communication clarity", "persuasion", "empathy", "people awareness", "energy"],
  weights: { roleFit: 0.20, experience: 0.15, problemSolving: 0.05, communication: 0.35, intent: 0.25 },
  rubricHints: "Evaluate confidence, enthusiasm, storytelling ability, and how naturally the candidate builds rapport. Technical depth is secondary. Reward energy and clarity. Flag overly scripted answers."
};

const OPERATIONS = {
  strategyId: "operations_default",
  roleTitle: "Operations",
  mustHaves: ["process thinking", "deadline management", "coordination", "ownership mindset"],
  weights: { roleFit: 0.30, experience: 0.25, problemSolving: 0.10, communication: 0.20, intent: 0.15 },
  rubricHints: "Evaluate structured thinking, ability to manage competing priorities, evidence of process ownership, and specific examples of coordination or improvement work. Penalize vague claims without measurable outcomes."
};

export function getStrategy(role) {
  const normalizedRole = String(role || "").toLowerCase();

  if (/(software|engineer|developer)/.test(normalizedRole)) {
    return SOFTWARE_ENGINEER;
  }
  if (/(sales|hr|human|recruit)/.test(normalizedRole)) {
    return SALES_HR;
  }
  if (/(operations|ops|logistics)/.test(normalizedRole)) {
    return OPERATIONS;
  }

  return SOFTWARE_ENGINEER;
}
