# InterviewPilot AI — Phases Full Plan

# Phase 1 — Full Execution Plan

## 0. Preparation Before Starting

### What to do

Install or verify that you have:

```txt
Node.js
VS Code
Git
GitHub
Codex
Gemini API Key
```

### What this means

- **Node.js** — allows you to run JavaScript on your computer.
- **VS Code** — the code editor where you write and manage the project.
- **Git** — saves versions of your code.
- **GitHub** — uploads your project online for your portfolio.
- **Codex** — helps you build, edit, and fix code.
- **Gemini API Key** — the key that allows your app to communicate with AI.

---

## 1. Create the Project Folder

### What to do

Create a folder named:

```txt
InterviewPilot-AI
```

### What this means

This is the main folder for the entire project.

Inside it, you will have:

```txt
frontend = the website
backend  = the API server
```

---

## 2. Create the Frontend

### What to do

Create a React app using Vite.

```txt
client/
```

### What this means

The frontend is everything the user sees:

- screens
- buttons
- forms
- interview questions
- final report

---

## 3. Install TypeScript

### What to do

Build the project with TypeScript from the beginning.

### What this means

TypeScript helps prevent coding mistakes.

Example:

```txt
If a number is expected and you write text, TypeScript warns you.
```

This also looks more professional for your resume.

---

## 4. Install Tailwind CSS

### What to do

Add Tailwind CSS to the frontend.

### What this means

Tailwind helps you design the website quickly.

For example:

```txt
nice buttons
spacing
colors
cards
clean screens
```

Without writing a lot of manual CSS.

---

## 5. Install shadcn/ui

### What to do

Add a ready-made component library.

### What this means

shadcn/ui gives you ready components such as:

```txt
Button
Card
Input
Textarea
Select
Dialog
```

This prevents you from building everything from scratch.

---

## 6. Create the Backend

### What to do

Create a folder:

```txt
server/
```

Then create an Express server.

### What this means

The backend is the part the user does not see.

It is responsible for:

```txt
receiving requests from the website
sending requests to Gemini
returning AI responses to the website
```

---

## 7. Connect Frontend to Backend

### What to do

Create a simple test:

```txt
The website sends a request to the server.
The server returns "OK".
```

### What this means

This proves that both parts of the project can communicate with each other.

---

## 8. Create the Home Page

### What to do

Build the first page:

```txt
InterviewPilot AI
Practice realistic AI-powered technical interviews
Start interview
```

### What this means

This is the first screen the user sees.

The goal:

```txt
Make it feel like a real product.
```

---

## 9. Create the Role Selection Screen

### What to do

Add cards for:

```txt
Frontend Developer
Backend Developer
Full Stack Developer
AI Engineer
Generative AI Engineer
```

### What this means

The user chooses which role they want to practice for.

This choice affects the questions the AI will generate.

---

## 10. Create the Experience Level Screen

### What to do

Add options:

```txt
Intern
Junior
Mid-Level
Senior
```

### What this means

The level controls the difficulty of the questions.

Example:

```txt
Intern = fundamentals, coursework or personal projects, communication, and learning ability
Junior = basic professional questions
Senior = deep architecture and advanced questions
```

---

## 11. Create the Interview Type Screen

### What to do

Add:

```txt
Technical
Behavioral
Mixed
```

### What this means

This controls the type of questions:

- **Technical** — technical questions.
- **Behavioral** — teamwork, communication, and personal experience questions.
- **Mixed** — a combination of both.

---

## 12. Save the User Selections

### What to do

Save the choices in an object:

```txt
role
experienceLevel
interviewType
```

### What this means

This is the information the system sends to the AI.

Example:

```txt
Generative AI Engineer + Intern + Technical
```

The AI will use this to create a relevant interview.

---

## 13. Create the Interview Generation API

### What to do

In the server, create:

```txt
POST /api/interview/create
```

### What this means

This is the route the website calls to request interview questions.

The website sends:

```txt
role + experience level + interview type
```

The server returns:

```txt
a list of questions
```

---

## 14. Connect Gemini

### What to do

Create a service:

```txt
AI service with a Gemini provider
```

### What this means

This is the file that communicates with Gemini.

It is responsible for:

```txt
receiving a prompt
sending it to Gemini
getting a response
returning it to the server
```

---

## 15. Create a Prompt Builder for Questions

### What to do

Create a file that builds instructions for the AI.

### What this means

Instead of writing messy prompts, you create a clean file that tells the AI:

```txt
Create 5 interview questions.
Use the selected role.
Use the selected experience level.
Use the selected interview type.
Return structured JSON.
```

---

## 16. Return Questions in a Fixed Format

### What to do

Make sure the AI returns JSON like this:

