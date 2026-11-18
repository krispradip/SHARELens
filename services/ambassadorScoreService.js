import {
  AMBASSADOR_PERFORMANCE,
  COMMUNICATIONS
} from "../data/platformData.js";
import { getUserContext } from "./userContextService.js";
import { getSubmissions } from "./submissionService.js";
import { getPublishedCommunicationsForAmbassador } from "./managementActionService.js";

/*
  Single source of truth for the Ambassador Performance Score.
  Historical demonstration totals are separate from individually
  actionable communications (including seeded examples).
  Both thumbs-up and thumbs-down acknowledge a broadcast.
  Changing a reaction does not earn a second acknowledgement.
  Target attainment continues to be capped at 100%.
*/
export function getAmbassadorScoreSnapshotV012() {
  const profile = getUserContext("ambassador");
  const performance = AMBASSADOR_PERFORMANCE;
  const submissions = getSubmissions().filter(item =>
    item.context?.staffId === profile.staffId
  );
  const actionable = [
    ...COMMUNICATIONS,
    ...getPublishedCommunicationsForAmbassador(profile)
  ].filter(item => item.type === "campaign" || item.type === "broadcast");
  const activities = [...new Map(actionable.map(item => [item.id, item])).values()];
  const campaigns = activities.filter(item => item.type === "campaign");
  const broadcasts = activities.filter(item => item.type === "broadcast");
  const hasResponse = (id, type) => submissions.some(item =>
    item.type === type && item.data?.communicationId === id
  );

  const campaignAvailable = performance.campaignParticipation.available + campaigns.length;
  const campaignParticipated = performance.campaignParticipation.participated +
    campaigns.filter(item => hasResponse(item.id, "campaign-participation")).length;
  const broadcastsSent = performance.broadcastAcknowledgement.sent + broadcasts.length;
  const broadcastsAcknowledged = performance.broadcastAcknowledgement.acknowledged +
    broadcasts.filter(item => hasResponse(item.id, "broadcast-acknowledgement")).length;

  const campaignRate = Math.round(100 * campaignParticipated / Math.max(1, campaignAvailable));
  const acknowledgementRate = Math.round(100 * broadcastsAcknowledged / Math.max(1, broadcastsSent));
  const feedbackCount = performance.feedbackSuggestions.baselineFeedback +
    submissions.filter(item => item.type === "feedback").length;
  const suggestionCount = performance.feedbackSuggestions.baselineSuggestions +
    submissions.filter(item => item.type === "suggestion").length;
  const counts = { feedbackCount, suggestionCount, combined: feedbackCount + suggestionCount };
  const threshold = performance.feedbackSuggestions.monthlyThreshold;
  const combinedProgress = Math.min(100, 100 * counts.combined / Math.max(1, threshold));
  const wallSubmitted = performance.shareWall.submitted +
    submissions.filter(item => item.type === "share-wall").length;
  const wallRate = Math.min(100, 100 * wallSubmitted / Math.max(1, performance.shareWall.expected));

  // The approved demo score uses target-capped attainment.
  const campaignAttainment = Math.min(100, 100 * campaignRate /
    Math.max(1, performance.campaignParticipation.threshold));
  const acknowledgementAttainment = Math.min(100, 100 * acknowledgementRate /
    Math.max(1, performance.broadcastAcknowledgement.threshold));
  const feedbackSuggestionAttainment = Math.min(100, 100 * counts.combined /
    Math.max(1, threshold));
  const wallAttainment = Math.min(100, 100 * wallSubmitted /
    Math.max(1, performance.shareWall.expected));
  const ambassadorPerformanceScore =
    (campaignAttainment + acknowledgementAttainment + feedbackSuggestionAttainment + wallAttainment) / 4;
  const ambassadorScoreDecimals = Number.isInteger(ambassadorPerformanceScore) ? 0 : 1;
  return {
    counts, threshold, combinedProgress, campaignRate, acknowledgementRate,
    campaignAvailable, campaignParticipated, broadcastsSent, broadcastsAcknowledged,
    wallSubmitted, wallRate, campaignAttainment, acknowledgementAttainment,
    feedbackSuggestionAttainment, wallAttainment, ambassadorPerformanceScore,
    ambassadorScoreDecimals,
    ambassadorScoreDisplay: ambassadorPerformanceScore.toFixed(ambassadorScoreDecimals)
  };
}
