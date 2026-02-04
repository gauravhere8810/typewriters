import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Plus } from "lucide-react";

interface SuccessMessageProps {
  onNewComplaint: () => void;
  onViewDashboard: () => void;
}

export const SuccessMessage = ({ onNewComplaint, onViewDashboard }: SuccessMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
        <CardContent className="pt-8 pb-6 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="p-4 rounded-full bg-green-100">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Grievance Submitted!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your complaint has been sent to the relevant department. You will receive a response
              on your email soon.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={onNewComplaint} variant="outline" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
            <Button onClick={onViewDashboard} size="lg">
              <FileText className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
