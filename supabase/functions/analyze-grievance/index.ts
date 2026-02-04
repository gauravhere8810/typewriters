import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, problem, department, studentDetails, currentDraft, instruction } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let messages: { role: string; content: string }[] = [];
    let tools: any[] = [];
    let tool_choice: any = undefined;

    if (action === "analyze") {
      messages = [
        {
          role: "system",
          content: `You are a grievance classification assistant for a university. Analyze student problems and classify them into the appropriate department.

Departments:
- Academics: Issues related to grades, attendance, faculty, courses, exams, academic policies
- Hostel: Issues related to hostel rooms, mess food, hostel facilities, room allocation
- Sanitation: Issues related to cleanliness, maintenance, infrastructure, repairs
- Ragging/Harassment: Issues related to ragging, bullying, harassment, discrimination, threats

IMPORTANT: Mark is_sensitive as TRUE only for Ragging/Harassment cases or any issue involving personal safety, mental health, or harassment.`,
        },
        {
          role: "user",
          content: `Analyze this student grievance and classify it:\n\n"${problem}"`,
        },
      ];

      tools = [
        {
          type: "function",
          function: {
            name: "classify_grievance",
            description: "Classify the grievance into a department",
            parameters: {
              type: "object",
              properties: {
                department: {
                  type: "string",
                  enum: ["Academics", "Hostel", "Sanitation", "Ragging/Harassment"],
                  description: "The department this grievance should be routed to",
                },
                is_sensitive: {
                  type: "boolean",
                  description: "Whether this is a sensitive issue (harassment, safety concerns, etc.)",
                },
              },
              required: ["department", "is_sensitive"],
              additionalProperties: false,
            },
          },
        },
      ];
      tool_choice = { type: "function", function: { name: "classify_grievance" } };
    } else if (action === "draft") {
      const studentInfo = studentDetails.isAnonymous
        ? "Anonymous Student"
        : `${studentDetails.name} (Roll No: ${studentDetails.rollNo}, ${studentDetails.course}, ${studentDetails.year}, ${studentDetails.branch})`;

      messages = [
        {
          role: "system",
          content: `You are a formal email drafting assistant. Write professional, polite, and clear grievance emails for students to send to university departments.

Guidelines:
- Use formal salutation and closing
- Be respectful but assertive
- Clearly state the problem
- Request appropriate action
- Keep it concise but comprehensive`,
        },
        {
          role: "user",
          content: `Draft a formal grievance email for the ${department} department.

Student Details: ${studentInfo}
Email: ${studentDetails.email}
Problem: ${problem}

Write a polite, formal email that clearly explains the issue and requests resolution.`,
        },
      ];
    } else if (action === "refine") {
      messages = [
        {
          role: "system",
          content: "You are an email editing assistant. Modify the given email based on the user's instructions while maintaining formality and professionalism.",
        },
        {
          role: "user",
          content: `Current email:\n\n${currentDraft}\n\nInstruction: ${instruction}\n\nProvide the refined email.`,
        },
      ];
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages,
    };

    if (tools.length > 0) {
      body.tools = tools;
      body.tool_choice = tool_choice;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    if (action === "analyze") {
      // Extract from tool call
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const result = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to parse analysis result");
    } else {
      // Draft or refine - return the content
      const content = data.choices?.[0]?.message?.content || "";
      return new Response(JSON.stringify({ draft: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
