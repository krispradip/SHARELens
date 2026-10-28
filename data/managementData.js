/* =========================================================
   SHARE LENS — MANAGEMENT DASHBOARD DATA CONTRACT
   Owner: Pradip

   PURPOSE:
   Provides prototype management metrics for BU Lead and
   Programme Lead dashboards through a production-shaped
   data contract.

   BUSINESS MEANING:
   The UI must not own management KPI values. In production,
   these fields are populated by APIs / repositories backed
   by operational databases, Databricks and approved source
   systems.

   PRODUCTION DATA REQUIREMENTS:
   - Ambassador master / identity:
     Entra ID / staff master + operational application DB
   - Campaigns / broadcasts / acknowledgements:
     SHARE Lens transactional DB (PostgreSQL / Aurora or
     approved equivalent)
   - Feedback / suggestions / SHARE Wall / physical training:
     SHARE Lens transactional DB
   - Online training:
     Mitti / SafetyCulture integration
   - Acquisition:
     Adjust attribution integration
   - Sales penetration:
     approved sales / loyalty source
   - Service Pulse:
     SHARE Lens Service Pulse store / approved analytics layer
   - Analytics / historical rollups:
     Databricks where appropriate
   - Media:
     approved object storage, referenced by database metadata

   CHANGE IMPACT:
   Management home dashboards and future drill-down pages.
========================================================= */

export const MANAGEMENT_TARGETS = {
  sharePerformance: 86,
  ambassadorPerformance: 80,
  salesPenetration: 40,
  servicePulse: 85,
  campaignParticipation: 75,
  broadcastAcknowledgement: 80,
  trainingCompletion: 90,
  knowledgeScore: 85,
  activeRate: 90
};


export const BU_LEAD_DASHBOARD = {
  scopeLabel: "Entertainment UAE",
  totalAmbassadors: 238,
  activeAmbassadors: 221,
  activeRate: 92.9,

  sharePerformance: 88.8,
  ambassadorPerformance: 84.5,
  acquisition: 1842,
  acquisitionTarget: 2100,
  salesPenetration: 36.4,
  servicePulse: 92.1,
  trainingCompletion: 91.0,
  knowledgeScore: 93.0,

  brands: [
    {
      name: "VOX Cinemas",
      ambassadors: 118,
      activeRate: 94.1,
      sharePerformance: 90.2,
      ambassadorPerformance: 86.8,
      acquisition: 932,
      salesPenetration: 38.6,
      servicePulse: 93.4
    },
    {
      name: "Magic Planet",
      ambassadors: 62,
      activeRate: 91.9,
      sharePerformance: 87.1,
      ambassadorPerformance: 82.6,
      acquisition: 481,
      salesPenetration: 35.2,
      servicePulse: 90.8
    },
    {
      name: "Ski Dubai / Attractions",
      ambassadors: 58,
      activeRate: 91.4,
      sharePerformance: 86.3,
      ambassadorPerformance: 81.9,
      acquisition: 429,
      salesPenetration: 34.7,
      servicePulse: 91.6
    }
  ],

  requiresAttention: [
    {
      severity: "High",
      title: "Sales penetration below target",
      detail: "VOX Cinemas · 36.4% vs 40% target",
      route: "team-performance"
    },
    {
      severity: "Medium",
      title: "17 online training assignments overdue",
      detail: "Follow up before the current learning cycle closes",
      route: "training-overview"
    },
    {
      severity: "Medium",
      title: "2 Ambassadors need inactivity review",
      detail: "No login recorded for more than 60 days",
      route: "ambassadors"
    }
  ],

  campaignSummary: {
    active: 2,
    participationRate: 78,
    broadcasts: 3,
    acknowledgementRate: 84
  },

  trainingSummary: {
    onlineCompletion: 91,
    physicalSessions: 13,
    peopleReached: 146,
    knowledgeScore: 93
  },

  submissions: {
    feedback: 33,
    suggestions: 18,
    shareWall: 9,
    physicalTraining: 13
  }
};


export const PROGRAMME_LEAD_DASHBOARD = {
  scopeLabel: "All authorised markets",
  totalAmbassadors: 1284,
  activeAmbassadors: 1172,
  activeRate: 91.3,

  sharePerformance: 88.8,
  ambassadorPerformance: 83.7,
  acquisition: 64230,
  acquisitionTarget: 70000,
  salesPenetration: 36.4,
  servicePulse: 92.1,
  trainingCompletion: 87.5,
  knowledgeScore: 86.2,

  businessUnits: [
    {
      name: "Entertainment",
      ambassadors: 341,
      activeRate: 92.4,
      sharePerformance: 90.1,
      ambassadorPerformance: 85.7,
      salesPenetration: 38.1,
      servicePulse: 94.2
    },
    {
      name: "Retail",
      ambassadors: 298,
      activeRate: 89.3,
      sharePerformance: 87.6,
      ambassadorPerformance: 82.1,
      salesPenetration: 34.6,
      servicePulse: 91.0
    },
    {
      name: "Lifestyle",
      ambassadors: 246,
      activeRate: 93.1,
      sharePerformance: 88.9,
      ambassadorPerformance: 84.8,
      salesPenetration: 33.7,
      servicePulse: 89.6
    },
    {
      name: "Shopping Malls",
      ambassadors: 212,
      activeRate: 90.5,
      sharePerformance: 86.3,
      ambassadorPerformance: 80.9,
      salesPenetration: 31.2,
      servicePulse: 88.9
    },
    {
      name: "Other MAF",
      ambassadors: 187,
      activeRate: 91.8,
      sharePerformance: 89.4,
      ambassadorPerformance: 83.4,
      salesPenetration: 37.5,
      servicePulse: 93.1
    }
  ],

  requiresAttention: [
    {
      severity: "High",
      title: "Shopping Malls sales penetration",
      detail: "31.2% against 40% programme target",
      route: "group-attention"
    },
    {
      severity: "High",
      title: "Training completion below target",
      detail: "87.5% overall · target 90%",
      route: "group-training"
    },
    {
      severity: "Medium",
      title: "Knowledge gaps concentrated in 5 stores",
      detail: "Review question-level gaps and corrective learning",
      route: "group-gaps"
    }
  ],

  campaignSummary: {
    active: 4,
    participationRate: 78.4,
    submissions: 1248,
    participatingStores: 308
  },

  recognition: {
    sparks: 2341,
    servicePulseWinners: 12,
    topAmbassadors: 25
  },

  trainingSummary: {
    onlineCompletion: 87.5,
    inPersonSessions: 42,
    evaluationScore: 4.6,
    knowledgeScore: 86.2
  },

  servicePulseSummary: {
    score: 92.1,
    assessments: 1024,
    compliantStores: 94.3
  },

  submissions: {
    feedback: 4821,
    shareWall: 2348,
    physicalTraining: 1932,
    manualTransactions: 846,
    trainingEvaluations: 2671
  }
};
