import { GrievanceIssue } from "./types";

const STORAGE_KEY = "smart_complaint_issues";

export const getStoredIssues = (): GrievanceIssue[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveIssue = (issue: GrievanceIssue): void => {
  const issues = getStoredIssues();
  issues.unshift(issue);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
};

export const updateIssueStatus = (id: string, status: GrievanceIssue["status"]): void => {
  const issues = getStoredIssues();
  const updated = issues.map((issue) =>
    issue.id === id ? { ...issue, status } : issue
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteIssue = (id: string): void => {
  const issues = getStoredIssues();
  const filtered = issues.filter((issue) => issue.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
