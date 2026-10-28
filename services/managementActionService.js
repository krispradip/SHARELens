/* =========================================================
   SERVICE: Management Action Service
   Owner: Pradip

   PURPOSE:
   Provides prototype persistence for management-created
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
   - workflow_audit

   CHANGE IMPACT:
   Management campaign creation and review actions.
========================================================= */

const CAMPAIGN_KEY =
  "sharelens-v0.12.0-management-campaigns";

const REVIEW_KEY =
  "sharelens-v0.12.0-management-reviews";


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
