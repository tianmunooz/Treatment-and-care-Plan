# Aesthetic Treatment & Care Plan Builder

An advanced, AI-powered web application for creating, customizing, and sharing personalized aesthetic treatment plans. This tool is designed for medical aesthetic professionals to streamline their consultation workflow, enhance patient communication, and manage their services efficiently.

![Application Screenshot](https://storage.googleapis.com/generative-ai-proctor/v1/user_uploaded_content/11696001151608753239/project_542561955620/instance_7673998379434863261/file_14954756306563380482_abstract-bg.jpg)

## Core Features

- **AI-Powered Plan Generation**: Utilizes the Google Gemini API to instantly transform unstructured consultation notes into a complete, multi-phase treatment plan.
- **Dynamic Plan Builder**: A rich, interactive interface to visually construct plans. Users can add phases and treatments, with full drag-and-drop support for reordering.
- **Template-Driven Workflow**: Start from expertly crafted, pre-built templates or create custom templates to standardize care and accelerate plan creation.
- **Comprehensive Customization**: A powerful Admin Panel allows for complete personalization. Define every product and service, set default pricing, manage dropdown options, and edit plan templates.
- **Bilingual Support (EN/ES)**: Fully functional in English and Spanish. The Admin Panel includes tools for managing translations for all custom content.
- **Professional PDF Export**: Generate polished, patient-ready PDF documents of the final care plan, complete with your practice's branding.
- **Interactive Tutorial System**: A built-in, step-by-step guide to help new users quickly learn and master the application's features.
- **Zero-Backend Architecture**: Runs entirely in the browser. All definitions and plans are persisted securely in the browser's `localStorage`, requiring no database or server-side setup.

## Tech Stack

- **Framework**: React (using TypeScript)
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF & html2canvas
- **Icons**: Lucide React
- **Module Loading**: ES Modules with Import Maps (no build step required)

## Gemini API Integration

The application leverages the Gemini API in two key areas:

1.  **AI-Powered Suggestion**: This is the core AI feature. When a user provides consultation notes, the application sends them to the `gemini-2.5-flash` model along with a list of all available treatments defined in the admin panel. By providing a strict JSON schema (`responseSchema`), we instruct Gemini to return a structured response containing extracted patient data (name, age, sex) and a complete plan broken into phases and treatments. This ensures the AI's suggestions are always relevant and use only the services the practice actually offers.

2.  **Key Instruction Generation**: Within the plan builder, a user can click a "Generate" button to get AI assistance in writing patient instructions for a specific treatment. This sends a simpler prompt to Gemini asking for concise, patient-focused instructions, which are then populated directly into the form.

## Getting Started

This application is designed to run directly in the browser without a traditional build process.

### Prerequisites

1.  **A Modern Web Browser** (e.g., Chrome, Firefox, Safari, Edge).
2.  **Google Gemini API Key**: The application requires a valid API key to be available as an environment variable (`process.env.API_KEY`) in the deployment environment.

### Running Locally

1.  Because the application uses ES modules, you must serve the files from a local web server. You cannot open the `index.html` file directly from your filesystem.
2.  A simple way to do this is to navigate to the project directory in your terminal and run one of the following commands:
    - **If you have Python 3:** `python -m http.server`
    - **If you have Node.js and `serve` installed (`npm install -g serve`):** `serve .`
3.  Open your browser and navigate to the address provided by the local server (e.g., `http://localhost:8000`).

## Configuration and Customization

The heart of this application's flexibility is the **Admin Panel**.

- **Access**: Click the "Admin & Settings" button on the main page.
- **Functionality**:
  - **General Settings**: Update your practice name, logo, provider name, and contact information. This data appears on all PDF exports.
  - **Templates**: Create, edit, or delete plan templates.
  - **Products & Services**: Define every treatment or retail product you offer. Group them into categories and configure their default properties like price, goal, and required fields.
  - **Options**: Customize the values that appear in dropdown menus throughout the app, such as "Target Areas," "Frequencies," or "Technologies."
- **Data Persistence**: All changes made in the Admin Panel are automatically saved to the browser's `localStorage`.

## Project Structure

```
/
├── components/          # React components
│   ├── common/          # Reusable UI components (Button, Input, etc.)
│   ├── AdminPage.tsx
│   ├── Header.tsx
│   ├── PlanBuilder.tsx
│   ├── PlanPreview.tsx
│   └── ...
├── data/                # Default application data
│   └── definitions.ts   # Default products, services, templates
├── services/            # Business logic and external API interactions
│   ├── geminiService.ts
│   ├── pdfService.ts
│   └── definitionsService.ts
├── i18n.ts              # Translation strings and logic
├── types.ts             # Core TypeScript type definitions
├── index.html           # Main HTML entry point with import maps
└── index.tsx            # React application root
```
