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


/* =========================================================
   MANAGEMENT DRILL-DOWN DATA

   PURPOSE:
   Prototype datasets for operational management screens.

   PRODUCTION DATA REQUIREMENT:
   Replace these arrays with repository/API responses. Keep
   the field contracts stable so the page modules do not need
   to be rewritten when persistence is connected.
========================================================= */

export const MANAGEMENT_AMBASSADORS = [
  {
    id: "AMB-100245",
    name: "Layla Haddad",
    staffId: "100245",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    store: "Mall of the Emirates",
    lastLogin: "22 Oct 2026 · 08:42",
    activity: "Active",
    sharePerformance: 91.2,
    ambassadorPerformance: 100,
    acquisition: 42,
    salesPenetration: 38.4,
    servicePulse: 94.0,
    trainingCompletion: 100,
    knowledgeScore: 96
  },
  {
    id: "AMB-100822",
    name: "Noor Hassan",
    staffId: "100822",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    store: "City Centre Mirdif",
    lastLogin: "20 Oct 2026 · 16:20",
    activity: "Active",
    sharePerformance: 86.4,
    ambassadorPerformance: 82.5,
    acquisition: 31,
    salesPenetration: 35.1,
    servicePulse: 89.4,
    trainingCompletion: 75,
    knowledgeScore: 88
  },
  {
    id: "AMB-100845",
    name: "Rania Ali",
    staffId: "100845",
    bu: "Entertainment",
    brand: "Magic Planet",
    store: "Mall of the Emirates",
    lastLogin: "04 Aug 2026 · 10:15",
    activity: "Needs inactivity review",
    sharePerformance: 79.8,
    ambassadorPerformance: 74.0,
    acquisition: 18,
    salesPenetration: 29.7,
    servicePulse: 81.5,
    trainingCompletion: 67,
    knowledgeScore: 79
  },
  {
    id: "AMB-100901",
    name: "Sami Omar",
    staffId: "100901",
    bu: "Entertainment",
    brand: "Magic Planet",
    store: "City Centre Deira",
    lastLogin: "18 Oct 2026 · 14:05",
    activity: "Active",
    sharePerformance: 88.1,
    ambassadorPerformance: 84.2,
    acquisition: 36,
    salesPenetration: 36.8,
    servicePulse: 91.1,
    trainingCompletion: 100,
    knowledgeScore: 91
  },
  {
    id: "AMB-200114",
    name: "Maha Karim",
    staffId: "200114",
    bu: "Retail",
    brand: "Carrefour",
    store: "City Centre Mirdif",
    lastLogin: "21 Oct 2026 · 11:45",
    activity: "Active",
    sharePerformance: 87.9,
    ambassadorPerformance: 83.5,
    acquisition: 51,
    salesPenetration: 34.8,
    servicePulse: 90.2,
    trainingCompletion: 92,
    knowledgeScore: 90
  },
  {
    id: "AMB-300071",
    name: "Sara Khan",
    staffId: "300071",
    bu: "Lifestyle",
    brand: "lululemon",
    store: "Mall of the Emirates",
    lastLogin: "30 Jul 2026 · 09:40",
    activity: "Needs inactivity review",
    sharePerformance: 84.7,
    ambassadorPerformance: 79.2,
    acquisition: 27,
    salesPenetration: 32.9,
    servicePulse: 87.8,
    trainingCompletion: 83,
    knowledgeScore: 84
  }
];


export const MANAGEMENT_CAMPAIGNS = [
  {
    id: "CMP-2026-021",
    type: "Campaign",
    title: "Mother's Day — Nominate a Mum",
    audience: "Entertainment UAE",
    start: "22 Oct 2026",
    end: "28 Oct 2026",
    status: "Live",
    sent: 238,
    participated: 188,
    rate: 79
  },
  {
    id: "BRD-2026-018",
    type: "Broadcast",
    title: "SHARE Member Week",
    audience: "Entertainment UAE",
    start: "21 Oct 2026",
    end: "31 Oct 2026",
    status: "Live",
    sent: 238,
    participated: 201,
    rate: 84
  },
  {
    id: "CMP-2026-019",
    type: "Campaign",
    title: "Service Hero Recognition",
    audience: "All Ambassadors",
    start: "10 Oct 2026",
    end: "20 Oct 2026",
    status: "Closed",
    sent: 1284,
    participated: 1017,
    rate: 79
  },
  {
    id: "BRD-2026-016",
    type: "Broadcast",
    title: "Service Pulse Guidance Update",
    audience: "All Ambassadors",
    start: "15 Oct 2026",
    end: "31 Oct 2026",
    status: "Live",
    sent: 1284,
    participated: 1089,
    rate: 85
  }
];


