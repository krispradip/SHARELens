import { analyseInteraction } from "./agents/agentOrchestrator.js";

import {
  renderAmbassadorHomeV012,
  renderServicePulseV012,
  renderFeedbackV012,
  renderSuggestionsV012,
  renderManualTransactionV012,
  renderShareWallV012,
  renderTrainingLandingV012,
  renderOnlineTrainingV012,
  renderPhysicalTrainingV012,
  renderKnowledgeV012,
  renderKnowledgeResultsV012,
  renderReportsV012,
  renderStatusV012,
  renderCommunicationsV012,
  setServicePulseScenarioV012,
  submitServicePulseFormV012,
  submitFeedbackFormV012,
  submitSuggestionFormV012,
  submitManualTransactionFormV012,
  closeManualTransactionFormV012,
  submitShareWallFormV012,
  submitPhysicalTrainingFormV012,
  setSelectedCommunicationV012,
  participateInCampaignFormV012,
  reactToBroadcastFormV012,
  initializeV12Motion
} from "./pages/ambassadorPages.js";

const app = document.getElementById("app");


/* =========================================================
   BUILD
========================================================= */

const APP_VERSION = "0.12.0";
const APP_BUILD_DATE = "21 Oct 2026";

const SHARE_POINT_AED_VALUE = 0.10;


/* =========================================================
   STATE
========================================================= */

let currentRole = null;
let currentPage = "home";

let expandedInteractionId = null;

let notificationDrawerOpen = false;
let unreadNotifications = 5;

let servicePulseTab = "dashboard";
let servicePulseDetailId = null;

let knowledgeEditorOpen = false;

let knowledgeCheckQuestion = 1;
let knowledgeCheckScore = 0;
let knowledgeCheckAnswered = false;


/* =========================================================
   PERIOD
========================================================= */

const currentPerformancePeriod = {
  preset: "MTD",
  from: "01 Oct 2026",
  to: "14 Oct 2026"
};


const performanceSummary = {
  score: 86,
  assessedInteractions: 12,
  visibleInteractions: 3,
  serviceQuality: 86,
  sopAdherence: 92,
  compliance: 100
};


/* =========================================================
   SHARE EARN RULES
========================================================= */

const shareEarnRates = {

  luxury: {
    label: "Luxury Brands",
    pointsPerSpend: 1,
    spendUnit: 10,
    rule: "1 SHARE Point per AED 10 spent"
  },

  nonLuxury: {
    label: "Non-Luxury / Shopping Malls",
    pointsPerSpend: 2,
    spendUnit: 10,
    rule: "2 SHARE Points per AED 10 spent"
  },

  lifestyle: {
    label: "Lifestyle Brands",
    pointsPerSpend: 10,
    spendUnit: 10,
    rule: "10 SHARE Points per AED 10 spent"
  },

  leisure: {
    label: "Leisure & Entertainment",
    pointsPerSpend: 30,
    spendUnit: 100,
    rule: "30 SHARE Points per AED 100 spent"
  },

  carrefour: {
    label: "Carrefour Groceries",
    pointsPerSpend: 2.5,
    spendUnit: 10,
    rule: "2.5 SHARE Points per AED 10 spent"
  }

};


/* =========================================================
   USERS
========================================================= */

const prototypeUsers = {

  ambassador: {
    login: "100245",
    password: "demo123",
    name: "Layla Haddad",
    initials: "LH",
    role: "Ambassador",
    identityType: "Staff ID",
    staffId: "100245",

    businessUnit: "Entertainment",
    brand: "VOX Cinemas",
    store: "Mall of the Emirates",
    manager: "Ahmed Salah",

    accountStatus: "Active Ambassador",

    shareMembersOnboarded: 42,
    shareMemberTarget: 50,

    memberSpend: 18450,
    memberPointsEarned: 5620,

    engagementPoints: 185
  },


  manager: {
    login: "ahmed.salah@maf.ae",
    password: "demo123",
    name: "Ahmed Salah",
    initials: "AS",
    role: "BU Lead / Trainer",
    identityType: "Microsoft Entra ID",

    businessUnit: "Entertainment",
    country: "UAE",
    scope: "Entertainment UAE"
  },


  service: {
    login: "marian.zakhary@maf.ae",
    password: "demo123",
    name: "Marian Zakhary",
    initials: "MZ",
    role: "Service Delivery",
    identityType: "Microsoft Entra ID",

    scope: "MAF Malls"
  },


  admin: {
    login: "admin@maf.ae",
    password: "demo123",
    name: "System Administrator",
    initials: "PA",
    role: "Platform Admin",
    identityType: "Microsoft Entra ID",

    scope: "Platform"
  }

};


/* =========================================================
   DEFINITIONS
========================================================= */

const metricDefinitions = {

  performance:
    "A consolidated view of service performance for the selected period, based on applicable assessed interactions and performance measures available for the selected person or organisational scope.",

  serviceQuality:
    "How well customer interactions are handled, including communication, issue understanding, resolution quality and customer handling.",

  sop:
    "How consistently required service process steps were followed correctly.",

  compliance:
    "Whether mandatory controls, policies and critical requirements were completed correctly.",

  knowledge:
    "The average result from completed Knowledge Checks in the selected period.",

  training:
    "The completion status of formal learning assigned to the Ambassador for the current learning plan.",

  acquisition:
    "Members acquired through attributable Ambassador activity, including the Ambassador Personal QR Code.",

  memberSpend:
    "Transaction value generated by members attributed to the Ambassador or selected organisational scope.",

  memberPoints:
    "SHARE Points earned by acquired members. The points belong to the members; acquisition contribution is attributed to the Ambassador.",

  pointsValue:
    `Estimated monetary value of SHARE Points earned by members. Prototype conversion: 1 SHARE Point = AED ${SHARE_POINT_AED_VALUE.toFixed(2)}.`,

  activeAmbassadors:
    "Ambassadors currently active within the selected organisational scope.",

  trainingCompletion:
    "Percentage of assigned learning completed within the selected organisational scope and period.",

  servicePulse:
    "Average assessment percentage across Service Pulse submissions included in the current filtered view.",

  servicePulseSubmissions:
    "Number of completed Service Pulse assessment records included in the current filtered view.",

  employeesAssessed:
    "Unique frontline employees captured in Service Pulse assessments in the current filtered view.",

  locationsAssessed:
    "Unique locations included in the current Service Pulse view.",

  sharePoints:
    "SHARE Points are calculated from the member transaction using the applicable category earn rule. Promotions add applicable bonus points."
};


/* =========================================================
   NOTIFICATIONS
========================================================= */

const ambassadorNotifications = [

  {
    id: "N-001",
    communicationId: "COM-001",
    type: "campaign",
    title: "Mother's Day — Nominate a Mum",
    detail: "Programme campaign: nominate a mum from your team.",
    date: "Today",
    action: "Open Campaign",
    target: "communications",
    unread: true
  },

  {
    id: "N-002",
    communicationId: "COM-002",
    type: "broadcast",
    title: "SHARE Member Week",
    detail: "New programme broadcast from your BU Lead.",
    date: "Today",
    action: "Acknowledge",
    target: "communications",
    unread: true
  },

  {
    id: "N-003",
    communicationId: "COM-003",
    type: "broadcast",
    title: "Service Pulse guidance updated",
    detail: "Please review and acknowledge the latest guidance.",
    date: "Today",
    action: "Acknowledge",
    target: "communications",
    unread: true
  },

  {
    id: "N-004",
    communicationId: "COM-004",
    type: "reminder",
    title: "Service Recovery Essentials",
    detail: "2 days remaining to complete your assigned training.",
    date: "Today",
    action: "View Reminder",
    target: "communications",
    unread: true
  },

  {
    id: "N-005",
    communicationId: "COM-005",
    type: "reminder",
    title: "Feedback / Suggestion monthly target",
    detail: "Reminder to complete your monthly Ambassador participation target.",
    date: "Today",
    action: "View Reminder",
    target: "communications",
    unread: true
  }

];


/* =========================================================
   CUSTOMER INTERACTIONS
========================================================= */

const interactions = [

  {
    id: "INT-1001",
    date: "10 Oct 2026",
    channel: "Voice",
    duration: "08:42",
    process: "Refund Handling",
    score: 86,
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check"
  },

  {
    id: "INT-0998",
    date: "07 Oct 2026",
    channel: "Chat",
    duration: "06:14",
    process: "Refund Status",
    score: 94,
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check"
  },

  {
    id: "INT-0984",
    date: "02 Oct 2026",
    channel: "Voice",
    duration: "07:31",
    process: "Cancellation Refund",
    score: 47,
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check"
  }

];


/* =========================================================
   TRAINING
========================================================= */

const assignedTraining = [

  {
    title: "SHARE Customer Experience",
    duration: "20 min",
    assigned: "01 Oct 2026",
    due: "15 Oct 2026",
    status: "Completed",
    dueState: "Completed 10 Oct 2026",
    dueClass: "complete"
  },

  {
    title: "Product Knowledge",
    duration: "30 min",
    assigned: "20 Sep 2026",
    due: "30 Sep 2026",
    status: "Completed",
    dueState: "Completed 28 Sep 2026",
    dueClass: "complete"
  },

  {
    title: "SHARE Member Onboarding",
    duration: "20 min",
    assigned: "20 Sep 2026",
    due: "01 Oct 2026",
    status: "Completed",
    dueState: "Completed 25 Sep 2026",
    dueClass: "complete"
  },

  {
    title: "Service Recovery Essentials",
    duration: "25 min",
    assigned: "12 Oct 2026",
    due: "16 Oct 2026",
    status: "In Progress",
    dueState: "2 days left",
    dueClass: "due-soon"
  }

];


const recommendedDevelopment = {

  title: "Refund Handling Refresher",

  trainingDuration: "15 min",

  triggerInteractions: [
    "INT-1001",
    "INT-0984"
  ],

  reason:
    "Recommended because refund timeline communication was identified as a recurring opportunity.",

  knowledgeCheck: {
    title: "Refund Handling Knowledge Check",
    duration: "5 min",
    questions: 10,

    purpose:
      "Verify that the refresher learning has been understood."
  }

};


/* =========================================================
   KNOWLEDGE
========================================================= */

const knowledgeRepository = [

  ["Refund Process", "Refunds & Cancellations", "Process Guidance", "02 Oct 2026", "v3.2"],
  ["Cancellation & Refund Policy", "Refunds & Cancellations", "Policy", "12 Sep 2026", "v2.4"],
  ["Customer Verification", "Customer Service", "Service Guidance", "19 Sep 2026", "v2.1"],
  ["Customer Escalation Process", "Customer Service", "SOP", "25 Sep 2026", "v4.0"],
  ["Service Recovery Guidelines", "Customer Service", "Service Guidance", "06 Oct 2026", "v3.1"],
  ["SHARE Benefits", "SHARE Benefits", "Product Knowledge", "09 Oct 2026", "v5.0"],
  ["Earning SHARE Points", "SHARE Benefits", "Product Knowledge", "01 Oct 2026", "v3.0"],
  ["Redeeming SHARE Points", "SHARE Benefits", "Product Knowledge", "01 Oct 2026", "v3.0"],
  ["Ambassador Role & Responsibilities", "Ambassador Program", "Program Guide", "05 Oct 2026", "v2.0"],
  ["Personal QR Code Guidelines", "Ambassador Program", "Program Guide", "07 Oct 2026", "v1.3"],
  ["SHARE Member Onboarding Guide", "Ambassador Program", "Program Guide", "08 Oct 2026", "v2.2"],
  ["Customer Data Protection", "Policies", "Policy", "21 Sep 2026", "v4.1"],
  ["Complaint Handling", "SOPs", "SOP", "29 Sep 2026", "v3.4"],
  ["Customer Communication Standards", "SOPs", "SOP", "30 Sep 2026", "v3.7"]

].map(
  ([title, category, type, updated, version]) => ({
    title,
    category,
    type,
    updated,
    version
  })
);


/* =========================================================
   AMBASSADOR CONTRIBUTION
========================================================= */

const ambassadorContribution = [

  {
    name: "Layla Haddad",
    staffId: "100245",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "Mall of the Emirates",
    location: "VOX MOE",

    members: 42,
    target: 50,

    memberSpend: 18450,
    memberPoints: 5620,

    performance: 86,
    training: 100,
    engagement: 185,

    status: "Active"
  },

  {
    name: "Noor Hassan",
    staffId: "100822",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Mirdif",
    location: "VOX CCM",

    members: 50,
    target: 50,

    memberSpend: 22180,
    memberPoints: 6840,

    performance: 91,
    training: 100,
    engagement: 240,

    status: "Active"
  },

  {
    name: "Rania Ali",
    staffId: "100845",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Deira",
    location: "VOX CCD",

    members: 29,
    target: 50,

    memberSpend: 12740,
    memberPoints: 3825,

    performance: 74,
    training: 82,
    engagement: 135,

    status: "Active"
  },

  {
    name: "Sami Omar",
    staffId: "100901",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Al Zahia",
    location: "VOX CCAZ",

    members: 44,
    target: 50,

    memberSpend: 19760,
    memberPoints: 5980,

    performance: 88,
    training: 94,
    engagement: 210,

    status: "Active"
  },

  {
    name: "Sara Khan",
    staffId: "100928",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Deira",
    location: "VOX CCD",

    members: 21,
    target: 50,

    memberSpend: 9130,
    memberPoints: 2715,

    performance: 72,
    training: 69,
    engagement: 120,

    status: "Active"
  }

];


const managerAcquisitionScope = {
  members: 1842,
  target: 2100,
  memberSpend: 812450,
  memberPoints: 248350
};


const serviceAcquisitionScope = {
  members: 7320,
  target: 8200,
  memberSpend: 3218900,
  memberPoints: 965670
};


/* =========================================================
   PERFORMANCE DATA
========================================================= */

const managerPerformanceBreakdown = [

  ["BU", "Entertainment", 86, 238],
  ["Brand", "VOX Cinemas", 87, 172],
  ["Mall", "Mall of the Emirates", 91, 38],
  ["Mall", "City Centre Mirdif", 88, 31],
  ["Mall", "City Centre Deira", 74, 27],
  ["Mall", "City Centre Al Zahia", 86, 24]

].map(
  ([level, name, score, ambassadors]) => ({
    level,
    name,
    score,
    ambassadors
  })
);


const managerAttentionItems = [

  ["Critical", "City Centre Deira", "Refund SLA knowledge", "8 Ambassadors"],
  ["High", "City Centre Mirdif", "Training overdue", "5 Ambassadors"],
  ["Medium", "Mall of the Emirates", "Service Recovery", "3 Ambassadors"]

].map(
  ([severity, location, issue, affected]) => ({
    severity,
    location,
    issue,
    affected
  })
);


const managerKnowledgeGaps = [

  ["Refund SLA", 34, 72, "Service Quality", "Declining"],
  ["Customer Verification", 18, 81, "SOP Adherence", "Stable"],
  ["SHARE Benefits", 11, 84, "Member Acquisition", "Improving"]

].map(
  ([theme, ambassadors, knowledgeScore, relatedPerformance, trend]) => ({
    theme,
    ambassadors,
    knowledgeScore,
    relatedPerformance,
    trend
  })
);


/* =========================================================
   SERVICE PULSE
========================================================= */

