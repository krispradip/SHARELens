/* =========================================================
   SERVICE: User Activity Service

   PURPOSE:
   Maintains the latest known login timestamp for prototype
   users and derives an inactivity-review status.

   BUSINESS MEANING:
   The same Last Login reference is used by the Ambassador,
   BU Lead and Programme Lead views so activity status is
   consistent across the platform.

   INPUTS:
   User ID, optional fallback timestamp.

   OUTPUTS:
   Last-login timestamp, days since login and activity status.

   BUSINESS RULE:
   60 days without a login triggers "Needs inactivity review".
   This does NOT automatically offboard or deactivate a user.
   A BU Lead / Programme Lead must verify the reason first.

   STORAGE:
   Browser localStorage for prototype demonstration only.

   PRODUCTION TARGET:
   Enterprise identity / authentication audit source.

   CHANGE IMPACT:
   Affects My Status, Ambassador population and lifecycle
   monitoring.
========================================================= */

const STORAGE_KEY = "sharelens-v0.12.0-user-activity";
export const INACTIVITY_REVIEW_DAYS = 60;

function readActivityStore() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );
  } catch {
    return {};
  }
}

function writeActivityStore(store) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store)
  );
}

export function recordLogin(
  userId,
  timestamp = new Date().toISOString()
) {
  if (!userId) return null;

  const store = readActivityStore();

  store[userId] = {
    ...(store[userId] || {}),
    lastLogin: timestamp
  };

  writeActivityStore(store);

  return timestamp;
}

export function getLastLogin(
  userId,
  fallback = ""
) {
  const store = readActivityStore();

  return (
    store[userId]?.lastLogin ||
    fallback ||
    ""
  );
}

export function daysSinceLogin(
  timestamp
) {
  if (!timestamp) return null;

  const value =
    new Date(timestamp);

  if (
    Number.isNaN(
      value.getTime()
    )
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(
      (
        Date.now() -
        value.getTime()
      ) /
      86400000
    )
  );
}

export function getActivityStatus(
  timestamp
) {
  const days =
    daysSinceLogin(timestamp);

  if (days === null) {
    return {
      label: "No login recorded",
      state: "unknown",
      days: null
    };
  }

  if (
    days >
    INACTIVITY_REVIEW_DAYS
  ) {
    return {
      label: "Needs inactivity review",
      state: "review",
      days
    };
  }

  return {
    label: "Active",
    state: "active",
    days
  };
}

export function formatLastLogin(
  timestamp
) {
  if (!timestamp) {
    return "No login recorded";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "No login recorded";
  }

  return date.toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );
}
