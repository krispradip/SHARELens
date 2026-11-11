import { getSubmissions } from "./submissionService.js";

/* =========================================================
   SERVICE: Management Action Service
   Owner: Pradip

   PURPOSE:
   Provides browser-based persistence for management-created
   Campaigns / Broadcasts and review actions.

   BUSINESS MEANING:
   Demonstrates the write path used by BU Leads and Programme
   Leads without coupling the UI to localStorage.

   PRODUCTION DATA REQUIREMENT:
   Replace localStorage implementation with authenticated API
   calls to the approved transactional datastore
   (PostgreSQL / Aurora / equivalent).

   EXPECTED PRODUCTION TABLES / ENTITIES:
   - communications
   - communication_audiences
   - communication_responses
   - ambassador_reviews
   - training_events
   - training_event_attendance
   - workflow_audit

   CHANGE IMPACT:
   Management campaign creation and review actions.
========================================================= */

const CAMPAIGN_KEY =
  "sharelens-v0.12.0-management-campaigns";

const REVIEW_KEY =
  "sharelens-v0.12.0-management-reviews";

const TRAINING_EVENT_KEY =
  "sharelens-v0.12.0-management-training-events";


function readJson(key, fallback) {
  try {
    return JSON.parse(
      localStorage.getItem(key) ||
      JSON.stringify(fallback)
    );
  } catch {
    return fallback;
  }
}


function writeJson(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}


export function getCreatedCampaigns() {
  return readJson(
    CAMPAIGN_KEY,
    []
  );
}


export function createManagementCampaign(
  payload
) {

  const records =
    getCreatedCampaigns();

  const created = {
    id:
      `COM-${String(Date.now()).slice(-8)}`,
    createdAt:
      new Date().toISOString(),
    status: "Live",
    sent: 0,
    participated: 0,
    rate: 0,
    ...payload
  };

  records.unshift(
    created
  );

  writeJson(
    CAMPAIGN_KEY,
    records.slice(0, 50)
  );

  return created;
}


/* =========================================================
   COMMUNICATION DELIVERY AND RESPONSE READ MODEL

   One browser: shared localStorage joins Management publishing
   with Ambassador Communications. When connected to corporate
   APIs, replace these functions with permission-filtered
   server endpoints and database-backed records. GitHub Pages
   cannot synchronize data across browsers or devices.
========================================================= */

function audienceMatches(audience, user) {
  const scope = String(audience || "All Ambassadors");
  if (scope === "All Ambassadors") return true;
  if (scope === "Entertainment UAE") {
    return user.businessUnit === "Entertainment" && user.country === "UAE";
  }
  if (scope.startsWith("Brand:")) {
    return user.brand === scope.slice("Brand:".length);
  }
  if (scope.startsWith("Store:")) {
    return user.store === scope.slice("Store:".length);
  }
  // Earlier pilot records used generic options without target identifiers.
  // Those older records remain visible to the sole testing Ambassador.
  return scope === "Selected Brand" || scope === "Selected Store";
}

function displayCommunicationDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function getPublishedCommunicationsForAmbassador(user) {
  return getCreatedCampaigns()
    .filter(record =>
      record.status === "Live" &&
      ["Campaign", "Broadcast"].includes(record.type) &&
      audienceMatches(record.audience, user || {})
    )
    .map(record => ({
      id: record.id,
      type: record.type.toLowerCase(),
      title: record.title,
      summary: record.message || "Please review and respond to this communication.",
      sender: record.publisherRole === "service"
        ? "Programme Lead"
        : "BU Lead",
      date: displayCommunicationDate(record.createdAt),
      due: displayCommunicationDate(record.end),
      actionLabel: record.type === "Campaign" ? "Participate" : "Acknowledge",
      reminderTarget: "",
      createdAt: record.createdAt,
      audience: record.audience
    }));
}

// Only observed responses are counted, never simulated recipients.
// Records are already newest-first; de-duplicate by Ambassador staff ID.
export function getCommunicationResponses(communicationId, type = "Campaign") {
  const submissionType = type === "Broadcast"
    ? "broadcast-acknowledgement"
    : "campaign-participation";
  const seen = new Set();
  return getSubmissions()
    .filter(item =>
      item.type === submissionType &&
      item.data?.communicationId === communicationId
    )
    .filter(item => {
      const person = item.context?.staffId || item.context?.userId || item.submissionId;
      if (seen.has(person)) return false;
      seen.add(person);
      return true;
    });
}

export function recordAmbassadorReview(
  ambassadorId,
  outcome
) {

  const reviews =
    readJson(
      REVIEW_KEY,
      []
    );

  const record = {
    reviewId:
      `REV-${String(Date.now()).slice(-8)}`,
    ambassadorId,
    outcome,
    reviewedAt:
      new Date().toISOString()
  };

  reviews.unshift(
    record
  );

  writeJson(
    REVIEW_KEY,
    reviews.slice(0, 100)
  );

  return record;
}


export function getAmbassadorReviews() {
  return readJson(
    REVIEW_KEY,
    []
  );
}


export function getCreatedTrainingEvents() {

  return readJson(
    TRAINING_EVENT_KEY,
    []
  );

}


export function createTrainingEvent(
  payload
) {

  const records =
    getCreatedTrainingEvents();

  const created = {
    id:
      `EVT-${String(Date.now()).slice(-8)}`,
    createdAt:
      new Date().toISOString(),
    status: "Scheduled",
    reached: 0,
    completion: "Not started",
    evidence: 0,
    ...payload
  };

  records.unshift(
    created
  );

  writeJson(
    TRAINING_EVENT_KEY,
    records.slice(0, 100)
  );

  return created;
}
