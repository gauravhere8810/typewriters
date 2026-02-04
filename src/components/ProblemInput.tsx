import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface ProblemInputProps {
  problem: string;
  setProblem: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const ProblemInput = ({ problem, setProblem, onAnalyze, isAnalyzing }: ProblemInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-primary">Describe Your Issue</CardTitle>
          <CardDescription className="text-base">
            Tell us about your problem in detail. Our AI will analyze and route it to the right department.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Example: The water supply in my hostel room has been disrupted for 3 days. I have reported this to the warden but no action has been taken..."
            className="min-h-[200px] text-base resize-none focus:ring-2 focus:ring-primary/50"
          />
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || !problem.trim()}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Analyze Problem
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