const servicePulseSubmissionsData = [

  {
    id: "SP-001",
    date: "13 Oct 2026",
    inspector: "Abdullah Mukhtar",
    bu: "Retail",
    brand: "Carrefour",
    location: "City Centre Mirdif",
    employee: "Leonor Guirit",
    counter: "N/A",
    scenario: "Existing SHARE Member",
    score: 2,
    totalScore: 16
  },

  {
    id: "SP-002",
    date: "12 Oct 2026",
    inspector: "Abdullah Mukhtar",
    bu: "Retail",
    brand: "Carrefour",
    location: "City Centre Mirdif",
    employee: "Regline",
    counter: "138",
    scenario: "Existing SHARE Member",
    score: 6,
    totalScore: 16
  },

  {
    id: "SP-003",
    date: "12 Oct 2026",
    inspector: "Dimitri Abdo",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "Jhoan",
    counter: "06",
    scenario: "Points Redemption",
    score: 15,
    totalScore: 17
  },

  {
    id: "SP-004",
    date: "11 Oct 2026",
    inspector: "Dimitri Abdo",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "Phiona",
    counter: "6",
    scenario: "Points Redemption",
    score: 5,
    totalScore: 17,
    note:
      "Customer interaction began with payment method rather than a welcome. Redemption journey was then discussed."
  },

  {
    id: "SP-005",
    date: "10 Oct 2026",
    inspector: "Dimitri Abdo",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "Arizza",
    counter: "06",
    scenario: "Existing SHARE Member",
    score: 11,
    totalScore: 16,
    note:
      "SHARE was not initially named when the app was discussed."
  },

  {
    id: "SP-006",
    date: "08 Oct 2026",
    inspector: "Dimitri Abdo",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "Juvie",
    counter: "22",
    scenario: "Existing SHARE Member",
    score: 13,
    totalScore: 16,
    note:
      "Greeting was positive but customer warmth could be improved."
  },

  {
    id: "SP-007",
    date: "07 Oct 2026",
    inspector: "Shahnawaz Ahmed",
    bu: "Unspecified",
    brand: "Unspecified",
    location: "Location not captured",
    employee: "Not captured",
    counter: "N/A",
    scenario: "General SHARE Query",
    score: 8,
    totalScore: 23
  },

  {
    id: "SP-008",
    date: "07 Oct 2026",
    inspector: "Mahmoud Mohamed",
    bu: "Retail",
    brand: "Carrefour",
    location: "City Centre Mirdif",
    employee: "Sheryl",
    counter: "Counter 28",
    scenario: "Existing SHARE Member",
    score: 7,
    totalScore: 16
  },

  {
    id: "SP-009",
    date: "07 Oct 2026",
    inspector: "Mahmoud Mohamed",
    bu: "Retail",
    brand: "Carrefour",
    location: "City Centre Mirdif",
    employee: "Leonor",
    counter: "Counter 11",
    scenario: "Existing SHARE Member",
    score: 7,
    totalScore: 16
  },

  {
    id: "SP-010",
    date: "07 Oct 2026",
    inspector: "Abdullah Mukhtar",
    bu: "Entertainment",
    brand: "Explorer",
    location: "Location not captured",
    employee: "N/A",
    counter: "N/A",
    scenario: "General SHARE Query",
    score: 15,
    totalScore: 16
  },

  {
    id: "SP-011",
    date: "07 Oct 2026",
    inspector: "Demo Christine",
    bu: "Retail",
    brand: "LEGO",
    location: "Mall of the Emirates",
    employee: "Not captured",
    counter: "N/A",
    scenario: "New Member Opportunity",
    score: 15,
    totalScore: 16
  },

  {
    id: "SP-012",
    date: "07 Oct 2026",
    inspector: "Ricah Yburan",
    bu: "Entertainment",
    brand: "Magic Planet",
    location: "City Centre Mirdif",
    employee: "Hossam",
    counter: "POS 1",
    scenario: "New Member Opportunity",
    score: 13,
    totalScore: 16
  },

  {
    id: "SP-013",
    date: "07 Oct 2026",
    inspector: "Abigail Espiritu",
    bu: "Entertainment",
    brand: "VOX",
    location: "City Centre Mirdif",
    employee: "Menelle",
    counter: "Counter 4",
    scenario: "New Member Opportunity",
    score: 6,
    totalScore: 16
  },

  {
    id: "SP-014",
    date: "07 Oct 2026",
    inspector: "Dimitri Abdo",
    bu: "Lifestyle",
    brand: "Lululemon",
    location: "Mall of the Emirates",
    employee: "XY",
    counter: "1",
    scenario: "General SHARE Query",
    score: 16,
    totalScore: 16
  },

  {
    id: "SP-015",
    date: "07 Oct 2026",
    inspector: "Demo Christine",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "N/A",
    counter: "2",
    scenario: "New Member Opportunity",
    score: 15,
    totalScore: 16
  },

  {
    id: "SP-016",
    date: "07 Oct 2026",
    inspector: "Mahmoud Mohamed",
    bu: "Retail",
    brand: "Carrefour",
    location: "City Centre Mirdif",
    employee: "Ahmed",
    counter: "21",
    scenario: "Existing SHARE Member",
    score: 4,
    totalScore: 16
  },

  {
    id: "SP-017",
    date: "07 Oct 2026",
    inspector: "Beverly Anacleto",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "XYC",
    counter: "1",
    scenario: "Points Redemption",
    score: 6,
    totalScore: 17
  },

  {
    id: "SP-018",
    date: "07 Oct 2026",
    inspector: "Beverly Anacleto",
    bu: "Retail",
    brand: "Lululemon",
    location: "Mall of the Emirates",
    employee: "May",
    counter: "3",
    scenario: "General SHARE Query",
    score: 6,
    totalScore: 16
  },

  {
    id: "SP-019",
    date: "07 Oct 2026",
    inspector: "Reem Gamal",
    bu: "Entertainment",
    brand: "LEGO",
    location: "Mall of the Emirates",
    employee: "Moh",
    counter: "3",
    scenario: "General SHARE Query",
    score: 10,
    totalScore: 14
  },

  {
    id: "SP-020",
    date: "07 Oct 2026",
    inspector: "Rosalie Mabasa",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "Not captured",
    counter: "N/A",
    scenario: "New Member Opportunity",
    score: 16,
    totalScore: 16
  },

  {
    id: "SP-021",
    date: "07 Oct 2026",
    inspector: "Ghaith Toutounji",
    bu: "Retail",
    brand: "Carrefour",
    location: "Mall of the Emirates",
    employee: "Samer",
    counter: "1",
    scenario: "General SHARE Query",
    score: 16,
    totalScore: 16
  }

];


const servicePulseScenarios = [

  {
    id: "existing",
    title: "Existing SHARE Member",
    description:
      "Customer is already a SHARE member and has the SHARE app.",

    questions: [
      "Did the staff greet the customer clearly and professionally?",
      "Did the staff initiate the SHARE conversation?",
      "Did the staff ask to scan the SHARE ID?",
      "Was the transaction processed accurately?",
      "Did the staff thank the customer for using SHARE?"
    ]
  },

  {
    id: "new",
    title: "New Member Opportunity",
    description:
      "Customer is not a SHARE member and does not have the SHARE app.",

    questions: [
      "Did the staff greet the customer clearly and professionally?",
      "Did the staff ask whether the customer has the SHARE app?",
      "Did the staff invite the customer to download the app?",
      "Did the staff clearly explain SHARE within 10 seconds?",
      "Did the staff close the interaction appropriately?"
    ]
  },

  {
    id: "redemption",
    title: "Points Redemption",
    description:
      "Customer is a SHARE member and wants to redeem SHARE Points.",

    questions: [
      "Did the staff greet the customer clearly and professionally?",
      "Did the staff ask whether the customer has the SHARE app?",
      "Did the staff offer SHARE Points redemption?",
      "Did the staff verify that the app was live and not a screenshot?",
      "If redemption was declined, did the staff explain that points would still be earned?",
      "Did the staff close the interaction appropriately?"
    ]
  },

  {
    id: "general",
    title: "General SHARE Query",
    description:
      "Customer asks a non-transactional question about SHARE.",

    questions: [
      "Did the staff greet the customer clearly and professionally?",
      "Did the staff clearly explain SHARE within 10 seconds?",
      "Did the staff explain where SHARE can be used?",
      "Did the staff mention earning and redeeming points?",
      "Did the staff invite the customer to download the app?"
    ]
  }

];


const servicePulseBehaviourAnalytics = [

  {
    behaviour: "Professional greeting",
    yes: 76,
    no: 24,
    na: 0,
    trend: "Stable"
  },

  {
    behaviour: "Initiate SHARE conversation",
    yes: 69,
    no: 31,
    na: 0,
    trend: "Needs Attention"
  },

  {
    behaviour: "Ask / scan SHARE ID",
    yes: 72,
    no: 28,
    na: 0,
    trend: "Opportunity"
  },

  {
    behaviour: "Explain SHARE clearly",
    yes: 74,
    no: 26,
    na: 0,
    trend: "Opportunity"
  },

  {
    behaviour: "Invite app download",
    yes: 81,
    no: 19,
    na: 0,
    trend: "Strong"
  },

  {
    behaviour: "Explain earning / redemption",
    yes: 78,
    no: 22,
    na: 0,
    trend: "Stable"
  },

  {
    behaviour: "Close / thank customer",
    yes: 84,
    no: 16,
    na: 0,
    trend: "Strong"
  }

];


/* =========================================================
   COMMUNICATIONS / HUB
========================================================= */

const communicationsFeed = [

  ["SHARE Member Week", "Announcement", "13 Oct 2026", "221 / 238", 198, 74, 18],
  ["New Service Recovery Guide", "Knowledge Update", "09 Oct 2026", "238 / 238", 215, 61, 11]

].map(
  ([title, type, date, reach, views, likes, comments]) => ({
    title,
    type,
    date,
    reach,
    views,
    likes,
    comments
  })
);


const ambassadorHubSubmissions = [

  ["Feedback", 18, 4, "Alida"],
  ["Suggestion", 24, 7, "Alida"],
  ["In-Store Training", 13, 2, "Alida"],
  ["SHARE Walls", 9, 1, "Alida"]

].map(
  ([type, submissions, open, integration]) => ({
    type,
    submissions,
    open,
    integration
  })
);


/* =========================================================
   NAVIGATION
========================================================= */

const navigation = {

  ambassador: [

    {
      title: "",
      items: [
        ["home", "Dashboard"]
      ]
    },

    {
      title: "Service Delivery",
      items: [
        ["service-pulse", "Service Pulse"]
      ]
    },

    {
      title: "Ambassador Actions",
      items: [
        ["communications", "Communications"],
        ["feedback", "Feedback"],
        ["suggestions", "Suggestions"],
        ["manual-transaction", "Manual Transaction"],
        ["share-wall", "SHARE Wall"]
      ]
    },

    {
      title: "Training & Knowledge",
      items: [
        ["training", "Training"],
        ["training-online", "Online Training", "child"],
        ["training-physical", "Physical / In-Store", "child"],
        ["knowledge", "Knowledge Base"]
      ]
    },

    {
      title: "My Activity",
      items: [
        ["reports", "Reports"],
        ["status", "My Status"]
      ]
    }

  ],


  manager: [

    {
      title: "",
      items: [
        ["home", "Home"]
      ]
    },

    {
      title: "Performance",
      items: [
        ["team-performance", "Performance"],
        ["team-attention", "Requires Attention"]
      ]
    },

    {
      title: "Training & Knowledge",
      items: [
        ["training-overview", "Training Overview"],
        ["knowledge-gaps", "Knowledge Gaps"],
        ["manager-knowledge", "Knowledge Base"]
      ]
    },

    {
      title: "Ambassador Program",
      items: [
        ["ambassadors", "Ambassadors"],
        ["manager-onboarding", "Onboarding & Offboarding"],
        ["manager-acquisition", "Acquisition"],
        ["manager-communications", "Communications"],
        ["manager-hub", "Ambassador Hub"]
      ]
    }

  ],


  service: [

    {
      title: "",
      items: [
        ["home", "Home"]
      ]
    },

    {
      title: "Service Delivery",
      items: [
        ["group-performance", "Performance"],
        ["group-attention", "Requires Attention"],
        ["service-pulse", "Service Pulse"],
        ["audit", "Service Audit / Mystery Shop"],
        ["group-actions", "Actions"]
      ]
    },

    {
      title: "Training & Knowledge",
      items: [
        ["group-training", "Training"],
        ["group-gaps", "Knowledge Gaps"],
        ["group-knowledge", "Knowledge Base"]
      ]
    },

    {
      title: "Ambassador Program",
      items: [
        ["group-ambassadors", "Ambassadors"],
        ["group-onboarding", "Onboarding & Offboarding"],
        ["group-acquisition", "Acquisition"],
        ["group-communications", "Communications"],
        ["group-hub", "Ambassador Hub"],
        ["group-recognition", "Recognition / Leaderboard"]
      ]
    }

  ],


  admin: [

    {
      title: "",
      items: [
        ["home", "Platform Overview"]
      ]
    },

    {
      title: "Identity & Access",
      items: [
        ["users-access", "Users & Access"],
        ["roles", "Roles & Permissions"],
        ["identity", "Identity Providers"]
      ]
    },

    {
      title: "AI Platform",
      items: [
        ["ai-agents", "AI Agents"],
        ["agent-config", "Agent Configuration"],
        ["knowledge-sources", "Knowledge Sources"]
      ]
    },

    {
      title: "Platform",
      items: [
        ["integrations", "Integrations"],
        ["frameworks", "Assessment Frameworks"],
        ["notifications", "Notifications"],
        ["engagement-leaderboard", "Engagement Leaderboard"],
        ["audit-log", "Audit Log"]
      ]
    }

  ]

};


/* =========================================================
   FORMATTERS
========================================================= */

function formatNumber(value, decimals = 0) {

  return Number(value).toLocaleString(
    undefined,
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  );

}


function formatPoints(value) {

  return Number(value).toLocaleString(
    undefined,
    {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2
    }
  );

}


function formatAED(value) {

  return `AED ${Number(value).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }
  )}`;

}


function pointsToAED(points) {

  return Number(points) * SHARE_POINT_AED_VALUE;

}


function percentage(score, total) {

  if (!total) return 0;

  return (
    Number(score) /
    Number(total)
  ) * 100;

}


function average(values) {

  if (!values.length) return 0;

  return (
    values.reduce(
      (sum, value) =>
        sum + Number(value),
      0
    ) /
    values.length
  );

}


/* =========================================================
   AUTH
========================================================= */

function setLoginMessage(message, type = "error") {

  const node =
    document.getElementById(
      "login-error"
    );

  if (!node) return;

  node.textContent = message;

  node.className =
    `login-error ${type}`;

}


function signIn() {

  const login =
    document
      .getElementById("login-id")
      .value
      .trim()
      .toLowerCase();

  const password =
    document
      .getElementById("login-password")
      .value;


  const matchedRole =
    Object
      .keys(prototypeUsers)
      .find(role => {

        const user =
          prototypeUsers[role];

        return (
          user.login.toLowerCase() === login &&
          user.password === password
        );

      });


  if (!matchedRole) {

    setLoginMessage(
      "The email / Staff ID or password is incorrect."
    );

    return;

  }


  loginAsRole(matchedRole);

}


function continueWithSSO() {

  const login =
    document
      .getElementById("login-id")
      .value
      .trim()
      .toLowerCase();


  const matchedRole =
    Object
      .keys(prototypeUsers)
      .find(role => {

        const user =
          prototypeUsers[role];

        return (
          user.identityType === "Microsoft Entra ID" &&
          user.login.toLowerCase() === login
        );

      });


  if (!matchedRole) {

    setLoginMessage(
      "Enter one of the corporate prototype accounts to demonstrate Microsoft SSO.",
      "info"
    );

    return;

  }


  loginAsRole(matchedRole);

}


function loginAsRole(role) {

  currentRole = role;

  currentPage = "home";

  expandedInteractionId = null;

  notificationDrawerOpen = false;

  renderCurrentPage();

}


function signOut() {

  location.reload();

}


/* =========================================================
   TOP BAR
========================================================= */

function topBar() {

  const user =
    prototypeUsers[currentRole];


  return `
    <header class="topbar">

      <div class="topbar-left">

        <button
          class="mobile-menu-button"
          onclick="toggleMobileNav()"
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div class="topbar-logo">
          SL
        </div>

        <div class="topbar-brand">

          <div class="topbar-brand-line">

            <strong>
              SHARE Lens
            </strong>

            <span class="header-version">
              v${APP_VERSION}
            </span>

          </div>

          <span>
            See. Understand. Act.
          </span>

        </div>

      </div>


      <div class="user-header">

        ${
          currentRole === "ambassador"
            ? `
              <button
                class="notification-button"
                onclick="toggleNotificationDrawer()"
                aria-label="Notifications"
              >

                ◇

                ${
                  unreadNotifications > 0
                    ? `
                      <span class="notification-count">
                        ${unreadNotifications}
                      </span>
                    `
                    : ""
                }

              </button>
            `
            : ""
        }

        <div class="user-avatar">
          ${user.initials}
        </div>

        <div class="user-details">

          <strong>
            ${user.name}
          </strong>

          <span>
            ${user.role}
          </span>

        </div>

        <button
          class="switch-role"
          onclick="signOut()"
        >
          Sign out
        </button>

      </div>

    </header>
  `;

}


/* =========================================================
   SIDEBAR
========================================================= */

function sidebar() {

  return `
    <aside
      id="sidebar"
      class="sidebar"
    >

      <div class="mobile-sidebar-header">

        <div>

          <strong>
            SHARE Lens
          </strong>

          <span>
            ${prototypeUsers[currentRole].role}
          </span>

        </div>

        <button
          onclick="closeMobileNav()"
        >
          ×
        </button>

      </div>


      ${navigation[currentRole]
        .map(group => `

          ${
            group.title
              ? `
                <div class="sidebar-title">
                  ${group.title}
                </div>
              `
              : ""
          }


          ${group.items
            .map(item => `

              <div
                class="nav-item ${
                  currentPage === item[0]
                    ? "active"
                    : ""
                } ${
                  item[2] === "child"
                    ? "nav-child"
                    : ""
                }"

                onclick="navigateTo('${item[0]}')"
              >
                ${item[1]}
              </div>

            `)
            .join("")}

        `)
        .join("")}


      <div class="sidebar-version">

        <span>
          Prototype
        </span>

        <strong>
          v${APP_VERSION}
        </strong>

      </div>

    </aside>
  `;

}


/* =========================================================
   SHELL
========================================================= */

function renderShell(content) {

  app.innerHTML = `
    <div
      id="workspace"
      class="workspace"
    >

      ${topBar()}

      <div class="workspace-body">

        ${sidebar()}

        <div
          class="mobile-nav-overlay"
          onclick="closeMobileNav()"
        ></div>

        <main class="content">
          ${content}
        </main>

        ${notificationDrawer()}

        ${
          notificationDrawerOpen
            ? `
              <div
                class="notification-overlay"
                onclick="toggleNotificationDrawer()"
              ></div>
            `
            : ""
        }

      </div>

    </div>
  `;

}


