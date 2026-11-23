import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { MatchScore } from "./match-score";
import { currentPerson, openDecisionStages, stageLabels, type Application } from "./model";
import { OwnWorkCard } from "./own-work-card";
import { Empty, PageTitle } from "./shell";
import { usePrototype } from "./store";
import { Field } from "./workspace";

const ALL_JOBS = "all";

/** Employer candidate list with one-click invite/defer decisions (test E5). */
export function EmployerCandidateList() {
  const { state, run } = usePrototype();
  const person = currentPerson(state)!;
  const [query, setQuery] = useState("");
  const [jobId, setJobId] = useState(ALL_JOBS);
  const [announcement, setAnnouncement] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);
  const statusRefs = useRef(new Map<string, HTMLElement>());

  const own = state.applications.filter((x) => x.companyId === person.companyId);
  const jobOptions = [
    { value: ALL_JOBS, label: "Wszystkie oferty" },
    ...state.jobs
      .filter((job) => own.some((a) => a.jobId === job.id))
      .map((job) => ({ value: job.id, label: job.title })),
  ];
  const needle = query.toLocaleLowerCase("pl");
  const applications = own.filter(
    (x) =>
      (jobId === ALL_JOBS || x.jobId === jobId) &&
      `${x.candidateName} ${x.jobTitle}`.toLocaleLowerCase("pl").includes(needle),
  );
  const count = (test: (a: Application) => boolean) => applications.filter(test).length;

  useLayoutEffect(() => {
    if (focusId) {
      statusRefs.current.get(focusId)?.focus({ preventScroll: true });
      setFocusId(null);
    }
  }, [focusId]);

  function decide(a: Application, stage: "interview_invited" | "deferred") {
    if (run({ type: "stage", applicationId: a.id, stage, note: "" })) {
      setAnnouncement(`${a.candidateName}: ${stageLabels[stage]}.`);
      setFocusId(a.id);
    }
  }

  return (
    <>
      <PageTitle>Kandydaci</PageTitle>
      <div className="candidate-list-tools">
        <Field label="Szukaj kandydata lub oferty">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
        </Field>
        <Field label="Oferta">
          <FormSelect
            ariaLabel="Oferta"
            value={jobId}
            options={jobOptions}
            onValueChange={(value) => setJobId(value || ALL_JOBS)}
          />
        </Field>
      </div>
      <p className="candidate-counts" aria-label="Podsumowanie decyzji">
        <span>Kandydaci: {applications.length}</span>
        <span>Bez decyzji: {count((a) => a.stage === "submitted" || a.stage === "reviewed")}</span>
        <span>Zaproszeni: {count((a) => a.stage === "interview_invited")}</span>
        <span>Odłożeni: {count((a) => a.stage === "deferred")}</span>
      </p>
      <div className="mt-6 space-y-4">
        {applications.length ? (
          applications.map((a) => {
            const open = openDecisionStages.includes(a.stage);
            return (
              <article
                className="prototype-panel ph-no-capture"
                key={a.id}
                aria-labelledby={`candidate-${a.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl" id={`candidate-${a.id}`}>
                      <Link
                        className="font-semibold text-[var(--gui-link)]"
                        to={`/app/kandydaci/${a.id}`}
                      >
                        {a.candidateName}
                      </Link>
                    </h2>
                    <p className="my-3 text-muted-foreground">{a.jobTitle}</p>
                    <p>
                      <span
                        className="record-stage"
                        tabIndex={-1}
                        ref={(node) => {
                          if (node) statusRefs.current.set(a.id, node);
                          else statusRefs.current.delete(a.id);
                        }}
                      >
                        {stageLabels[a.stage]}
                      </span>
                    </p>
                  </div>
                  <MatchScore score={a.score} />
                </div>
                {a.summary ? (
                  <p className="mt-4 text-muted-foreground">{a.summary}</p>
                ) : (
                  <p className="candidate-excerpt">{a.answer}</p>
                )}
                {state.ownWorkCard && a.ownWork && <OwnWorkCard work={a.ownWork} />}
                {open && (
                  <div className="candidate-row-actions">
                    <Button onClick={() => decide(a, "interview_invited")}>
                      Zaproś na rozmowę
                      <span className="sr-only">: {a.candidateName}</span>
                    </Button>
                    {a.stage !== "deferred" && (
                      <Button variant="outline" onClick={() => decide(a, "deferred")}>
                        Odłóż<span className="sr-only">: {a.candidateName}</span>
                      </Button>
                    )}
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <Empty>Brak aplikacji spełniających kryteria.</Empty>
        )}
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
