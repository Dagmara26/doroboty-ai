import { Component, createRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEY } from "./storage";
import { downloadText } from "./settings";

type Props = { children: ReactNode };
type State = { failed: boolean };

function savedScenario(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Last-resort screen for unexpected rendering errors. It replaces a blank page with recovery
 * steps. It never sends or logs scenario data; the browser save stays untouched.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  heading = createRef<HTMLHeadingElement>();

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidMount() {
    if (this.state.failed) this.heading.current?.focus();
  }

  componentDidUpdate(_: Props, previous: State) {
    if (this.state.failed && !previous.failed) this.heading.current?.focus();
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const saved = savedScenario();
    return (
      <main className="prototype-section">
        <h1 ref={this.heading} tabIndex={-1} className="outline-none">
          Coś poszło nie tak
        </h1>
        <p className="my-5">
          Ten ekran nie mógł się wyświetlić. Twój zapis w tej przeglądarce nie został zmieniony.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => window.location.reload()}>Odśwież stronę</Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.hash = "#/";
              window.location.reload();
            }}
          >
            Wróć na stronę główną
          </Button>
          {saved !== null && (
            <Button
              variant="outline"
              onClick={() => downloadText("doroboty-zapis-do-odzyskania.txt", saved, "text/plain")}
            >
              Pobierz kopię zapisu
            </Button>
          )}
        </div>
        <p className="my-5">
          Jeśli błąd się powtarza, napisz na kanale kursu AIPH3: pod jakim adresem i co robiłaś lub
          robiłeś tuż przed błędem. Nie wysyłaj danych osobowych.
        </p>
      </main>
    );
  }
}
