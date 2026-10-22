import { buildSubmissionContext } from "./userContextService.js";

/* =========================================================
   SERVICE: Submission Service

   PURPOSE:
   Creates and stores prototype operational submissions.

   BUSINESS MEANING:
   Demonstrates the future native workflow pattern:
   authenticated context + activity fields + timestamp +
   submission ID.

   STORAGE:
   Browser localStorage for prototype demonstration only.

   PRODUCTION TARGET:
   Secure API + enterprise data store / workflow service.

   CHANGE IMPACT:
   Storage schema changes affect Reports and recent activity.
========================================================= */

const STORAGE_KEY = "sharelens-v0.12.0-submissions";

export function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function createSubmission(type, payload = {}) {
  const all = getSubmissions();

  const submission = {
    submissionId: `SL-${type.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${Date.now()}`,
    type,
    status: payload.status || "Submitted",
    createdAt: new Date().toISOString(),
    context: buildSubmissionContext("ambassador"),
    data: { ...payload }
  };

  all.unshift(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 100)));

  return submission;
}

export function getSubmissionsByType(type) {
  return getSubmissions().filter(item => item.type === type);
}


/* =========================================================
   SERVICE: Submission Status Update

   PURPOSE:
   Updates an existing prototype submission by ID.

   BUSINESS MEANING:
   Supports visible workflow progression such as OneView
   ticket creation and final closure.

   INPUTS:
   Submission ID + partial status/data changes.

   OUTPUTS:
   Updated submission persisted to prototype local storage.

   CHANGE IMPACT:
   Used by workflow screens and activity reporting.
========================================================= */

export function updateSubmission(submissionId, changes = {}) {
  const all = getSubmissions();

  const index = all.findIndex(
    item => item.submissionId === submissionId
  );

  if (index === -1) {
    return null;
  }

  const current = all[index];

  all[index] = {
    ...current,
    ...changes,
    data: {
      ...current.data,
      ...(changes.data || {})
    }
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(all.slice(0, 100))
  );

  return all[index];
}
