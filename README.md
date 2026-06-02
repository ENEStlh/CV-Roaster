# 🔥 CV Roaster - AI-Powered Resume Analyzer

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-success?style=for-the-badge&logo=vercel)](https://cv-roaster-4kz45wi7i-enes-s-projects1.vercel.app/)

CV Roaster is a full-stack web application that extracts text from PDF resumes and leverages Large Language Models (OpenAI GPT-4o-mini) to provide brutally honest, structured feedback on clarity, impact, and ATS compatibility. 

Built as a showcase of bridging the gap between raw AI models and production-ready user interfaces.

## 🚀 Features
- **Live Cloud Deployment:** Fully deployed frontend (Vercel) and asynchronous backend (Render).
- **Asynchronous PDF Extraction:** Fast and reliable resume parsing using `pdfplumber`.
- **AI-Driven Analysis:** Utilizes OpenAI's GPT-4o-mini with forced JSON structured outputs for parseable and highly detailed feedback.
- **Brutally Honest Feedback:** Analyzes Experience, Projects, Skills, and Education sections independently, providing actionable improvement steps.
- **Dynamic UI/UX:** Responsive, dark-themed frontend built with React, Vite, and Tailwind CSS.
- **Dynamic Scoring:** Visual progress rings and dynamic color-coding based on the resume's overall ATS score.

## 🛠️ Tech Stack

**Frontend:** ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend & AI:** ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

## ⚙️ How to Run Locally

If you want to run this project on your local machine, follow these steps:

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

---
*Developed by Enes Talha Kir* [LinkedIn](https://www.linkedin.com/in/enes-talha-kir/) | [GitHub](https://github.com/ENEStlh)