function toggleMobileNav() {

  const workspace =
    document.getElementById(
      "workspace"
    );

  if (!workspace) return;

  workspace.classList.toggle(
    "mobile-nav-open"
  );

}


function closeMobileNav() {

  const workspace =
    document.getElementById(
      "workspace"
    );

  if (!workspace) return;

  workspace.classList.remove(
    "mobile-nav-open"
  );

}


/* =========================================================
   COMMON UI
========================================================= */

function pageTitle(
  label,
  title,
  subtitle
) {

  return `
    <div class="page-heading">

      <span class="section-label">
        ${label}
      </span>

      <h1>
        ${title}
      </h1>

      <p>
        ${subtitle}
      </p>

    </div>
  `;

}


function infoIcon(text) {

  return `
    <span class="info-wrap">

      <button
        class="info-icon"
        onclick="toggleInfo(event)"
      >
        i
      </button>

      <span class="metric-popover">
        ${text}
      </span>

    </span>
  `;

}


function toggleInfo(event) {

  event.stopPropagation();

  const wrap =
    event.currentTarget.closest(
      ".info-wrap"
    );

  if (!wrap) return;


  document
    .querySelectorAll(
      ".info-wrap.open"
    )
    .forEach(item => {

      if (item !== wrap) {

        item.classList.remove(
          "open"
        );

      }

    });


  wrap.classList.toggle(
    "open"
  );

}


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".info-wrap"
      )
    ) {

      document
        .querySelectorAll(
          ".info-wrap.open"
        )
        .forEach(item => {

          item.classList.remove(
            "open"
          );

        });

    }

  }
);


function metricCard(
  title,
  value,
  detail,
  definition = ""
) {

  return `
    <section class="dashboard-card metric-card">

      <div class="metric-label-row">

        <span>
          ${title}
        </span>

        ${
          definition
            ? infoIcon(definition)
            : ""
        }

      </div>

      <strong>
        ${value}
      </strong>

      <small>
        ${detail}
      </small>

    </section>
  `;

}


function profileLine(
  label,
  value
) {

  return `
    <div class="profile-line">

      <span>
        ${label}
      </span>

      <strong>
        ${value}
      </strong>

    </div>
  `;

}


function showToast(message) {

  let toast =
    document.getElementById(
      "prototype-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "prototype-toast";

    toast.className =
      "prototype-toast";

    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.classList.add(
    "visible"
  );


  setTimeout(() => {

    toast.classList.remove(
      "visible"
    );

  }, 2200);

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function notificationDrawer() {

  if (
    currentRole !== "ambassador"
  ) {

    return "";

  }


  return `
    <aside
      class="notification-drawer ${
        notificationDrawerOpen
          ? "open"
          : ""
      }"
    >

      <div class="notification-drawer-header">

        <div>

          <span class="section-label">
            MY UPDATES
          </span>

          <h3>
            Notifications
          </h3>

        </div>

        <button
          class="drawer-close"
          onclick="toggleNotificationDrawer()"
        >
          ×
        </button>

      </div>


      ${ambassadorNotifications
        .map(item => `

          <div class="notification-item">

            <div class="notification-type-icon">
              ${notificationIcon(item.type)}
            </div>

            <div>

              <div class="notification-meta-row">
                <span class="notification-type-tag ${item.type}">
                  ${item.type === "campaign"
                    ? "Campaign"
                    : item.type === "broadcast"
                      ? "Broadcast"
                      : "Reminder"
                  }
                </span>

                <span class="notification-date">
                  ${item.date}
                </span>
              </div>

              <strong>
                ${item.title}
              </strong>

              <p>
                ${item.detail}
              </p>

              <button
                class="text-button"
                onclick="handleNotificationAction('${item.target}', '${item.id}')"
              >
                ${item.action}
              </button>

            </div>

          </div>

        `)
        .join("")}

    </aside>
  `;

}


function notificationIcon(type) {

  const icons = {
    campaign: "C",
    broadcast: "B",
    reminder: "R"
  };

  return icons[type] || "•";

}


function toggleNotificationDrawer() {

  notificationDrawerOpen =
    !notificationDrawerOpen;

  renderCurrentPage();

}


function handleNotificationAction(
  target,
  notificationId
) {

  const item =
    ambassadorNotifications
      .find(
        notification =>
          notification.id ===
          notificationId
      );


  if (item) {

    item.unread = false;

    unreadNotifications =
      ambassadorNotifications
        .filter(
          notification =>
            notification.unread
        )
        .length;

    setSelectedCommunicationV012(
      item.communicationId
    );

  }


  notificationDrawerOpen =
    false;

  navigateTo(
    target ||
    "communications"
  );

}


/* =========================================================
   AMBASSADOR JOURNEY
========================================================= */

function compactJourney() {

  const steps = [
    "Onboarded",
    "Mandatory Training",
    "Knowledge Check",
    "Personal QR Code"
  ];


  return `
    <div class="compact-journey">

      <div class="compact-journey-heading">

        <span>
          Ambassador Journey
        </span>

        <strong>
          Complete
        </strong>

      </div>

      <div class="compact-journey-track">

        ${steps.map(
          (step, index) => `

            <div class="compact-journey-step">

              <span class="compact-journey-check">
                ✓
              </span>

              <span class="compact-journey-label">
                ${step}
              </span>

            </div>

            ${
              index <
              steps.length - 1
                ? `
                  <div class="compact-journey-line"></div>
                `
                : ""
            }

          `
        ).join("")}

      </div>

    </div>
  `;

}


/* =========================================================
   AMBASSADOR HOME
========================================================= */

function ambassadorHome() {

  const user =
    prototypeUsers.ambassador;


  const achievement =
    Math.round(
      (
        user.shareMembersOnboarded /
        user.shareMemberTarget
      ) * 100
    );


  return `
    <div class="ambassador-home-header">

      <div>

        <span class="section-label">
          MY SHARE
        </span>

        <h1>
          Good morning, Layla
        </h1>

        <p>
          Your Ambassador progress.
        </p>

      </div>

      ${compactJourney()}

    </div>


    <div class="home-kpi-grid">

      ${homeMetric(
        "Performance Score",
        "86%",
        "Strong",
        "performance",
        metricDefinitions.performance
      )}

      ${homeMetric(
        "Knowledge Score",
        "94%",
        "Strong",
        "performance",
        metricDefinitions.knowledge
      )}

      ${homeMetric(
        "Training",
        "100%",
        "Completed",
        "training",
        metricDefinitions.training
      )}


      <section
        class="dashboard-card home-metric-card"
        onclick="navigateTo('status')"
      >

        <div class="metric-label-row">

          <span>
            SHARE Acquisition
          </span>

          ${infoIcon(
            metricDefinitions.acquisition
          )}

        </div>

        <strong>
          ${user.shareMembersOnboarded}

          <small>
            / ${user.shareMemberTarget}
          </small>
        </strong>

        <div class="mini-progress-track">

          <div
            class="mini-progress-fill"
            style="width:${achievement}%"
          ></div>

        </div>

        <div class="home-metric-footer">

          <span>
            ${achievement}% of target
          </span>

          <span>
            View →
          </span>

        </div>

      </section>

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              RECENT ACTIVITY
            </span>

            <h3>
              What to review
            </h3>

          </div>

          <button
            class="small-button"
            onclick="toggleNotificationDrawer()"
          >
            ${unreadNotifications} updates
          </button>

        </div>


        <div
          class="home-action-card"
          onclick="openPerformanceInteraction('INT-0984')"
        >

          <div>

            <strong>
              Cancellation Refund interaction
            </strong>

            <p>
              47% · Needs Attention
            </p>

          </div>

          <span>
            Review →
          </span>

        </div>


        <div
          class="home-action-card"
          onclick="navigateTo('training')"
        >

          <div>

            <strong>
              Refund Handling Refresher
            </strong>

            <p>
              Triggered by INT-1001 and INT-0984
            </p>

          </div>

          <span>
            Open →
          </span>

        </div>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          MY STATUS
        </span>

        <h3>
          Ambassador profile
        </h3>

        ${profileLine(
          "Status",
          "Active Ambassador"
        )}

        ${profileLine(
          "Personal QR Code",
          "Active"
        )}

        ${profileLine(
          "Engagement Points",
          user.engagementPoints
        )}

        ${profileLine(
          "Brand",
          user.brand
        )}

        ${profileLine(
          "Store",
          user.store
        )}

        <button
          class="profile-action-button"
          onclick="navigateTo('status')"
        >
          View My Profile
        </button>

      </section>

    </div>
  `;

}


function homeMetric(
  title,
  value,
  status,
  target,
  definition
) {

  return `
    <section
      class="dashboard-card home-metric-card"
      onclick="navigateTo('${target}')"
    >

      <div class="metric-label-row">

        <span>
          ${title}
        </span>

        ${infoIcon(definition)}

      </div>

      <strong>
        ${value}
      </strong>

      <div class="home-metric-footer">

        <span class="metric-positive">
          ${status}
        </span>

        <span>
          View →
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   AMBASSADOR PERFORMANCE
========================================================= */

function ambassadorPerformance() {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "My Performance",
      "Understand your performance, what is driving it and what to do next."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Performance Score",
        "86%",
        "Overall service performance",
        metricDefinitions.performance
      )}

      ${metricCard(
        "Service Quality",
        "86%",
        "Customer handling",
        metricDefinitions.serviceQuality
      )}

      ${metricCard(
        "SOP Adherence",
        "92%",
        "Process adherence",
        metricDefinitions.sop
      )}

      ${metricCard(
        "Compliance",
        "100%",
        "Mandatory controls",
        metricDefinitions.compliance
      )}

    </div>


    <section class="overall-ai-strip">

      <div>

        <span class="section-label light-label">
          OVERALL PERFORMANCE ANALYSIS
        </span>

        <h2>
          86% · Strong
        </h2>

        <p>
          Based on all 12 assessed interactions in the selected period.
          Run Analyse Overall to understand what is driving your score.
        </p>

      </div>

      <button
        class="analyse-overall-button"
        onclick="runAmbassadorOverallAnalysis()"
      >
        ✦ Analyse Overall
      </button>

    </section>


    <div
      id="ambassador-overall-output"
      class="agent-output hidden-output"
    ></div>


    <section class="dashboard-card">

      <div class="table-heading-with-controls">

        <div>

          <span class="section-label">
            RECENT CUSTOMER INTERACTIONS
          </span>

          <h3>
            Your latest interactions
          </h3>

          <p>
            Showing 3 most recent of 12 assessed interactions.
            The 86% Overall Performance Score is calculated across all 12 assessed interactions, not only the three shown below.
          </p>

        </div>

        ${periodControls()}

      </div>


      <div class="interaction-header">

        <span>Interaction</span>
        <span>Channel / Duration</span>
        <span>Process</span>
        <span>Score</span>
        <span>Status</span>
        <span>Action</span>

      </div>


      ${interactions
        .map(interactionBlock)
        .join("")}

    </section>
  `;

}


function periodControls() {

  return `
    <div class="interaction-period-controls">

      <select>
        <option>MTD</option>
        <option>QTD</option>
        <option>YTD</option>
        <option>Custom</option>
      </select>

      <input
        type="date"
        value="2026-10-01"
      >

      <span>to</span>

      <input
        type="date"
        value="2026-10-14"
      >

    </div>
  `;

}


function interactionBlock(interaction) {

  const status =
    getInteractionStatus(
      interaction.score
    );


  const expanded =
    expandedInteractionId ===
    interaction.id;


  return `
    <div class="interaction-block">

      <div class="interaction-row">

        <div data-label="Interaction">

          <strong>
            ${interaction.id}
          </strong>

          <span>
            ${interaction.date}
          </span>

        </div>


        <div data-label="Channel">

          <strong>
            ${interaction.channel}
          </strong>

          <span>
            ${interaction.duration}
          </span>

        </div>


        <strong data-label="Process">
          ${interaction.process}
        </strong>


        <strong
          data-label="Score"
          class="${
            interaction.score < 50
              ? "score-attention"
              : ""
          }"
        >
          ${interaction.score}%
        </strong>


        <span
          data-label="Status"
          class="status-block ${status.className}"
        >
          ${status.label}
        </span>


        <button
          class="${
            interaction.score >= 90
              ? "small-button"
              : "primary-small"
          }"

          onclick="${
            interaction.score >= 90
              ? `toggleInteractionDetails('${interaction.id}')`
              : `analyseInlineInteraction('${interaction.id}')`
          }"
        >
          ${
            expanded
              ? "Collapse"
              : interaction.score >= 90
                ? "View Details"
                : "✦ Analyse Interaction"
          }
        </button>

      </div>


      <div
        class="interaction-expand ${
          expanded
            ? "open"
            : ""
        }"
      >

        ${
          expanded
            ? renderExpandedInteraction(
                interaction
              )
            : ""
        }

      </div>

    </div>
  `;

}


function getInteractionStatus(score) {

  if (score >= 90) {

    return {
      label: "Good Interaction",
      className: "good"
    };

  }


  if (score >= 50) {

    return {
      label: "Opportunity to Strengthen",
      className: "strengthen"
    };

  }


  return {
    label: "Needs Attention",
    className: "attention"
  };

}


function toggleInteractionDetails(id) {

  expandedInteractionId =
    expandedInteractionId === id
      ? null
      : id;


  navigateTo(
    "performance",
    {
      preserveInteraction: true
    }
  );

}


function analyseInlineInteraction(id) {

  expandedInteractionId =
    expandedInteractionId === id
      ? null
      : id;


  navigateTo(
    "performance",
    {
      preserveInteraction: true
    }
  );

}


function renderExpandedInteraction(
  interaction
) {

  if (interaction.score >= 90) {

    return `
      <div class="inline-analysis-placeholder">

        <span class="section-label">
          INTERACTION RESULT
        </span>

        <h3>
          Good Interaction
        </h3>

        <p>
          This interaction met the expected service standard.
        </p>

      </div>
    `;

  }


  return `
    <div
      id="inline-analysis-${interaction.id}"
      class="inline-analysis-placeholder"
    >

      <div class="analysis-ready">

        <div>

          <span class="section-label">
            AI INTERACTION ANALYSIS
          </span>

          <h3>
            Ready to analyse ${interaction.id}
          </h3>

          <p>
            SHARE Lens will run the specialist agent team against this interaction.
          </p>

        </div>

        <button
          class="primary-small"
          onclick="startInlineAnalysis('${interaction.id}')"
        >
          ✦ Start Analysis
        </button>

      </div>

    </div>
  `;

}


function startInlineAnalysis(id) {

  const interaction =
    interactions.find(
      item =>
        item.id === id
    );


  if (!interaction) return;


  const output =
    document.getElementById(
      `inline-analysis-${id}`
    );


  if (!output) return;


  output.innerHTML =
    buildAgentPipeline(
      "Interaction Analysis",
      [
        "Evaluation Agent",
        "SOP Agent",
        "Compliance Agent",
        "Combined Analysis"
      ],
      "interaction-pipeline"
    );


  animatePipeline(
    "interaction-pipeline",
    [
      "Reviewing service quality and customer handling...",
      "Checking required service process steps...",
      "Checking mandatory controls and compliance...",
      "Combining findings and preparing the next action..."
    ],
    () => {

      const analysis =
        analyseInteraction(
          interaction
        );


      output.innerHTML = `
        <div class="inline-analysis-result">

          <span class="section-label">
            AI ANALYSIS COMPLETE
          </span>

          <h3>
            ${
              interaction.score < 50
                ? "Needs Attention"
                : "Opportunity to Strengthen"
            }
          </h3>


          <div class="analysis-score-row">

            ${analysisMiniCard(
              "Service Quality",
              `${analysis.evaluation.score}%`
            )}

            ${analysisMiniCard(
              "SOP Adherence",
              `${analysis.sop.compliance}%`
            )}

            ${analysisMiniCard(
              "Compliance",
              `${analysis.compliance.complianceScore}%`
            )}

          </div>


          <div class="recommended-development">

            <div>

              <span class="section-label">
                RECOMMENDED NEXT ACTION
              </span>

              <h3>
                ${interaction.trainingTitle}
              </h3>

              <p>
                Complete the 15 min refresher and then the 5 min Knowledge Check.
              </p>

            </div>

            <button
              onclick="navigateTo('training')"
            >
              Go to Training
            </button>

          </div>

        </div>
      `;

    }
  );

}


function analysisMiniCard(
  title,
  value
) {

  return `
    <div class="analysis-agent-card">

      <span>
        ${title}
      </span>

      <strong>
        ${value}
      </strong>

    </div>
  `;

}


function runAmbassadorOverallAnalysis() {

  const output =
    document.getElementById(
      "ambassador-overall-output"
    );


  if (!output) return;


  output.classList.remove(
    "hidden-output"
  );


  output.innerHTML =
    buildAgentPipeline(
      "Analysing Overall Performance",
      [
        "Evaluation Agent",
        "SOP Agent",
        "Compliance Agent",
        "Pattern Agent",
        "Combined Analysis"
      ],
      "ambassador-overall-pipeline"
    );


  animatePipeline(
    "ambassador-overall-pipeline",
    [
      "Reviewing all assessed interactions in the selected period...",
      "Checking recurring SOP adherence patterns...",
      "Checking recurring compliance findings...",
      "Identifying themes across assessed interactions...",
      "Preparing overall findings and recommended development..."
    ],
    () => {

      output.innerHTML = `
        <span class="section-label">
          OVERALL AI ANALYSIS
        </span>

        <h3>
          Recurring opportunity: refund timeline communication
        </h3>

        <p>
          Identified across the full 12-interaction assessment population, including INT-1001 and INT-0984.
        </p>

        <button
          class="primary-small"
          onclick="navigateTo('training')"
        >
          Open Recommended Development
        </button>
      `;

    }
  );

}


/* =========================================================
   GENERIC AI PIPELINE
========================================================= */

function buildAgentPipeline(
  title,
  agents,
  prefix
) {

  return `
    <div class="agent-pipeline">

      <div class="pipeline-heading">

        <div>

          <span class="section-label">
            AGENT-TO-AGENT ORCHESTRATION
          </span>

          <h3>
            ${title}
          </h3>

        </div>

        <span class="pipeline-running-badge">
          AI team running
        </span>

      </div>


      <div class="pipeline-steps">

        ${agents.map(
          (agent, index) => `

            ${
              index > 0
                ? `
                  <div class="pipeline-line"></div>
                `
                : ""
            }

            <div
              id="${prefix}-${index}"
              class="pipeline-step ${
                index === 0
                  ? "active"
                  : "waiting"
              }"
            >

              <div class="pipeline-number">
                ${index + 1}
              </div>

              <div>

                <strong>
                  ${agent}
                </strong>

                <span class="pipeline-step-status">
                  ${
                    index === 0
                      ? "Running"
                      : "Waiting"
                  }
                </span>

              </div>

            </div>

          `
        ).join("")}

      </div>


      <div class="pipeline-status">

        <div class="processing-dot"></div>

        <span id="${prefix}-message">
          Starting analysis...
        </span>

      </div>

    </div>
  `;

}


function animatePipeline(
  prefix,
  messages,
  onComplete
) {

  messages.forEach(
    (message, index) => {

      const startDelay =
        index * 850;


      if (index > 0) {

        setTimeout(() => {

          const node =
            document.getElementById(
              `${prefix}-${index}`
            );


          if (!node) return;


          node.classList.remove(
            "waiting",
            "complete"
          );


          node.classList.add(
            "active"
          );


          const status =
            node.querySelector(
              ".pipeline-step-status"
            );


          if (status) {

            status.textContent =
              "Running";

          }


          const messageNode =
            document.getElementById(
              `${prefix}-message`
            );


          if (messageNode) {

            messageNode.textContent =
              message;

          }

        }, startDelay);

      } else {

        const messageNode =
          document.getElementById(
            `${prefix}-message`
          );


        if (messageNode) {

          messageNode.textContent =
            message;

        }

      }


      setTimeout(() => {

        const node =
          document.getElementById(
            `${prefix}-${index}`
          );


        if (node) {

          node.classList.remove(
            "active",
            "waiting"
          );


          node.classList.add(
            "complete"
          );


          const status =
            node.querySelector(
              ".pipeline-step-status"
            );


          if (status) {

            status.textContent =
              "Complete";

          }

        }


        if (
          index ===
          messages.length - 1
        ) {

          setTimeout(
            onComplete,
            350
          );

        }

      }, startDelay + 620);

    }
  );

}


/* =========================================================
   TRAINING
========================================================= */

function trainingPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "My Training",
      "Your assigned learning and performance-linked development."
    )}


    <div class="training-layout">

      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              ASSIGNED TRAINING
            </span>

            <h3>
              Your assigned learning
            </h3>

          </div>

          <span class="training-count">
            ${assignedTraining.length}
          </span>

        </div>


        ${assignedTraining
          .map(assignedTrainingCard)
          .join("")}

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          RECOMMENDED DEVELOPMENT
        </span>

        <h3>
          Based on recent performance
        </h3>

        ${recommendedDevelopmentCard()}

      </section>

    </div>
  `;

}


function assignedTrainingCard(item) {

  return `
    <div class="training-item-card">

      <div class="training-item-main">

        <div>

          <strong>
            ${item.title}
          </strong>

          <div class="training-item-meta">

            <span>
              ${item.duration}
            </span>

            <span>
              Assigned ${item.assigned}
            </span>

            <span>
              Due ${item.due}
            </span>

          </div>

        </div>

        <div class="training-status-circle ${item.dueClass}">
          ${item.status}
        </div>

      </div>


      <div class="due-state-row">

        <span>
          ${
            item.status === "Completed"
              ? "Completion"
              : "Due status"
          }
        </span>

        <strong>
          ${item.dueState}
        </strong>

      </div>

    </div>
  `;

}


function recommendedDevelopmentCard() {

  return `
    <div class="development-step">

      <div>

        <span class="section-label">
          LEARN / REFRESH
        </span>

        <h3>
          ${recommendedDevelopment.title}
        </h3>

        <p>
          ${recommendedDevelopment.reason}
        </p>

        <div class="training-trigger-links">

          <span>
            Linked evidence:
          </span>

          ${recommendedDevelopment
            .triggerInteractions
            .map(id => `

              <button
                onclick="openPerformanceInteraction('${id}')"
              >
                ${id}
              </button>

            `)
            .join("")}

        </div>

      </div>

      <span class="duration-pill">
        ${recommendedDevelopment.trainingDuration}
      </span>

    </div>


    <div class="development-connector">
      Then verify learning
    </div>


    <div class="development-step">

      <div>

        <span class="section-label">
          KNOWLEDGE CHECK
        </span>

        <h3>
          ${recommendedDevelopment.knowledgeCheck.title}
        </h3>

        <p>
          ${recommendedDevelopment.knowledgeCheck.purpose}
        </p>

      </div>

      <span class="duration-pill">
        ${recommendedDevelopment.knowledgeCheck.duration}
      </span>

      <button
        class="primary-small"
        onclick="navigateTo('knowledge-check')"
      >
        Start Check
      </button>

    </div>
  `;

}


/* =========================================================
   KNOWLEDGE CHECK
========================================================= */

function knowledgeCheckPage() {

  return `
    ${pageTitle(
      "KNOWLEDGE CHECK",
      "Refund Handling Challenge",
      "Performance-linked interactive Knowledge Check."
    )}


    <section class="knowledge-game-hero">

      <div>

        <span class="section-label light-label">
          REFUND HANDLING
        </span>

        <h2>
          Question ${knowledgeCheckQuestion} of 10
        </h2>

        <p>
          Approx. 5 min · Timed challenge
        </p>

      </div>

      <div class="knowledge-game-timer">
        04:32
      </div>

    </section>


    <section class="dashboard-card">

      <h2>
        A member asks when their cancelled booking refund will appear. What should you do?
      </h2>

      <div class="answer-grid">

        ${knowledgeAnswer(
          "A",
          "Tell the member the refund will arrive soon."
        )}

        ${knowledgeAnswer(
          "B",
          "Verify the booking, explain the expected refund timeframe and provide the next step."
        )}

        ${knowledgeAnswer(
          "C",
          "Ask the member to contact their bank immediately."
        )}

        ${knowledgeAnswer(
          "D",
          "Create a replacement booking."
        )}

      </div>

      <div
        id="knowledge-answer-feedback"
      ></div>

    </section>
  `;

}


function knowledgeAnswer(
  letter,
  text
) {

  return `
    <button
      class="knowledge-answer"
      onclick="answerKnowledgeQuestion('${letter}')"
    >

      <span>
        ${letter}
      </span>

      <strong>
        ${text}
      </strong>

    </button>
  `;

}


function answerKnowledgeQuestion(letter) {

  if (
    knowledgeCheckAnswered
  ) {

    return;

  }


  knowledgeCheckAnswered = true;


  const output =
    document.getElementById(
      "knowledge-answer-feedback"
    );


  if (!output) return;


  if (letter === "B") {

    knowledgeCheckScore += 1;

  }


  output.innerHTML = `
    <div class="knowledge-feedback ${
      letter === "B"
        ? "good"
        : "attention"
    }">

      <strong>
        ${
          letter === "B"
            ? "✓ Correct"
            : "Review this"
        }
      </strong>

      <p>
        Verify the booking, explain the expected refund timeframe and clearly provide the next step.
      </p>

    </div>

    <button
      class="primary-small"
      onclick="nextKnowledgeQuestion()"
    >
      Next Question →
    </button>
  `;

}


function nextKnowledgeQuestion() {

  knowledgeCheckAnswered =
    false;


  if (
    knowledgeCheckQuestion < 10
  ) {

    knowledgeCheckQuestion += 1;

  }


  navigateTo(
    "knowledge-check"
  );

}


/* =========================================================
   KNOWLEDGE BASE
========================================================= */

function knowledgePage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Search and access the approved knowledge repository."
    )}

    ${knowledgeRepositorySection(false)}
  `;

}


