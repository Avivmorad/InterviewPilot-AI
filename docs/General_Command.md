# מדריך Git ו-GitHub למתחילים

מדריך קצר לפקודות שבהן משתמשים במהלך העבודה הרגילה על פרויקט.

## תוכן עניינים

1. [סדר העבודה היומיומי](#סדר-העבודה-היומיומי)
2. [עבודה עם Codex](#עבודה-עם-codex)
3. [הכנת המחשב והפרויקט](#הכנת-המחשב-והפרויקט)
4. [חיבור פרויקט קיים ל-GitHub](#חיבור-פרויקט-קיים-ל-github)
5. [הסבר על הפקודות החשובות](#הסבר-על-הפקודות-החשובות)
6. [שמירה על קבצים סודיים](#שמירה-על-קבצים-סודיים)
7. [פקודות מסוכנות](#פקודות-מסוכנות)

---

## סדר העבודה היומיומי

בכל פעם שמסיימים שינוי חשוב בפרויקט:

```bash
git status
git diff
git add .
git commit -m "Describe the change"
git push
```

מה כל שלב עושה:

1. `git status` בודק אילו קבצים השתנו.
2. `git diff` מציג את השינויים שבוצעו.
3. `git add .` מכין את השינויים לשמירה.
4. `git commit` שומר גרסה מקומית.
5. `git push` מעלה את הגרסה ל-GitHub.

### הפקודות החשובות ביותר

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

אלו הפקודות שבהן משתמשים ברוב העבודה היומיומית.

---

## עבודה עם Codex

### לפני שינוי גדול

מומלץ לשמור את המצב הנוכחי:

```bash
git status
git add .
git commit -m "Before Codex changes"
```

### אחרי ש-Codex מסיים

בדוק מה השתנה:

```bash
git status
git diff
```

אם הכול נראה תקין:

```bash
git add .
git commit -m "Apply Codex changes"
git push
```

כך אפשר לחזור לגרסה הקודמת אם השינוי החדש יוצר בעיה.

---

## הכנת המחשב והפרויקט

### בחירת טרמינל

מומלץ להשתמש ב-**Git Bash** בתוך VS Code:

`VS Code` → `Terminal` → `New Terminal` → `Git Bash`

אפשר להשתמש גם ב-PowerShell.

### בדיקה ש-Git מותקן

```bash
git --version
```

תוצאה תקינה תיראה בערך כך:

```text
git version 2.xx.x
```

### מעבר לתיקיית הפרויקט

```bash
cd Desktop/my-project
```

בדוק שאתה בתיקייה הנכונה:

```bash
pwd
ls
```

- `pwd` מציג את התיקייה הנוכחית.
- `ls` מציג את הקבצים והתיקיות שבתוכה.

חשוב להריץ פקודות Git מתוך תיקיית הפרויקט.

### התחלת Git בפרויקט חדש

```bash
git init
```

הפקודה הופכת את התיקייה הנוכחית לפרויקט ש-Git עוקב אחריו.
משתמשים בה פעם אחת בלבד בתחילת פרויקט חדש.

אין להריץ `git init` אחרי שכבר הורדת את הפרויקט באמצעות `git clone`.

---

## חיבור פרויקט קיים ל-GitHub

### יצירת Repository באתר GitHub

1. היכנס ל-GitHub.
2. לחץ על `New repository`.
3. בחר שם לפרויקט.
4. בחר אם הפרויקט יהיה `Public` או `Private`.
5. אם כבר קיים README במחשב, אל תיצור README נוסף באתר.
6. לחץ על `Create repository`.

`Public` מתאים לפרויקט שרוצים להציג לאחרים.  
`Private` מתאים לפרויקט שלא רוצים לפרסם.

### חיבור הפרויקט המקומי

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

החלף את `YOUR_USERNAME` ואת `YOUR_REPO_NAME` בפרטים שלך.

- `git remote add origin ...` מחבר את הפרויקט ל-GitHub.
- `git branch -M main` מגדיר את שם הענף הראשי כ-`main`.
- `git push -u origin main` מעלה את הפרויקט בפעם הראשונה.

### בדיקת החיבור ל-GitHub

```bash
git remote -v
```

### שינוי כתובת קיימת של GitHub

אם כבר קיים `origin` והוא מצביע לכתובת לא נכונה:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### הורדת פרויקט קיים מ-GitHub

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

## הסבר על הפקודות החשובות

### בדיקת מצב הפרויקט

```bash
git status
```

מציג אילו קבצים השתנו, אילו קבצים חדשים, ואילו שינויים מוכנים לשמירה.

### הצגת השינויים

```bash
git diff
```

מציג את השינויים שעדיין לא נשמרו ב-commit.

### הכנת שינויים לשמירה

```bash
git add .
```

מכין את כל השינויים בתיקייה הנוכחית ובתיקיות שמתחתיה לשמירה.

### שמירת גרסה

```bash
git commit -m "Describe the change"
```

שומר נקודת מצב של הפרויקט במחשב.

דוגמאות להודעות commit ברורות:

```bash
git commit -m "Add homepage"
git commit -m "Fix login bug"
git commit -m "Connect Gemini API"
```

### העלאת שינויים ל-GitHub

```bash
git push
```

מעלה ל-GitHub את ה-commits שנשמרו במחשב.

### הורדת שינויים מ-GitHub

```bash
git pull
```

מוריד ומחבר שינויים מ-GitHub לפרויקט המקומי.
מומלץ לבדוק קודם שאין שינויים מקומיים שלא נשמרו.

### הצגת היסטוריית השמירות

```bash
git log --oneline
```

מציג רשימה קצרה של ה-commits בפרויקט.

---

## שמירה על קבצים סודיים

קובץ `.gitignore` אומר ל-Git מאילו קבצים להתעלם.

דוגמה לפרויקט Node.js ו-React:

```gitignore
node_modules/
.env
dist/
build/
.vscode/
```

חשוב:

- אין להעלות API keys או סיסמאות ל-GitHub.
- קובצי `.env` חייבים להופיע בתוך `.gitignore`.
- לפני `git push`, מומלץ לבדוק את השינויים עם `git status` ו-`git diff`.

---

## פקודות מסוכנות

אין להריץ את הפקודות הבאות בלי להבין בדיוק מה הן עושות:

```bash
git reset --hard
git clean -fd
git rebase
git push --force
```

פקודות אלו עלולות למחוק שינויים או לשנות את היסטוריית הפרויקט.
