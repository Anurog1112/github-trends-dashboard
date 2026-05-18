import { getDateBefore } from "../utils/date";
import type { Repository, SearchRepositoriesResponse } from "../types";

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const BASE_URL = "https://api.github.com";

const headers = {
  "Authorization": `Bearer ${TOKEN}`,
  "Content-Type": "application/vnd.github.v3+json",
};

async function safeFetch(url: string): Promise<unknown> {
  const res = await fetch(url, { headers });

  if (res.status === 403) {
    throw new Error("403 Rate limit exceeded");
  }
  if (res.status === 404) {
    throw new Error("404 Not found");
  }
  if (!res.ok) {
    throw new Error(`${res.status} Request failed`);
  }

  return res.json();
}

export async function searchRepositories(query: string): Promise<Repository[]> {
  const url = `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`;
  const data = await safeFetch(url) as SearchRepositoriesResponse;
  return data.items;
}

export async function getUserRepos(username: string): Promise<Repository[]> {
  const url = `${BASE_URL}/users/${username}/repos?sort=stars&order=desc&per_page=30`;
  const data = await safeFetch(url) as Repository[];
  return data;
}

export async function getRepo(owner: string, repo: string): Promise<Repository> {
  const url = `${BASE_URL}/repos/${owner}/${repo}`;
  const data = await safeFetch(url) as Repository;
  return data;
}

export async function getTrendingRepositories(days: number): Promise<Repository[]> {
  const date = getDateBefore(days);
  const url = `${BASE_URL}/search/repositories?q=created:>${date}&sort=stars&order=desc&per_page=10`;
  const data = await safeFetch(url) as SearchRepositoriesResponse;
  return data.items;
}

export async function getRateLimit() {
  const url = `${BASE_URL}/rate_limit`;
  return safeFetch(url);
}

export async function getTopRepositories(): Promise<Repository[]> {
  const url = `${BASE_URL}/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=100`;
  const data = await safeFetch(url) as SearchRepositoriesResponse;
  return data.items;
}