function knowledgeRepositorySection(
  canManage = false
) {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            KNOWLEDGE BASE
          </span>

          <h3>
            Approved knowledge
          </h3>

          <p>
            Browse the complete approved knowledge repository.
          </p>

        </div>


        ${
          canManage
            ? `
              <button
                class="primary-small"
                onclick="toggleKnowledgeEditor()"
              >
                + Add / Update Article
              </button>
            `
            : ""
        }

      </div>


      ${
        canManage &&
        knowledgeEditorOpen
          ? knowledgeEditor()
          : ""
      }


      <div class="knowledge-toolbar">

        <input
          id="knowledge-search"
          placeholder="Search Knowledge Base"
          oninput="filterKnowledgeBase(${canManage})"
        >

        <select
          id="knowledge-category"
          onchange="filterKnowledgeBase(${canManage})"
        >

          <option value="all">
            All Categories
          </option>

          <option value="Customer Service">
            Customer Service
          </option>

          <option value="Refunds & Cancellations">
            Refunds & Cancellations
          </option>

          <option value="SHARE Benefits">
            SHARE Benefits
          </option>

          <option value="Ambassador Program">
            Ambassador Program
          </option>

          <option value="Policies">
            Policies
          </option>

          <option value="SOPs">
            SOPs
          </option>

        </select>

      </div>


      <div id="knowledge-results">

        ${renderKnowledgeRows(
          knowledgeRepository,
          canManage
        )}

      </div>

    </section>
  `;

}


function knowledgeEditor() {

  return `
    <div class="knowledge-editor">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            ARTICLE MANAGEMENT
          </span>

          <h3>
            Add / Update Knowledge Article
          </h3>

        </div>

        <button
          class="small-button"
          onclick="toggleKnowledgeEditor()"
        >
          Close
        </button>

      </div>


      <div class="editor-grid">

        ${editorField(
          "Article Title",
          "Refund Process"
        )}

        ${editorField(
          "Category",
          "Refunds & Cancellations"
        )}

        ${editorField(
          "Version",
          "v3.3"
        )}

        ${editorField(
          "Owner",
          "Service Delivery"
        )}

        ${editorField(
          "Audience",
          "Ambassadors"
        )}

        ${editorField(
          "Status",
          "Draft Update"
        )}

        ${editorField(
          "Effective Date",
          "15 Oct 2026"
        )}

        ${editorField(
          "Scope",
          "Entertainment UAE"
        )}

      </div>


      <button
        class="primary-small"
        onclick="showToast('Prototype article published')"
      >
        Publish Update
      </button>

    </div>
  `;

}


function editorField(
  label,
  value
) {

  return `
    <div class="mock-field">

      <label>
        ${label}
      </label>

      <div>
        ${value}
      </div>

    </div>
  `;

}


function toggleKnowledgeEditor() {

  knowledgeEditorOpen =
    !knowledgeEditorOpen;

  renderCurrentPage();

}


function renderKnowledgeRows(
  items,
  canManage
) {

  return items
    .map(item => `

      <div class="knowledge-row">

        <div>

          <strong>
            ${item.title}
          </strong>

          <span>
            ${item.category}
          </span>

        </div>

        <span>
          ${item.type}
        </span>

        <span>
          ${item.version} · ${item.updated}
        </span>

        <div class="knowledge-actions">

          <button
            class="small-button"
          >
            Open
          </button>

          ${
            canManage
              ? `
                <button
                  class="small-button"
                  onclick="toggleKnowledgeEditor()"
                >
                  Update
                </button>
              `
              : ""
          }

        </div>

      </div>

    `)
    .join("");

}


function filterKnowledgeBase(
  canManage
) {

  const searchNode =
    document.getElementById(
      "knowledge-search"
    );


  const categoryNode =
    document.getElementById(
      "knowledge-category"
    );


  const resultsNode =
    document.getElementById(
      "knowledge-results"
    );


  if (
    !searchNode ||
    !categoryNode ||
    !resultsNode
  ) {

    return;

  }


  const search =
    searchNode
      .value
      .toLowerCase();


  const category =
    categoryNode.value;


  const filtered =
    knowledgeRepository.filter(item => {

      const matchesSearch =
        !search ||
        item.title
          .toLowerCase()
          .includes(search) ||
        item.category
          .toLowerCase()
          .includes(search) ||
        item.type
          .toLowerCase()
          .includes(search);


      const matchesCategory =
        category === "all" ||
        item.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  resultsNode.innerHTML =
    renderKnowledgeRows(
      filtered,
      canManage
    );

}


/* =========================================================
   AMBASSADOR STATUS
========================================================= */

function statusPage() {

  const user =
    prototypeUsers.ambassador;


  const achievement =
    Math.round(
      (
        user.shareMembersOnboarded /
        user.shareMemberTarget
      ) * 100
    );


  const remaining =
    Math.max(
      user.shareMemberTarget -
      user.shareMembersOnboarded,
      0
    );


  return `
    ${pageTitle(
      "AMBASSADOR",
      "My Status",
      "Your profile, Personal QR Code and contribution to the SHARE programme."
    )}


    <div class="status-top-grid">

      <section class="dashboard-card">

        <div class="ambassador-profile-header">

          <div class="large-avatar">
            LH
          </div>

          <div>

            <h2>
              Layla Haddad
            </h2>

            <span class="status-block good">
              Active Ambassador
            </span>

          </div>

        </div>


        ${profileLine(
          "Staff ID",
          user.staffId
        )}

        ${profileLine(
          "Business Unit",
          user.businessUnit
        )}

        ${profileLine(
          "Brand",
          user.brand
        )}

        ${profileLine(
          "Store",
          user.store
        )}

        ${profileLine(
          "Engagement Points",
          user.engagementPoints
        )}

      </section>


      <section class="dashboard-card compact-qr-card">

        <div>

          <span class="section-label">
            PERSONAL QR CODE
          </span>

          <h3>
            Active
          </h3>

          <p>
            Used to attribute acquired members to your Ambassador profile.
          </p>

        </div>

        <img
          class="share-qr-image"
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwww.sharerewards.com%2F"
          alt="SHARE QR Code"
        >

      </section>

    </div>


    <section class="share-contribution-section">

      <div class="share-contribution-header">

        <div>

          <span class="section-label light-label">
            MY SHARE CONTRIBUTION
          </span>

          <h2>
            Impact from members you acquired
          </h2>

          <p>
            ${currentPerformancePeriod.from} – ${currentPerformancePeriod.to}
          </p>

        </div>

        <div class="contribution-target">

          <strong>
            ${achievement}%
          </strong>

          <span>
            ${remaining} members to target
          </span>

        </div>

      </div>


      <div class="contribution-kpi-grid">

        ${darkContributionCard(
          "Members Acquired",
          user.shareMembersOnboarded,
          metricDefinitions.acquisition
        )}

        ${darkContributionCard(
          "Member Spend",
          formatAED(
            user.memberSpend
          ),
          metricDefinitions.memberSpend
        )}

        ${darkContributionCard(
          "SHARE Points Earned by Members",
          formatPoints(
            user.memberPointsEarned
          ),
          metricDefinitions.memberPoints
        )}

        ${darkContributionCard(
          "Value of Points Earned",
          formatAED(
            pointsToAED(
              user.memberPointsEarned
            )
          ),
          metricDefinitions.pointsValue
        )}

      </div>


      <div class="status-progress-track">

        <div
          class="status-progress-fill"
          style="width:${achievement}%"
        ></div>

      </div>

    </section>


    ${sharePointsCalculator()}
  `;

}


function darkContributionCard(
  title,
  value,
  definition
) {

  return `
    <div class="dark-contribution-card">

      <div class="metric-label-row">

        <span>
          ${title}
        </span>

        ${infoIcon(definition)}

      </div>

      <strong>
        ${value}
      </strong>

    </div>
  `;

}


/* =========================================================
   SHARE POINTS CALCULATOR
========================================================= */

function sharePointsCalculator() {

  return `
    <section class="dashboard-card share-points-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            MEMBER SHARE POINTS CALCULATOR
          </span>

          <h3>
            Calculate points for a member transaction
          </h3>

          <p>
            Calculates SHARE Points earned by the member, not points owned by the Ambassador.
          </p>

        </div>

        ${infoIcon(
          metricDefinitions.sharePoints
        )}

      </div>


      <div class="share-calculator-controls">

        <div>

          <label>
            Transaction Value
          </label>

          <input
            id="share-transaction"
            type="number"
            min="0"
            value="1000"
            oninput="calculateSharePoints()"
          >

        </div>


        <div>

          <label>
            Spend Category
          </label>

          <select
            id="share-transaction-type"
            onchange="calculateSharePoints()"
          >

            <option value="leisure">
              Leisure & Entertainment
            </option>

            <option value="luxury">
              Luxury Brands
            </option>

            <option value="nonLuxury">
              Non-Luxury / Shopping Malls
            </option>

            <option value="lifestyle">
              Lifestyle Brands
            </option>

            <option value="carrefour">
              Carrefour Groceries
            </option>

          </select>

        </div>


        <div>

          <label>
            Promotion
          </label>

          <select
            id="share-promo"
            onchange="calculateSharePoints()"
          >

            <option value="1">
              Standard Earn
            </option>

            <option value="2">
              2× Points
            </option>

          </select>

        </div>

      </div>


      <div class="earn-rule-banner">

        <span class="section-label">
          SELECTED EARNING RULE
        </span>

        <strong
          id="share-selected-rule"
        >
          30 SHARE Points per AED 100 spent
        </strong>

      </div>


      <div class="share-points-results">

        <div class="points-result-card">

          <span>
            Base Points
          </span>

          <strong
            id="share-base-points"
          >
            300
          </strong>

          <small>
            Standard member earn
          </small>

        </div>


        <div class="points-result-card">

          <span>
            Bonus / Promo Points
          </span>

          <strong
            id="share-bonus-points"
          >
            0
          </strong>

          <small>
            Additional promotional points
          </small>

        </div>


        <div class="points-result-card total">

          <span>
            Total SHARE Points
          </span>

          <strong
            id="share-total-points"
          >
            300
          </strong>

          <small>
            Earned by the member
          </small>

        </div>


        <div class="points-result-card value">

          <span>
            Estimated Points Value
          </span>

          <strong
            id="share-points-value"
          >
            AED 30
          </strong>

          <small>
            Prototype value conversion
          </small>

        </div>

      </div>

    </section>
  `;

}


function calculateSharePoints() {

  const transactionNode =
    document.getElementById(
      "share-transaction"
    );


  const typeNode =
    document.getElementById(
      "share-transaction-type"
    );


  const promoNode =
    document.getElementById(
      "share-promo"
    );


  if (
    !transactionNode ||
    !typeNode ||
    !promoNode
  ) {

    return;

  }


  const transactionValue =
    Math.max(
      Number(
        transactionNode.value
      ) || 0,
      0
    );


  const category =
    shareEarnRates[
      typeNode.value
    ];


  const multiplier =
    Number(
      promoNode.value
    );


  const base =
    (
      transactionValue /
      category.spendUnit
    ) *
    category.pointsPerSpend;


  const bonus =
    base *
    (
      multiplier - 1
    );


  const total =
    base + bonus;


  document.getElementById(
    "share-base-points"
  ).textContent =
    formatPoints(base);


  document.getElementById(
    "share-bonus-points"
  ).textContent =
    formatPoints(bonus);


  document.getElementById(
    "share-total-points"
  ).textContent =
    formatPoints(total);


  document.getElementById(
    "share-points-value"
  ).textContent =
    formatAED(
      pointsToAED(total)
    );


  document.getElementById(
    "share-selected-rule"
  ).textContent =
    category.rule;

}


/* =========================================================
   MANAGEMENT FILTERS
========================================================= */

function managementFilters(
  service = false
) {

  return `
    <section class="manager-filter-bar">

      ${filterField(
        "Period",
        [
          "MTD",
          "QTD",
          "YTD",
          "Custom"
        ]
      )}

      ${filterField(
        "Country",
        service
          ? [
              "All Countries",
              "UAE",
              "Bahrain",
              "Oman"
            ]
          : [
              "UAE"
            ]
      )}

      ${filterField(
        "BU",
        service
          ? [
              "All BUs",
              "Entertainment",
              "Retail",
              "Lifestyle"
            ]
          : [
              "Entertainment"
            ]
      )}

      ${filterField(
        "Brand",
        [
          "All Brands",
          "VOX Cinemas",
          "Magic Planet",
          "Carrefour",
          "LEGO",
          "Lululemon"
        ]
      )}

      ${filterField(
        "Mall",
        [
          "All Malls",
          "Mall of the Emirates",
          "City Centre Mirdif",
          "City Centre Deira",
          "City Centre Al Zahia",
          "City Centre Ajman",
          "City Centre Sharjah",
          "City Centre Fujairah",
          "City Centre Bahrain",
          "City Centre Muscat",
          "City Centre Sohar"
        ]
      )}

      ${filterField(
        "Store / Location",
        [
          "All Locations",
          "VOX MOE",
          "VOX CCM",
          "VOX CCD",
          "VOX CCAZ"
        ]
      )}

    </section>


    <div class="scope-notice">

      <strong>
        ${
          service
            ? "Enterprise Service Delivery visibility"
            : "Scoped to Entertainment UAE"
        }
      </strong>

      <span>
        ${
          service
            ? "Authorised visibility across BUs, brands, MAF mall locations and Ambassadors."
            : "Only records within the assigned Entertainment UAE scope are available."
        }
      </span>

    </div>
  `;

}


function filterField(
  label,
  values
) {

  return `
    <div class="filter-field">

      <label>
        ${label}
      </label>

      <select>

        ${values
          .map(value => `
            <option>
              ${value}
            </option>
          `)
          .join("")}

      </select>

    </div>
  `;

}


/* =========================================================
   BU LEAD HOME
========================================================= */

function managerHome() {

  return `
    ${pageTitle(
      "ENTERTAINMENT UAE",
      "BU Lead / Trainer Dashboard",
      "Understand team performance and where action is required."
    )}

    ${managementFilters(false)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Performance Score",
        "86%",
        "Strong",
        metricDefinitions.performance
      )}

      ${metricCard(
        "Active Ambassadors",
        "238",
        "Entertainment UAE",
        metricDefinitions.activeAmbassadors
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "Current period",
        metricDefinitions.trainingCompletion
      )}

      ${metricCard(
        "SHARE Members Acquired",
        "1,842",
        "88% of target",
        metricDefinitions.acquisition
      )}

    </div>


    <div class="dashboard-grid two">

      ${performanceBreakdownSection()}

      ${requiresAttentionSummary(false)}

    </div>


    ${contributionSummary(
      managerAcquisitionScope,
      "Value generated by members acquired by your Ambassador population",
      "manager-acquisition"
    )}
  `;

}


function performanceBreakdownSection() {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            PERFORMANCE BREAKDOWN
          </span>

          <h3>
            Organisational performance
          </h3>

        </div>

      </div>


      ${managerPerformanceBreakdown
        .map(item => `
          <div class="manager-performance-row">

            <div>

              <span class="hierarchy-pill">
                ${item.level}
              </span>

              <strong>
                ${item.name}
              </strong>

            </div>

            <span>
              ${item.ambassadors} Ambassadors
            </span>

            <strong>
              ${item.score}%
            </strong>

            <button class="small-button">
              Drill Down
            </button>

          </div>
        `)
        .join("")}

    </section>
  `;

}


