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

## 💭 What I'd improve with more time