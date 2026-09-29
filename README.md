# CampusConnect

CampusConnect is an AI-enhanced campus event discovery platform built with Next.js. It helps students discover campus events through search and category filtering, save favourite events, and receive personalized event recommendations based on their interests. The application uses Google Gemini for meaningful AI-powered recommendations, with a local fallback system when the AI service is unavailable.

## Features

* 🔎 Search campus events by title, category, or venue
* 🏷️ Filter events by category
* ❤️ Save and remove favourite events
* 💾 Persist favourites using browser local storage
* ✨ AI-powered event recommendations using Google Gemini
* 🛡️ Local fallback recommendations when Gemini is unavailable
* ⏳ Loading, empty, and error states
* ♿ Keyboard-friendly and accessible interface
* 📊 Automated accessibility testing with axe
* 🧪 Component and end-to-end testing
* ⚡ Optimized production build

---

## Tech Stack

* **Framework:** Next.js 16.3.3
* **Frontend:** React 19
* **Styling:** Tailwind CSS
* **AI:** Google Gemini API
* **Testing:** Vitest, React Testing Library, Playwright
* **Accessibility Testing:** axe-core
* **Deployment:** Vercel
* **Version Control:** Git & GitHub

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/ganiagibu4-coder/phase3-app.git
cd phase3-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The API key must remain private and should never be committed to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The main event discovery page is available at:

```text
http://localhost:3000/events
```

---

## Project Architecture

```text
phase3-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── recommend/
│   │   │       └── route.js
│   │   ├── events/
│   │   │   └── page.js
│   │   ├── favourites/
│   │   │   └── page.js
│   │   ├── health/
│   │   │   └── route.js
│   │   └── page.js
│   │
│   ├── components/
│   │   ├── EventExplorer.jsx
│   │   └── EventExplorer.test.jsx
│   │
│   └── data/
│       └── events.js
│
├── e2e/
│   └── events.spec.js
│
├── public/
├── playwright.config.mjs
├── vitest.config.mjs
├── vitest.setup.js
├── package.json
└── README.md
```

### Main Components

**EventExplorer**

The main client-side component responsible for:

* Searching events
* Filtering categories
* Saving favourites
* Reading/writing favourites from local storage
* Displaying loading and empty states
* Requesting AI recommendations

**Events API**

`/api/recommend` receives the student's interests and the available events and returns structured recommendations from Gemini.

**Health Route**

`/health` provides a simple endpoint that can be used to verify that the deployed application is responding.

---

## AI Integration

### Why AI is used

The AI feature is designed around a specific user problem: students may have difficulty finding which campus events are relevant to their interests.

Instead of adding a generic chatbot, CampusConnect uses AI to provide **personalized event recommendations**.

A student can enter interests such as:

```text
AI, coding, cybersecurity
```

The application sends those interests together with the available campus events to Gemini.

Gemini returns up to three relevant events with a short explanation for each recommendation.

### AI Flow

```text
Student interests
       ↓
EventExplorer
       ↓
POST /api/recommend
       ↓
Google Gemini
       ↓
Structured JSON response
       ↓
Recommendation cards
```

### Structured Output

The Gemini request uses a JSON response schema containing:

```json
{
  "recommendations": [
    {
      "title": "Event name",
      "reason": "Why this event matches the student's interests"
    }
  ]
}
```

This makes the response predictable and easier for the frontend to process.

### Prompt

The AI is instructed to:

* Act as a campus event recommendation assistant
* Use the student's interests
* Recommend only events supplied by the application
* Return up to three recommendations
* Give a short reason for each recommendation

### Fallback Handling

If Gemini is unavailable or the API request fails, CampusConnect does not leave the user with a broken experience.

The application uses a local keyword-matching fallback that compares the student's interests with the event title, category, and description.

The fallback returns matching events when possible.

This provides a useful response even when the external AI service is temporarily unavailable.

---

## Error and Edge-Case Handling

The application handles several common states:

* Missing AI input
* Empty event lists
* AI API failures
* Loading while recommendations are being generated
* No search results
* No matching AI recommendations
* Favourites stored locally
* External AI service unavailable

The AI endpoint also validates the required request data before attempting to call Gemini.

---

## Testing

### Component Tests

