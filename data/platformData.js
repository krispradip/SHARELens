/* =========================================================
   MODULE: SHARE Lens Platform Data
   VERSION: v0.12.0

   PURPOSE:
   Centralises prototype configuration used by the new
   Ambassador experience.

   BUSINESS MEANING:
   Keeps KPI definitions, user context, training integration
   and knowledge source configuration separate from page UI.

   INPUTS:
   Prototype configuration maintained in this file.

   OUTPUTS:
   Read-only configuration consumed by pages and services.

   USED BY:
   Ambassador pages, user context service, reporting.

   CHANGE IMPACT:
   Changes can affect labels, targets, organisational context,
   integration destinations and KPI-driven recommendations.
========================================================= */

export const BUILD = {
  version: "0.12.0",
  date: "21 Oct 2026"
};


/* =========================================================
   COMPONENT: Prototype User Context

   PURPOSE:
   Provides stable identity and organisational metadata.

   BUSINESS MEANING:
   Authenticated users should not repeatedly enter known
   identity, BU, brand, store or location data.

   INPUTS:
   Authenticated role / user.

   OUTPUTS:
   Canonical prototype profile fields.

   CHANGE IMPACT:
   Changes appear in forms, submissions and reports.
========================================================= */
export const USERS = {
  ambassador: {
    userId: "USR-AMB-100245",
    staffId: "100245",
    employeeId: "100245",
    shareId: "9478400002450001",
    name: "Layla Haddad",
    initials: "LH",
    role: "Ambassador",
    country: "UAE",
    businessUnit: "Entertainment",
    brand: "VOX Cinemas",
    store: "Mall of the Emirates",
    location: "Mall of the Emirates",
    manager: "Ahmed Salah",
    accountStatus: "Active Ambassador",
    lastLogin: "2026-10-22T08:42:00+04:00"
  }
};


/* =========================================================
   COMPONENT: Ambassador KPI Configuration

   PURPOSE:
   Defines the four agreed home-screen KPIs.

   BUSINESS MEANING:
   These KPIs drive Ambassador focus and Next Best Actions.

   OUTPUTS:
   KPI cards, target gaps and action triggers.

   CHANGE IMPACT:
   A target change affects dashboard status and NBA logic.
========================================================= */
export const AMBASSADOR_KPIS = {
  performance: {
    key: "performance",
    label: "SHARE Performance Score",
    actual: 88.8,
    target: 86,
    unit: "%",
    trend: 4.2,
    description: "Overall Ambassador programme performance."
  },
  acquisition: {
    key: "acquisition",
    label: "SHARE Acquisition",
    actual: 42,
    target: 50,
    unit: "",
    trend: 12,
    description: "Members acquired through the Ambassador's personalised Adjust acquisition QR."
  },
  penetration: {
    key: "penetration",
    label: "Sales Penetration",
    actual: 36.4,
    target: 40,
    unit: "%",
    trend: -3.1,
    description: "SHARE sales penetration for the Ambassador's applicable operating scope."
  },
  servicePulse: {
    key: "servicePulse",
    label: "Service Pulse",
    actual: 92.1,
    target: 85,
    unit: "%",
    trend: 1.3,
    description: "Average applicable Service Pulse assessment score."
  }
};


/* =========================================================
   COMPONENT: Score Families

   PURPOSE:
   Records the agreed conceptual score model.

   IMPORTANT:
   Final business weightings are not hard-coded.
========================================================= */
export const SCORE_FAMILIES = {
  sharePerformance: {
    label: "SHARE Performance Score",
    components: ["SHARE Acquisition", "Sales Penetration", "Service Pulse"]
  },
  ambassadorPerformance: {
    label: "Ambassador Performance Score",
    components: ["Campaign Participation", "Broadcast Acknowledgement", "Feedback & Suggestions", "SHARE Wall Submission"]
  },
  trainingPerformance: {
    label: "Training Performance Score",
    components: ["Online Training Completion", "Knowledge Score", "Physical / In-Store Training Completion"]
  }
};