function requiresAttentionSummary(
  service
) {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            REQUIRES ATTENTION
          </span>

          <h3>
            Priority areas
          </h3>

        </div>

        <button
          class="small-button"
          onclick="navigateTo('${
            service
              ? "group-attention"
              : "team-attention"
          }')"
        >
          View All
        </button>

      </div>


      ${managerAttentionItems
        .map(item => `
          <div class="manager-attention-row">

            <span
              class="severity-pill ${item.severity.toLowerCase()}"
            >
              ${item.severity}
            </span>

            <div>

              <strong>
                ${item.location}
              </strong>

              <span>
                ${item.issue}
              </span>

            </div>

            <span>
              ${item.affected}
            </span>

          </div>
        `)
        .join("")}

    </section>
  `;

}


function contributionSummary(
  scope,
  title,
  target
) {

  return `
    <section class="dashboard-card contribution-summary">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            SHARE MEMBER CONTRIBUTION
          </span>

          <h3>
            ${title}
          </h3>

        </div>

        <button
          class="small-button"
          onclick="navigateTo('${target}')"
        >
          View Acquisition
        </button>

      </div>


      <div class="contribution-summary-grid">

        ${metricCard(
          "Members Acquired",
          formatNumber(
            scope.members
          ),
          `${Math.round(
            scope.members /
            scope.target *
            100
          )}% of target`,
          metricDefinitions.acquisition
        )}

        ${metricCard(
          "Member Spend",
          formatAED(
            scope.memberSpend
          ),
          "Attributed spend",
          metricDefinitions.memberSpend
        )}

        ${metricCard(
          "SHARE Points Earned by Members",
          formatPoints(
            scope.memberPoints
          ),
          "Points earned by members",
          metricDefinitions.memberPoints
        )}

        ${metricCard(
          "Value of Points Earned",
          formatAED(
            pointsToAED(
              scope.memberPoints
            )
          ),
          "Estimated value",
          metricDefinitions.pointsValue
        )}

      </div>

    </section>
  `;

}


/* =========================================================
   MANAGER PERFORMANCE
========================================================= */

function managerPerformance() {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "BU Performance",
      "Drill down by BU, Brand, Mall, Store / Location and Ambassador."
    )}

    ${managementFilters(false)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Performance Score",
        "86%",
        "Strong",
        metricDefinitions.performance
      )}

      ${metricCard(
        "Service Quality",
        "84%",
        "Current period",
        metricDefinitions.serviceQuality
      )}

      ${metricCard(
        "SOP Adherence",
        "89%",
        "Current period",
        metricDefinitions.sop
      )}

      ${metricCard(
        "Compliance",
        "97%",
        "Current period",
        metricDefinitions.compliance
      )}

    </div>


    ${managementAI("manager")}

    ${performanceBreakdownSection()}
  `;

}


function managementAI(type) {

  const outputId =
    type === "manager"
      ? "manager-agent-output"
      : "service-agent-output";


  const handler =
    type === "manager"
      ? "runManagerAnalysis()"
      : "runServiceAnalysis()";


  return `
    <section class="overall-ai-strip">

      <div>

        <span class="section-label light-label">
          AI PERFORMANCE ANALYSIS
        </span>

        <h2>
          Analyse current filtered view
        </h2>

        <p>
          Identify recurring themes, severity and recommended interventions.
        </p>

      </div>

      <button
        class="analyse-overall-button"
        onclick="${handler}"
      >
        ✦ Analyse Current View
      </button>

    </section>


    <div
      id="${outputId}"
      class="agent-output"
    >
      Run analysis to identify recurring patterns.
    </div>
  `;

}


/* =========================================================
   ATTENTION
========================================================= */

function attentionPage(service) {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "Requires Attention",
      service
        ? "Priority issues across the authorised Service Delivery scope."
        : "Priority issues within your Entertainment UAE scope."
    )}

    ${managementFilters(service)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Critical",
        service ? "3" : "1",
        "Immediate intervention"
      )}

      ${metricCard(
        "High",
        service ? "9" : "4",
        "Priority follow-up"
      )}

      ${metricCard(
        "Medium",
        service ? "18" : "7",
        "Monitor"
      )}

      ${metricCard(
        "Ambassadors Impacted",
        service ? "96" : "34",
        "Selected scope"
      )}

    </div>


    <section class="dashboard-card">

      ${managerAttentionItems
        .map(item => `
          <div class="manager-attention-row full">

            <span
              class="severity-pill ${item.severity.toLowerCase()}"
            >
              ${item.severity}
            </span>

            <div>

              <strong>
                ${item.location}
              </strong>

              <span>
                ${item.issue}
              </span>

            </div>

            <span>
              ${item.affected}
            </span>

            <button class="small-button">
              Review
            </button>

          </div>
        `)
        .join("")}

    </section>
  `;

}


/* =========================================================
   AMBASSADOR POPULATION
========================================================= */

function ambassadorsPage(service) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassadors",
      "View population, performance and attributed SHARE contribution."
    )}

    ${managementFilters(service)}


    <section class="dashboard-card population-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            AMBASSADOR POPULATION
          </span>

          <h3>
            Population detail
          </h3>

        </div>

        <button
          class="primary-small"
          onclick="exportAmbassadorList()"
        >
          ↓ Export CSV
        </button>

      </div>


      <div class="population-table">

        <div class="population-header">

          <span>Ambassador</span>
          <span>Brand</span>
          <span>Location</span>
          <span>Performance</span>
          <span>Members</span>
          <span>Member Spend</span>
          <span>Member Points</span>
          <span>Points Value</span>

        </div>


        ${ambassadorContribution
          .map(item => `
            <div class="population-row">

              <div data-label="Ambassador">

                <strong>
                  ${item.name}
                </strong>

                <span>
                  ${item.staffId}
                </span>

              </div>

              <span data-label="Brand">
                ${item.brand}
              </span>

              <span data-label="Location">
                ${item.mall}
              </span>

              <strong data-label="Performance">
                ${item.performance}%
              </strong>

              <strong data-label="Members">
                ${item.members}
              </strong>

              <strong data-label="Member Spend">
                ${formatAED(
                  item.memberSpend
                )}
              </strong>

              <strong data-label="Member Points">
                ${formatPoints(
                  item.memberPoints
                )}
              </strong>

              <strong data-label="Points Value">
                ${formatAED(
                  pointsToAED(
                    item.memberPoints
                  )
                )}
              </strong>

            </div>
          `)
          .join("")}

      </div>

    </section>
  `;

}


function exportAmbassadorList() {

  const header = [
    "Name",
    "Staff ID",
    "BU",
    "Brand",
    "Mall",
    "Members Acquired",
    "Member Spend",
    "SHARE Points Earned by Members",
    "Points Value"
  ];


  const rows =
    ambassadorContribution.map(
      item => [

        item.name,
        item.staffId,
        item.bu,
        item.brand,
        item.mall,
        item.members,
        item.memberSpend,
        item.memberPoints,
        pointsToAED(
          item.memberPoints
        )

      ]
    );


  const csv =
    [
      header,
      ...rows
    ]
      .map(row =>
        row
          .map(value =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href = url;


  link.download =
    "share-lens-ambassador-population.csv";


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );

}


/* =========================================================
   ACQUISITION
========================================================= */

function acquisitionPage(service) {

  const scope =
    service
      ? serviceAcquisitionScope
      : managerAcquisitionScope;


  const achievement =
    Math.round(
      (
        scope.members /
        scope.target
      ) * 100
    );


  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "SHARE Acquisition",
      "Track members acquired and the loyalty value generated by those members."
    )}

    ${managementFilters(service)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Members Acquired",
        formatNumber(
          scope.members
        ),
        `${achievement}% of target`,
        metricDefinitions.acquisition
      )}

      ${metricCard(
        "Member Spend",
        formatAED(
          scope.memberSpend
        ),
        "Attributed transaction value",
        metricDefinitions.memberSpend
      )}

      ${metricCard(
        "SHARE Points Earned by Members",
        formatPoints(
          scope.memberPoints
        ),
        "Points belong to members",
        metricDefinitions.memberPoints
      )}

      ${metricCard(
        "Value of Points Earned",
        formatAED(
          pointsToAED(
            scope.memberPoints
          )
        ),
        "Estimated monetary value",
        metricDefinitions.pointsValue
      )}

    </div>


    <section class="acquisition-target-card">

      <div>

        <span class="section-label light-label">
          ACQUISITION TARGET
        </span>

        <h2>
          ${formatNumber(
            scope.members
          )}
          of
          ${formatNumber(
            scope.target
          )}
          members
        </h2>

      </div>

      <strong>
        ${achievement}%
      </strong>

      <div class="acquisition-target-track">

        <div
          style="width:${achievement}%"
        ></div>

      </div>

    </section>


    <section class="dashboard-card">

      <span class="section-label">
        AMBASSADOR CONTRIBUTION
      </span>

      <h3>
        Contribution by Ambassador
      </h3>

      <p>
        SHARE Points belong to the members. The contribution is attributed to the Ambassador who acquired them.
      </p>


      <div class="contribution-table-header">

        <span>Ambassador</span>
        <span>Location</span>
        <span>Members</span>
        <span>Member Spend</span>
        <span>Member Points</span>
        <span>Points Value</span>

      </div>


      ${ambassadorContribution
        .map(item => `
          <div class="contribution-table-row">

            <strong data-label="Ambassador">
              ${item.name}
            </strong>

            <span data-label="Location">
              ${item.mall}
            </span>

            <strong data-label="Members">
              ${item.members}
            </strong>

            <strong data-label="Member Spend">
              ${formatAED(
                item.memberSpend
              )}
            </strong>

            <strong data-label="Member Points">
              ${formatPoints(
                item.memberPoints
              )}
            </strong>

            <strong data-label="Points Value">
              ${formatAED(
                pointsToAED(
                  item.memberPoints
                )
              )}
            </strong>

          </div>
        `)
        .join("")}

    </section>
  `;

}


/* =========================================================
   MANAGEMENT TRAINING
========================================================= */

function managementTrainingPage(service) {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Training Overview",
      "Monitor completion, in-progress learning and overdue learning."
    )}

    ${managementFilters(service)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Assigned",
        "594",
        "Training assignments"
      )}

      ${metricCard(
        "Completed",
        "545",
        "91% completion"
      )}

      ${metricCard(
        "In Progress",
        "32",
        "Current"
      )}

      ${metricCard(
        "Overdue",
        "17",
        "Needs follow-up"
      )}

    </div>


    <section class="dashboard-card">

      <div class="management-list-row">

        <strong>
          SHARE Customer Experience
        </strong>

        <span>
          238 assigned
        </span>

        <span>
          224 completed
        </span>

        <span>
          9 in progress
        </span>

        <span>
          5 overdue
        </span>

      </div>


      <div class="management-list-row">

        <strong>
          Service Recovery Essentials
        </strong>

        <span>
          118 assigned
        </span>

        <span>
          91 completed
        </span>

        <span>
          19 in progress
        </span>

        <span>
          8 overdue
        </span>

      </div>


      <div class="management-list-row">

        <strong>
          Product Knowledge
        </strong>

        <span>
          238 assigned
        </span>

        <span>
          230 completed
        </span>

        <span>
          4 in progress
        </span>

        <span>
          4 overdue
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   KNOWLEDGE GAPS
========================================================= */

function knowledgeGapsPage(service) {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Gaps",
      "Identify recurring knowledge themes affecting Ambassador performance."
    )}

    ${managementFilters(service)}


    <section class="dashboard-card">

      ${managerKnowledgeGaps
        .map(item => `
          <div class="management-list-row">

            <strong>
              ${item.theme}
            </strong>

            <span>
              ${item.ambassadors} Ambassadors
            </span>

            <strong>
              ${item.knowledgeScore}%
            </strong>

            <span>
              ${item.relatedPerformance}
            </span>

            <span>
              ${item.trend}
            </span>

          </div>
        `)
        .join("")}

    </section>
  `;

}


