import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: "Problem", short: "1" },
  { label: "Analysis", short: "2" },
  { label: "Details", short: "3" },
  { label: "Draft", short: "4" },
  { label: "Sent", short: "5" },
];

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.slice(0, totalSteps).map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isActive ? 1.1 : 1 }}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                isComplete && "bg-primary border-primary",
                isActive && "border-primary bg-primary/10",
                !isComplete && !isActive && "border-muted-foreground/30 bg-muted"
              )}
            >
              {isComplete ? (
                <Check className="w-5 h-5 text-primary-foreground" />
              ) : (
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {stepNumber}
                </span>
              )}
            </motion.div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