/* =========================================================
   COMPONENT: KPI Card Definitions

   PURPOSE:
   Provides one source of truth for the explanatory tooltip
   shown from KPI information icons across Ambassador,
   BU Lead and Programme Lead views.

   BUSINESS MEANING:
   The same KPI must mean the same thing regardless of the
   user's organisational scope.

   CHANGE IMPACT:
   Tooltip wording across all v0.12 user personas.
========================================================= */
export const KPI_CARD_DEFINITIONS = {
  sharePerformance:
    "SHARE Performance measures SHARERewards performance for the selected Ambassador or organisational scope. It brings together SHARE Acquisition, Sales Penetration and Service Pulse performance.",

  ambassadorPerformance:
    "Ambassador Performance measures participation in the Ambassador programme. It is based on Campaign Participation, Broadcast Acknowledgement, Feedback & Suggestions, and SHARE Wall Submission. The current prototype uses equal-weight target attainment across the four components.",

  trainingPerformance:
    "Training Performance measures learning and development performance. It brings together Online Training Completion, Knowledge Score, and Physical / In-Store Training Completion.",

  totalAmbassadors:
    "Total Ambassadors is the number of Ambassadors included in the current authorised organisational scope and selected filters.",

  activeRate:
    "Active Rate is the percentage of Ambassadors considered active based on recent platform activity. More than 60 days without a login triggers an inactivity review; it does not automatically offboard the Ambassador.",

  acquisition:
    "SHARE Acquisition is the number of SHARE members acquired through attributable Ambassador activity, including the Ambassador's personal acquisition QR. In production, attribution is expected to come from Adjust or the approved acquisition source.",

  salesPenetration:
    "Sales Penetration shows the proportion of applicable sales linked to SHARE activity within the selected operating scope. It is one of the three components of SHARE Performance.",

  servicePulse:
    "Service Pulse measures observed SHARE service behaviour through the applicable Service Pulse assessment. It is one of the three components of SHARE Performance.",

  trainingCompletion:
    "Training Completion shows completion of assigned online learning for the selected scope. It is one input into the broader Training Performance score, alongside Knowledge Score and Physical / In-Store Training Completion.",

  knowledgeScore:
    "Knowledge Score is the average result from applicable Knowledge Checks in the selected scope. It is one component of Training Performance.",

  campaignParticipation:
    "Campaign Participation measures the share of eligible programme campaigns in which the Ambassador participated. The current target is 75%.",

  broadcastAcknowledgement:
    "Broadcast Acknowledgement measures the share of programme broadcasts acknowledged by the Ambassador. The current target is 80%.",

  feedbackSuggestions:
    "Feedback & Suggestions measures the Ambassador's monthly contribution through submitted feedback and suggestions. The current combined target is two submissions per month.",

  shareWall:
    "SHARE Wall Submission measures whether the Ambassador has completed the expected SHARE Wall contribution for the reporting period."
};


/* =========================================================
   COMPONENT: Ambassador Performance Score

   PURPOSE:
   Defines the Ambassador-owned engagement measures agreed
   for the programme dashboard.

   BUSINESS MEANING:
   Measures participation in programme activity rather than
   service delivery outcomes.

   INPUTS:
   Campaign participation, broadcast acknowledgements,
   Feedback + Suggestions submissions and SHARE Wall updates.

   IMPORTANT:
   Final weighting is not yet confirmed. The prototype score
   is therefore a demo value, while each component is shown
   transparently underneath it.

   CHANGE IMPACT:
   Changes affect the Ambassador Performance card and future
   BU / Programme Lead roll-ups.
========================================================= */
export const AMBASSADOR_PERFORMANCE = {
  weightingMethod: "Equal-weight average of target attainment, capped at 100% per component",

  campaignParticipation: {
    participated: 3,
    available: 4,
    threshold: 75,
    label: "Campaign Participation",
    description:
      "Participation in campaigns launched by BU Leads or Programme Leads, including response-based campaigns such as nominations. The current participation threshold is 75%."
  },

  broadcastAcknowledgement: {
    acknowledged: 4,
    sent: 5,
    threshold: 80,
    positiveReactions: 3,
    negativeReactions: 1,
    label: "Broadcast Acknowledgement",
    description:
      "Acknowledgement of programme broadcasts using the configured response action, including thumbs-up / thumbs-down reactions. The current acknowledgement threshold is 80%."
  },

  feedbackSuggestions: {
    baselineFeedback: 1,
    baselineSuggestions: 0,
    monthlyThreshold: 2,
    label: "Feedback & Suggestions",
    description:
      "Feedback and Suggestions share one monthly threshold. Each Ambassador should submit at least 2 in total per month, in any combination."
  },

  shareWall: {
    submitted: 1,
    expected: 1,
    label: "SHARE Wall Submission",
    description:
      "Number of required SHARE Wall updates submitted for the current period."
  }
};


