# Phase 1 — סדר פעולות מלא

## 0. הכנות לפני שמתחילים

### מה עושים

מתקינים/בודקים שיש:

```txt
Node.js
VS Code
Git
GitHub
Codex
Gemini API Key
```

### מה זה

- **Node.js** — מאפשר להריץ JavaScript במחשב.
- **VS Code** — המקום שבו כותבים קוד.
- **Git** — שומר גרסאות של הקוד.
- **GitHub** — מעלה את הפרויקט לאינטרנט ולפורטפוליו.
- **Codex** — עוזר לבנות ולתקן קוד.
- **Gemini API Key** — המפתח שמאפשר לאפליקציה לדבר עם AI.

---

# 1. יצירת תיקיית פרויקט

### מה עושים

יוצרים תיקייה בשם:

```txt
InterviewPilot-AI
```

### מה זה

זו התיקייה הראשית של כל הפרויקט.

בתוכה יהיו:

```txt
client  = האתר
server  = השרת
```

---

# 2. יצירת Frontend

### מה עושים

יוצרים React app עם Vite.

```txt
client/
```

### מה זה

ה־Frontend הוא כל מה שהמשתמש רואה:

- מסכים
- כפתורים
- טפסים
- שאלות
- דוח סופי

---

# 3. התקנת TypeScript

### מה עושים

בונים את הפרויקט מראש עם TypeScript.

### מה זה

TypeScript עוזר למנוע טעויות בקוד.

לדוגמה:

```txt
אם צריך מספר וכתבת טקסט — הוא מזהיר אותך
```

זה נראה יותר מקצועי לקורות חיים.

---

# 4. התקנת Tailwind CSS

### מה עושים

מוסיפים Tailwind ל־client.

### מה זה

Tailwind עוזר לעצב את האתר מהר.

לדוגמה:

```txt
כפתור יפה
ריווחים
צבעים
כרטיסים
מסכים נקיים
```

בלי לכתוב הרבה CSS ידני.

---

# 5. התקנת shadcn/ui

### מה עושים

מוסיפים ספריית קומפוננטות מוכנות.

### מה זה

זה נותן רכיבים מוכנים כמו:

```txt
Button
Card
Input
Textarea
Select
Dialog
```

במקום לבנות הכל מאפס.

---

# 6. יצירת Backend

### מה עושים

יוצרים תיקייה:

```txt
server/
```

ומקימים שרת Express.

### מה זה

ה־Backend הוא החלק שהמשתמש לא רואה.

הוא אחראי על:

```txt
קבלת בקשות מהאתר
שליחת בקשות ל-Gemini
החזרת תשובות לאתר
```

---

# 7. חיבור Frontend ל־Backend

### מה עושים

יוצרים בדיקה פשוטה:

```txt
האתר שולח בקשה לשרת
השרת מחזיר "OK"
```

### מה זה

זה מוכיח ששני החלקים של הפרויקט מדברים אחד עם השני.

---

# 8. יצירת דף בית

### מה עושים

בונים עמוד ראשון:

```txt
InterviewPilot AI
Practice realistic AI-powered technical interviews
Start Interview
```

### מה זה

זה המסך הראשון שהמשתמש רואה.

המטרה:

```txt
להרגיש כמו מוצר אמיתי
```

---

# 9. יצירת מסך בחירת תפקיד

### מה עושים

מוסיפים כרטיסים:

```txt
Frontend Developer
Backend Developer
Full Stack Developer
AI Engineer
```

### מה זה

המשתמש בוחר לאיזה תפקיד הוא רוצה להתאמן.

הבחירה תשפיע על השאלות שה־AI ייצור.

---

# 10. יצירת מסך בחירת רמה

### מה עושים

מוסיפים אפשרויות:

```txt
Junior
Mid-Level
Senior
```

### מה זה

הרמה קובעת את קושי השאלות.

דוגמה:

```txt
Junior = שאלות בסיסיות
Senior = שאלות עומק וארכיטקטורה
```

---

# 11. יצירת מסך בחירת סוג ראיון

### מה עושים

מוסיפים:

```txt
Technical
Behavioral
Mixed
```

### מה זה

זה קובע איזה סוג שאלות יהיו:

- **Technical** — שאלות טכניות.
- **Behavioral** — שאלות אישיות/עבודה בצוות.
- **Mixed** — שילוב.

---

# 12. שמירת בחירות המשתמש

### מה עושים

שומרים את הבחירות באובייקט:

```txt
role
experienceLevel
interviewType
```

### מה זה

זה המידע שהמערכת תשלח ל־AI.

לדוגמה:

```txt
AI Engineer + Junior + Technical
```

ה־AI יידע ליצור ראיון מתאים לזה.

---

# 13. יצירת API ליצירת ראיון

### מה עושים

בשרת יוצרים:

```txt
POST /api/interview/generate
```

### מה זה

זה נתיב שהאתר קורא לו כדי לבקש שאלות.

האתר שולח:

```txt
תפקיד + רמה + סוג ראיון
```

השרת מחזיר:

```txt
רשימת שאלות
```

---

# 14. חיבור Gemini

### מה עושים

יוצרים שירות:

```txt
geminiService
```

### מה זה

זה הקובץ שמדבר עם Gemini.

הוא אחראי על:

```txt
לקבל prompt
לשלוח אותו ל-Gemini
לקבל תשובה
להחזיר אותה לשרת
```

---

# 15. יצירת Prompt Builder לשאלות

### מה עושים

יוצרים קובץ שבונה הוראות ל־AI.

### מה זה

במקום לכתוב prompt מבולגן, יש קובץ מסודר שאומר ל־AI:

```txt
צור 5 שאלות ראיון
לפי תפקיד
לפי רמה
לפי סוג ראיון
תחזיר JSON מסודר
```

---

# 16. החזרת שאלות בפורמט קבוע

### מה עושים

דואגים שה־AI מחזיר JSON כזה:

```txt
id
question
topic
difficulty
expectedAnswerPoints
```

### מה זה

זה חשוב כי האתר צריך לדעת איך להציג את הנתונים.

לא רוצים תשובה חופשית ומבולגנת.

---

# 17. הצגת שאלות באתר

### מה עושים

יוצרים מסך:

```txt
Question 1 of 5
[Question text]
[Answer box]
[Submit Answer]
```

### מה זה

זה מסך הראיון עצמו.

המשתמש רואה שאלה אחת בכל פעם ועונה.

---

# 18. יצירת תיבת תשובה

### מה עושים

מוסיפים Textarea.

### מה זה

זה המקום שבו המשתמש כותב את התשובה שלו.

---

# 19. יצירת API להערכת תשובה

### מה עושים

בשרת יוצרים:

```txt
POST /api/interview/evaluate
```

### מה זה

האתר שולח לשרת:

```txt
השאלה
התשובה של המשתמש
התפקיד
הרמה
```

השרת מחזיר:

```txt
ציון ופידבק
```

---

# 20. יצירת Prompt Builder להערכה

### מה עושים

יוצרים prompt שאומר ל־AI איך לבדוק תשובה.

### מה זה

ה־AI מקבל הוראות ברורות:

```txt
תן ציון 1-10
כתוב חוזקות
כתוב חולשות
כתוב מושגים חסרים
כתוב תשובה משופרת
```

---

# 21. החזרת הערכה בפורמט קבוע

### מה עושים

ה־AI מחזיר:

```txt
score
strengths
weaknesses
missingConcepts
improvedAnswer
confidenceLevel
```

### מה זה

זה הופך את הפידבק למבנה קבוע וברור.

זה חשוב מאוד לפרויקט AI רציני.

---

# 22. הצגת פידבק באתר

### מה עושים

אחרי שליחת תשובה מציגים:

```txt
Score: 8/10
Strengths
Weaknesses
Missing Concepts
Improved Answer
```

### מה זה

המשתמש מבין בדיוק מה טוב ומה צריך לשפר.

---

# 23. מעבר לשאלה הבאה

### מה עושים

מוסיפים כפתור:

```txt
Next Question
```

### מה זה

אחרי פידבק, המשתמש עובר לשאלה הבאה.

---

# 24. שמירת כל התשובות והציונים

### מה עושים

שומרים בזיכרון של האתר:

```txt
כל שאלה
כל תשובה
כל ציון
כל פידבק
```

### מה זה

צריך את זה בשביל הדוח הסופי.

---

# 25. יצירת Final Report

### מה עושים

בסוף הראיון יוצרים מסך סיכום.

### מה זה כולל

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

# 26. חישוב ציון כללי

### מה עושים

לוקחים את כל הציונים ומחשבים ממוצע.

### מה זה

אם היו ציונים:

```txt
8, 7, 9, 6, 8
```

הציון הכללי יהיה:

```txt
7.6/10
```

---

# 27. יצירת Learning Roadmap

### מה עושים

ה־AI או הקוד יוצרים רשימת נושאים לשיפור.

### מה זה

לדוגמה:

```txt
1. Learn REST API basics
2. Practice database relationships
3. Review authentication flow
```

זה נותן למשתמש תוכנית למידה אחרי הראיון.

---

# 28. הוספת Loading States

### מה עושים

מוסיפים הודעות טעינה:

```txt
Generating questions...
Evaluating answer...
Creating report...
```

### מה זה

כשה־AI עובד, המשתמש לא יחשוב שהאתר נתקע.

---

# 29. הוספת Error States

### מה עושים

מוסיפים הודעות שגיאה:

```txt
Something went wrong. Please try again.
```

### מה זה

אם Gemini נכשל או האינטרנט נופל, האתר לא קורס.

---

# 30. בדיקות ידניות

### מה עושים

בודקים:

```txt
בחירת תפקיד עובדת
יצירת שאלות עובדת
שליחת תשובה עובדת
פידבק מוצג
דוח סופי נוצר
```

### מה זה

מוודאים שה־MVP באמת עובד מהתחלה עד סוף.

---

# 31. העלאה ל־GitHub

### מה עושים

שומרים את הקוד ב־GitHub.

### מה זה

זה חשוב כי מגייסים יכולים לראות:

```txt
קוד
מבנה פרויקט
commits
README
```

---

# 32. כתיבת README

### מה עושים

כותבים קובץ הסבר לפרויקט.

### מה צריך להיות בו

```txt
מה הפרויקט עושה
באיזה טכנולוגיות השתמשת
איך מריצים אותו
מה ה-AI עושה
מה למדת
תמונות מסך
```

### למה זה חשוב

הרבה מגייסים קוראים README לפני שהם מסתכלים בקוד.

---

# 33. Deployment

### מה עושים

מעלים לאינטרנט:

```txt
Frontend → Vercel
Backend → Render
```

### מה זה

ככה אפשר לשלוח לינק חי למגייסים.

---

# 34. מה לא עושים עדיין

ב־Phase 1 לא מוסיפים:

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

### למה

כי זה יאט את הבנייה.

קודם בונים מוצר עובד.

---

# סדר הביצוע הכי נכון

```txt
1. Setup project
2. Setup frontend
3. Setup backend
4. Connect frontend/backend
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

זה הסדר הכי נכון ל־Phase 1.
