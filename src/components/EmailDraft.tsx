import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Sparkles } from "lucide-react";

interface EmailDraftProps {
  draft: string;
  setDraft: (value: string) => void;
  onRefine: (instruction: string) => void;
  onSend: () => void;
  isDrafting: boolean;
  isSending: boolean;
}

export const EmailDraft = ({
  draft,
  setDraft,
  onRefine,
  onSend,
  isDrafting,
  isSending,
}: EmailDraftProps) => {
  const [refineInstruction, setRefineInstruction] = useState("");

  const handleRefine = () => {
    if (refineInstruction.trim()) {
      onRefine(refineInstruction);
      setRefineInstruction("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl text-primary">Review Your Email</CardTitle>
          <CardDescription className="text-base">
            Review and edit the drafted email before sending. You can also refine it with AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[300px] text-base resize-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
            />
            {isDrafting && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={refineInstruction}
              onChange={(e) => setRefineInstruction(e.target.value)}
              placeholder="e.g., Make it more urgent, Add more details..."
              onKeyDown={(e) => e.key === "Enter" && handleRefine()}
              disabled={isDrafting}
            />
            <Button
              onClick={handleRefine}
              disabled={isDrafting || !refineInstruction.trim()}
              variant="secondary"
              className="shrink-0"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Refine
            </Button>
          </div>

          <Button
            onClick={onSend}
            disabled={isSending || isDrafting || !draft.trim()}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send to Department
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
