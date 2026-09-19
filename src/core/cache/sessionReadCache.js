import { toApiFailure } from "../http/ApiFailure";

const CACHE_PREFIX = "k2-read-cache:";

const now = () => Date.now();

const cacheKey = (key) => `${CACHE_PREFIX}${key}`;

const readEntry = (key, storage = sessionStorage) => {
  try {
    const raw = storage.getItem(cacheKey(key));
    if (!raw) {
      return null;
    }

    const entry = JSON.parse(raw);
    if (
      !entry ||
      typeof entry.savedAt !== "number" ||
      !Object.hasOwn(entry, "data")
    ) {
      storage.removeItem(cacheKey(key));
      return null;
    }

    return entry;
  } catch {
    return null;
  }
};

const writeEntry = (key, data, storage = sessionStorage) => {
  try {
    storage.setItem(cacheKey(key), JSON.stringify({ data, savedAt: now() }));
  } catch {
    // Cache storage is an enhancement and must never block a successful read.
  }
};

export const clearSessionReadCache = (key, storage = sessionStorage) => {
  try {
    storage.removeItem(cacheKey(key));
  } catch {
    // Cache storage is an enhancement and must never block a user action.
  }
};

export const fetchWithSessionReadCache = async ({
  fetcher,
  key,
  maxAgeMs,
  storage = sessionStorage,
}) => {
  const cached = readEntry(key, storage);
  const isFresh = cached && now() - cached.savedAt <= maxAgeMs;

  if (isFresh) {
    return {
      data: cached.data,
      error: null,
      isStale: false,
      savedAt: cached.savedAt,
      source: "cache",
    };
  }

  try {
    const data = await fetcher();
    writeEntry(key, data, storage);
    return {
      data,
      error: null,
      isStale: false,
      savedAt: now(),
      source: "network",
    };
  } catch (error) {
    if (cached) {
      return {
        data: cached.data,
        error: toApiFailure(error),
        isStale: true,
        savedAt: cached.savedAt,
        source: "cache",
      };
    }
    throw toApiFailure(error);
  }
};
