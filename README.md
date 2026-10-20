# GTIC School Management — Frontend

Frontend dashboard for the GTIC school-management platform.

Built with Next.js and TypeScript, the application provides an administrative interface for managing students, teachers, courses, classes, payments, and other school operations.

## Main Features

- Administrative dashboard
- Student and inactive-student management
- Teacher management
- Course and class workflows
- Payment views
- Profile management
- Charts and dashboard statistics
- Searchable and tabular data views
- PDF generation/export functionality
- Internationalized routes and UI

## Tech Stack

- **Framework:** Next.js 15
- **Frontend:** React 19, TypeScript
- **Data fetching:** Axios, TanStack Query
- **Tables:** TanStack Table
- **Forms:** React Hook Form, Zod
- **Internationalization:** next-intl / i18next
- **Charts:** Recharts
- **UI:** Radix UI, Lucide React, Tailwind CSS
- **PDF / export:** jsPDF, html2canvas, html2pdf.js

## Getting Started

```bash
git clone https://github.com/dacolate/gtic-frontend.git
cd gtic-frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend expects the GTIC backend API to be available and configured in the application's environment.

## Related Repository

The backend API is available in [gtic-backend](https://github.com/dacolate/gtic-backend).
