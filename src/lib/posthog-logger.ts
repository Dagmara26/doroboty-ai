import posthog from "posthog-js";

const posthogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
);

type LogAttributes = Record<string, boolean | number | string>;

export function logPostHogOutcome(message: string, attributes: LogAttributes) {
  if (!posthogConfigured) return;
  posthog.logger.info(message, attributes);
}
