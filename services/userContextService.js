import { USERS } from "../data/platformData.js";

/* =========================================================
   SERVICE: User Context Service

   PURPOSE:
   Provides authenticated user and organisational metadata
   to platform workflows.

   BUSINESS MEANING:
   Prevents Ambassadors from repeatedly entering known
   identity, BU, brand and store data.

   INPUTS:
   Role key.

   OUTPUTS:
   Profile and submission context.

   USED BY:
   Feedback, SHARE Wall, Manual Transactions, Training,
   Service Pulse and Reports.

   CHANGE IMPACT:
   Changes may affect all submissions, reporting hierarchy,
   permissions and analytics.
========================================================= */

export function getUserContext(role = "ambassador") {
  return { ...(USERS[role] || USERS.ambassador) };
}

export function buildSubmissionContext(role = "ambassador") {
  const user = getUserContext(role);

  return {
    userId: user.userId,
    staffId: user.staffId,
    employeeId: user.employeeId,
    shareId: user.shareId,
    ambassadorName: user.name,
    country: user.country,
    businessUnit: user.businessUnit,
    brand: user.brand,
    store: user.store,
    location: user.location
  };
}
