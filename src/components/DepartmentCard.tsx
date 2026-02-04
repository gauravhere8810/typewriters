import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, AlertTriangle, ArrowRight } from "lucide-react";
import { AnalysisResult, DepartmentInfo } from "@/lib/types";

interface DepartmentCardProps {
  analysis: AnalysisResult;
  departmentInfo: DepartmentInfo;
  onProceed: () => void;
}

export const DepartmentCard = ({ analysis, departmentInfo, onProceed }: DepartmentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-2xl text-primary">{departmentInfo.name}</CardTitle>
            {analysis.is_sensitive && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Sensitive
              </Badge>
            )}
          </div>
          <CardDescription className="text-base">{departmentInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{departmentInfo.email}</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 border"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Helpline</p>
                <p className="font-medium">{departmentInfo.helpline}</p>
              </div>
            </motion.div>
          </div>

          {analysis.is_sensitive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/30"
            >
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                This issue has been flagged as sensitive. You may choose to stay anonymous.
              </p>
            </motion.div>
          )}

          <Button onClick={onProceed} className="w-full h-12 text-lg font-semibold" size="lg">
            Continue to Details
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