/* =========================================================
   COMPONENT: Acquisition Integration

   PURPOSE:
   Represents the Adjust-powered personal acquisition QR.

   SOURCE OF RECORD:
   Adjust.

   CHANGE IMPACT:
   Provider or URL changes affect acquisition launch only.
========================================================= */
export const ACQUISITION = {
  provider: "Adjust",
  qrReference: "ADJ-AMB-100245",
  membersAcquired: 42,
  target: 50,
  activeMemberRate: 81,
  attributedSpend: 18450
};


/* =========================================================
   COMPONENT: Training Integration

   PURPOSE:
   Separates online and physical learning.

   BUSINESS MEANING:
   Online training remains in Mitti / SafetyCulture while
   physical and in-store training is captured natively.

   CHANGE IMPACT:
   Launch URL changes affect the external learning button.
========================================================= */
export const TRAINING = {
  online: {
    provider: "Mitti / SafetyCulture",
    launchUrl: "https://app.safetyculture.com/",
    courses: [
      { id: "MITTI-001", title: "SHARE Customer Experience", progress: 100, status: "Completed", due: "15 Oct 2026", score: 96 },
      { id: "MITTI-002", title: "Product Knowledge", progress: 100, status: "Completed", due: "30 Sep 2026", score: 92 },
      { id: "MITTI-003", title: "Service Recovery Essentials", progress: 60, status: "In Progress", due: "26 Oct 2026", score: null }
    ]
  },
  physical: {
    provider: "SHARE Lens",
    sessionTypes: ["Training", "Huddle"]
  }
};


/* =========================================================
   COMPONENT: Knowledge Source Layer

   PURPOSE:
   Keeps the SHARE Lens knowledge experience independent
   from a single content repository.

   BUSINESS MEANING:
   Knowmax, Databricks, a training portal or another approved
   repository can feed the same SHARE Lens experience.
========================================================= */
export const KNOWLEDGE_SOURCES = [
  { id: "training-portal", name: "Training Portal", type: "Primary planned source", status: "Planned" },
  { id: "knowmax", name: "Knowmax", type: "Knowledge repository", status: "Available fallback" },
  { id: "databricks", name: "Databricks", type: "Approved data / insight source", status: "Potential source" }
];

export const KNOWLEDGE_ARTICLES = [
  { title: "What is SHARE?", category: "SHARE Basics", source: "Knowmax", updated: "18 Oct 2026" },
  { title: "How to introduce SHARE to a non-member", category: "Acquisition", source: "Training Portal", updated: "17 Oct 2026" },
  { title: "Earning and redeeming SHARE points", category: "SHARE Basics", source: "Knowmax", updated: "14 Oct 2026" },
  { title: "Service Pulse: expected customer behaviours", category: "Service Pulse", source: "Knowmax", updated: "12 Oct 2026" },
  { title: "Ambassador role and responsibilities", category: "Ambassador Program", source: "Training Portal", updated: "10 Oct 2026" }
];


/* =========================================================
   COMPONENT: Service Pulse Prototype Configuration

   PURPOSE:
   Provides the current four-scenario Service Pulse model.

   BUSINESS MEANING:
   The rubric remains stable while locations and cycles can
   vary. Target threshold should not fall below 85%.
========================================================= */
export const SERVICE_PULSE = {
  threshold: 85,
  scenarios: [
    "Existing SHARE Member & Has SHARE App",
    "Customer is NOT a SHARE Member / Does Not Have App",
    "SHARE Member Wants to Redeem SHARE Points",
    "General SHARE Query"
  ],
  questions: {
    "Existing SHARE Member & Has SHARE App": [
      "Professional greeting",
      "Initiated SHARE conversation / asked about the app",
      "Scanned SHARE ID correctly",
      "Transaction completed accurately",
      "Thanked customer for using SHARE"
    ],
    "Customer is NOT a SHARE Member / Does Not Have App": [
      "Professional greeting",
      "Asked whether customer has the SHARE app",
      "Invited customer to download SHARE",
      "Explained SHARE clearly in approximately 10 seconds",
      "Thanked the customer"
    ],
    "SHARE Member Wants to Redeem SHARE Points": [
      "Professional greeting",
      "Asked about the SHARE app",
      "Offered points redemption",
      "Verified live app rather than screenshot",
      "Confirmed points would still be earned if redemption was declined",
      "Thanked the customer"
    ],
    "General SHARE Query": [
      "Professional greeting",
      "Explained SHARE clearly in approximately 10 seconds",
      "Explained where SHARE can be used",
      "Explained earning and redeeming",
      "Invited customer to download the app"
    ]
  }
};


