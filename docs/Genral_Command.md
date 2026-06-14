# פעולות Git ו-GitHub בסיסיות

## באיזה טרמינל להשתמש?

מומלץ לעבוד ב-VS Code עם:

Git Bash

איך לפתוח:
VS Code → Terminal → New Terminal → Git Bash

אפשר גם לעבוד עם PowerShell, אבל Git Bash יותר נוח לפקודות Git והרבה מדריכים משתמשים בו.

---

## בדיקה ש-Git מותקן

פקודה:
git --version

מה זה עושה:
בודק אם Git מותקן במחשב.

תוצאה תקינה:
git version 2.xx.x

---

## בדיקה שאתה בתיקייה הנכונה

פקודה:
pwd

מה זה עושה:
מראה באיזו תיקייה אתה נמצא עכשיו.

פקודה:
ls

מה זה עושה:
מראה את הקבצים והתיקיות שנמצאים בתיקייה הנוכחית.

---

## כניסה לתיקיית פרויקט

פקודה לדוגמה:
cd Desktop/my-project

מה זה עושה:
מכניס אותך לתיקיית הפרויקט.

חשוב:
צריך להריץ פקודות Git מתוך תיקיית הפרויקט, לא סתם מכל מקום במחשב.

---

## התחלת Git בפרויקט

פקודה:
git init

מה זה עושה:
הופך את התיקייה הנוכחית לפרויקט ש-Git עוקב אחריו.

מתי משתמשים:
רק פעם אחת בתחילת הפרויקט.

---

## בדיקת מצב הפרויקט

פקודה:
git status

מה זה עושה:
מראה אילו קבצים השתנו, אילו קבצים חדשים, ומה מוכן לשמירה.

מתי משתמשים:
לפני כל שמירה, אחרי שינויים, ואחרי ש-Codex משנה קבצים.

---

## הוספת קבצים לשמירה

פקודה:
git add .

מה זה עושה:
מכין את כל הקבצים שהשתנו לשמירה ב-Git.

הנקודה . אומרת:
כל הקבצים בתיקייה הנוכחית ובתיקיות שמתחתיה.

---

## שמירת גרסה - Commit

פקודה:
git commit -m "message"

דוגמה:
git commit -m "Initial project setup"

מה זה עושה:
שומר נקודת מצב של הפרויקט.

איך לכתוב הודעה:
לכתוב בקצרה מה השתנה.

דוגמאות טובות:
git commit -m "Add homepage"
git commit -m "Fix login bug"
git commit -m "Connect AI API"
git commit -m "Before Codex changes"

---

## לראות היסטוריית שמירות

פקודה:
git log --oneline

מה זה עושה:
מציג רשימה קצרה של כל ה-commits שעשית.

שימוש:
טוב כדי לראות לאיזה נקודות אפשר לחזור אם משהו נהרס.

---

## לראות בדיוק מה השתנה

פקודה:
git diff

מה זה עושה:
מראה את השינויים בתוך הקבצים לפני commit.

מתי להשתמש:
כשרוצים לבדוק מה Codex או אתה שיניתם לפני ששומרים.

---

# חיבור הפרויקט ל-GitHub

## יצירת Repository ב-GitHub

מה עושים באתר GitHub:

1. נכנסים ל-GitHub
2. לוחצים New repository
3. נותנים שם לפרויקט
4. בוחרים Public או Private
5. לא מסמנים README אם כבר יש פרויקט במחשב
6. לוחצים Create repository

Public:
טוב לפרויקט שאתה רוצה להציג בקורות חיים.

Private:
טוב לפרויקט אישי שלא רוצים לפרסם.

---

## חיבור הפרויקט מהמחשב ל-GitHub

פקודות לדוגמה:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main

מה כל פקודה עושה:

git remote add origin ...
מחבר את הפרויקט המקומי לכתובת של GitHub.

git branch -M main
מגדיר שהענף הראשי ייקרא main.

git push -u origin main
מעלה את הפרויקט ל-GitHub בפעם הראשונה.

חשוב:
את YOUR_USERNAME ו-YOUR_REPO_NAME מחליפים בשם המשתמש והפרויקט שלך.

---

## העלאת שינויים ל-GitHub

פקודה:
git push

מה זה עושה:
מעלה את ה-commits מהמחשב ל-GitHub.

מתי משתמשים:
אחרי שעשית commit ואתה רוצה שהקוד יהיה שמור גם בענן.

---

## הורדת שינויים מ-GitHub

פקודה:
git pull

מה זה עושה:
מוריד עדכונים מ-GitHub למחשב.

מתי משתמשים:
אם עבדת ממחשב אחר, או אם מישהו אחר שינה את הפרויקט.

---

# סדר עבודה רגיל

בכל פעם שאתה עושה שינוי חשוב בפרויקט:

git status
git add .
git commit -m "Describe the change"
git push

פירוש:

1. בודק מה השתנה
2. מכין את השינויים לשמירה
3. שומר גרסה
4. מעלה ל-GitHub

---

# סדר עבודה נכון עם Codex

לפני שנותנים ל-Codex לעשות שינוי גדול:

git status
git add .
git commit -m "Before Codex changes"

אחרי ש-Codex מסיים:

git status
git diff

אם הכל נראה טוב:

git add .
git commit -m "Apply Codex changes"
git push

למה זה חשוב:
אם Codex שובר משהו, יש לך גרסה קודמת שמורה.

---

# קובץ .gitignore

מה זה:
קובץ שאומר ל-Git מאילו קבצים להתעלם.

למה צריך:
כדי לא להעלות דברים מיותרים או סודיים ל-GitHub.

דוגמה לתוכן בפרויקט Node/React:

node_modules
.env
dist
build
.vscode

חשוב מאוד:
לא מעלים API keys ל-GitHub.
קובץ .env חייב להיות בתוך .gitignore.

---

# פקודות שלא להריץ בלי להבין

לא להריץ לבד בהתחלה:

git reset --hard
git clean -fd
git rebase
git push --force

למה:
הפקודות האלה יכולות למחוק שינויים או לסבך את הפרויקט.

---

# פקודת הבסיס שצריך לזכור

git status
git add .
git commit -m "message"
git push

זה רוב העבודה היומיומית עם Git ו-GitHub.
