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
    accountStatus: "Active Ambassador"
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
    label: "Performance Score",
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
    components: ["SHARE Penetration", "Service Pulse", "SHARE Acquisitions"]
  },
  ambassadorPerformance: {
    label: "Ambassador Performance Score",
    components: ["Campaign Participation", "Broadcast Acknowledgement", "Feedback", "SHARE Wall Submission"]
  },
  trainingPerformance: {
    label: "Training Performance Score",
    components: ["Online Training Completion", "Knowledge Score", "In-Store Training Completion"]
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
