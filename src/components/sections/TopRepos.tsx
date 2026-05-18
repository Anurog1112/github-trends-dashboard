import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Repository } from "../../types";
import { EmptyState } from "./ui";

interface TopReposProps {
  repos: Repository[];
}

type SortOrder = "desc" | "asc";

interface ChartItem {
  name: string;
  full_name: string;
  stars: number;
  forks: number;
  language: string | null;
  avatar_url: string;
  login: string;
  updated: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#DEA584",
  "C++": "#F34B7D",
  CSS: "#663399",
  Shell: "#89E051",
  Markdown: "#083FA1",
};

interface CustomBarLabelProps {
  x?: string | number;
  y?: string | number;
  width?: string | number;
  value?: any;
  index?: number;
  data: ChartItem[];
}

function CustomBarLabel(props: CustomBarLabelProps) {
  const { x, y, width, value = 0, index = 0, data } = props;
  const xNum = typeof x === 'string' ? parseFloat(x) : (x ?? 0);
  const yNum = typeof y === 'string' ? parseFloat(y) : (y ?? 0);
  const widthNum = typeof width === 'string' ? parseFloat(width) : (width ?? 0);
  const valueNum = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
  const item = data[index];
  if (!item || valueNum === 0) return null;

  const cx = xNum + widthNum / 2;
  const avatarSize = 20;
  const avatarR = avatarSize / 2;
  const starY = yNum - 6;
  const avatarCy = starY - 16;

  return (
    <g>
      {/* Star count */}
      <text
        x={cx}
        y={starY}
        textAnchor="middle"
        fontSize={9}
        fontWeight={600}
        fill="#64748B"
      >
        {formatNumber(valueNum)}
      </text>

      {/* Avatar */}
      <defs>
        <clipPath id={`clip-${item.login}-${index}`}>
          <circle cx={cx} cy={avatarCy} r={avatarR} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={avatarCy} r={avatarR + 1.5} fill="white" />
      <image
        href={item.avatar_url}
        x={cx - avatarR}
        y={avatarCy - avatarR}
        width={avatarSize}
        height={avatarSize}
        clipPath={`url(#clip-${item.login}-${index})`}
      />
    </g>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const repo: ChartItem = payload[0].payload;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs max-w-56">
      <div className="flex items-center gap-2 mb-2">
        <img
          src={repo.avatar_url}
          alt={repo.login}
          className="w-6 h-6 rounded-lg border border-slate-100"
        />
        <p className="font-bold text-slate-800 truncate">{repo.full_name}</p>
      </div>
      <div className="flex flex-col gap-1 text-slate-500">
        <span className="text-amber-600 font-semibold">
          ⭐ {repo.stars.toLocaleString()} stars
        </span>
        <span>🍴 {repo.forks.toLocaleString()} forks</span>
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: LANG_COLORS[repo.language] ?? "#94A3B8",
              }}
            />
            {repo.language}
          </span>
        )}
        <span>🕒 {repo.updated}</span>
      </div>
    </div>
  );
}

export function TopRepos({ repos }: TopReposProps) {
  const [view, setView] = useState<"chart" | "list">("chart");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sorted = [...repos].sort((a, b) =>
    sortOrder === "desc"
      ? b.stargazers_count - a.stargazers_count
      : a.stargazers_count - b.stargazers_count
  );

  const chartData: ChartItem[] = sorted.slice(0, 8).map((repo) => ({
    name: repo.name.length > 10 ? repo.name.slice(0, 10) + "…" : repo.name,
    full_name: repo.full_name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    avatar_url: repo.owner.avatar_url,
    login: repo.owner.login,
    updated: formatDate(repo.updated_at),
  }));

  if (sorted.length === 0) {
    return (
      <div className="card-elevated p-5 flex flex-col h-full">
        <h2 className="text-base font-bold text-slate-900 mb-4 shrink-0">
          Top Repositories
        </h2>
        <EmptyState
          title="No repositories found"
          message="Try searching for something else"
        />
      </div>
    );
  }

  return (
    <div className="card-elevated p-5 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Top Repositories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Most starred on GitHub</p>
        </div>

        <div className="flex items-center gap-2">

          {/* Sort — แสดงทั้ง Chart และ List View */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                sortOrder === "asc" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9M3 12h5m8 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
            {sortOrder === "desc" ? "Most Stars" : "Least Stars"}
          </button>

          {/* View Toggle */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView("chart")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                view === "chart"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Chart View
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                view === "list"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Chart View */}
      {view === "chart" && (
        <div className="flex-1 min-h-0 flex flex-col">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={chartData}
              margin={{ top: 52, right: 8, left: 0, bottom: 4 }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tickFormatter={(v) => formatNumber(v)}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                width={38}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F8FAFC" }}
              />
              <Bar
                dataKey="stars"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
                label={(props) => (
                  <CustomBarLabel {...props} data={chartData} />
                )}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={LANG_COLORS[entry.language ?? ""] ?? "#3B82F6"}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Language Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-1 shrink-0">
            {Array.from(
              new Set(chartData.map((d) => d.language).filter(Boolean))
            ).map((lang) => (
              <div key={lang} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: LANG_COLORS[lang!] ?? "#94A3B8",
                  }}
                />
                <span className="text-xs text-slate-500">{lang}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-1 shrink-0">
            Color by language · Hover for details
          </p>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <>
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="text-xs text-slate-400">
              {sorted.length} repositories
            </span>
            {sorted.length > 5 && (
              <span className="text-xs text-slate-400">
                ↕ Scroll to see all {sorted.length} repos
              </span>
            )}
          </div>

          <div
            className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1"
            style={{ maxHeight: "380px" }}
          >
            {sorted.map((repo, idx) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 shrink-0"
              >
                <span className="text-xs font-bold text-slate-300 w-5 pt-1 shrink-0">
                  {idx + 1}
                </span>
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://github.com/ghost.png";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 truncate transition-colors">
                    {repo.full_name}
                  </p>
                  {repo.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <svg
                        className="w-3 h-3 fill-amber-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {formatNumber(repo.stargazers_count)}
                    </span>
                    <span className="text-xs text-slate-500">
                      🍴 {formatNumber(repo.forks_count)}
                    </span>
                    {repo.language && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              LANG_COLORS[repo.language] ?? "#94A3B8",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto shrink-0">
                      {formatDate(repo.updated_at)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

    </div>
  );
}