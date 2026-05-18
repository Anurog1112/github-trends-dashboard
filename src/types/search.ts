import type { Repository } from "./repository";

export interface SearchRepositoriesResponse {
    items: Repository[];
    total_count: number;
}