Component testing is implemented using:

* Vitest
* React Testing Library

Run:

```bash
npm test
```

Current component tests cover:

* Rendering the event search interface
* Searching/filtering events
* Saving an event to favourites

### Coverage

Run:

```bash
npm test -- --coverage
```

Current measured coverage:

| Metric     | Coverage |
| ---------- | -------: |
| Statements |   63.93% |
| Branches   |   55.76% |
| Functions  |   68.75% |
| Lines      |   63.93% |
| Components |   62.71% |

The project therefore exceeds the capstone requirement of 50% component coverage.

---

## End-to-End Testing

Playwright is used to test the application from a real user's perspective.

Run:

```bash
npx playwright test
```

The current E2E test verifies that a user can:

1. Open the Events page
2. Search for an event
3. Save an event
4. See the event marked as a favourite

### Current E2E Result

```text
1 passed
```

---

## Accessibility Testing

Automated accessibility testing is performed using `axe-core` with Playwright.

The E2E test runs an accessibility scan on the Events page.

Current result:

```text
Accessibility violations: 0
```

The project was also checked using Lighthouse.

### Lighthouse Results

| Category       | Score |
| -------------- | ----: |
| Performance    |    96 |
| Accessibility  |   100 |
| Best Practices |   100 |

These results were obtained during local testing of the `/events` page.

---

## Performance

The application was tested using Chrome Lighthouse.

The Events page achieved:

* Performance: **96**
* Accessibility: **100**
* Best Practices: **100**

One concrete performance improvement was keeping the application focused on a lightweight client-side event dataset rather than introducing unnecessary external dependencies or large UI libraries.

---

## Production Build

The production build has been verified successfully.

Run:

```bash
npm run build
```

The following routes are currently generated:

```text
/
 /events
 /favourites
 /health
 /api/recommend
```

The production build completed successfully with no build errors.

---

## Deployment

The application is designed for deployment on Vercel.

### Environment Variable

The following environment variable must be configured in the deployment environment:

```text
GEMINI_API_KEY
```

The API key should never be included directly in source code or committed to the repository.

### Deployment Checklist

* [x] Application builds successfully
* [x] Production routes generated successfully
* [x] AI recommendation endpoint tested
* [x] Gemini API failure fallback implemented
* [x] Component tests passing
* [x] Component coverage above 50%
* [x] E2E test passing
* [x] axe accessibility scan passing
* [x] Lighthouse accessibility score verified
* [x] Lighthouse performance score verified
* [x] Environment variable documented
* [x] Secrets excluded from Git
* [x] GitHub repository updated
* [ ] Verify production deployment after each major release
* [ ] Verify Gemini API key is configured in the production environment

---

## Monitoring and Rollback

### Monitoring

The application can be monitored through:

* Vercel deployment logs
* Application/API errors
* `/health` endpoint
* Gemini API errors logged by the recommendation route
* Failed production builds

### Rollback

If a deployment introduces a serious issue:

1. Identify the failed deployment in Vercel.
2. Review deployment logs.
3. Return traffic to the last known working deployment.
4. Fix the issue locally.
5. Run the test suite and production build again.
6. Deploy the corrected version.

---

## Limitations

* Event data is currently maintained locally rather than coming from a live campus event management system.
* AI recommendations depend on the availability of the Gemini API.
* The fallback recommendation system is keyword-based and therefore simpler than the AI recommendation system.
* The application currently does not include user authentication.
* Favourites are stored locally in the browser.

---

## Future Improvements

Possible future improvements include:

* Connect events to a real campus event database
* Add student authentication
* Add event registration
* Add calendar integration
* Improve recommendation personalization using interaction history
* Add notifications for upcoming events
* Add administrator tools for managing events

---

## Repository

GitHub:

https://github.com/ganiagibu4-coder/phase3-app

## Live Application

https://phase3-app-one.vercel.app/
---

## Production Status

CampusConnect has been developed as a production-oriented AI-enhanced frontend application with:

* Functional event discovery
* Meaningful AI integration
* Structured AI output
* AI fallback handling
* Automated component testing
* End-to-end testing
* Automated accessibility testing
* Lighthouse performance testing
* Production build verification
* Deployment and rollback documentation