/* =========================================================
   LIFECYCLE
========================================================= */

function lifecyclePage(service) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Onboarding & Offboarding",
      "Track task completion across the Ambassador lifecycle."
    )}

    ${managementFilters(service)}


    <section class="dashboard-card">

      <span class="section-label">
        ONBOARDING JOURNEY
      </span>

      <h3>
        Noor Hassan
      </h3>


      <div class="lifecycle-steps">

        ${[
          ["Account Created", "Complete"],
          ["First Login", "Complete"],
          ["Mandatory Training", "In Progress"],
          ["Knowledge Check", "Pending"],
          ["Personal QR Code", "Pending"],
          ["Active", "Pending"]
        ]
          .map(step => `
            <div class="lifecycle-step">

              <strong>
                ${step[0]}
              </strong>

              <span>
                ${step[1]}
              </span>

            </div>
          `)
          .join("")}

      </div>

    </section>


    <section class="dashboard-card lifecycle-secondary">

      <span class="section-label">
        OFFBOARDING
      </span>

      <h3>
        Controlled access removal
      </h3>

      <p>
        Disable programme access, deactivate QR attribution, close open tasks and preserve the audit trail.
      </p>

    </section>
  `;

}


/* =========================================================
   COMMUNICATIONS
========================================================= */

function communicationsPage(service) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Communications",
      "Broadcast updates and measure Ambassador engagement."
    )}

    ${managementFilters(service)}


    <section class="overall-ai-strip">

      <div>

        <span class="section-label light-label">
          BROADCASTS & INTERACTIVE FEED
        </span>

        <h2>
          Engage the Ambassador community
        </h2>

        <p>
          Share announcements, knowledge updates and recognition while tracking engagement.
        </p>

      </div>

      <button
        class="analyse-overall-button"
        onclick="showBroadcastComposer()"
      >
        + New Broadcast
      </button>

    </section>


    <div
      id="broadcast-composer"
    ></div>


    <section class="dashboard-card">

      ${communicationsFeed
        .map(item => `
          <div class="management-list-row">

            <div>

              <strong>
                ${item.title}
              </strong>

              <span>
                ${item.type} · ${item.date}
              </span>

            </div>

            <span>
              ${item.reach} reach
            </span>

            <span>
              ${item.views} views
            </span>

            <span>
              ${item.likes} likes
            </span>

            <span>
              ${item.comments} comments
            </span>

          </div>
        `)
        .join("")}

    </section>
  `;

}


function showBroadcastComposer() {

  const output =
    document.getElementById(
      "broadcast-composer"
    );


  if (!output) return;


  output.innerHTML = `
    <section class="dashboard-card broadcast-compose-card">

      <span class="section-label">
        NEW BROADCAST
      </span>

      <h3>
        Create Ambassador update
      </h3>

      <div class="editor-grid">

        ${editorField(
          "Audience",
          "Current filtered scope"
        )}

        ${editorField(
          "Type",
          "Announcement"
        )}

        ${editorField(
          "Engagement",
          "Likes + Comments"
        )}

        ${editorField(
          "Status",
          "Draft"
        )}

      </div>

      <button
        class="primary-small"
        onclick="showToast('Prototype broadcast published')"
      >
        Publish Broadcast
      </button>

    </section>
  `;

}


/* =========================================================
   AMBASSADOR HUB
========================================================= */

function hubPage(service) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassador Hub",
      "Feedback, suggestions, in-store training and SHARE Wall submissions."
    )}

    ${managementFilters(service)}


    <div class="dashboard-grid four">

      ${ambassadorHubSubmissions
        .map(item =>
          metricCard(
            item.type,
            item.submissions,
            `${item.open} open · ${item.integration}`
          )
        )
        .join("")}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        SUBMISSION FLOW
      </span>

      <h3>
        Ambassador Hub → Alida
      </h3>


      <div class="hub-flow">

        <span>
          Ambassador Submission
        </span>

        <b>→</b>

        <span>
          SHARE Lens
        </span>

        <b>→</b>

        <span>
          Alida
        </span>

        <b>→</b>

        <span>
          Follow-up
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   SERVICE DELIVERY HOME
========================================================= */

function serviceHome() {

  return `
    ${pageTitle(
      "MAF MALLS",
      "Service Delivery",
      "Cross-BU visibility across service performance, Service Pulse, training, knowledge and the Ambassador Program."
    )}

    ${managementFilters(true)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Performance Score",
        "88%",
        "Strong",
        metricDefinitions.performance
      )}

      ${metricCard(
        "Active Ambassadors",
        "850",
        "Selected scope",
        metricDefinitions.activeAmbassadors
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "Current period",
        metricDefinitions.trainingCompletion
      )}

      ${metricCard(
        "SHARE Members Acquired",
        "7,320",
        "Selected scope",
        metricDefinitions.acquisition
      )}

    </div>


    <div class="dashboard-grid two">

      ${performanceBreakdownSection()}


      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              SERVICE PULSE
            </span>

            <h3>
              ${servicePulseOverallScore().toFixed(2)}%
            </h3>

          </div>

          <span class="status-block attention">
            Needs Attention
          </span>

        </div>

        <p>
          Average score across ${servicePulseSubmissionsData.length} assessments in the current prototype dataset.
        </p>

        <button
          class="primary-small"
          onclick="navigateTo('service-pulse')"
        >
          Open Service Pulse
        </button>

      </section>

    </div>


    ${contributionSummary(
      serviceAcquisitionScope,
      "Value generated through the Ambassador programme",
      "group-acquisition"
    )}
  `;

}


/* =========================================================
   SERVICE PERFORMANCE
========================================================= */

function servicePerformance() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Performance",
      "Analyse performance across the selected organisational scope."
    )}

    ${managementFilters(true)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Performance Score",
        "88%",
        "Strong",
        metricDefinitions.performance
      )}

      ${metricCard(
        "Service Quality",
        "85%",
        "Current period",
        metricDefinitions.serviceQuality
      )}

      ${metricCard(
        "SOP Adherence",
        "90%",
        "Current period",
        metricDefinitions.sop
      )}

      ${metricCard(
        "Compliance",
        "98%",
        "Current period",
        metricDefinitions.compliance
      )}

    </div>


    ${managementAI("service")}

    ${performanceBreakdownSection()}
  `;

}


/* =========================================================
   SERVICE PULSE CALCULATIONS
========================================================= */

function servicePulseOverallScore(
  data = servicePulseSubmissionsData
) {

  return average(
    data.map(item =>
      percentage(
        item.score,
        item.totalScore
      )
    )
  );

}


function uniqueCount(
  data,
  key
) {

  return new Set(
    data
      .map(item =>
        item[key]
      )
      .filter(value =>
        value &&
        value !== "Not captured" &&
        value !== "N/A" &&
        value !== "Location not captured"
      )
  ).size;

}


function groupServicePulse(
  data,
  key
) {

  const groups = {};


  data.forEach(item => {

    const value =
      item[key] ||
      "Not captured";


    if (!groups[value]) {

      groups[value] = [];

    }


    groups[value].push(
      item
    );

  });


  return Object
    .entries(groups)
    .map(
      ([name, records]) => ({

        name,

        assessments:
          records.length,

        score:
          servicePulseOverallScore(
            records
          )

      })
    )
    .sort(
      (a, b) =>
        b.score - a.score
    );

}


/* =========================================================
   SERVICE PULSE FILTERS
========================================================= */

function servicePulseFilters() {

  return `
    <section class="service-pulse-filter-bar">

      ${pulseSelect(
        "pulse-period",
        "Period",
        [
          "MTD",
          "QTD",
          "YTD",
          "Custom"
        ]
      )}

      ${pulseSelect(
        "pulse-country",
        "Country",
        [
          "UAE"
        ]
      )}

      ${pulseSelect(
        "pulse-bu",
        "Business Unit",
        [
          "All BUs",
          "Retail",
          "Entertainment",
          "Lifestyle"
        ]
      )}

      ${pulseSelect(
        "pulse-brand",
        "Brand",
        [
          "All Brands",
          "Carrefour",
          "VOX",
          "Magic Planet",
          "Explorer",
          "LEGO",
          "Lululemon"
        ]
      )}

      ${pulseSelect(
        "pulse-location",
        "Mall / Location",
        [
          "All Locations",
          "Mall of the Emirates",
          "City Centre Mirdif"
        ]
      )}

      ${pulseSelect(
        "pulse-scenario",
        "Scenario",
        [
          "All Scenarios",
          "Existing SHARE Member",
          "New Member Opportunity",
          "Points Redemption",
          "General SHARE Query"
        ]
      )}

      ${pulseSelect(
        "pulse-template",
        "Template",
        [
          "UAE - Service Pulse"
        ]
      )}

    </section>
  `;

}


function pulseSelect(
  id,
  label,
  values
) {

  return `
    <div class="filter-field">

      <label>
        ${label}
      </label>

      <select
        id="${id}"
        onchange="renderServicePulseFilteredView()"
      >

        ${values
          .map(value => `
            <option>
              ${value}
            </option>
          `)
          .join("")}

      </select>

    </div>
  `;

}


function getServicePulseFilteredData() {

  const bu =
    document.getElementById(
      "pulse-bu"
    )?.value ||
    "All BUs";


  const brand =
    document.getElementById(
      "pulse-brand"
    )?.value ||
    "All Brands";


  const location =
    document.getElementById(
      "pulse-location"
    )?.value ||
    "All Locations";


  const scenario =
    document.getElementById(
      "pulse-scenario"
    )?.value ||
    "All Scenarios";


  return servicePulseSubmissionsData
    .filter(item => {

      return (
        (
          bu === "All BUs" ||
          item.bu === bu
        ) &&
        (
          brand === "All Brands" ||
          item.brand === brand
        ) &&
        (
          location === "All Locations" ||
          item.location === location
        ) &&
        (
          scenario === "All Scenarios" ||
          item.scenario === scenario
        )
      );

    });

}


/* =========================================================
   SERVICE PULSE PAGE
========================================================= */

function servicePulsePage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Service Pulse",
      "Analyse SHARE service behaviour by BU, Brand, Mall, Location, Scenario and individual assessment."
    )}


    ${servicePulseFilters()}


    <div class="service-pulse-scope-note">

      <strong>
        UAE - Service Pulse
      </strong>

      <span>
        Visit Details → Scenario → Questions → Notes → Score
      </span>

    </div>


    <div class="tab-bar">

      ${pulseTabButton(
        "dashboard",
        "Dashboard"
      )}

      ${pulseTabButton(
        "submissions",
        "Submissions"
      )}

      ${pulseTabButton(
        "questions",
        "Question Analysis"
      )}

      ${pulseTabButton(
        "templates",
        "Templates"
      )}

    </div>


    <div
      id="service-pulse-content"
    >
      ${servicePulseTabContent()}
    </div>
  `;

}


function pulseTabButton(
  id,
  label
) {

  return `
    <button
      class="tab-button ${
        servicePulseTab === id
          ? "active"
          : ""
      }"

      onclick="setServicePulseTab('${id}')"
    >
      ${label}
    </button>
  `;

}


function setServicePulseTab(tab) {

  servicePulseTab =
    tab;


  servicePulseDetailId =
    null;


  renderCurrentPage();

}


function renderServicePulseFilteredView() {

  const content =
    document.getElementById(
      "service-pulse-content"
    );


  if (!content) return;


  content.innerHTML =
    servicePulseTabContent();

}


function servicePulseTabContent() {

  const data =
    getServicePulseFilteredData();


  if (
    servicePulseTab === "submissions"
  ) {

    return servicePulseSubmissionsView(
      data
    );

  }


  if (
    servicePulseTab === "questions"
  ) {

    return servicePulseQuestionView(
      data
    );

  }


  if (
    servicePulseTab === "templates"
  ) {

    return servicePulseTemplatesView();

  }


  return servicePulseDashboard(
    data
  );

}


/* =========================================================
   SERVICE PULSE DASHBOARD
========================================================= */

function servicePulseDashboard(
  data
) {

  const overall =
    servicePulseOverallScore(
      data
    );


  const locations =
    uniqueCount(
      data,
      "location"
    );


  const employees =
    uniqueCount(
      data,
      "employee"
    );


  return `
    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Service Pulse Score",
        `${overall.toFixed(2)}%`,
        "Average assessment score",
        metricDefinitions.servicePulse
      )}

      ${metricCard(
        "Assessments Completed",
        data.length,
        "Current filtered view",
        metricDefinitions.servicePulseSubmissions
      )}

      ${metricCard(
        "Locations Assessed",
        locations,
        "Current filtered view",
        metricDefinitions.locationsAssessed
      )}

      ${metricCard(
        "Employees Assessed",
        employees,
        "Current filtered view",
        metricDefinitions.employeesAssessed
      )}

    </div>


    <section class="service-pulse-ai-card">

      <div>

        <span class="section-label light-label">
          INTELLIGENT ANALYSIS
        </span>

        <h2>
          Turn assessment data into action
        </h2>

        <p>
          Analyse recurring behaviours, locations and scenarios in the current filtered view.
        </p>

      </div>

      <button
        class="analyse-overall-button"
        onclick="runServicePulseAI()"
      >
        ✦ Analyse Service Pulse
      </button>

    </section>


    <div
      id="service-pulse-ai-output"
      class="agent-output hidden-output"
    ></div>


    <div class="dashboard-grid two">

      ${servicePulseGroupedCard(
        "PERFORMANCE BY BUSINESS UNIT",
        "Business Unit",
        groupServicePulse(
          data,
          "bu"
        )
      )}

      ${servicePulseGroupedCard(
        "PERFORMANCE BY BRAND",
        "Brand",
        groupServicePulse(
          data,
          "brand"
        )
      )}

    </div>


    <div class="dashboard-grid two">

      ${servicePulseGroupedCard(
        "PERFORMANCE BY LOCATION",
        "Location",
        groupServicePulse(
          data,
          "location"
        )
      )}

      ${servicePulseScenarioCard(
        data
      )}

    </div>


    ${servicePulseBehaviourSummary()}


    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            RECENT ASSESSMENTS
          </span>

          <h3>
            Latest Service Pulse submissions
          </h3>

        </div>

        <button
          class="small-button"
          onclick="setServicePulseTab('submissions')"
        >
          View All
        </button>

      </div>


      ${data
        .slice(0, 6)
        .map(
          servicePulseSubmissionRow
        )
        .join("")}

    </section>
  `;

}


function servicePulseGroupedCard(
  label,
  groupLabel,
  items
) {

  return `
    <section class="dashboard-card">

      <span class="section-label">
        ${label}
      </span>

      <h3>
        ${groupLabel}
      </h3>


      ${
        items.length
          ? items
              .map(item => `

                <div class="pulse-ranking-row">

                  <div>

                    <strong>
                      ${item.name}
                    </strong>

                    <span>
                      ${item.assessments} assessments
                    </span>

                  </div>

                  <div class="pulse-score-side">

                    <strong>
                      ${item.score.toFixed(1)}%
                    </strong>

                    <span
                      class="status-block ${pulseStatusClass(item.score)}"
                    >
                      ${pulseStatusLabel(item.score)}
                    </span>

                  </div>

                </div>

              `)
              .join("")
          : `
            <div class="empty-state">
              No assessment data in this filtered view.
            </div>
          `
      }

    </section>
  `;

}


