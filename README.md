# Smart Complaint 🚀

Smart Complaint is an AI-powered student grievance resolution system designed to streamline the process of reporting and resolving campus issues. It uses intelligent classification to route grievances to the correct departments and assists students in drafting professional emails.

## ✨ Features

- **AI Classification**: Automatically categorizes grievances into Academics, Hostel, Sanitation, or Ragging/Harassment.
- **Smart Drafting**: Generates professional email drafts based on the student's problem description.
- **Department Routing**: Automatically identifies the correct department and contact information.
- **Anonymous Reporting**: Support for students who wish to remain anonymous while reporting sensitive issues.
- **Issue Tracking**: Keeps a local record of submitted grievances and their status.
- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui for a premium, responsive experience.

## 🛠️ Tech Stack+

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **UI Components**: shadcn/ui (Radix UI)
- **Email Service**: @emailjs/browser
- **Backend/AI**: Supabase Edge Functions

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher.
- **npm**: Installed with Node.js.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd smart-resolver-buddy-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (or update the existing one) with the following variables:
   ```env
   VITE_SUPABASE_URL="your_supabase_url"
   VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_key"
   VITE_EMAILJS_PUBLIC_KEY="your_emailjs_public_key"
   VITE_EMAILJS_SERVICE_ID="your_emailjs_service_id"
   VITE_EMAILJS_TEMPLATE_ID="your_emailjs_template_id"
   ```

### Running the Project

Start the development server:
```bash
npm run dev
```
The app will typically be available at `http://localhost:8080/` (or `8081` if port 8080 is in use).

## 📂 Project Structure

- `src/components/`: Reusable UI components.
- `src/hooks/`: Custom React hooks (e.g., `useGrievance` for core logic).
- `src/lib/`: Type definitions and utility functions.
- `src/pages/`: Main application pages.
- `supabase/`: Configuration and Edge Functions for AI analysis.

## 📧 Configuration

Departments and their contact emails are defined in `src/lib/types.ts`. To change receiving addresses or add departments, modify the `DEPARTMENT_INFO` object in that file.

---
Built with ❤️ for a better campus experience.
