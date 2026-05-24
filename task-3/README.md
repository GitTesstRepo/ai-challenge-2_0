# Telegram Study Bot — Usage Guide

An AI-powered personal learning assistant delivered as a Telegram bot. Submit any URL to get a structured study summary, then test your knowledge with an auto-generated quiz.

---

## Prerequisites

- A Telegram account
- Access to the bot link: https://t.me/asdadasdbot

No installation required — the bot runs entirely on n8n cloud.

---

## How to Use

### Step 1 — Open the bot

Find the bot on Telegram using the provided link and start a conversation.

### Step 2 — Learn from a URL

Send the `/learn` command followed by a URL you want to study:

```
/learn https://en.wikipedia.org/wiki/Machine_learning
```

The bot will:
1. Fetch and extract the content from the URL.
2. Analyze it with the **Teacher AI** agent.
3. Reply with a structured summary containing 5–7 key points, main concepts, and a difficulty level.

### Step 3 — Take a quiz

Once you have submitted at least one URL, send:

```
/quiz
```

The bot will generate 5 multiple-choice questions based on your most recently saved material and send them one by one.

### Step 4 — Answer the questions

Each question is followed by four options labeled A, B, C, and D. Reply with the letter of your chosen answer:

```
A
```

- If your answer is **correct**, the next question is sent immediately.
- If your answer is **wrong**, the bot explains the correct answer before moving on.

### Step 5 — See your results

After the 5th question, the bot sends your final score as a percentage:

```
You scored 80%
```

The session is then cleared and you can start a new quiz at any time.

---

## Commands Reference

| Command | Description |
|---|---|
| `/learn [url]` | Fetch a URL, generate a summary, and save the material |
| `/quiz` | Start a 5-question quiz on your most recently saved material |

---

## Notes

- Data persists between sessions — your saved materials remain available after you close Telegram.
- The same URL can be re-submitted; the existing entry will be updated rather than duplicated.
- Only one quiz session can be active per user at a time.
- Answer by typing a single letter: `A`, `B`, `C`, or `D` (case-sensitive).