function servicePulseScenarioCard(
  data
) {

  const groups =
    groupServicePulse(
      data,
      "scenario"
    );


  return `
    <section class="dashboard-card">

      <span class="section-label">
        SCENARIO PERFORMANCE
      </span>

      <h3>
        SHARE customer journeys
      </h3>


      ${groups
        .map(item => `

          <div class="pulse-ranking-row">

            <div>

              <strong>
                ${item.name}
              </strong>

              <span>
                ${item.assessments} assessments
              </span>

            </div>

            <strong>
              ${item.score.toFixed(1)}%
            </strong>

          </div>

        `)
        .join("")}

    </section>
  `;

}


function pulseStatusClass(score) {

  if (score >= 85) {
    return "good";
  }


  if (score >= 70) {
    return "strengthen";
  }


  return "attention";

}


function pulseStatusLabel(score) {

  if (score >= 85) {
    return "Strong";
  }


  if (score >= 70) {
    return "Opportunity";
  }


  return "Needs Attention";

}


/* =========================================================
   SERVICE PULSE BEHAVIOURS
========================================================= */

function servicePulseBehaviourSummary() {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            CUSTOMER BEHAVIOUR ANALYSIS
          </span>

          <h3>
            Which SHARE behaviours are being followed?
          </h3>

          <p>
            Prototype analytical layer translating assessment questions into operational behaviours.
          </p>

        </div>

        <button
          class="small-button"
          onclick="setServicePulseTab('questions')"
        >
          View Question Analysis
        </button>

      </div>


      <div class="behaviour-grid">

        ${servicePulseBehaviourAnalytics
          .map(item => `
            <div class="behaviour-card">

              <strong>
                ${item.behaviour}
              </strong>

              <div class="behaviour-score">
                ${item.yes}%
              </div>

              <div class="behaviour-bar">

                <div
                  style="width:${item.yes}%"
                ></div>

              </div>

              <span>
                ${item.trend}
              </span>

            </div>
          `)
          .join("")}

      </div>

    </section>
  `;

}


function servicePulseQuestionView() {

  return `
    <section class="dashboard-card">

      <span class="section-label">
        QUESTION / BEHAVIOUR ANALYSIS
      </span>

      <h3>
        Performance against expected SHARE behaviours
      </h3>


      <div class="pulse-question-header">

        <span>Behaviour</span>
        <span>Yes</span>
        <span>No</span>
        <span>N/A</span>
        <span>Status</span>

      </div>


      ${servicePulseBehaviourAnalytics
        .map(item => `

          <div class="pulse-question-row">

            <strong data-label="Behaviour">
              ${item.behaviour}
            </strong>

            <strong data-label="Yes">
              ${item.yes}%
            </strong>

            <span data-label="No">
              ${item.no}%
            </span>

            <span data-label="N/A">
              ${item.na}%
            </span>

            <span
              data-label="Status"
              class="status-block ${
                item.yes >= 80
                  ? "good"
                  : item.yes >= 70
                    ? "strengthen"
                    : "attention"
              }"
            >
              ${item.trend}
            </span>

          </div>

        `)
        .join("")}

    </section>


    <section class="dashboard-card">

      <span class="section-label">
        SCENARIO QUESTION LIBRARY
      </span>

      <h3>
        Current Service Pulse scenarios
      </h3>


      ${servicePulseScenarios
        .map(scenario => `

          <details class="scenario-details">

            <summary>

              <strong>
                ${scenario.title}
              </strong>

              <span>
                ${scenario.questions.length} questions
              </span>

            </summary>

            <p>
              ${scenario.description}
            </p>

            <ol>

              ${scenario.questions
                .map(question => `
                  <li>
                    ${question}
                  </li>
                `)
                .join("")}

            </ol>

          </details>

        `)
        .join("")}

    </section>
  `;

}


/* =========================================================
   SERVICE PULSE SUBMISSIONS
========================================================= */

function servicePulseSubmissionsView(
  data
) {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            SERVICE PULSE SUBMISSIONS
          </span>

          <h3>
            Individual assessments
          </h3>

        </div>

        <button
          class="primary-small"
          onclick="exportServicePulse()"
        >
          ↓ Export
        </button>

      </div>


      <div class="pulse-submission-header">

        <span>Date</span>
        <span>Inspector</span>
        <span>BU / Brand</span>
        <span>Location / Employee</span>
        <span>Scenario</span>
        <span>Score</span>
        <span>Action</span>

      </div>


      ${data
        .map(
          servicePulseSubmissionRow
        )
        .join("")}

    </section>


    ${
      servicePulseDetailId
        ? servicePulseDetailView(
            servicePulseDetailId
          )
        : ""
    }
  `;

}


function servicePulseSubmissionRow(
  item
) {

  const score =
    percentage(
      item.score,
      item.totalScore
    );


  return `
    <div class="pulse-submission-row">

      <span data-label="Date">
        ${item.date}
      </span>

      <span data-label="Inspector">
        ${item.inspector}
      </span>

      <div data-label="BU / Brand">

        <strong>
          ${item.bu}
        </strong>

        <span>
          ${item.brand}
        </span>

      </div>

      <div data-label="Location / Employee">

        <strong>
          ${item.location}
        </strong>

        <span>
          ${item.employee}
        </span>

      </div>

      <span data-label="Scenario">
        ${item.scenario}
      </span>

      <div data-label="Score">

        <strong>
          ${score.toFixed(2)}%
        </strong>

        <span>
          ${item.score}/${item.totalScore}
        </span>

      </div>

      <button
        class="small-button"
        onclick="openServicePulseDetail('${item.id}')"
      >
        View Assessment
      </button>

    </div>
  `;

}


