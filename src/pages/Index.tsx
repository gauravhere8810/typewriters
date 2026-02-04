import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { ProblemInput } from "@/components/ProblemInput";
import { DepartmentCard } from "@/components/DepartmentCard";
import { StudentDetailsForm } from "@/components/StudentDetailsForm";
import { EmailDraft } from "@/components/EmailDraft";
import { SuccessMessage } from "@/components/SuccessMessage";
import { Dashboard } from "@/components/Dashboard";
import { useGrievance } from "@/hooks/useGrievance";
import { DEPARTMENT_INFO } from "@/lib/types";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const grievance = useGrievance();

  const renderStep = () => {
    switch (grievance.currentStep) {
      case 1:
        return (
          <ProblemInput
            problem={grievance.problem}
            setProblem={grievance.setProblem}
            onAnalyze={grievance.analyzeProblem}
            isAnalyzing={grievance.isAnalyzing}
          />
        );
      case 2:
        return grievance.analysis ? (
          <DepartmentCard
            analysis={grievance.analysis}
            departmentInfo={DEPARTMENT_INFO[grievance.analysis.department]}
            onProceed={() => grievance.setCurrentStep(3)}
          />
        ) : null;
      case 3:
        return grievance.analysis ? (
          <StudentDetailsForm
            details={grievance.studentDetails}
            setDetails={grievance.setStudentDetails}
            isSensitive={grievance.analysis.is_sensitive}
            onDraft={grievance.draftEmail}
            isDrafting={grievance.isDrafting}
          />
        ) : null;
      case 4:
        return (
          <EmailDraft
            draft={grievance.emailDraft}
            setDraft={grievance.setEmailDraft}
            onRefine={grievance.refineEmail}
            onSend={grievance.sendEmail}
            isDrafting={grievance.isDrafting}
            isSending={grievance.isSending}
          />
        );
      case 5:
        return (
          <SuccessMessage
            onNewComplaint={grievance.resetForm}
            onViewDashboard={() => setShowDashboard(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onViewDashboard={() => setShowDashboard(true)}
        showDashboard={showDashboard}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {showDashboard ? (
            <Dashboard
              key="dashboard"
              onBack={() => setShowDashboard(false)}
            />
          ) : (
            <div key="form">
              <StepIndicator currentStep={grievance.currentStep} totalSteps={5} />
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