export const MANAGEMENT_TRAINING = {
  onlineCourses: [
    {
      title: "SHARE Customer Experience",
      assigned: 238,
      completed: 224,
      inProgress: 9,
      overdue: 5,
      completion: 94
    },
    {
      title: "Service Recovery Essentials",
      assigned: 118,
      completed: 91,
      inProgress: 19,
      overdue: 8,
      completion: 77
    },
    {
      title: "Product Knowledge",
      assigned: 238,
      completed: 230,
      inProgress: 4,
      overdue: 4,
      completion: 97
    }
  ],
  physicalSessions: [
    {
      id: "TRN-441",
      type: "Training",
      topic: "SHARE Member Onboarding",
      date: "20 Oct 2026",
      location: "Mall of the Emirates",
      ambassador: "Layla Haddad",
      reached: 18,
      completion: "81–99%",
      evidence: 2
    },
    {
      id: "HUD-219",
      type: "Huddle",
      topic: "Service Pulse",
      date: "18 Oct 2026",
      location: "City Centre Mirdif",
      ambassador: "Noor Hassan",
      reached: 11,
      completion: "61–80%",
      evidence: 1
    },
    {
      id: "TRN-438",
      type: "Training",
      topic: "SHARE Benefits",
      date: "17 Oct 2026",
      location: "City Centre Deira",
      ambassador: "Sami Omar",
      reached: 16,
      completion: "100%",
      evidence: 2
    }
  ]
};


export const MANAGEMENT_KNOWLEDGE_CHECKS = [
  {
    id: "KC-2026-08",
    title: "UAE | SHARE August Knowledge Check",
    period: "Aug 2026",
    responses: 265,
    participation: 88,
    score: 93.0,
    topGap: "SHARE earn rates across business units",
    status: "Closed"
  },
  {
    id: "KC-2026-Q4",
    title: "Q4 SHARE Knowledge Check",
    period: "Oct 2026",
    responses: 198,
    participation: 74,
    score: 89.4,
    topGap: "Receipt Scan and co-branded card",
    status: "Live"
  }
];


export const MANAGEMENT_ONBOARDING = [
  {
    id: "ONB-100822",
    name: "Noor Hassan",
    brand: "VOX Cinemas",
    store: "City Centre Mirdif",
    account: "Complete",
    firstLogin: "Complete",
    training: "In Progress",
    knowledge: "Pending",
    personalQr: "Pending",
    status: "Onboarding"
  },
  {
    id: "ONB-101002",
    name: "Aisha Rahman",
    brand: "Magic Planet",
    store: "City Centre Mirdif",
    account: "Complete",
    firstLogin: "Pending",
    training: "Pending",
    knowledge: "Pending",
    personalQr: "Pending",
    status: "Invited"
  }
];


export const MANAGEMENT_SUBMISSIONS = [
  {
    type: "Feedback",
    total: 33,
    thisMonth: 33,
    awaitingReview: 4,
    source: "SHARE Lens"
  },
  {
    type: "Suggestions",
    total: 18,
    thisMonth: 18,
    awaitingReview: 7,
    source: "SHARE Lens"
  },
  {
    type: "SHARE Wall",
    total: 9,
    thisMonth: 9,
    awaitingReview: 1,
    source: "SHARE Lens"
  },
  {
    type: "Physical Training / Huddles",
    total: 13,
    thisMonth: 13,
    awaitingReview: 2,
    source: "SHARE Lens"
  },
  {
    type: "Manual Transactions",
    total: 24,
    thisMonth: 24,
    awaitingReview: 5,
    source: "OneView"
  }
];


export const MANAGEMENT_RECOGNITION = [
  {
    rank: 1,
    ambassador: "Layla Haddad",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    performance: 100,
    acquisition: 42,
    recognition: "Service Pulse Champion"
  },
  {
    rank: 2,
    ambassador: "Maha Karim",
    bu: "Retail",
    brand: "Carrefour",
    performance: 96,
    acquisition: 51,
    recognition: "Acquisition Leader"
  },
  {
    rank: 3,
    ambassador: "Sami Omar",
    bu: "Entertainment",
    brand: "Magic Planet",
    performance: 92,
    acquisition: 36,
    recognition: "Training Champion"
  }
];
