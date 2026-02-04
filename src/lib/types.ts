export interface AnalysisResult {
  department: "Academics" | "Hostel" | "Sanitation" | "Ragging/Harassment";
  is_sensitive: boolean;
}

export interface DepartmentInfo {
  name: string;
  email: string;
  helpline: string;
  description: string;
}

export interface StudentDetails {
  name: string;
  email: string;
  branch: string;
  rollNo: string;
  year: string;
  course: string;
  isAnonymous: boolean;
}

export interface GrievanceIssue {
  id: string;
  problem: string;
  department: string;
  status: "pending" | "sent" | "resolved";
  createdAt: string;
  studentDetails: StudentDetails;
  emailDraft?: string;
}

export const DEPARTMENT_INFO: Record<string, DepartmentInfo> = {
  Academics: {
    name: "Academics Department",
    email: "academics@university.edu",
    helpline: "+91 1234 567 001",
    description: "Academic issues, grades, attendance, faculty concerns",
  },
  Hostel: {
    name: "Hostel Administration",
    email: "hostel@university.edu",
    helpline: "+91 1234 567 002",
    description: "Hostel facilities, room allocation, mess issues",
  },
  Sanitation: {
    name: "Sanitation & Maintenance",
    email: "sanitation@university.edu",
    helpline: "+91 1234 567 003",
    description: "Cleanliness, repairs, infrastructure maintenance",
  },
  "Ragging/Harassment": {
    name: "Anti-Ragging Cell",
    email: "pratapgajendra8810@gmail.com",
    helpline: "+91 1234 567 004",
    description: "Confidential reporting for ragging and harassment cases",
  },
};

export const COURSES = [
  "BTech",
  "MTech",
  "MBA",
  "PhD",
  "BSc",
  "MSc",
  "BBA",
  "BCA",
  "MCA",
] as const;

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"] as const;
