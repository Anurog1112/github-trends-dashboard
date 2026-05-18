# GitHub Trends Dashboard

A responsive web application for exploring GitHub trends — built with React + Vite, TypeScript, and TailwindCSS.

🔗 **Live Demo:** [https://github-trends-dashboard.netlify.app/]

---

## ⭐ Product Thinking

### Who is this for?

I built this for 3 groups of people I had in mind while designing:

**1. The Tech Trend Hunter** — CTO, Tech Lead, or any developer who wants to know "what's hot right now?" without having to manually call GitHub APIs or scroll through endless GitHub pages. They need a single page that answers their question in under 3 seconds.

**2. The Open Source Contributor** — developers looking for active projects to contribute to, but don't know where to start. The Trending section helps them find projects that are gaining traction *right now*, not just projects that have been popular for years.

**3. Me — as someone being evaluated** — I know the interviewer will test edge cases. Especially what happens when the API quota runs out. So I made sure the app handles that gracefully instead of just crashing with a white screen.

---

### How I define each term

**Top Programming Language**
The language that appears most in the `language` field across the top 100 most-starred repositories on GitHub at the time of the request. I count occurrences, calculate percentage, and rank them. It's not a perfect sample, but it's honest and I document it clearly.

**Top Repository**
Public repositories sorted by total star count — descending. What "top" means depends on context: when the page first loads, it shows globally popular repos. When you search, it shows what's relevant to your query.

**Trending Repository**
Repositories *created* within a specific time window (last 1 day / 7 days / 30 days), sorted by stars. GitHub doesn't have an official `/trending` endpoint, so this is my workaround — and I think it's a fair proxy for "what's getting attention right now."

---

### API Endpoints Used

| Endpoint | Used For |
|---|---|
| `GET /search/repositories` | Top repos, trending repos, keyword search |
| `GET /users/{username}/repos` | User or organization repository list |
| `GET /repos/{owner}/{repo}` | Full repository detail (e.g. `facebook/react`) |
| `GET /rate_limit` | Checking remaining API quota |

---

### Why these endpoints?

**`/search/repositories` is the backbone of this whole app.**
One endpoint, one query parameter change — and I can handle Top Repos, Trending, and Search all at once. It's flexible enough that I didn't need to build 3 separate data pipelines.

**`/users/{username}/repos` and `/repos/{owner}/{repo}` are for precision.**
When someone types `vercel` or `facebook/react`, they already know what they want. Hitting the right endpoint directly gives them an exact answer faster than running a search query.

**`/rate_limit` is for user protection.**
Without a token, GitHub gives you 60 requests/hour. That runs out fast. Instead of letting the app crash silently, I poll this endpoint to detect the limit and show a clear warning with instructions on how to add a token.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Anurog1112/github-trends-dashboard.git
cd github-trends-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then open .env and add your GitHub token

# Run the development server
npm run dev
```

### Environment Variables

```bash
# .env
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

> Without a token → 60 requests/hour  
> With a token → 5,000 requests/hour  
> Generate one at: https://github.com/settings/tokens

---

## 🔍 Search Guide

| What you type | What happens |
|---|---|
| `react` | Search repositories matching "react" |
| `vercel` | Show all repositories from vercel (user/org) |
| `facebook/react` | Show details of that specific repository |
| `face/book/x` | Show an error — invalid format |

---

## 🛠 Tech Stack

| Part | Technology | Why |
|---|---|---|
| Framework | React + Vite + TypeScript | Fast dev setup, type-safe API handling |
| Styling | TailwindCSS | Utility-first, responsive without extra files |
| Charts | Recharts | Lightweight, composable, works well with React |
| API | GitHub REST API | Official, well-documented, no backend needed |

---

## 💭 What I'd improve with more time

These aren't random tech improvements — each one is tied directly to a real problem one of the three target users would face.

---

**1. Real Star Velocity — for The Tech Trend Hunter**

Right now "trending" means "created recently + high stars." That's a reasonable proxy, but it doesn't capture momentum. A repo created 2 years ago that suddenly gained 5,000 stars this week is trending — but my current logic wouldn't surface it.

A proper solution: a lightweight backend (cron job) that snapshots star counts every 24 hours and computes the delta. This would give the Tech Trend Hunter the signal they actually care about — not just "what's new" but "what's accelerating."

---

**2. Filter by Language — for The Tech Trend Hunter**

A CTO evaluating whether to adopt Rust or Go doesn't want to see Python repos mixed in. Letting users filter Top Repositories and Trending by language would turn this from a general dashboard into a focused decision-making tool.

---

**3. "Good First Issue" Signal — for The Open Source Contributor**

The Open Source Contributor's core problem isn't finding popular repos — it's finding repos where they can actually contribute. Adding a filter for repos with open `good first issue` labels (available via GitHub Issues API) would directly solve that. This is the one improvement that would most change the value proposition for that user group.

---

**4. Pagination and Load More — for all users**

Search results currently cap at 30. A user searching for "machine learning" gets 30 of 180,000 results. Adding a "Load More" button (not infinite scroll — that's harder to control) would let users explore deeper without rebuilding the whole search flow.

---

**5. Client-side Caching — for The Evaluator**

Every page load re-fetches everything, which burns through rate limit quickly and feels slow on repeat visits. A simple `localStorage` cache with a 5-minute TTL would cut API calls significantly and make the app feel faster — without any backend.

---

**6. Larger Sample for Top Languages**

100 repos is enough for a demo but statistically thin. With `Promise.all` across 5–10 pages (500–1000 repos), the language distribution would be far more representative — and the chart would become a genuinely useful signal rather than an approximation.