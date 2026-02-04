import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Trash2, FileText, Clock, CheckCircle2, Send } from "lucide-react";
import { GrievanceIssue } from "@/lib/types";
import { getStoredIssues, deleteIssue } from "@/lib/localStorage";
import { format } from "date-fns";

interface DashboardProps {
  onBack: () => void;
}

export const Dashboard = ({ onBack }: DashboardProps) => {
  const [issues, setIssues] = useState<GrievanceIssue[]>([]);

  useEffect(() => {
    setIssues(getStoredIssues());
  }, []);

  const handleDelete = (id: string) => {
    deleteIssue(id);
    setIssues(getStoredIssues());
  };

  const getStatusBadge = (status: GrievanceIssue["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "sent":
        return (
          <Badge className="gap-1 bg-primary">
            <Send className="h-3 w-3" />
            Sent
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Resolved
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Button onClick={onBack} variant="ghost" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Your Past Issues
          </CardTitle>
          <CardDescription>
            Track and manage all your submitted grievances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No issues submitted yet</p>
              <p className="text-sm text-muted-foreground">
                Your submitted complaints will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {issues.map((issue) => (
                      <motion.tr
                        key={issue.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {format(new Date(issue.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{issue.department}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {issue.problem}
                        </TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(issue.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
