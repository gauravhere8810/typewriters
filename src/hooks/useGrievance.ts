import { useState, useCallback } from "react";
import { AnalysisResult, StudentDetails, GrievanceIssue, DEPARTMENT_INFO } from "@/lib/types";
import { saveIssue, updateIssueStatus } from "@/lib/localStorage";
import emailjs from "@emailjs/browser";
import { toast } from "@/hooks/use-toast";

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "4HCkZRcv0NGsL_JtM";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_9ey4srh";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "dibv60o";

export const useGrievance = () => {
  const [problem, setProblem] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    name: "",
    email: "",
    branch: "",
    rollNo: "",
    year: "",
    course: "",
    isAnonymous: false,
  });
  const [emailDraft, setEmailDraft] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentIssueId, setCurrentIssueId] = useState<string | null>(null);

  const analyzeProblem = useCallback(async () => {
    if (!problem.trim()) {
      toast({ title: "Error", description: "Please describe your problem", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-grievance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ problem, action: "analyze" }),
        }
      );

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setAnalysis(data);
      setCurrentStep(2);
      toast({ title: "Analysis Complete", description: `Classified under ${data.department}` });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Error", description: "Failed to analyze. Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  }, [problem]);

  const draftEmail = useCallback(async () => {
    if (!analysis) return;

    setIsDrafting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-grievance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            problem,
            action: "draft",
            department: analysis.department,
            studentDetails: studentDetails.isAnonymous
              ? { ...studentDetails, name: "Anonymous", rollNo: "N/A" }
              : studentDetails,
          }),
        }
      );

      if (!response.ok) throw new Error("Drafting failed");

      const data = await response.json();
      setEmailDraft(data.draft);
      setCurrentStep(4);
      toast({ title: "Draft Ready", description: "Your email has been drafted" });
    } catch (error) {
      console.error("Draft error:", error);
      toast({ title: "Error", description: "Failed to draft email. Please try again.", variant: "destructive" });
    } finally {
      setIsDrafting(false);
    }
  }, [problem, analysis, studentDetails]);

  const refineEmail = useCallback(async (instruction: string) => {
    if (!instruction.trim()) return;

    setIsDrafting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-grievance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "refine",
            currentDraft: emailDraft,
            instruction,
          }),
        }
      );

      if (!response.ok) throw new Error("Refinement failed");

      const data = await response.json();
      setEmailDraft(data.draft);
      toast({ title: "Email Refined", description: "Your email has been updated" });
    } catch (error) {
      console.error("Refine error:", error);
      toast({ title: "Error", description: "Failed to refine email. Please try again.", variant: "destructive" });
    } finally {
      setIsDrafting(false);
    }
  }, [emailDraft]);

  const sendEmail = useCallback(async () => {
    if (!analysis || !emailDraft) return;

    setIsSending(true);
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);

      const departmentInfo = DEPARTMENT_INFO[analysis.department];

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: departmentInfo.email,
        from_name: studentDetails.isAnonymous ? "Anonymous Student" : studentDetails.name,
        reply_to: studentDetails.email,
        subject: `Student Grievance - ${analysis.department}`,
        message: emailDraft,
      });

      // Save to localStorage
      const issue: GrievanceIssue = {
        id: crypto.randomUUID(),
        problem,
        department: analysis.department,
        status: "sent",
        createdAt: new Date().toISOString(),
        studentDetails,
        emailDraft,
      };
      saveIssue(issue);
      setCurrentIssueId(issue.id);

      toast({ title: "Email Sent!", description: "Your grievance has been submitted successfully" });
      setCurrentStep(5);
    } catch (error) {
      console.log("EmailJS Error Details:", error);
      console.error("Send error:", error);
      toast({ title: "Error", description: "Failed to send email. Please try again.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  }, [analysis, emailDraft, problem, studentDetails]);

  const resetForm = useCallback(() => {
    setProblem("");
    setAnalysis(null);
    setStudentDetails({
      name: "",
      email: "",
      branch: "",
      rollNo: "",
      year: "",
      course: "",
      isAnonymous: false,
    });
    setEmailDraft("");
    setCurrentStep(1);
    setCurrentIssueId(null);
  }, []);

  return {
    problem,
    setProblem,
    analysis,
    studentDetails,
    setStudentDetails,
    emailDraft,
    setEmailDraft,
    currentStep,
    setCurrentStep,
    isAnalyzing,
    isDrafting,
    isSending,
    currentIssueId,
    analyzeProblem,
    draftEmail,
    refineEmail,
    sendEmail,
    resetForm,
  };
};
