# Feedback Tracker

A full-stack application for collecting, managing, and analyzing user feedback with optional AI-powered suggestions.

## Core Functionality

- **Feedback Management:** Create, view, edit, and delete feedback entries
- **Real-time Updates:** Instant UI updates without page refreshes
- **Categorization:** Organize feedback by categories (Bug Report, Feature Request, General)
- **Priority Levels:** Set and filter by priority (Low, Medium, High)
- **Status Tracking:** Track feedback status (Open, In Progress, Resolved)

## Tech Stack

### Frontend

- React 18 with functional components and hooks
- Tailwind CSS for styling
- Lucide React for icons
- Fetch API for HTTP requests

### Backend

- Node.js with Express.js
- OpenAI API integration
- CORS enabled for cross-origin requests
- JSON file-based storage (easily replaceable with a database)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Clone the Repository

```bash
git clone https://github.com/ishitapandey01/Feedback-Tracker.git
cd feedback-tracker
Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file in the backend directory:

ini
Copy
Edit
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
Running the Application
Start the Backend (Terminal 1)
bash
Copy
Edit
cd backend
npm start
The backend will run at:
http://localhost:5000

Start the Frontend (Terminal 2)
bash
Copy
Edit
cd frontend
npm start
The frontend will run at:
http://localhost:3000

