# Report: AI-Powered Telegram Learning Bot

## Tools and Techniques Used

### Platform
- **n8n** (cloud trial) — visual workflow automation platform used to build the entire bot logic without a dedicated backend server.

### AI
- **GPT-5-mini** via n8n's built-in free OpenAI API credits — powers both AI agents.
- **AI Teacher Agent** — analyzes raw content, produces a structured 5–7 point summary, infers a title, and assigns a difficulty level (beginner / basic / intermediate / advanced / expert).
- **AI Examiner Agent** — generates exactly 5 multiple-choice questions (A/B/C/D) with explanations, based on the Teacher's summary.

### Content Extraction
- **Jina AI Reader API** (`r.jina.ai`) — used as an HTTP proxy that converts any URL into clean Markdown. No API key required. The URL is transformed as `https://r.jina.ai/` + original URL, and the response is parsed for `Title`, `URL Source`, and `Markdown Content` fields.

### Storage
- **n8n Data Tables** — three tables used for persistence:
  - `learning_material` — stores URL, title, extracted content, summary, and difficulty.
  - `quiz` — stores generated questions, options, correct answer, explanation, and the linked `materialId`.
  - `quiz_session` — tracks per-user state: current question index, material being quizzed, points scored, and expected answer/explanation for the current question.

### Telegram Integration
- **n8n Telegram Trigger** — webhook-based listener for incoming messages.
- **n8n Telegram node** — sends messages back to the user.
- A **Switch** node routes traffic based on whether the message starts with `/learn`, equals `/quiz`, or is an answer to an ongoing quiz.

### Memory
- **n8n Buffer Window Memory** — attached to both AI agents, keyed by Telegram chat ID, to maintain conversational context within a session.

---

## What Worked

- **Jina AI for content extraction** worked reliably across a wide variety of URLs — news articles, documentation pages, and blog posts — without requiring additional credentials.
- **n8n Data Tables** provided a simple, zero-configuration persistence layer that survived across sessions without any external database setup.
- **Upsert logic** for both `learning_material` and `quiz` tables meant the same URL could be re-submitted without duplicating data.
- **AI agent prompt engineering** — explicit formatting rules in the system prompts (numbered list items, JSON-only output, no schema output) made the parsed outputs reliable enough to feed directly into downstream nodes.
- **Quiz session state machine** — tracking `current_question`, `answer`, and `points` in a single table row per user allowed clean question-by-question progression and final score calculation.
- The workflow runs **continuously without restart** between commands; the Switch node handles all routing within a single active workflow.

---

## What Did Not Work / Limitations

- **Topic selection for `/quiz`** — the spec requires presenting the user with a list of saved materials to choose from. The current implementation skips this step and automatically uses the most recently saved material. Implementing a proper selection menu would require multi-turn state management (e.g., storing a "pending topic selection" state) or Telegram inline keyboards with callback queries, which adds significant complexity to the n8n flow.
- **Intelligent answer validation** — answer checking is currently an exact string match (e.g., user must type `A`, `B`, `C`, or `D`). A more robust approach would involve AI-based semantic validation, but this was not implemented to keep latency low and credits usage minimal.
- **No `/start` command handler** — the `/start` command is not explicitly handled in the Switch node. Users who send `/start` fall through to the answer-handling branch, which may return an unhelpful response.
- **Single-user quiz sessions** — the `quiz_session` table uses only `user_id` as the key, meaning a user can only have one active quiz at a time. Concurrent quizzes across materials are not supported.
- **Error handling** — the AI Teacher Agent has an `onError: continueErrorOutput` setting, but the error path is not connected to any user-facing message, so failed URL fetches produce silent failures.

---

## Notable Decisions

- **Jina AI over raw HTTP scraping** — direct HTTP requests to arbitrary URLs often fail due to JavaScript rendering, paywalls, or bot detection. Jina AI's reader reliably returns structured Markdown from most public URLs with a single GET request.
- **Storing the summary (not raw content) as the Examiner's input** — the Examiner agent receives the Teacher's summary rather than the full raw content. This keeps token usage low and ensures quiz questions stay focused on the key learning points, not peripheral details in the article.
- **Upsert over insert** — using upsert operations for both material and quiz storage prevents duplicates when users re-submit the same URL or retrigger quiz generation.
- **Flat session row per user** — rather than storing individual answer history rows, a single session row is updated in place as the quiz progresses. This is simpler to query but means per-question answer history is not retained after the session ends.
