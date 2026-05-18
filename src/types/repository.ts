import type { Owner } from "./owner";

export interface Repository {
    id: number;
    name: string;
    full_name:string;
    owner: Owner;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
}