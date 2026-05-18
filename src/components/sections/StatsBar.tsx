interface StatsBarProps {
  trendingThisWeek: number;
  highestStars: number;
  topLanguage: string;
  topLanguagePercent: number;
  apiRemaining: number;
  apiLimit: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function StatsBar({
  trendingThisWeek,
  highestStars,
  topLanguage,
  topLanguagePercent,
  apiRemaining,
  apiLimit,
}: StatsBarProps) {
  const quotaPercent = apiLimit > 0
    ? Math.round((apiRemaining / apiLimit) * 100)
    : 100;
  const isLowQuota = quotaPercent < 20;

  const stats = [
    {
      label: "Trending This Week",
      value: formatNumber(trendingThisWeek),
      sub: "new repos in last 7 days",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      valueColor: "text-orange-600",
    },
    {
      label: "Highest Stars",
      value: formatNumber(highestStars),
      sub: "top repository right now",
      icon: (
        <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      valueColor: "text-amber-600",
    },
    {
      label: "Top Language",
      value: topLanguage || "—",
      sub: topLanguagePercent > 0
        ? `${topLanguagePercent}% of top repos`
        : "most used globally",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      iconBg: "bg-violet-50",
      iconColor: "text-violet-500",
      valueColor: "text-violet-600",
    },
    {
      label: "API Quota",
      value: `${formatNumber(apiRemaining)} / ${formatNumber(apiLimit)}`,
      sub: isLowQuota ? "⚠️ Running low — add token" : "requests remaining",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconBg: isLowQuota ? "bg-red-50" : "bg-emerald-50",
      iconColor: isLowQuota ? "text-red-500" : "text-emerald-500",
      valueColor: isLowQuota ? "text-red-600" : "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400 font-medium leading-tight">
              {stat.label}
            </p>
            <p className={`text-base font-bold ${stat.valueColor} truncate leading-tight`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 truncate leading-tight">
              {stat.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}