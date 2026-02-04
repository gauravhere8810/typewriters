import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";

interface HeaderProps {
  onViewDashboard: () => void;
  showDashboard: boolean;
}

export const Header = ({ onViewDashboard, showDashboard }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b bg-card shadow-sm"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Smart Complaint</h1>
            <p className="text-xs text-muted-foreground">Student Grievance Intelligence System</p>
          </div>
        </div>
        {!showDashboard && (
          <Button onClick={onViewDashboard} variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Dashboard
          </Button>
        )}
      </div>
    </motion.header>
  );
};
