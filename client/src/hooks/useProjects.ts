import { useCallback, useSyncExternalStore } from "react";
import { getProjectsApi } from "../services/apiService";
import type { Project } from "../types";

const PROJECTS_CACHE_KEY = "portfolio:projects:v2";
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [1000, 2500];

interface CachePayload {
  version: 2;
  savedAt: number;
  projects: Project[];
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: boolean;
  lastUpdated: number | null;
}

const emptyState: ProjectsState = {
  projects: [],
  loading: true,
  error: false,
  lastUpdated: null,
};

const listeners = new Set<() => void>();
let state: ProjectsState = emptyState;
let request: Promise<Project[]> | null = null;
let initialized = false;

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setState = (next: ProjectsState | ((current: ProjectsState) => ProjectsState)) => {
  state = typeof next === "function" ? next(state) : next;
  emit();
};

const clearCache = () => {
  try {
    sessionStorage.removeItem(PROJECTS_CACHE_KEY);
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
};

const readCache = (): { projects: Project[]; savedAt: number } | null => {
  try {
    const raw = sessionStorage.getItem(PROJECTS_CACHE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    // Reject the old array-only cache format so the cache is versioned.
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("version" in parsed) ||
      !("savedAt" in parsed) ||
      !("projects" in parsed)
    ) {
      clearCache();
      return null;
    }

    const cache = parsed as CachePayload;

    if (
      cache.version !== 2 ||
      !Number.isFinite(cache.savedAt) ||
      !Array.isArray(cache.projects)
    ) {
      clearCache();
      return null;
    }

    return {
      projects: cache.projects,
      savedAt: cache.savedAt,
    };
  } catch {
    clearCache();
    return null;
  }
};

const writeCache = (projects: Project[]) => {
  try {
    const payload: CachePayload = {
      version: 2,
      savedAt: Date.now(),
      projects,
    };

    sessionStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // The network response remains the source of truth when storage is unavailable.
  }
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const isTransientError = (error: unknown) => {
  if (!error || typeof error !== "object") return true;

  const status =
    "status" in error && typeof error.status === "number"
      ? error.status
      : undefined;

  return (
    status === undefined ||
    status === 408 ||
    status === 429 ||
    status >= 500
  );
};

const fetchProjectsWithRetry = async (): Promise<Project[]> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const projects = await getProjectsApi();

      if (!Array.isArray(projects)) {
        throw new Error("Invalid project archive response.");
      }

      return projects;
    } catch (error) {
      lastError = error;

      if (attempt === MAX_ATTEMPTS - 1 || !isTransientError(error)) {
        throw error;
      }

      await sleep(RETRY_DELAYS_MS[attempt] ?? 2500);
    }
  }

  throw lastError ?? new Error("Failed to fetch projects.");
};

export const prefetchProjects = () => {
  void ensureProjects();
};

export const ensureProjects = async (force = false): Promise<Project[]> => {
  const now = Date.now();
  const hasProjects = state.projects.length > 0;
  const cacheIsFresh =
    state.lastUpdated !== null &&
    now - state.lastUpdated < CACHE_TTL_MS;

  if (!force && initialized && hasProjects && cacheIsFresh) {
    return state.projects;
  }

  if (request) return request;

  initialized = true;
  setState((current) => ({
    ...current,
    loading: current.projects.length === 0,
    error: false,
  }));

  request = fetchProjectsWithRetry()
    .then((projects) => {
      const updatedAt = Date.now();

      writeCache(projects);

      setState({
        projects,
        loading: false,
        error: false,
        lastUpdated: updatedAt,
      });

      return projects;
    })
    .catch((error) => {
      console.error("[projects] Failed to load project archive:", error);

      setState((current) => ({
        ...current,
        // Keep stale data visible if a background refresh fails.
        loading: current.projects.length === 0,
        error: current.projects.length === 0,
      }));

      throw error;
    })
    .finally(() => {
      request = null;
    });

  return request;
};

export const replaceProjectsCache = (projects: Project[]) => {
  const updatedAt = Date.now();

  writeCache(projects);

  setState({
    projects,
    loading: false,
    error: false,
    lastUpdated: updatedAt,
  });

  initialized = true;
};

export const invalidateProjectsCache = () => {
  clearCache();

  // Do not discard visible projects. Mark them stale and refresh them.
  setState((current) => ({
    ...current,
    lastUpdated: null,
    error: false,
    loading: current.projects.length === 0,
  }));

  void ensureProjects(true);
};

const initializeStore = () => {
  if (initialized) return;

  initialized = true;

  const cached = readCache();

  if (cached) {
    state = {
      projects: cached.projects,
      loading: false,
      error: false,
      lastUpdated: cached.savedAt,
    };

    // Stale-while-revalidate: cached projects render immediately while
    // a background request checks the server for changes.
    void ensureProjects();
    return;
  }

  state = emptyState;
};

initializeStore();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const useProjects = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const retry = useCallback(() => {
    void ensureProjects(true);
  }, []);

  return {
    projects: snapshot.projects,
    loading: snapshot.loading,
    error: snapshot.error,
    retry,
  };
};