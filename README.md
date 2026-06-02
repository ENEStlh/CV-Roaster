#  CV Roaster - AI-Powered Resume Analyzer

CV Roaster is a full-stack web application that extracts text from PDF resumes and leverages Large Language Models (OpenAI GPT-4o-mini) to provide brutally honest, structured feedback on clarity, impact, and ATS compatibility. 

Built as a showcase of bridging the gap between raw AI models and production-ready user interfaces.

##  Features
- **Asynchronous PDF Extraction:** Fast and reliable resume parsing using `pdfplumber`.
- **AI-Driven Analysis:** Utilizes OpenAI's GPT-4o-mini with forced JSON structured outputs for parseable and highly detailed feedback.
- **Brutally Honest Feedback:** Analyzes Experience, Projects, Skills, and Education sections independently, providing actionable improvement steps.
- **Dynamic UI/UX:** Responsive, dark-themed frontend built with React, Vite, and Tailwind CSS.
- **Dynamic Scoring:** Visual progress rings and dynamic color-coding based on the resume's overall ATS score.

##  Tech Stack
- **AI & Backend:** Python, FastAPI, pdfplumber, OpenAI API
- **Frontend:** React.js, Vite, Tailwind CSS
- **Architecture:** RESTful API, Asynchronous Processing, JSON Mode LLM Integration

## ⚙️ How to Run Locally

### 1. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_api_key_here
```
Start the FastAPI server:
```bash
uvicorn main:app --reload
```

### 2. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 3. Usage
Open your browser and navigate to `http://localhost:5173`. Upload a PDF resume and wait for the AI to roast it!
