import { computed, ref } from 'vue';

const STORAGE_KEY = 'jct-progress';

export const REQUIRED_MOSHMAN_PAGES = [
  '/work-history',
  '/art-gallery',
  '/about-josh',
  '/personal-projects',
  '/juke-box'
] as const;

type ProgressState = {
  visitedPages: string[];
  moshmanUnlocked: boolean;
};

const defaultState: ProgressState = {
  visitedPages: [],
  moshmanUnlocked: false
};

const canUseStorage = () => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

const readProgress = (): ProgressState => {
  if (!canUseStorage()) return defaultState;

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return defaultState;

    const parsed = JSON.parse(storedValue) as Partial<ProgressState>;

    return {
      visitedPages: Array.isArray(parsed.visitedPages) ? parsed.visitedPages : [],
      moshmanUnlocked: parsed.moshmanUnlocked === true
    };
  } catch {
    return defaultState;
  }
};

const progress = ref<ProgressState>(readProgress());

const writeProgress = () => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value));
  } catch {
    // Progress unlocks are nice-to-have persistence; route state still works for the current session.
  }
};

export const hasVisitedAllMoshmanPages = computed(() =>
  REQUIRED_MOSHMAN_PAGES.every((page) => progress.value.visitedPages.includes(page))
);

export const moshmanUnlocked = computed(() => progress.value.moshmanUnlocked || hasVisitedAllMoshmanPages.value);

export const isMoshmanUnlocked = () => moshmanUnlocked.value;

export const recordVisitedPage = (path: string) => {
  if (!REQUIRED_MOSHMAN_PAGES.includes(path as (typeof REQUIRED_MOSHMAN_PAGES)[number])) return;
  if (progress.value.visitedPages.includes(path)) return;

  progress.value = {
    ...progress.value,
    visitedPages: [...progress.value.visitedPages, path]
  };

  writeProgress();
};

export const unlockMoshman = () => {
  if (progress.value.moshmanUnlocked) return;

  progress.value = {
    ...progress.value,
    moshmanUnlocked: true
  };

  writeProgress();
};