/* =========================================================
   COMPONENT: KPI-Driven Next Best Actions

   PURPOSE:
   Converts controlled KPI target gaps into approved actions.

   RULE:
   Do not infer external causes that SHARE does not control.
========================================================= */
export const NEXT_BEST_ACTIONS = [
  {
    kpi: "penetration",
    title: "Improve SHARE Sales Penetration",
    action: "Review the approved customer conversation guide and practise the non-member SHARE introduction."
  },
  {
    kpi: "acquisition",
    title: "Grow SHARE Acquisition",
    action: "Use your personalised Adjust QR and complete the acquisition techniques refresher."
  },
  {
    kpi: "servicePulse",
    title: "Improve Service Pulse",
    action: "Review the lowest-scoring Service Pulse behaviour and complete the linked corrective guidance."
  },
  {
    kpi: "performance",
    title: "Improve Ambassador Performance",
    action: "Review the below-target programme component contributing to your performance score."
  }
];


/* =========================================================
   COMPONENT: Ambassador Communications

   PURPOSE:
   Provides prototype Campaign, Broadcast and Reminder
   communications for the Ambassador experience.

   BUSINESS MEANING:
   BU Leads / Programme Leads can send programme activity
   that Ambassadors consume and acknowledge in one place.

   TYPES:
   - Campaign: requires participation / response.
   - Broadcast: requires acknowledgement / reaction.
   - Reminder: points the Ambassador to an outstanding task.

   OUTPUTS:
   Communications page, notification drawer and future
   Ambassador engagement metrics.

   CHANGE IMPACT:
   Changes affect notifications, Communications and the
   Ambassador engagement model.
========================================================= */

export const COMMUNICATIONS = [
  {
    id: "COM-001",
    type: "campaign",
    title: "Mother's Day — Nominate a Mum",
    summary: "Nominate a mum from your team who deserves to be recognised this Mother's Day.",
    sender: "Programme Lead",
    date: "22 Oct 2026",
    due: "28 Oct 2026",
    actionLabel: "Participate",
    reminderTarget: ""
  },
  {
    id: "COM-002",
    type: "broadcast",
    title: "SHARE Member Week",
    summary: "This week's programme focus is proactive SHARE conversations with every eligible customer.",
    sender: "Ahmed Salah · BU Lead",
    date: "21 Oct 2026",
    due: "",
    actionLabel: "Acknowledge",
    reminderTarget: ""
  },
  {
    id: "COM-003",
    type: "broadcast",
    title: "Service Pulse guidance updated",
    summary: "Review the latest Service Pulse guidance before your next assessment.",
    sender: "Service Delivery",
    date: "21 Oct 2026",
    due: "",
    actionLabel: "Acknowledge",
    reminderTarget: ""
  },
  {
    id: "COM-004",
    type: "reminder",
    title: "Service Recovery Essentials",
    summary: "2 days remaining to complete your assigned online training.",
    sender: "Training",
    date: "22 Oct 2026",
    due: "24 Oct 2026",
    actionLabel: "Open Training",
    reminderTarget: "training-online"
  },
  {
    id: "COM-005",
    type: "reminder",
    title: "Feedback / Suggestion monthly target",
    summary: "You need 2 Feedback or Suggestion submissions in total this month, in any combination.",
    sender: "SHARE Ambassador Programme",
    date: "22 Oct 2026",
    due: "31 Oct 2026",
    actionLabel: "Submit",
    reminderTarget: "feedback"
  }
];
