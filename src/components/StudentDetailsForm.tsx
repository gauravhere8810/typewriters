import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Loader2 } from "lucide-react";
import { StudentDetails, COURSES, YEARS } from "@/lib/types";

interface StudentDetailsFormProps {
  details: StudentDetails;
  setDetails: (details: StudentDetails) => void;
  isSensitive: boolean;
  onDraft: () => void;
  isDrafting: boolean;
}

export const StudentDetailsForm = ({
  details,
  setDetails,
  isSensitive,
  onDraft,
  isDrafting,
}: StudentDetailsFormProps) => {
  const updateField = (field: keyof StudentDetails, value: string | boolean) => {
    setDetails({ ...details, [field]: value });
  };

  const isValid = () => {
    if (details.isAnonymous) {
      return details.email && details.branch && details.year && details.course;
    }
    return (
      details.name &&
      details.email &&
      details.branch &&
      details.rollNo &&
      details.year &&
      details.course
    );
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
          <CardTitle className="text-2xl text-primary">Your Details</CardTitle>
          <CardDescription className="text-base">
            {isSensitive
              ? "You may choose to stay anonymous for this sensitive issue."
              : "Please provide your details for follow-up."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isSensitive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-accent border"
            >
              <div>
                <Label htmlFor="anonymous" className="text-base font-medium">
                  Stay Anonymous?
                </Label>
                <p className="text-sm text-muted-foreground">
                  Your identity will be kept confidential
                </p>
              </div>
              <Switch
                id="anonymous"
                checked={details.isAnonymous}
                onCheckedChange={(checked) => updateField("isAnonymous", checked)}
              />
            </motion.div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {!details.isAnonymous && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={details.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number *</Label>
                  <Input
                    id="rollNo"
                    value={details.rollNo}
                    onChange={(e) => updateField("rollNo", e.target.value)}
                    placeholder="2021CS001"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="student@university.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch/Department *</Label>
              <Input
                id="branch"
                value={details.branch}
                onChange={(e) => updateField("branch", e.target.value)}
                placeholder="Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select
                value={details.course}
                onValueChange={(value) => updateField("course", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select
                value={details.year}
                onValueChange={(value) => updateField("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={onDraft}
            disabled={isDrafting || !isValid()}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isDrafting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Drafting Email...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Draft Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
