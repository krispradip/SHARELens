import { getSubmissions } from "./submissionService.js";
import { getCreatedCampaigns } from "./managementActionService.js";

/* =========================================================
   INTERACTION METRICS SERVICE
   Browser-based show-and-tell read model. Count completed
   native submissions (not clicks). Corporate deployment:
   swap this read model for a permission-filtered API and
   EKS-hosted backend connected to the corporate database.
   Illustrative historical totals remain separate.
========================================================= */

const TYPE_TO_KEY = {
  "feedback": "feedback",
  "suggestion": "suggestions",
  "share-wall": "shareWall",
  "physical-training": "physicalTraining",
  "service-pulse": "servicePulse",
  "manual-transaction": "manualTransactions",
  "campaign-participation": "campaignResponses",
  "broadcast-acknowledgement": "broadcastAcknowledgements",
  "knowledge-check": "knowledgeChecks"
};

export function getInteractionSnapshot(programmeLead = false) {
  const eligible = getSubmissions().filter(item =>
    programmeLead ||
    (item.context?.businessUnit === "Entertainment" &&
     item.context?.country === "UAE")
  );
  const counts = {
    feedback: 0,
    suggestions: 0,
    shareWall: 0,
    physicalTraining: 0,
    servicePulse: 0,
    manualTransactions: 0,
    campaignResponses: 0,
    broadcastAcknowledgements: 0,
    knowledgeChecks: 0,
    peopleReached: 0,
    totalActivities: 0,
    publishedCampaigns: 0,
    publishedBroadcasts: 0
  };
  const seen = new Set();
  for (const item of eligible) {
    const key = TYPE_TO_KEY[item.type];
    if (!key) continue;
    if (item.type === "campaign-participation" ||
        item.type === "broadcast-acknowledgement") {
      const person = item.context?.staffId || item.context?.userId || item.submissionId;
      const dedupeKey = item.type + ":" + item.data?.communicationId + ":" + person;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
    }
    counts[key]++;
    counts.totalActivities++;
    if (item.type === "physical-training") {
      counts.peopleReached += Math.max(0, Number(item.data?.teamMembersReached) || 0);
    }
  }

  const buBrands = new Set(["VOX Cinemas", "Magic Planet", "Ski Dubai / Attractions"]);
  const buStores = new Set(["Mall of the Emirates", "City Centre Mirdif", "City Centre Deira"]);
  for (const communication of getCreatedCampaigns()) {
    if (communication.status !== "Live") continue;
    if (!programmeLead) {
      const audience = String(communication.audience || "");
      if (!(audience === "All Ambassadors" ||
            audience === "Entertainment UAE" ||
            audience === "Selected Brand" ||
            audience === "Selected Store" ||
            (audience.startsWith("Brand:") && buBrands.has(audience.slice(6))) ||
            (audience.startsWith("Store:") && buStores.has(audience.slice(6))))) {
        continue;
      }
    }
    if (communication.type === "Campaign") counts.publishedCampaigns++;
    if (communication.type === "Broadcast") counts.publishedBroadcasts++;
  }
  return counts;
}
