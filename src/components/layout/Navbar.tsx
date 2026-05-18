import { useState } from "react";

export type SearchMode =
  | { type: "fullRepo"; owner: string; repo: string }
  | { type: "smartSearch"; query: string }
  | { type: "invalid"; reason: string };

export function detectSearchMode(query: string): SearchMode {
  const trimmed = query.trim();

  if (!trimmed) {
    return { type: "invalid", reason: "Please enter a search term" };
  }

  // facebook/react → Full Repo
  const fullRepoPattern = /^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/;
  const fullRepoMatch = trimmed.match(fullRepoPattern);
  if (fullRepoMatch) {
    return {
      type: "fullRepo",
      owner: fullRepoMatch[1],
      repo: fullRepoMatch[2],
    };
  }

  // มี / แต่ผิด format
  if (trimmed.includes("/")) {
    return {
      type: "invalid",
      reason: 'Invalid format. Use "owner/repo" for full repository search',
    };
  }

  // vercel, react, microsoft → ให้ระบบตัดสินใจเอง
  return { type: "smartSearch", query: trimmed };
}

interface NavbarProps {
  onSearch: (mode: SearchMode) => void;
  onClear: () => void;
}

export function Navbar({ onSearch, onClear }: NavbarProps) {
  const [query, setQuery] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    // ลบจนว่าง → กลับ default
    if (value === "") {
      onClear();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const mode = detectSearchMode(query);
    onSearch(mode);
  }

  return (
    <nav className="bg-white border-b px-4 py-3 md:px-6 md:py-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

        <h1 className="text-xl font-bold text-gray-900 shrink-0">
          GitHub Trends Dashboard
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search user, org, repo... (e.g. vercel, react, facebook/react)"
            className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded text-sm shrink-0 hover:bg-gray-700"
          >
            Search
          </button>
        </form>

      </div>
    </nav>
  );
}