```txt
id
question
topic
difficulty
expectedConcepts
```

### What this means

This is important because the website needs to know how to display the data.

You do not want random, unstructured AI text.

---

## 17. Display Questions on the Website

### What to do

Create an interview screen:

```txt
Question 1 of 5
[Question text]
[Answer box]
[Submit Answer]
```

### What this means

This is the actual interview screen.

The user sees one question at a time and writes an answer.

---

## 18. Create the Answer Box

### What to do

Add a Textarea.

### What this means

This is where the user writes their answer.

---

## 19. Create the Answer Evaluation API

### What to do

In the server, create:

```txt
POST /api/interview/evaluate
```

### What this means

The website sends the server:

```txt
the question
the user's answer
the role
the experience level
```

The server returns:

```txt
a score and feedback
```

---

## 20. Create a Prompt Builder for Evaluation

### What to do

Create a prompt that tells the AI how to evaluate an answer.

### What this means

The AI receives clear instructions:

```txt
Give a score from 1-5.
Write strengths.
Write weaknesses.
Write missing concepts.
Write an improved answer.
```

---

## 21. Return Evaluation in a Fixed Format

### What to do

The AI returns:

```txt
score
strengths
weaknesses
missingConcepts
improvedAnswer
confidenceLevel
```

### What this means

This makes the feedback structured and clear.

This is very important for a serious AI project.

---

## 22. Display Feedback on the Website

### What to do

After the user submits an answer, display:

```txt
Score: 4/5
Strengths
Weaknesses
Missing Concepts
Improved Answer
```

### What this means

The user understands exactly what was good and what needs improvement.

---

## 23. Move to the Next Question

### What to do

Add a button:

```txt
Next Question
```

### What this means

After receiving feedback, the user moves to the next question.

---

## 24. Save All Answers and Scores

### What to do

Store in the frontend memory:

```txt
each question
each user answer
each score
each feedback result
```

### What this means

You need this data for the final report.

---

## 25. Create the Final Report

### What to do

At the end of the interview, create a summary screen.

### What it includes

```txt
Overall Score
Technical Score
Communication Score
Problem Solving Score
Strengths
Weaknesses
Knowledge Gaps
Learning Roadmap
Recommended Topics
```

---

## 26. Calculate the Overall Score

### What to do

Take all scores and calculate the average.

### What this means

If the scores are:

```txt
8, 7, 9, 6, 8
```

The overall score will be:

```txt
3.8/5
```

---

## 27. Create a Learning Roadmap

### What to do

The AI or the code creates a list of topics for improvement.

### What this means

Example:

```txt
1. Learn REST API basics
2. Practice database relationships
3. Review authentication flow
```

This gives the user a learning plan after the interview.

---

## 28. Add Loading States

### What to do

Add loading messages:

```txt
Generating questions...
Evaluating answer...
Creating report...
```

### What this means

When the AI is working, the user will not think the website is stuck.

---

## 29. Add Error States

### What to do

Add error messages:

```txt
Something went wrong. Please try again.
```

### What this means

If Gemini fails or the internet connection has a problem, the website does not crash.

---

## 30. Manual Testing

### What to do

Test:

```txt
role selection works
question generation works
answer submission works
feedback appears
final report is created
```

### What this means

You verify that the MVP works from start to finish.

---

## 31. Push to GitHub

### What to do

Save the code on GitHub.

### What this means

This is important because recruiters can see:

```txt
code
project structure
commits
README
```

---

## 32. Write the README

### What to do

Write a project explanation file.

### What it should include

```txt
what the project does
which technologies you used
how to run it
what the AI does
what you learned
screenshots
```

### Why this is important

Many recruiters read the README before looking at the code.

---

## 33. Deployment

### What to do

Deploy the project online:

```txt
Frontend → Vercel
Backend → Render
```

### What this means

This allows you to send a live link to recruiters.

---

## 34. What Not to Build Yet

In Phase 1, do not add:

```txt
Login
Database
Interview History
Analytics Dashboard
Resume Upload
Voice Interview
Payment
Admin Panel
```

### Why

Because it will slow down the build.

First, build a working product.

---

# Best Execution Order

```txt
1. Setup project
2. Setup frontend
3. Setup backend
4. Connect client/backend
5. Build homepage
6. Build role selection
7. Build level selection
8. Build interview type selection
9. Save interview settings
10. Create generate questions API
11. Connect Gemini
12. Build question prompt
13. Show questions
14. Build answer input
15. Create evaluate answer API
16. Build evaluation prompt
17. Show feedback
18. Move between questions
19. Save answers/evaluations
20. Build final report
21. Add loading/error states
22. Test full flow
23. Push to GitHub
24. Write README
25. Deploy
```

This is the best order for Phase 1.
