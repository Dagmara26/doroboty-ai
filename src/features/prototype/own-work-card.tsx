import type { OwnWork } from "./model";

const missing = "Nie opisano w zgłoszeniu.";

/**
 * Prepared own-work card (idea I7, test E5). Shows the candidate's own statements; an empty
 * statement is rendered as explicitly missing rather than inferred.
 */
export function OwnWorkCard({ work, headingLevel = 3 }: { work: OwnWork; headingLevel?: 3 | 4 }) {
  const Heading = `h${headingLevel}` as const;
  const rows: [string, string][] = [
    ["Co zrobił/a sam/a", work.self],
    ["Co robili inni", work.others],
    ["Rezultat i skąd o nim wie", work.result],
  ];
  return (
    <section className="own-work-card" aria-label="Karta własnej pracy">
      <Heading className="own-work-title">
        Własna praca <span>· {work.area}</span>
      </Heading>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className="own-work-row">
            <dt>{label}</dt>
            <dd data-missing={value ? undefined : ""}>{value || missing}</dd>
          </div>
        ))}
        <div className="own-work-row">
          <dt>Materiał</dt>
          <dd>
            {work.materialType}.
            {work.materialNote && <span className="own-work-note"> {work.materialNote}</span>}
            <span className="own-work-note"> Link usunięty przy anonimizacji.</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
