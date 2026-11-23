import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import {
  currentPerson,
  initialState,
  transition,
  type Action,
  type Person,
  type State,
} from "./model";
import { parseState, readState, saveState, type StoragePort } from "./storage";

const posthogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
);

function identifyPerson(person: Person) {
  if (!posthogConfigured) return;
  posthog.identify(person.id, { name: person.name, role: person.role });
}

function resetPosthog() {
  if (!posthogConfigured) return;
  posthog.reset();
}
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const latest = useRef(state);
  const restoredPerson = useRef(currentPerson(loaded.state));
  const restoredIdentityHandled = useRef(false);
  function commit(next: State, replace = false) {
    latest.current = next;
    setState(next);
    setError("");
    if (blocked && !replace) return;
    try {
      saveState(browserStorage(), next);
      setIssue("");
      if (replace) setBlocked(false);
    } catch (e) {
      setIssue((e as Error).message);
    }
  }
  function run(action: Action) {
    try {
      const previousPerson = currentPerson(latest.current);
      const next = transition(latest.current, action);
      const nextPerson = currentPerson(next);
      commit(next);

      if (action.type === "select_person" && previousPerson?.id !== nextPerson?.id) {
        if (previousPerson) resetPosthog();
        if (nextPerson) identifyPerson(nextPerson);
      }

      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    try {
      const previousPerson = currentPerson(latest.current);
      const next = parseState(raw);
      const nextPerson = currentPerson(next);
      commit(next, true);

      if (previousPerson?.id !== nextPerson?.id) {
        if (previousPerson) resetPosthog();
        if (nextPerson) identifyPerson(nextPerson);
      }

      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  useEffect(() => {
    if (restoredIdentityHandled.current) return;

    restoredIdentityHandled.current = true;
    if (restoredPerson.current) identifyPerson(restoredPerson.current);
  }, []);
  return {
    state,
    issue,
    error,
    blocked,
    original: loaded.original,
    run,
    importState,
    clearError: () => setError(""),
    reset: () => {
      if (currentPerson(latest.current)) resetPosthog();
      commit(initialState(), true);
    },
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