function openServicePulseDetail(id) {

  servicePulseDetailId =
    id;


  renderCurrentPage();


  setTimeout(() => {

    document
      .getElementById(
        "pulse-assessment-detail"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 50);

}


function servicePulseDetailView(id) {

  const item =
    servicePulseSubmissionsData
      .find(record =>
        record.id === id
      );


  if (!item) return "";


  const score =
    percentage(
      item.score,
      item.totalScore
    );


  const scenario =
    servicePulseScenarios.find(
      scenarioItem =>
        item.scenario ===
        scenarioItem.title
    );


  return `
    <section
      id="pulse-assessment-detail"
      class="pulse-assessment-detail"
    >

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            ASSESSMENT DETAIL
          </span>

          <h2>
            ${item.id}
          </h2>

          <p>
            ${item.date} · ${item.location}
          </p>

        </div>

        <button
          class="small-button"
          onclick="closeServicePulseDetail()"
        >
          Close
        </button>

      </div>


      <div class="assessment-detail-grid">

        ${assessmentDetail(
          "Inspector",
          item.inspector
        )}

        ${assessmentDetail(
          "Business Unit",
          item.bu
        )}

        ${assessmentDetail(
          "Brand",
          item.brand
        )}

        ${assessmentDetail(
          "Location",
          item.location
        )}

        ${assessmentDetail(
          "Employee",
          item.employee
        )}

        ${assessmentDetail(
          "Counter / POS",
          item.counter
        )}

        ${assessmentDetail(
          "Scenario",
          item.scenario
        )}

        ${assessmentDetail(
          "Score",
          `${score.toFixed(2)}% (${item.score}/${item.totalScore})`
        )}

      </div>


      ${
        scenario
          ? `
            <div class="assessment-question-preview">

              <span class="section-label">
                APPLICABLE QUESTION SET
              </span>

              <h3>
                ${scenario.title}
              </h3>

              <ol>

                ${scenario.questions
                  .map(question => `
                    <li>
                      ${question}
                    </li>
                  `)
                  .join("")}

              </ol>

            </div>
          `
          : ""
      }


      ${
        item.note
          ? `
            <div class="assessment-note">

              <span class="section-label">
                INSPECTOR NOTE
              </span>

              <p>
                ${item.note}
              </p>

            </div>
          `
          : ""
      }

    </section>
  `;

}


function assessmentDetail(
  label,
  value
) {

  return `
    <div class="assessment-detail-item">

      <span>
        ${label}
      </span>

      <strong>
        ${value}
      </strong>

    </div>
  `;

}


function closeServicePulseDetail() {

  servicePulseDetailId =
    null;


  renderCurrentPage();

}


function exportServicePulse() {

  const rows =
    getServicePulseFilteredData();


  const header = [
    "Date",
    "Inspector",
    "Business Unit",
    "Brand",
    "Location",
    "Employee",
    "Scenario",
    "Score",
    "Total Score",
    "Percentage"
  ];


  const output =
    rows.map(item => [

      item.date,
      item.inspector,
      item.bu,
      item.brand,
      item.location,
      item.employee,
      item.scenario,
      item.score,
      item.totalScore,
      percentage(
        item.score,
        item.totalScore
      ).toFixed(2)

    ]);


  const csv =
    [
      header,
      ...output
    ]
      .map(row =>
        row
          .map(value =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    "share-lens-service-pulse.csv";


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );

}


/* =========================================================
   SERVICE PULSE TEMPLATES
========================================================= */

function servicePulseTemplatesView() {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            SERVICE PULSE TEMPLATE
          </span>

          <h3>
            UAE - Service Pulse / نبض الخدمة
          </h3>

          <p>
            Scenario-driven assessment template with bilingual questions.
          </p>

        </div>

        <button
          class="primary-small"
          onclick="showToast('Prototype template editor opened')"
        >
          + Create / Update Template
        </button>

      </div>


      <div class="template-structure">

        <div class="template-section">

          <strong>
            1. Visit Details / تفاصيل الزيارة
          </strong>

          <span>
            Inspector · BU · Brand · Mall / Location · Visit Date · Employee · Counter / POS
          </span>

        </div>


        ${servicePulseScenarios
          .map(
            (scenario, index) => `

              <div class="template-section">

                <strong>
                  ${index + 2}. ${scenario.title}
                </strong>

                <span>
                  ${scenario.questions.length} applicable questions
                </span>

              </div>

            `
          )
          .join("")}


        <div class="template-section">

          <strong>
            Overall Interaction Rating
          </strong>

          <span>
            Assessment score and overall customer experience rating
          </span>

        </div>


        <div class="template-section">

          <strong>
            Signature
          </strong>

          <span>
            Inspector confirmation
          </span>

        </div>

      </div>

    </section>


    <section class="notice-card">

      <strong>
        Prototype scoring note
      </strong>

      <p>
        SHARE Lens currently reads the score and total score supplied by each assessment record. Production scoring, question weighting and treatment of N/A responses should follow the formally approved Service Pulse configuration.
      </p>

    </section>
  `;

}


/* =========================================================
   SERVICE PULSE AI
========================================================= */

function runServicePulseAI() {

  const output =
    document.getElementById(
      "service-pulse-ai-output"
    );


  if (!output) return;


  output.classList.remove(
    "hidden-output"
  );


  output.innerHTML =
    buildAgentPipeline(
      "Analysing Service Pulse",
      [
        "Assessment Agent",
        "Pattern Agent",
        "Location Severity Agent",
        "Behaviour Agent",
        "Next Best Action"
      ],
      "service-pulse-pipeline"
    );


  animatePipeline(
    "service-pulse-pipeline",
    [
      "Reviewing assessment scores, scenarios and individual responses...",
      "Looking for recurring behaviour patterns across assessments...",
      "Comparing performance across business units, brands and locations...",
      "Identifying which SHARE behaviours are driving the results...",
      "Preparing the recommended next best action..."
    ],
    showServicePulseAIResult
  );

}


function showServicePulseAIResult() {

  const output =
    document.getElementById(
      "service-pulse-ai-output"
    );


  if (!output) return;


  const filteredData =
    getServicePulseFilteredData();


  const overallScore =
    servicePulseOverallScore(
      filteredData
    );


  const locationGroups =
    groupServicePulse(
      filteredData,
      "location"
    );


  const scenarioGroups =
    groupServicePulse(
      filteredData,
      "scenario"
    );


  const weakestLocation =
    [...locationGroups]
      .sort(
        (a, b) =>
          a.score - b.score
      )[0];


  const weakestScenario =
    [...scenarioGroups]
      .sort(
        (a, b) =>
          a.score - b.score
      )[0];


  const weakestBehaviour =
    [...servicePulseBehaviourAnalytics]
      .sort(
        (a, b) =>
          a.yes - b.yes
      )[0];


  output.innerHTML = `
    <div class="pulse-ai-result">

      <div class="pulse-ai-result-header">

        <div>

          <span class="section-label">
            SERVICE PULSE AI ANALYSIS
          </span>

          <h2>
            Primary opportunity:
            ${weakestBehaviour.behaviour}
          </h2>

          <p>
            SHARE Lens analysed ${filteredData.length} assessments in the current filtered view. Overall Service Pulse performance is ${overallScore.toFixed(2)}%.
          </p>

        </div>

        <span
          class="status-block ${pulseStatusClass(overallScore)}"
        >
          ${pulseStatusLabel(overallScore)}
        </span>

      </div>


      <div class="dashboard-grid four pulse-ai-result-cards">

        ${metricCard(
          "Overall Service Pulse",
          `${overallScore.toFixed(2)}%`,
          `${filteredData.length} assessments`
        )}

        ${metricCard(
          "Weakest Behaviour",
          `${weakestBehaviour.yes}%`,
          weakestBehaviour.behaviour
        )}

        ${metricCard(
          "Lowest Location",
          weakestLocation
            ? `${weakestLocation.score.toFixed(1)}%`
            : "N/A",
          weakestLocation
            ? weakestLocation.name
            : "No location data"
        )}

        ${metricCard(
          "Weakest Scenario",
          weakestScenario
            ? `${weakestScenario.score.toFixed(1)}%`
            : "N/A",
          weakestScenario
            ? weakestScenario.name
            : "No scenario data"
        )}

      </div>


      <div class="pulse-ai-insight-grid">

        <section class="pulse-ai-insight">

          <span class="section-label">
            WHAT IS DRIVING IT
          </span>

          <h3>
            ${weakestBehaviour.behaviour}
          </h3>

          <p>
            ${100 - weakestBehaviour.yes}% of the current prototype behaviour sample does not demonstrate this expected SHARE behaviour.
          </p>

        </section>


        <section class="pulse-ai-insight">

          <span class="section-label">
            WHERE TO LOOK
          </span>

          <h3>
            ${
              weakestLocation
                ? weakestLocation.name
                : "Location analysis"
            }
          </h3>

          <p>
            ${
              weakestLocation
                ? `${weakestLocation.name} currently has the lowest average Service Pulse score at ${weakestLocation.score.toFixed(1)}%.`
                : "Use the location filters to identify the lowest-performing locations."
            }
          </p>

        </section>


        <section class="pulse-ai-insight">

          <span class="section-label">
            CUSTOMER JOURNEY
          </span>

          <h3>
            ${
              weakestScenario
                ? weakestScenario.name
                : "Scenario analysis"
            }
          </h3>

          <p>
            ${
              weakestScenario
                ? `This scenario currently has the lowest average score at ${weakestScenario.score.toFixed(1)}%.`
                : "Review scenario performance to identify journey-level gaps."
            }
          </p>

        </section>


        <section class="pulse-ai-insight recommended-action-insight">

          <span class="section-label">
            NEXT BEST ACTION
          </span>

          <h3>
            Targeted SHARE behaviour refresher
          </h3>

          <p>
            Assign focused learning to the affected population, follow with a Knowledge Check and validate improvement in the next Service Pulse cycle.
          </p>

        </section>

      </div>


      <div class="pulse-ai-actions">

        <button
          class="small-button"
          onclick="setServicePulseTab('questions')"
        >
          View Question Analysis
        </button>

        <button
          class="small-button"
          onclick="setServicePulseTab('submissions')"
        >
          View Assessments
        </button>

        <button
          class="primary-small"
          onclick="navigateTo('group-training')"
        >
          Review Training
        </button>

      </div>

    </div>
  `;

}


/* =========================================================
   AUDIT
========================================================= */

function auditPage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Service Audit / Mystery Shop",
      "Review audit and Mystery Shop findings."
    )}

    ${managementFilters(true)}


    <div class="dashboard-grid four">

      ${metricCard(
        "Audits Completed",
        "42",
        "Current period"
      )}

      ${metricCard(
        "Average Score",
        "84%",
        "Current period"
      )}

      ${metricCard(
        "Critical Findings",
        "3",
        "Needs intervention"
      )}

      ${metricCard(
        "Open Actions",
        "11",
        "Current"
      )}

    </div>


    <section class="notice-card">

      <strong>
        Prototype assumption
      </strong>

      <p>
        Mystery Shop scoring and report ingestion will be aligned to the current reporting structure once formally confirmed.
      </p>

    </section>
  `;

}


/* =========================================================
   MANAGEMENT AI
========================================================= */

function runManagerAnalysis() {

  const output =
    document.getElementById(
      "manager-agent-output"
    );


  if (!output) return;


  output.innerHTML =
    buildAgentPipeline(
      "Analysing Entertainment UAE",
      [
        "Performance Agent",
        "Pattern Agent",
        "Knowledge Gap Agent",
        "Intervention Agent"
      ],
      "manager-pipeline"
    );


  animatePipeline(
    "manager-pipeline",
    [
      "Reviewing performance across the selected BU scope...",
      "Identifying recurring patterns...",
      "Linking patterns to knowledge gaps...",
      "Preparing the recommended intervention..."
    ],
    () => {

      output.innerHTML = `
        <span class="section-label">
          BU AI ANALYSIS
        </span>

        <h3>
          Refund SLA knowledge is the highest recurring opportunity.
        </h3>

        <p>
          34 Ambassadors across 3 locations are contributing to the pattern.
        </p>
      `;

    }
  );

}


function runServiceAnalysis() {

  const output =
    document.getElementById(
      "service-agent-output"
    );


  if (!output) return;


  output.innerHTML =
    buildAgentPipeline(
      "Analysing Service Delivery Scope",
      [
        "Performance Agent",
        "Pattern Agent",
        "Location Severity Agent",
        "Intervention Agent"
      ],
      "service-performance-pipeline"
    );


  animatePipeline(
    "service-performance-pipeline",
    [
      "Reviewing performance across the selected organisational scope...",
      "Identifying systemic patterns...",
      "Ranking affected locations by severity...",
      "Preparing the recommended intervention..."
    ],
    () => {

      output.innerHTML = `
        <span class="section-label">
          SERVICE DELIVERY AI ANALYSIS
        </span>

        <h3>
          Refund SLA remains the highest recurring cross-location theme.
        </h3>

        <p>
          City Centre Deira currently shows the highest severity within the prototype dataset.
        </p>
      `;

    }
  );

}


/* =========================================================
   ADMIN
========================================================= */

function adminHome() {

  return `
    ${pageTitle(
      "PLATFORM ADMINISTRATION",
      "SHARE Lens Platform",
      "Manage identity, access, AI agents, integrations and governance."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Platform Users",
        "1,124",
        "All roles"
      )}

      ${metricCard(
        "Active Ambassadors",
        "812",
        "Current"
      )}

      ${metricCard(
        "AI Agents",
        "13",
        "Configured"
      )}

      ${metricCard(
        "Integrations",
        "11",
        "Prototype"
      )}

    </div>
  `;

}


function integrationsPage() {

  const integrations = [

    ["Mitti / SafetyCulture", "Training / Service Pulse", "Prototype"],
    ["Knowmax", "Knowledge Base", "Prototype"],
    ["Infobip", "Communications", "Prototype"],
    ["Adjust", "Acquisition Attribution", "Prototype"],
    ["Alida", "Ambassador Hub", "Placeholder"],
    ["OneView", "Customer / Service Context", "Placeholder"],
    ["Asana", "Action / Task Connectivity", "Placeholder"],
    ["HR / Staff Master", "Identity & Organisational Scope", "Prototype"],
    ["Genesys", "Customer Interactions", "Planned"]

  ];


  return `
    ${pageTitle(
      "PLATFORM",
      "Integrations",
      "Prototype representation of current and future connectivity."
    )}


    <div class="dashboard-grid three">

      ${integrations
        .map(item => `
          <section class="dashboard-card">

            <span class="section-label">
              INTEGRATION
            </span>

            <h3>
              ${item[0]}
            </h3>

            <p>
              ${item[1]}
            </p>

            <span
              class="status-block ${
                item[2] === "Placeholder"
                  ? "strengthen"
                  : "good"
              }"
            >
              ${item[2]}
            </span>

          </section>
        `)
        .join("")}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        SHARE PROGRAMME CONFIGURATION
      </span>

      <h3>
        Points-value conversion
      </h3>

      <p>
        The prototype currently uses <strong>1 SHARE Point = AED ${SHARE_POINT_AED_VALUE.toFixed(2)}</strong> for estimated monetary-value reporting.
      </p>

    </section>
  `;

}


/* =========================================================
   GENERIC
========================================================= */

function genericRolePage(
  label,
  title,
  description
) {

  return `
    ${pageTitle(
      label,
      title,
      description
    )}

    <section class="dashboard-card">

      <span class="section-label">
        PROTOTYPE VIEW
      </span>

      <h3>
        ${title}
      </h3>

      <p>
        This capability is represented within the SHARE Lens prototype.
      </p>

    </section>
  `;

}


/* =========================================================
   ROUTING
========================================================= */

function navigateTo(
  page,
  options = {}
) {

  if (
    page === "performance" &&
    !options.preserveInteraction
  ) {

    expandedInteractionId =
      null;

  }


  currentPage =
    page;


  notificationDrawerOpen =
    false;


  closeMobileNav();


  renderCurrentPage();

}


function openPerformanceInteraction(id) {

  expandedInteractionId =
    id;


  navigateTo(
    "performance",
    {
      preserveInteraction: true
    }
  );


  setTimeout(() => {

    document
      .getElementById(
        `inline-analysis-${id}`
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

  }, 100);

}


function renderCurrentPage() {

  let content = "";


  if (
    currentRole === "ambassador"
  ) {

    const pages = {

      home:
        renderAmbassadorHomeV012,

      "service-pulse":
        renderServicePulseV012,

      communications:
        renderCommunicationsV012,

      feedback:
        renderFeedbackV012,

      suggestions:
        renderSuggestionsV012,

      "manual-transaction":
        renderManualTransactionV012,

      "share-wall":
        renderShareWallV012,

      training:
        renderTrainingLandingV012,

      "training-online":
        renderOnlineTrainingV012,

      "training-physical":
        renderPhysicalTrainingV012,

      knowledge:
        renderKnowledgeV012,

      reports:
        renderReportsV012,

      "knowledge-check":
        knowledgeCheckPage,

      status:
        renderStatusV012

    };


    content =
      pages[currentPage]
        ? pages[currentPage]()
        : renderAmbassadorHomeV012();

  }


  if (
    currentRole === "manager"
  ) {

    const pages = {

      home:
        managerHome,

      "team-performance":
        managerPerformance,

      "team-attention":
        () =>
          attentionPage(false),

      "training-overview":
        () =>
          managementTrainingPage(false),

      "knowledge-gaps":
        () =>
          knowledgeGapsPage(false),

      "manager-knowledge":
        () => `
          ${pageTitle(
            "TRAINING & KNOWLEDGE",
            "Knowledge Base",
            "Browse and maintain approved knowledge."
          )}

          ${managementFilters(false)}

          ${knowledgeRepositorySection(true)}
        `,

      ambassadors:
        () =>
          ambassadorsPage(false),

      "manager-onboarding":
        () =>
          lifecyclePage(false),

      "manager-acquisition":
        () =>
          acquisitionPage(false),

      "manager-communications":
        () =>
          communicationsPage(false),

      "manager-hub":
        () =>
          hubPage(false)

    };


    content =
      pages[currentPage]
        ? pages[currentPage]()
        : managerHome();

  }


  if (
    currentRole === "service"
  ) {

    const pages = {

      home:
        serviceHome,

      "group-performance":
        servicePerformance,

      "group-attention":
        () =>
          attentionPage(true),

      "service-pulse":
        servicePulsePage,

      audit:
        auditPage,

      "group-training":
        () =>
          managementTrainingPage(true),

      "group-gaps":
        () =>
          knowledgeGapsPage(true),

      "group-knowledge":
        () => `
          ${pageTitle(
            "TRAINING & KNOWLEDGE",
            "Knowledge Base",
            "Browse and maintain approved knowledge."
          )}

          ${managementFilters(true)}

          ${knowledgeRepositorySection(true)}
        `,

      "group-ambassadors":
        () =>
          ambassadorsPage(true),

      "group-onboarding":
        () =>
          lifecyclePage(true),

      "group-acquisition":
        () =>
          acquisitionPage(true),

      "group-communications":
        () =>
          communicationsPage(true),

      "group-hub":
        () =>
          hubPage(true),

      "group-recognition":
        () =>
          acquisitionPage(true),

      "group-actions":
        () =>
          genericRolePage(
            "SERVICE DELIVERY",
            "Actions",
            "Track corrective actions and follow-up."
          )

    };


    content =
      pages[currentPage]
        ? pages[currentPage]()
        : serviceHome();

  }


  if (
    currentRole === "admin"
  ) {

    const pages = {

      home:
        adminHome,

      integrations:
        integrationsPage,

      "knowledge-sources":
        () => `
          ${pageTitle(
            "AI PLATFORM",
            "Knowledge Sources",
            "Manage approved knowledge sources used by SHARE Lens."
          )}

          ${knowledgeRepositorySection(true)}
        `,

      "users-access":
        () =>
          genericRolePage(
            "IDENTITY & ACCESS",
            "Users & Access",
            "Manage Staff ID, Microsoft SSO and organisational scope."
          ),

      roles:
        () =>
          genericRolePage(
            "IDENTITY & ACCESS",
            "Roles & Permissions",
            "Configure role-based access."
          ),

      identity:
        () =>
          genericRolePage(
            "IDENTITY & ACCESS",
            "Identity Providers",
            "Configure Staff ID and Microsoft Entra ID."
          ),

      "ai-agents":
        () =>
          genericRolePage(
            "AI PLATFORM",
            "AI Agents",
            "View specialist AI capabilities."
          ),

      "agent-config":
        () =>
          genericRolePage(
            "AI PLATFORM",
            "Agent Configuration",
            "Configure AI orchestration."
          ),

      frameworks:
        () =>
          genericRolePage(
            "PLATFORM",
            "Assessment Frameworks",
            "Configure assessment templates and scoring."
          ),

      notifications:
        () =>
          genericRolePage(
            "PLATFORM",
            "Notifications",
            "Configure alerts and reminders."
          ),

      "engagement-leaderboard":
        () =>
          acquisitionPage(true),

      "audit-log":
        () =>
          genericRolePage(
            "PLATFORM",
            "Audit Log",
            "Review platform activity."
          )

    };


    content =
      pages[currentPage]
        ? pages[currentPage]()
        : adminHome();

  }


  renderShell(content);

  if (
    currentRole === "ambassador"
  ) {

    initializeV12Motion();

  }

}


/* =========================================================
   COMPONENT: v0.12 Ambassador Action Handlers

   PURPOSE:
   Bridges modular Ambassador pages to the existing global
   prototype shell and toast system.

   BUSINESS MEANING:
   Keeps page-specific workflows outside app.js while
   preserving the existing no-framework navigation pattern.

   INPUTS:
   Native form values from modular Ambassador pages.

   OUTPUTS:
   Prototype submissions and refreshed page state.

   CHANGE IMPACT:
   Changes affect Ambassador workflow submission behaviour.
========================================================= */

function runV12Submission(action, successMessage) {

  try {

    const submission =
      action();

    showToast(
      `${successMessage} · ${submission.submissionId}`
    );

    renderCurrentPage();

  } catch (error) {

    showToast(
      error?.message ||
      "Please check the form and try again."
    );

  }

}


function selectServicePulseScenarioV012(
  scenario
) {

  setServicePulseScenarioV012(
    scenario
  );

  renderCurrentPage();

}


function submitServicePulseV012() {

  runV12Submission(
    submitServicePulseFormV012,
    "Service Pulse submitted"
  );

}


function submitFeedbackV012() {

  runV12Submission(
    submitFeedbackFormV012,
    "Feedback submitted"
  );

}


function submitSuggestionV012() {

  runV12Submission(
    submitSuggestionFormV012,
    "Suggestion submitted"
  );

}


function submitManualTransactionV012() {

  try {

    const submission =
      submitManualTransactionFormV012();

    const button =
      document.getElementById(
        "mt-submit-button"
      );

    if (button) {

      button.disabled = true;
      button.textContent =
        "Processing...";

    }


    const validation =
      document.querySelector(
        '[data-flow-step="validation"]'
      );

    const oneView =
      document.querySelector(
        '[data-flow-step="oneview"]'
      );

    const ticketResult =
      document.getElementById(
        "manual-ticket-result"
      );


    if (validation) {

      validation.classList.remove(
        "idle",
        "processing"
      );

      validation.classList.add(
        "complete"
      );

      validation.querySelector(
        ".v12-ticket-state"
      ).textContent =
        "Validated";

    }


    setTimeout(
      () => {

        if (oneView) {

          oneView.classList.remove(
            "idle",
            "complete"
          );

          oneView.classList.add(
            "processing"
          );

          oneView.querySelector(
            ".v12-ticket-state"
          ).textContent =
            "Sending payload";

        }

      },
      500
    );


    setTimeout(
      () => {

        if (oneView) {

          oneView.classList.remove(
            "processing",
            "idle"
          );

          oneView.classList.add(
            "complete"
          );

          oneView.querySelector(
            ".v12-ticket-state"
          ).textContent =
            "Ticket received";

        }


        if (ticketResult) {

          ticketResult.classList.add(
            "visible"
          );

          ticketResult.querySelector(
            "strong"
          ).textContent =
            submission.data.oneViewTicketId;

        }


        showToast(
          `OneView ticket created · ${submission.data.oneViewTicketId}`
        );

      },
      1350
    );


    setTimeout(
      () => {

        renderCurrentPage();

      },
      2200
    );

  } catch (error) {

    showToast(
      error?.message ||
      "Please check the form and try again."
    );

  }

}


function closeManualTransactionV012(
  submissionId
) {

  const updated =
    closeManualTransactionFormV012(
      submissionId
    );

  if (!updated) {

    showToast(
      "Unable to update this ticket."
    );

    return;

  }


  const resolution =
    document.querySelector(
      '[data-flow-step="resolution"]'
    );


  if (resolution) {

    resolution.classList.remove(
      "idle",
      "processing"
    );

    resolution.classList.add(
      "complete"
    );

    resolution.querySelector(
      ".v12-ticket-state"
    ).textContent =
      "Closed";

  }


  showToast(
    "Ticket marked closed and resolved."
  );


  setTimeout(
    () => {

      renderCurrentPage();

    },
    650
  );

}


function submitShareWallV012() {

  runV12Submission(
    submitShareWallFormV012,
    "SHARE Wall update submitted"
  );

}


function submitPhysicalTrainingV012() {

  runV12Submission(
    submitPhysicalTrainingFormV012,
    "Training session logged"
  );

}


function participateInCampaignV012(
  communicationId
) {

  runV12Submission(
    () =>
      participateInCampaignFormV012(
        communicationId
      ),
    "Campaign participation recorded"
  );

}


function reactToBroadcastV012(
  communicationId,
  reaction
) {

  runV12Submission(
    () =>
      reactToBroadcastFormV012(
        communicationId,
        reaction
      ),
    reaction === "up"
      ? "Broadcast acknowledged with thumbs up"
      : "Broadcast acknowledged with thumbs down"
  );

}


function filterV12Knowledge() {

  const query =
    document
      .getElementById(
        "v12-knowledge-search"
      )
      ?.value ||
    "";

  const target =
    document.getElementById(
      "v12-knowledge-results"
    );

  if (!target) return;

  target.innerHTML =
    renderKnowledgeResultsV012(
      query
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.signIn =
  signIn;

window.continueWithSSO =
  continueWithSSO;

window.signOut =
  signOut;

window.navigateTo =
  navigateTo;

window.toggleMobileNav =
  toggleMobileNav;

window.closeMobileNav =
  closeMobileNav;

window.toggleInfo =
  toggleInfo;

window.showToast =
  showToast;

window.toggleNotificationDrawer =
  toggleNotificationDrawer;

window.handleNotificationAction =
  handleNotificationAction;

window.toggleInteractionDetails =
  toggleInteractionDetails;

window.analyseInlineInteraction =
  analyseInlineInteraction;

window.startInlineAnalysis =
  startInlineAnalysis;

window.openPerformanceInteraction =
  openPerformanceInteraction;

window.runAmbassadorOverallAnalysis =
  runAmbassadorOverallAnalysis;

window.runManagerAnalysis =
  runManagerAnalysis;

window.runServiceAnalysis =
  runServiceAnalysis;

window.answerKnowledgeQuestion =
  answerKnowledgeQuestion;

window.nextKnowledgeQuestion =
  nextKnowledgeQuestion;

window.filterKnowledgeBase =
  filterKnowledgeBase;

window.toggleKnowledgeEditor =
  toggleKnowledgeEditor;

window.calculateSharePoints =
  calculateSharePoints;

window.exportAmbassadorList =
  exportAmbassadorList;

window.showBroadcastComposer =
  showBroadcastComposer;

window.setServicePulseTab =
  setServicePulseTab;

window.renderServicePulseFilteredView =
  renderServicePulseFilteredView;

window.openServicePulseDetail =
  openServicePulseDetail;

window.closeServicePulseDetail =
  closeServicePulseDetail;

window.exportServicePulse =
  exportServicePulse;

window.runServicePulseAI =
  runServicePulseAI;

window.selectServicePulseScenarioV012 =
  selectServicePulseScenarioV012;

window.submitServicePulseV012 =
  submitServicePulseV012;

window.submitFeedbackV012 =
  submitFeedbackV012;

window.submitSuggestionV012 =
  submitSuggestionV012;

window.submitManualTransactionV012 =
  submitManualTransactionV012;

window.closeManualTransactionV012 =
  closeManualTransactionV012;

window.submitShareWallV012 =
  submitShareWallV012;

window.submitPhysicalTrainingV012 =
  submitPhysicalTrainingV012;

window.participateInCampaignV012 =
  participateInCampaignV012;

window.reactToBroadcastV012 =
  reactToBroadcastV012;

window.filterV12Knowledge =
  filterV12Knowledge;


/* =========================================================
   ENTER KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      document.getElementById(
        "login-id"
      )
    ) {

      signIn();

    }

  }
);
