import { analyseInteraction } from "./agents/agentOrchestrator.js";

const app = document.getElementById("app");


/* =========================================================
   BUILD
========================================================= */

const APP_VERSION = "0.9.0";
const APP_BUILD_DATE = "15 Oct 2026";


/* =========================================================
   STATE
========================================================= */

let currentRole = null;
let currentPage = "home";

let expandedInteractionId = null;

let notificationDrawerOpen = false;
let unreadNotifications = 5;

let servicePulseTab = "dashboard";

let knowledgeEditorOpen = false;

let knowledgeCheckQuestion = 1;
let knowledgeCheckScore = 0;
let knowledgeCheckAnswered = false;


/* =========================================================
   SHARED PERIOD
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
    "A consolidated view of service performance for the selected period, based on the applicable assessed interactions and performance measures available for the selected person or organisational scope.",

  serviceQuality:
    "How well customer interactions are handled, including communication, issue understanding, resolution quality and customer handling.",

  sop:
    "How consistently the required service process steps were followed correctly.",

  compliance:
    "Whether mandatory controls, policies and critical requirements were completed correctly.",

  knowledge:
    "The average result from completed Knowledge Checks in the selected period.",

  training:
    "The completion status of formal learning assigned to the Ambassador for the current learning plan.",

  acquisition:
    "SHARE members onboarded through attributable Ambassador activity, including the Ambassador's Personal QR Code, against the target for the selected period.",

  activeAmbassadors:
    "Ambassadors currently active within the selected organisational scope.",

  trainingCompletion:
    "Percentage of assigned learning completed within the selected organisational scope and period.",

  engagement:
    "Points earned from Ambassador Program engagement such as recognised contributions, selected programme activity and communication engagement."

};


/* =========================================================
   NOTIFICATIONS
========================================================= */

const ambassadorNotifications = [

  {
    id: "N-001",
    type: "knowledge",
    title: "Refund Process updated",
    detail: "Review the latest Refund Process guidance.",
    date: "Today",
    action: "Open Knowledge",
    target: "knowledge",
    unread: true
  },

  {
    id: "N-002",
    type: "recognition",
    title: "Noor reached 50 SHARE onboardings",
    detail: "Recognise a fellow Ambassador.",
    date: "Today",
    action: "Cheer Noor",
    target: "cheer",
    unread: true
  },

  {
    id: "N-003",
    type: "training",
    title: "Service Recovery Essentials",
    detail: "2 days remaining to complete your assigned training.",
    date: "Today",
    action: "Open Training",
    target: "training",
    unread: true
  },

  {
    id: "N-004",
    type: "knowledge-check",
    title: "Refund Handling Knowledge Check",
    detail: "Recommended after your performance-linked refresher.",
    date: "14 Oct",
    action: "Start Check",
    target: "knowledge-check",
    unread: true
  },

  {
    id: "N-005",
    type: "announcement",
    title: "SHARE Member Week",
    detail: "Entertainment UAE programme update from Ahmed.",
    date: "13 Oct",
    action: "View",
    target: "announcement",
    unread: true
  }

];


/* =========================================================
   INTERACTIONS
========================================================= */

const interactions = [

  {
    id: "INT-1001",
    date: "10 Oct 2026",
    channel: "Voice",
    duration: "08:42",
    process: "Refund Handling",
    score: 86,
    customer: "Aisha Rahman",
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
    customer: "Omar Khalid",
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
    customer: "Sara Malik",
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check"
  }

];


/* =========================================================
   TRAINING
========================================================= */

const assignedTraining = [

  {
    id: "share-cx",
    title: "SHARE Customer Experience",
    duration: "20 min",
    assigned: "01 Oct 2026",
    due: "15 Oct 2026",
    status: "Completed",
    dueState: "Completed 10 Oct 2026",
    dueClass: "complete"
  },

  {
    id: "product-knowledge",
    title: "Product Knowledge",
    duration: "30 min",
    assigned: "20 Sep 2026",
    due: "30 Sep 2026",
    status: "Completed",
    dueState: "Completed 28 Sep 2026",
    dueClass: "complete"
  },

  {
    id: "share-member-onboarding",
    title: "SHARE Member Onboarding",
    duration: "20 min",
    assigned: "20 Sep 2026",
    due: "01 Oct 2026",
    status: "Completed",
    dueState: "Completed 25 Sep 2026",
    dueClass: "complete"
  },

  {
    id: "service-recovery",
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

  recommended: "14 Oct 2026",

  triggerInteractions: [
    "INT-1001",
    "INT-0984"
  ],

  reason:
    "Recommended because refund timeline communication was identified as a recurring opportunity.",

  knowledgeCheck: {
    title: "Refund Handling Knowledge Check",
    questions: 10,
    duration: "5 min",
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
   MANAGEMENT DATA
========================================================= */

const managerPerformanceBreakdown = [

  ["BU", "Entertainment", 86, 238],
  ["Brand", "VOX Cinemas", 87, 172],
  ["Mall", "Mall of the Emirates", 91, 38],
  ["Mall", "City Centre Mirdif", 88, 31],
  ["Mall", "City Centre Deira", 74, 27],
  ["Mall", "City Centre Al Zahia", 86, 24]

].map(([level, name, score, ambassadors]) => ({
  level,
  name,
  score,
  ambassadors
}));


const managerAttentionItems = [

  ["Critical", "City Centre Deira", "Refund SLA knowledge", "8 Ambassadors"],
  ["High", "City Centre Mirdif", "Training overdue", "5 Ambassadors"],
  ["Medium", "Mall of the Emirates", "Service Recovery", "3 Ambassadors"]

].map(([severity, location, issue, affected]) => ({
  severity,
  location,
  issue,
  affected
}));


const ambassadorPopulation = [

  ["Layla Haddad", "100245", "Entertainment", "VOX Cinemas", "Mall of the Emirates", "VOX MOE", 86, 100, 42, 185, "Active"],

  ["Noor Hassan", "100822", "Entertainment", "VOX Cinemas", "City Centre Mirdif", "VOX CCM", 91, 100, 50, 240, "Active"],

  ["Rania Ali", "100845", "Entertainment", "VOX Cinemas", "City Centre Deira", "VOX CCD", 74, 82, 29, 135, "Active"],

  ["Sami Omar", "100901", "Entertainment", "VOX Cinemas", "City Centre Al Zahia", "VOX CCAZ", 88, 94, 44, 210, "Active"],

  ["Sara Khan", "100928", "Entertainment", "VOX Cinemas", "City Centre Deira", "VOX CCD", 72, 69, 21, 120, "Active"]

].map(
  ([
    name,
    staffId,
    bu,
    brand,
    mall,
    location,
    performance,
    training,
    members,
    engagement,
    status
  ]) => ({
    name,
    staffId,
    bu,
    brand,
    mall,
    location,
    performance,
    training,
    members,
    engagement,
    status
  })
);


const managerKnowledgeGaps = [

  ["Refund SLA", 34, 72, "Service Quality", "Declining"],
  ["Customer Verification", 18, 81, "SOP Adherence", "Stable"],
  ["SHARE Benefits", 11, 84, "Member Acquisition", "Improving"]

].map(
  ([
    theme,
    ambassadors,
    knowledgeScore,
    relatedPerformance,
    trend
  ]) => ({
    theme,
    ambassadors,
    knowledgeScore,
    relatedPerformance,
    trend
  })
);


const managerTrainingOverview = [

  ["SHARE Customer Experience", 238, 224, 9, 5, "4 days"],
  ["Service Recovery Essentials", 118, 91, 19, 8, "6 days"],
  ["Product Knowledge", 238, 230, 4, 4, "3 days"]

].map(
  ([
    training,
    assigned,
    completed,
    inProgress,
    overdue,
    avgAging
  ]) => ({
    training,
    assigned,
    completed,
    inProgress,
    overdue,
    avgAging
  })
);


/* =========================================================
   COMMUNICATIONS
========================================================= */

const communicationsFeed = [

  ["SHARE Member Week", "Announcement", "13 Oct 2026", "221 / 238", 198, 74, 18],

  ["New Service Recovery Guide", "Knowledge Update", "09 Oct 2026", "238 / 238", 215, 61, 11]

].map(
  ([
    title,
    type,
    date,
    reach,
    views,
    likes,
    comments
  ]) => ({
    title,
    type,
    date,
    reach,
    views,
    likes,
    comments
  })
);


/* =========================================================
   HUB
========================================================= */

const ambassadorHubSubmissions = [

  ["Feedback", 18, 4, "Alida"],
  ["Suggestion", 24, 7, "Alida"],
  ["In-Store Training", 13, 2, "Alida"],
  ["SHARE Walls", 9, 1, "Alida"]

].map(([type, submissions, open, integration]) => ({
  type,
  submissions,
  open,
  integration
}));


/* =========================================================
   SERVICE PULSE
========================================================= */

const servicePulseRows = [

  ["Mall of the Emirates", "Entertainment", "VOX Cinemas", "91%", "On Track"],
  ["City Centre Mirdif", "Entertainment", "VOX Cinemas", "82%", "Opportunity to Strengthen"],
  ["City Centre Deira", "Entertainment", "VOX Cinemas", "71%", "Needs Attention"],
  ["City Centre Al Zahia", "Entertainment", "VOX Cinemas", "88%", "Opportunity to Strengthen"]

];


const servicePulseTemplates = [

  ["UAE - Service Pulse", "UAE", "12 sections", "48 questions", "Published"],
  ["Bahrain - Service Pulse", "Bahrain", "11 sections", "44 questions", "Draft"],
  ["Oman - Service Pulse", "Oman", "12 sections", "46 questions", "Published"]

];


/* =========================================================
   NAVIGATION
========================================================= */

const navigation = {

  ambassador: [

    {
      title: "",
      items: [
        ["home", "Home"]
      ]
    },

    {
      title: "Performance",
      items: [
        ["performance", "My Performance"]
      ]
    },

    {
      title: "Training & Knowledge",
      items: [
        ["training", "My Training"],
        ["knowledge", "Knowledge Base"]
      ]
    },

    {
      title: "Ambassador",
      items: [
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
   AUTH
========================================================= */

function setLoginMessage(message, type = "error") {

  const node =
    document.getElementById("login-error");

  if (!node) return;

  node.textContent = message;
  node.className = `login-error ${type}`;

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


  if (!login) {

    setLoginMessage(
      "Enter your corporate email first to continue with Microsoft SSO.",
      "info"
    );

    return;

  }


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
      "Microsoft SSO is available for the corporate prototype accounts. Ambassador access is demonstrated using Staff ID.",
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

  navigateTo("home");

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

  const showNotifications =
    currentRole === "ambassador";


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
          showNotifications
            ? `
              <button
                class="notification-button"
                onclick="toggleNotificationDrawer()"
                aria-label="Notifications"
              >
                <span class="notification-bell">
                  ♢
                </span>

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

  const groups =
    navigation[currentRole];


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


      ${groups.map(group => `

        ${
          group.title
            ? `
              <div class="sidebar-title">
                ${group.title}
              </div>
            `
            : ""
        }

        ${group.items.map(item => `

          <div
            class="nav-item ${
              currentPage === item[0]
                ? "active"
                : ""
            }"
            onclick="navigateTo('${item[0]}')"
          >
            ${item[1]}
          </div>

        `).join("")}

      `).join("")}


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
   NOTIFICATION DRAWER
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


      <div class="notification-list">

        ${ambassadorNotifications
          .map(notificationItem)
          .join("")}

      </div>


      <button
        class="mark-read-button"
        onclick="markAllNotificationsRead()"
      >
        Mark all as read
      </button>

    </aside>
  `;

}


function notificationItem(item) {

  return `
    <div class="notification-item ${item.unread ? "unread" : ""}">

      <div class="notification-type-icon ${item.type}">
        ${notificationIcon(item.type)}
      </div>

      <div class="notification-copy">

        <div class="notification-title-row">

          <strong>
            ${item.title}
          </strong>

          <span>
            ${item.date}
          </span>

        </div>

        <p>
          ${item.detail}
        </p>

        <button
          onclick="handleNotificationAction('${item.target}', '${item.id}')"
        >
          ${item.action}
        </button>

      </div>

    </div>
  `;

}


function notificationIcon(type) {

  const icons = {
    knowledge: "K",
    recognition: "★",
    training: "T",
    "knowledge-check": "?",
    announcement: "!"
  };

  return icons[type] || "•";

}


function toggleNotificationDrawer() {

  notificationDrawerOpen =
    !notificationDrawerOpen;

  rerenderCurrentPage();

}


function markAllNotificationsRead() {

  ambassadorNotifications.forEach(
    item => {
      item.unread = false;
    }
  );

  unreadNotifications = 0;

  rerenderCurrentPage();

}


function handleNotificationAction(target, id) {

  const notification =
    ambassadorNotifications.find(
      item => item.id === id
    );

  if (notification) {
    notification.unread = false;
  }

  unreadNotifications =
    ambassadorNotifications.filter(
      item => item.unread
    ).length;


  if (target === "cheer") {

    showToast(
      "You cheered Noor. +5 engagement points."
    );

    prototypeUsers.ambassador.engagementPoints += 5;

    notificationDrawerOpen = false;

    rerenderCurrentPage();

    return;

  }


  if (target === "announcement") {

    showToast(
      "Opening SHARE Member Week announcement."
    );

    return;

  }


  notificationDrawerOpen = false;

  navigateTo(target);

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


function rerenderCurrentPage() {

  renderCurrentPage();

}


function toggleMobileNav() {

  const workspace =
    document.getElementById("workspace");

  if (!workspace) return;

  workspace.classList.toggle(
    "mobile-nav-open"
  );

}


function closeMobileNav() {

  const workspace =
    document.getElementById("workspace");

  if (!workspace) return;

  workspace.classList.remove(
    "mobile-nav-open"
  );

}


/* =========================================================
   COMMON UI
========================================================= */

function pageTitle(label, title, subtitle, right = "") {

  return `
    <div class="page-heading page-heading-row">

      <div>

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

      ${right}

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
        item.classList.remove("open");
      }

    });


  wrap.classList.toggle("open");

}


document.addEventListener("click", event => {

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
        item.classList.remove("open");
      });

  }

});


function metricCard(title, value, detail, definition = "") {

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


function profileLine(label, value) {

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
      document.createElement("div");

    toast.id =
      "prototype-toast";

    toast.className =
      "prototype-toast";

    document.body.appendChild(toast);

  }


  toast.textContent =
    message;

  toast.classList.add("visible");


  setTimeout(() => {

    toast.classList.remove("visible");

  }, 2500);

}


/* =========================================================
   AMBASSADOR HOME
========================================================= */

function compactJourney() {

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

        ${compactJourneyStep("Onboarded")}
        ${compactJourneyLine()}

        ${compactJourneyStep("Mandatory Training")}
        ${compactJourneyLine()}

        ${compactJourneyStep("Knowledge Check")}
        ${compactJourneyLine()}

        ${compactJourneyStep("Personal QR Code")}

      </div>

    </div>
  `;

}


function compactJourneyStep(label) {

  return `
    <div class="compact-journey-step">

      <span class="compact-journey-check">
        ✓
      </span>

      <span class="compact-journey-label">
        ${label}
      </span>

    </div>
  `;

}


function compactJourneyLine() {

  return `
    <div class="compact-journey-line"></div>
  `;

}


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

  const remaining =
    user.shareMemberTarget -
    user.shareMembersOnboarded;


  return `
    <div class="ambassador-home-header">

      <div class="ambassador-home-title">

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

      ${homeMetricCard(
        "Performance Score",
        "86%",
        "Strong",
        "performance",
        metricDefinitions.performance
      )}

      ${homeMetricCard(
        "Knowledge Score",
        "94%",
        "Strong",
        "performance",
        metricDefinitions.knowledge
      )}

      ${homeMetricCard(
        "Training",
        "100%",
        "Completed",
        "training",
        metricDefinitions.training
      )}

      ${homeAcquisitionCard(
        user.shareMembersOnboarded,
        user.shareMemberTarget,
        achievement,
        remaining
      )}

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
            class="notification-inline-button"
            onclick="toggleNotificationDrawer()"
          >
            View ${unreadNotifications} updates
          </button>

        </div>


        <div
          class="home-action-card attention"
          onclick="openPerformanceInteraction('INT-0984')"
        >

          <div>

            <strong>
              Cancellation Refund interaction
            </strong>

            <p>
              Score 47% · Needs Attention
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
          "VOX Cinemas"
        )}

        ${profileLine(
          "Store",
          "Mall of the Emirates"
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


function homeMetricCard(
  title,
  value,
  detail,
  target,
  definition
) {

  return `
    <section
      class="dashboard-card home-metric-card"
      onclick="navigateTo('${target}')"
    >

      <div class="metric-label-row">

        <span class="home-metric-label">
          ${title}
        </span>

        ${infoIcon(definition)}

      </div>

      <strong>
        ${value}
      </strong>

      <div class="home-metric-footer">

        <span class="metric-positive">
          ${detail}
        </span>

        <span class="metric-link">
          View →
        </span>

      </div>

    </section>
  `;

}


function homeAcquisitionCard(
  onboarded,
  target,
  achievement,
  remaining
) {

  return `
    <section
      class="dashboard-card home-metric-card acquisition-home-card"
      onclick="navigateTo('status')"
    >

      <div class="home-acquisition-top">

        <div class="metric-label-row">

          <span class="home-metric-label">
            SHARE Acquisition
          </span>

          ${infoIcon(
            metricDefinitions.acquisition
          )}

        </div>

        <span class="home-acquisition-percent">
          ${achievement}%
        </span>

      </div>

      <strong class="home-acquisition-value">

        ${onboarded}

        <span>
          / ${target}
        </span>

      </strong>

      <div class="home-acquisition-caption">
        Members onboarded
      </div>

      <div class="mini-progress-track">

        <div
          class="mini-progress-fill"
          style="--home-progress:${achievement}%"
        ></div>

      </div>

      <div class="home-acquisition-footer">

        <span>
          ${remaining} members to target
        </span>

        <span class="metric-link">
          View progress →
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   AMBASSADOR PERFORMANCE
========================================================= */

function performanceMetricCard(
  title,
  value,
  category,
  detail,
  definition
) {

  return `
    <section class="dashboard-card performance-metric-card">

      <div class="performance-metric-top">

        <span>
          ${title}
        </span>

        <div class="metric-tools">

          <small>
            ${category}
          </small>

          ${infoIcon(definition)}

        </div>

      </div>

      <strong>
        ${value}
      </strong>

      <p>
        ${detail}
      </p>

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


function ambassadorPerformance() {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "My Performance",
      "Understand your performance, what is driving it and what to do next."
    )}


    <div class="dashboard-grid four performance-cards-top">

      ${performanceMetricCard(
        "Performance Score",
        "86%",
        "Overall",
        `Calculated across ${performanceSummary.assessedInteractions} assessed interactions in the selected period.`,
        metricDefinitions.performance
      )}

      ${performanceMetricCard(
        "Service Quality",
        "86%",
        "Evaluation",
        "Communication, issue understanding and resolution quality.",
        metricDefinitions.serviceQuality
      )}

      ${performanceMetricCard(
        "SOP Adherence",
        "92%",
        "Process",
        "How consistently required service steps were followed.",
        metricDefinitions.sop
      )}

      ${performanceMetricCard(
        "Compliance",
        "100%",
        "Controls",
        "Mandatory and critical controls completed correctly.",
        metricDefinitions.compliance
      )}

    </div>


    <section class="overall-ai-strip">

      <div class="overall-ai-copy">

        <span class="section-label light-label">
          OVERALL PERFORMANCE ANALYSIS
        </span>

        <h2>
          86% · Strong
        </h2>

        <p>
          Based on all ${performanceSummary.assessedInteractions} assessed interactions in the selected period.
          Run Analyse Overall to understand what is driving your score and identify recurring themes.
        </p>

      </div>

      <button
        class="analyse-overall-button"
        onclick="runAmbassadorOverallAnalysis()"
      >

        <span class="overall-ai-icon">
          ✦
        </span>

        <div>

          <strong>
            Analyse Overall
          </strong>

          <small>
            Find patterns across all assessed interactions
          </small>

        </div>

      </button>

    </section>


    <div
      id="ambassador-overall-output"
      class="agent-output compact-output hidden-output"
    ></div>


    <section class="dashboard-card performance-table-card">

      <div class="table-heading table-heading-with-controls">

        <div>

          <span class="section-label">
            RECENT CUSTOMER INTERACTIONS
          </span>

          <h3>
            Your latest interactions
          </h3>

          <p>
            Showing ${performanceSummary.visibleInteractions} most recent of
            ${performanceSummary.assessedInteractions} assessed interactions.
            The 86% Overall Performance Score is calculated across all
            ${performanceSummary.assessedInteractions}, not only the three shown below.
          </p>

        </div>

        ${periodControls()}

      </div>


      <div class="interaction-header">

        <span>Interaction</span>
        <span>Channel / Duration</span>
        <span>Process / Theme</span>
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


function interactionBlock(interaction) {

  const status =
    getInteractionStatus(
      interaction.score
    );

  const isExpanded =
    expandedInteractionId ===
    interaction.id;


  const action =
    interaction.score >= 90
      ? `
        <button
          class="details-button"
          onclick="toggleInteractionDetails('${interaction.id}')"
        >
          ${
            isExpanded
              ? "Collapse Details"
              : "View Details"
          }
        </button>
      `
      : `
        <button
          class="analyse-button compact"
          onclick="analyseInlineInteraction('${interaction.id}')"
        >
          <span>✦</span>

          ${
            isExpanded
              ? "Collapse Analysis"
              : "Analyse Interaction"
          }

        </button>
      `;


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


        <div data-label="Channel / Duration">

          <strong>
            ${interaction.channel}
          </strong>

          <span>
            ${interaction.duration}
          </span>

        </div>


        <div data-label="Process / Theme">

          <strong>
            ${interaction.process}
          </strong>

          <span>
            Customer interaction
          </span>

        </div>


        <div
          data-label="Score"
          class="interaction-score ${
            interaction.score < 50
              ? "low"
              : ""
          }"
        >
          ${interaction.score}%
        </div>


        <div data-label="Status">

          <span class="status-block ${status.className}">
            ${status.icon} ${status.label}
          </span>

        </div>


        <div data-label="Action">
          ${action}
        </div>

      </div>


      <div
        id="interaction-expand-${interaction.id}"
        class="interaction-expand ${
          isExpanded
            ? "open"
            : ""
        }"
      >
        ${
          isExpanded
            ? renderExpandedInteraction(interaction)
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
      className: "good",
      icon: "✓"
    };

  }


  if (score >= 50) {

    return {
      label: "Opportunity to Strengthen",
      className: "strengthen",
      icon: "↗"
    };

  }


  return {
    label: "Needs Attention",
    className: "attention",
    icon: "!"
  };

}


function toggleInteractionDetails(interactionId) {

  expandedInteractionId =
    expandedInteractionId === interactionId
      ? null
      : interactionId;

  navigateTo(
    "performance",
    {
      preserveInteraction: true
    }
  );

}


function analyseInlineInteraction(interactionId) {

  if (
    expandedInteractionId === interactionId
  ) {

    expandedInteractionId = null;

    navigateTo(
      "performance",
      {
        preserveInteraction: true
      }
    );

    return;

  }


  expandedInteractionId =
    interactionId;

  navigateTo(
    "performance",
    {
      preserveInteraction: true
    }
  );

}


function renderExpandedInteraction(interaction) {

  if (interaction.score >= 90) {

    return `
      <div class="good-interaction-detail">

        <div class="good-detail-icon">
          ✓
        </div>

        <div>

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
          class="start-analysis-button"
          onclick="startInlineAnalysis('${interaction.id}')"
        >
          ✦ Start Analysis
        </button>

      </div>

    </div>
  `;

}


function startInlineAnalysis(interactionId) {

  const interaction =
    interactions.find(
      item =>
        item.id === interactionId
    );

  if (!interaction) return;


  runAnimation({

    outputId:
      `inline-analysis-${interaction.id}`,

    title:
      `Analysing ${interaction.id}`,

    steps: [

      {
        id: `evaluation-${interaction.id}`,
        title: "Evaluation Agent",
        message:
          "Reviewing service quality and customer handling."
      },

      {
        id: `sop-${interaction.id}`,
        title: "SOP Agent",
        message:
          "Checking required process steps."
      },

      {
        id: `compliance-${interaction.id}`,
        title: "Compliance Agent",
        message:
          "Checking mandatory controls and compliance."
      },

      {
        id: `combined-${interaction.id}`,
        title: "Combined Analysis",
        message:
          "Combining findings and identifying the next best action."
      }

    ],

    onComplete:
      () =>
        showInlineAnalysisResult(
          interaction
        )

  });

}


function showInlineAnalysisResult(interaction) {

  const output =
    document.getElementById(
      `inline-analysis-${interaction.id}`
    );

  if (!output) return;


  const analysis =
    analyseInteraction(interaction);

  const urgent =
    interaction.score < 50;


  output.innerHTML = `
    <div class="inline-analysis-result">

      <div class="inline-result-heading">

        <div>

          <span class="section-label">
            AI ANALYSIS COMPLETE
          </span>

          <h3>
            ${
              urgent
                ? "Needs Attention"
                : "Opportunity to Strengthen"
            }
          </h3>

          <p>
            ${interaction.process} · ${interaction.score}%
          </p>

        </div>

        <span class="status-block ${
          urgent
            ? "attention"
            : "strengthen"
        }">

          ${
            urgent
              ? "! Needs Attention"
              : "↗ Opportunity to Strengthen"
          }

        </span>

      </div>


      <div class="inline-analysis-grid">

        <section class="analysis-callout positive">

          <span class="section-label">
            WHAT WENT WELL
          </span>

          <h4>
            Customer verification
          </h4>

          <p>
            The customer and booking reference were verified before discussing the booking.
          </p>

        </section>


        <section class="analysis-callout warning">

          <span class="section-label">
            OPPORTUNITY TO STRENGTHEN
          </span>

          <h4>
            Refund timeline communication
          </h4>

          <p>
            The expected refund timeframe could have been communicated more clearly.
          </p>

        </section>

      </div>


      <div class="analysis-score-row">

        ${analysisMiniCard(
          "Service Quality",
          `${analysis.evaluation.score}%`,
          "Evaluation result"
        )}

        ${analysisMiniCard(
          "SOP Adherence",
          `${analysis.sop.compliance}%`,
          "Process adherence"
        )}

        ${analysisMiniCard(
          "Compliance",
          `${analysis.compliance.complianceScore}%`,
          "Mandatory controls"
        )}

      </div>


      <div class="recommended-development">

        <div class="recommendation-icon">
          ✦
        </div>

        <div>

          <span class="section-label">
            RECOMMENDED NEXT ACTION
          </span>

          <h3>
            ${interaction.trainingTitle}
          </h3>

          <p>
            Complete the 15 min refresher and then the 5 min ${interaction.knowledgeTarget}.
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


function runAmbassadorOverallAnalysis() {

  const output =
    document.getElementById(
      "ambassador-overall-output"
    );

  if (output) {
    output.classList.remove(
      "hidden-output"
    );
  }


  runAnimation({

    outputId:
      "ambassador-overall-output",

    title:
      "Analysing overall performance",

    steps: [

      {
        id: "amb-performance",
        title: "Evaluation Agent",
        message:
          `Reviewing ${performanceSummary.assessedInteractions} assessed interactions across the selected period.`
      },

      {
        id: "amb-sop",
        title: "SOP Agent",
        message:
          "Looking for repeated SOP adherence patterns."
      },

      {
        id: "amb-compliance",
        title: "Compliance Agent",
        message:
          "Checking recurring compliance findings."
      },

      {
        id: "amb-theme",
        title: "Pattern Agent",
        message:
          "Linking themes back to interaction evidence."
      },

      {
        id: "amb-combined",
        title: "Combined Analysis",
        message:
          "Preparing the overall performance summary and next action."
      }

    ],

    onComplete:
      showAmbassadorOverallResult

  });

}


function showAmbassadorOverallResult() {

  const output =
    document.getElementById(
      "ambassador-overall-output"
    );

  if (!output) return;


  output.innerHTML = `
    <div class="overall-analysis-result">

      <div class="analysis-result-header">

        <div>

          <span class="section-label">
            OVERALL AI ANALYSIS
          </span>

          <h2>
            Recurring opportunity: refund timeline communication
          </h2>

          <p>
            Identified across the full ${performanceSummary.assessedInteractions}-interaction assessment set.
          </p>

        </div>

        <div class="analysis-score">

          86%

          <span>
            Strong
          </span>

        </div>

      </div>


      <div class="evidence-links">

        <button
          onclick="openPerformanceInteraction('INT-1001')"
        >
          INT-1001 · 86%
        </button>

        <button
          onclick="openPerformanceInteraction('INT-0984')"
        >
          INT-0984 · 47%
        </button>

      </div>


      <div class="recommended-development compact-recommendation">

        <div class="recommendation-icon">
          ✦
        </div>

        <div>

          <span class="section-label">
            NEXT DEVELOPMENT ACTION
          </span>

          <h3>
            Refund Handling Refresher → Knowledge Check
          </h3>

          <p>
            15 min refresher followed by a 5 min knowledge check.
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


function analysisMiniCard(title, score, detail) {

  return `
    <div class="analysis-agent-card">

      <span>
        ${title}
      </span>

      <strong>
        ${score}
      </strong>

      <small>
        ${detail}
      </small>

    </div>
  `;

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

      <section class="dashboard-card training-panel">

        <div class="training-panel-heading">

          <div>

            <span class="section-label">
              ASSIGNED TRAINING
            </span>

            <h3>
              Your assigned learning
            </h3>

            <p>
              Formal learning assigned as part of your learning plan.
            </p>

          </div>

          <span class="training-count">
            ${assignedTraining.length}
          </span>

        </div>

        <div class="training-card-list">

          ${assignedTraining
            .map(assignedTrainingCard)
            .join("")}

        </div>

      </section>


      <section class="dashboard-card training-panel recommended-panel">

        <div class="training-panel-heading">

          <div>

            <span class="section-label">
              RECOMMENDED DEVELOPMENT
            </span>

            <h3>
              Based on your recent performance
            </h3>

            <p>
              Refresh the topic first, then verify learning.
            </p>

          </div>

          <span class="training-count recommended">
            1
          </span>

        </div>


        ${recommendedDevelopmentCard(
          recommendedDevelopment
        )}

      </section>

    </div>
  `;

}


function trainingStatusCircle(item) {

  return `
    <div class="training-status-circle ${item.dueClass}">

      <span>
        ${item.status}
      </span>

    </div>
  `;

}


function assignedTrainingCard(item) {

  return `
    <div class="training-item-card">

      <div class="training-item-main">

        <div>

          <strong class="training-item-title">
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

        ${trainingStatusCircle(item)}

      </div>


      <div class="due-state-row ${item.dueClass}">

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

      <button
        class="training-open-button"
        onclick="showToast('${
          item.status === "Completed"
            ? "Opening training review"
            : "Opening assigned training"
        }')"
      >
        ${
          item.status === "Completed"
            ? "Review"
            : "Open"
        }
      </button>

    </div>
  `;

}


function recommendedDevelopmentCard(item) {

  return `
    <div class="development-path-card">

      <div class="development-step">

        <div class="development-step-number">
          1
        </div>

        <div class="development-step-content">

          <div class="development-title-row">

            <div>

              <span class="section-label">
                LEARN / REFRESH
              </span>

              <h3>
                ${item.title}
              </h3>

            </div>

            <span class="duration-pill">
              ${item.trainingDuration}
            </span>

          </div>

          <p>
            ${item.reason}
          </p>

          <div class="trigger-links">

            <span>
              Triggered by:
            </span>

            ${item.triggerInteractions.map(id => `
              <button
                onclick="openPerformanceInteraction('${id}')"
              >
                ${id}
              </button>
            `).join("")}

          </div>

          <div class="training-item-meta">

            <span>
              Recommended ${item.recommended}
            </span>

          </div>

        </div>

        <button
          class="training-open-button primary"
          onclick="showToast('Opening Refund Handling Refresher')"
        >
          Start Training
        </button>

      </div>


      <div class="development-connector">
        <span>
          Then verify learning
        </span>
      </div>


      <div class="development-step knowledge-step">

        <div class="development-step-number">
          2
        </div>

        <div class="development-step-content">

          <div class="development-title-row">

            <div>

              <span class="section-label">
                KNOWLEDGE CHECK
              </span>

              <h3>
                ${item.knowledgeCheck.title}
              </h3>

            </div>

            <span class="duration-pill">
              ${item.knowledgeCheck.duration}
            </span>

          </div>

          <p>
            ${item.knowledgeCheck.purpose}
          </p>

          <div class="training-item-meta">

            <span>
              ${item.knowledgeCheck.questions} questions
            </span>

            <span>
              Interactive challenge
            </span>

          </div>

        </div>

        <button
          class="training-open-button"
          onclick="navigateTo('knowledge-check')"
        >
          Start Check
        </button>

      </div>

    </div>
  `;

}


/* =========================================================
   GAMIFIED KNOWLEDGE CHECK
========================================================= */

function knowledgeCheckPage() {

  return `
    ${pageTitle(
      "KNOWLEDGE CHECK",
      "Refund Handling Challenge",
      "An interactive performance-linked Knowledge Check."
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

        <span>
          TIME
        </span>

        <strong>
          04:32
        </strong>

      </div>

    </section>


    <div class="knowledge-game-progress">

      <div
        style="width:${knowledgeCheckQuestion * 10}%"
      ></div>

    </div>


    <section class="dashboard-card knowledge-question-card">

      <div class="question-meta">

        <span class="question-type">
          Scenario
        </span>

        <span class="ai-question-pill">
          ✦ AI-generated practice variation
        </span>

      </div>


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
          "Create a new booking to replace the cancelled one."
        )}

      </div>


      <div
        id="knowledge-answer-feedback"
        class="knowledge-answer-feedback"
      ></div>

    </section>


    <section class="dashboard-card gamification-preview">

      <span class="section-label">
        OTHER KNOWLEDGE CHECK FORMATS
      </span>

      <h3>
        Gamified assessment formats
      </h3>

      <div class="gamification-grid">

        <div>
          <strong>Timed Challenges</strong>
          <span>Answer before time expires</span>
        </div>

        <div>
          <strong>Drag & Drop</strong>
          <span>Arrange process steps in order</span>
        </div>

        <div>
          <strong>Scenario Questions</strong>
          <span>Choose the best customer response</span>
        </div>

        <div>
          <strong>AI Practice</strong>
          <span>Generate additional question variations</span>
        </div>

      </div>

    </section>
  `;

}


function knowledgeAnswer(letter, text) {

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

  if (knowledgeCheckAnswered) return;

  knowledgeCheckAnswered = true;

  const feedback =
    document.getElementById(
      "knowledge-answer-feedback"
    );

  if (!feedback) return;


  if (letter === "B") {

    knowledgeCheckScore += 1;

    feedback.innerHTML = `
      <div class="knowledge-feedback good">

        <strong>
          ✓ Correct
        </strong>

        <span>
          Verify the booking and clearly communicate the expected timeframe and next step.
        </span>

      </div>

      <button
        onclick="nextKnowledgeQuestion()"
      >
        Next Question →
      </button>
    `;

  } else {

    feedback.innerHTML = `
      <div class="knowledge-feedback attention">

        <strong>
          Review this
        </strong>

        <span>
          The expected approach is to verify the booking, explain the refund timeframe and provide the next step.
        </span>

      </div>

      <button
        onclick="nextKnowledgeQuestion()"
      >
        Next Question →
      </button>
    `;

  }

}


function nextKnowledgeQuestion() {

  knowledgeCheckAnswered = false;

  if (knowledgeCheckQuestion < 10) {
    knowledgeCheckQuestion += 1;
  }

  navigateTo("knowledge-check");

}


/* =========================================================
   KNOWLEDGE BASE
========================================================= */

function knowledgePage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Search and access the full approved knowledge repository."
    )}

    ${knowledgeRepositorySection(false)}
  `;

}


function knowledgeRepositorySection(canManage = false) {

  return `
    <section class="dashboard-card knowledge-repository">

      <div class="knowledge-repository-heading">

        <div>

          <span class="section-label">
            FULL KNOWLEDGE BASE
          </span>

          <h3>
            All approved knowledge
          </h3>

          <p>
            Browse the complete approved knowledge repository.
          </p>

        </div>


        <div class="knowledge-header-actions">

          <div class="knowledge-count">

            ${knowledgeRepository.length}

            <span>
              Articles
            </span>

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

      </div>


      ${
        canManage && knowledgeEditorOpen
          ? knowledgeEditor()
          : ""
      }


      <div class="knowledge-toolbar">

        <div class="knowledge-search">

          <span>
            ⌕
          </span>

          <input
            id="knowledge-search"
            type="text"
            placeholder="Search Knowledge Base"
            oninput="filterKnowledgeBase(${canManage})"
          >

        </div>

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


      <div class="knowledge-header">

        <span>
          Knowledge Article
        </span>

        <span>
          Category
        </span>

        <span>
          Type
        </span>

        <span>
          Version / Updated
        </span>

        <span>
          Action
        </span>

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
    <section class="knowledge-editor">

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
          "Article Type",
          "Process Guidance"
        )}

        ${editorField(
          "Current Version",
          "v3.2"
        )}

        ${editorField(
          "Effective Date",
          "15 Oct 2026"
        )}

        ${editorField(
          "Owner",
          "Service Delivery"
        )}

        ${editorField(
          "Target Audience",
          "Ambassadors"
        )}

        ${editorField(
          "Applicability",
          "Entertainment · VOX Cinemas"
        )}

      </div>


      <div class="mock-field wide-editor">

        <label>
          Content / Attachment
        </label>

        <div class="mock-textarea">
          Update article content or attach the approved source.
        </div>

      </div>


      <div class="editor-actions">

        <button class="small-button">
          Save Draft
        </button>

        <button
          class="primary-small"
          onclick="showToast('Prototype article published')"
        >
          Publish Update
        </button>

      </div>

    </section>
  `;

}


function editorField(label, value) {

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

  rerenderCurrentPage();

}


function renderKnowledgeRows(
  items,
  canManage = false
) {

  if (!items.length) {

    return `
      <div class="knowledge-empty">
        No knowledge articles match your search.
      </div>
    `;

  }


  return items.map(item => `
    <div class="knowledge-row">

      <div data-label="Knowledge Article">

        <strong>
          ${item.title}
        </strong>

      </div>

      <span data-label="Category">
        ${item.category}
      </span>

      <span data-label="Type">
        ${item.type}
      </span>

      <div data-label="Version / Updated">

        <strong>
          ${item.version}
        </strong>

        <span class="knowledge-updated">
          ${item.updated}
        </span>

      </div>

      <div class="knowledge-actions">

        <button
          class="small-button"
          onclick="showToast('Opening ${item.title}')"
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
  `).join("");

}


function filterKnowledgeBase(canManage = false) {

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
      .trim()
      .toLowerCase();

  const category =
    categoryNode.value;


  const filtered =
    knowledgeRepository.filter(item => {

      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search);

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
   MY STATUS + SHARE POINTS
========================================================= */

function statusPage() {

  const user =
    prototypeUsers.ambassador;

  const onboarded =
    user.shareMembersOnboarded;

  const target =
    user.shareMemberTarget;

  const remaining =
    Math.max(
      target - onboarded,
      0
    );

  const achievement =
    Math.min(
      Math.round(
        (
          onboarded /
          target
        ) * 100
      ),
      100
    );


  return `
    ${pageTitle(
      "AMBASSADOR",
      "My Status",
      "Your profile, Personal QR Code, SHARE impact and programme engagement."
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


        <div class="profile-details">

          ${profileLine(
            "Staff ID",
            "100245"
          )}

          ${profileLine(
            "Business Unit",
            "Entertainment"
          )}

          ${profileLine(
            "Brand",
            "VOX Cinemas"
          )}

          ${profileLine(
            "Store",
            "Mall of the Emirates"
          )}

          ${profileLine(
            "Engagement Points",
            user.engagementPoints
          )}

        </div>

      </section>


      <section class="dashboard-card qr-card compact-qr-card">

        <div>

          <span class="section-label">
            PERSONAL QR CODE
          </span>

          <h3>
            Active
          </h3>

          <p>
            Use your Personal QR Code for attributable SHARE member onboarding.
          </p>

        </div>

        <div class="active-qr-wrapper compact-qr">

          <img
            class="share-qr-image"
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwww.sharerewards.com%2F"
            alt="SHARE Rewards QR Code"
          >

        </div>

      </section>

    </div>


    <section class="share-impact-compact">

      <div class="share-impact-compact-heading">

        <div>

          <span class="section-label light-label">
            MY SHARE IMPACT
          </span>

          <h2>
            SHARE Acquisition
          </h2>

          <p>
            ${currentPerformancePeriod.from} – ${currentPerformancePeriod.to}
          </p>

        </div>


        <div class="impact-compact-summary">

          <div>

            <strong>
              ${onboarded}
            </strong>

            <span>
              Onboarded
            </span>

          </div>

          <div>

            <strong>
              ${target}
            </strong>

            <span>
              Target
            </span>

          </div>

          <div>

            <strong>
              ${achievement}%
            </strong>

            <span>
              Achievement
            </span>

          </div>

          <div>

            <strong>
              ${remaining}
            </strong>

            <span>
              Remaining
            </span>

          </div>

        </div>

      </div>


      <div class="compact-progress-track">

        <div
          class="compact-progress-fill"
          style="--compact-progress:${achievement}%"
        ></div>

      </div>


      <div class="compact-impact-footer">

        <span>
          <b>${onboarded} of ${target}</b> members onboarded
        </span>

        <div class="compact-milestones">

          <span class="done">
            ✓ Started
          </span>

          <span class="done">
            ✓ Halfway
          </span>

          <span>
            ○ Target
          </span>

        </div>

      </div>

    </section>


    ${sharePointsCalculator()}
  `;

}


function sharePointsCalculator() {

  return `
    <section class="dashboard-card share-points-card">

      <div class="share-points-heading">

        <div>

          <span class="section-label">
            SHARE POINTS CALCULATOR
          </span>

          <h3>
            Calculate points earned
          </h3>

          <p>
            Enter the member transaction value and select the transaction type.
          </p>

        </div>

        ${infoIcon(
          "Non-Luxury base points use 0.025% of transaction value. Luxury base points use 1% of transaction value. A Bonus / Promo multiplier can add 2× the base points."
        )}

      </div>


      <div class="share-calculator-controls">

        <div class="calculator-field">

          <label>
            Transaction value
          </label>

          <div class="currency-input">

            <span>
              AED
            </span>

            <input
              id="share-transaction"
              type="number"
              min="0"
              step="0.01"
              value="1000"
              oninput="calculateSharePoints()"
            >

          </div>

        </div>


        <div class="calculator-field">

          <label>
            Transaction type
          </label>

          <select
            id="share-transaction-type"
            onchange="calculateSharePoints()"
          >

            <option value="non-luxury">
              Non-Luxury
            </option>

            <option value="luxury">
              Luxury
            </option>

          </select>

        </div>


        <div class="calculator-field">

          <label>
            Bonus / Promo
          </label>

          <select
            id="share-promo"
            onchange="calculateSharePoints()"
          >

            <option value="1">
              No promotion
            </option>

            <option value="2">
              2× Base Points
            </option>

          </select>

        </div>

      </div>


      <div class="share-points-results">

        <div class="points-result-card">

          <span>
            Base Points
          </span>

          <strong id="share-base-points">
            0.25
          </strong>

          <small id="share-base-rule">
            Non-Luxury · 0.025%
          </small>

        </div>


        <div class="points-result-card bonus">

          <span>
            Bonus / Promo Points
          </span>

          <strong id="share-bonus-points">
            0.00
          </strong>

          <small>
            Additional promotional points
          </small>

        </div>


        <div class="points-result-card total">

          <span>
            Total SHARE Points
          </span>

          <strong id="share-total-points">
            0.25
          </strong>

          <small>
            Base + Bonus / Promo
          </small>

        </div>

      </div>


      <div class="calculator-rule-note">

        <strong>
          Calculation rules
        </strong>

        <span>
          Non-Luxury = 0.025% of transaction value · Luxury = 1% of transaction value · Promotion = additional points equal to 2× base when selected.
        </span>

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


  const transaction =
    Number(transactionNode.value) || 0;

  const type =
    typeNode.value;

  const promoMultiplier =
    Number(promoNode.value);


  const rate =
    type === "luxury"
      ? 0.01
      : 0.00025;


  const basePoints =
    transaction * rate;


  const bonusPoints =
    promoMultiplier === 2
      ? basePoints * 2
      : 0;


  const totalPoints =
    basePoints + bonusPoints;


  document.getElementById(
    "share-base-points"
  ).textContent =
    basePoints.toFixed(2);


  document.getElementById(
    "share-bonus-points"
  ).textContent =
    bonusPoints.toFixed(2);


  document.getElementById(
    "share-total-points"
  ).textContent =
    totalPoints.toFixed(2);


  document.getElementById(
    "share-base-rule"
  ).textContent =
    type === "luxury"
      ? "Luxury · 1%"
      : "Non-Luxury · 0.025%";

}


/* =========================================================
   MANAGEMENT FILTERS
========================================================= */

function managementFilters(
  scopeType = "manager"
) {

  const isService =
    scopeType === "service";


  return `
    <section class="manager-filter-bar">

      <div class="filter-field">

        <label>
          Period
        </label>

        <select>
          <option>MTD</option>
          <option>QTD</option>
          <option>YTD</option>
          <option>Custom</option>
        </select>

      </div>

      <div class="filter-field">

        <label>
          Country
        </label>

        <select>

          <option>
            ${
              isService
                ? "All Countries"
                : "UAE"
            }
          </option>

          <option>UAE</option>
          <option>Bahrain</option>
          <option>Oman</option>

        </select>

      </div>

      <div class="filter-field">

        <label>
          BU
        </label>

        <select>

          <option>
            ${
              isService
                ? "All BUs"
                : "Entertainment"
            }
          </option>

          <option>Entertainment</option>

        </select>

      </div>

      <div class="filter-field">

        <label>
          Brand
        </label>

        <select>
          <option>All Brands</option>
          <option>VOX Cinemas</option>
        </select>

      </div>

      <div class="filter-field">

        <label>
          Mall
        </label>

        <select>
          <option>All Malls</option>
          <option>Mall of the Emirates</option>
          <option>City Centre Mirdif</option>
          <option>City Centre Deira</option>
          <option>City Centre Al Zahia</option>
          <option>City Centre Ajman</option>
          <option>City Centre Sharjah</option>
          <option>City Centre Fujairah</option>
          <option>City Centre Bahrain</option>
          <option>City Centre Muscat</option>
          <option>City Centre Sohar</option>
        </select>

      </div>

      <div class="filter-field">

        <label>
          Store / Location
        </label>

        <select>
          <option>All Locations</option>
          <option>VOX MOE</option>
          <option>VOX CCM</option>
          <option>VOX CCD</option>
          <option>VOX CCAZ</option>
        </select>

      </div>

    </section>


    <div class="scope-notice">

      <div class="scope-icon">
        🔒
      </div>

      <div>

        <strong>
          ${
            isService
              ? "Cross-BU Service Delivery visibility"
              : "Scoped to Entertainment UAE"
          }
        </strong>

        <span>
          ${
            isService
              ? "Authorised visibility across countries, BUs, brands, MAF malls, locations and Ambassadors."
              : "Only Ambassadors, locations and performance within the assigned Entertainment UAE scope are available."
          }
        </span>

      </div>

    </div>
  `;

}


function managerFilters() {
  return managementFilters("manager");
}


function serviceFilters() {
  return managementFilters("service");
}


/* =========================================================
   MANAGER HOME
========================================================= */

function managerHome() {

  const onboarded = 1842;
  const target = 2100;
  const achievement = Math.round((onboarded / target) * 100);
  const remaining = target - onboarded;


  return `
    ${pageTitle(
      "ENTERTAINMENT UAE",
      "BU Lead / Trainer Dashboard",
      "Understand how your teams are performing and where attention is required."
    )}


    ${managerFilters()}


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Performance Score",
        "86%",
        "Strong",
        "Aggregated service performance for Ambassadors within the selected BU, Brand, Mall or Location scope."
      )}

      ${metricCard(
        "Active Ambassadors",
        "238",
        "Within your scope",
        metricDefinitions.activeAmbassadors
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "Current period",
        metricDefinitions.trainingCompletion
      )}

      ${managerAcquisitionSummaryCard(
        onboarded,
        target,
        achievement,
        remaining
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              PERFORMANCE BREAKDOWN
            </span>

            <h3>
              Performance by organisational level
            </h3>

            <p>
              Drill from BU to Brand, Mall, Store / Location and Ambassador.
            </p>

          </div>

          <button
            class="small-button"
            onclick="navigateTo('team-performance')"
          >
            View Performance
          </button>

        </div>


        <div class="manager-performance-list">

          ${managerPerformanceBreakdown
            .map(managerPerformanceRow)
            .join("")}

        </div>

      </section>


      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              REQUIRES ATTENTION
            </span>

            <h3>
              Priority areas in your team
            </h3>

            <p>
              Only issues within your assigned BU population are shown.
            </p>

          </div>

          <button
            class="small-button"
            onclick="navigateTo('team-attention')"
          >
            View All
          </button>

        </div>


        ${managerAttentionItems
          .map(managerAttentionRow)
          .join("")}

      </section>

    </div>


    <section class="manager-home-acquisition compact-banner">

      <div>

        <span class="section-label light-label">
          SHARE ACQUISITION
        </span>

        <h2>
          ${onboarded.toLocaleString()} of ${target.toLocaleString()} members onboarded
        </h2>

        <p>
          Entertainment UAE · ${currentPerformancePeriod.preset}
        </p>

      </div>


      <div class="manager-acquisition-right">

        <strong>
          ${achievement}%
        </strong>

        <span>
          ${remaining} members remaining
        </span>

      </div>


      <div class="manager-progress-track">

        <div
          class="manager-progress-fill"
          style="--manager-progress:${achievement}%"
        ></div>

      </div>

    </section>
  `;

}


function managerAcquisitionSummaryCard(
  onboarded,
  target,
  achievement,
  remaining
) {

  return `
    <section
      class="dashboard-card manager-acquisition-kpi"
      onclick="navigateTo('${
        currentRole === "service"
          ? "group-acquisition"
          : "manager-acquisition"
      }')"
    >

      <div class="manager-kpi-top">

        <div class="metric-label-row">

          <span>
            SHARE Members Onboarded
          </span>

          ${infoIcon(
            metricDefinitions.acquisition
          )}

        </div>

        <small>
          ${achievement}%
        </small>

      </div>

      <strong>
        ${onboarded.toLocaleString()}
      </strong>

      <div class="tiny-progress-track">

        <div
          class="tiny-progress-fill"
          style="--tiny-progress:${achievement}%"
        ></div>

      </div>

      <div class="manager-kpi-footer">

        <span>
          Target ${target.toLocaleString()}
        </span>

        <span>
          ${remaining} remaining
        </span>

      </div>

    </section>
  `;

}


function managerPerformanceRow(item) {

  return `
    <div class="manager-performance-row">

      <div data-label="Organisation">

        <span class="hierarchy-pill">
          ${item.level}
        </span>

        <strong>
          ${item.name}
        </strong>

      </div>

      <div
        class="manager-row-population"
        data-label="Ambassadors"
      >

        <span>
          Ambassadors
        </span>

        <strong>
          ${item.ambassadors}
        </strong>

      </div>

      <div
        class="manager-row-score"
        data-label="Performance"
      >

        <strong>
          ${item.score}%
        </strong>

        <div class="mini-score-track">

          <div
            class="mini-score-fill ${
              item.score < 80
                ? "attention"
                : ""
            }"
            style="width:${item.score}%"
          ></div>

        </div>

      </div>

      <button
        class="small-button"
        onclick="navigateTo('${
          currentRole === "service"
            ? "group-performance"
            : "team-performance"
        }')"
      >
        Drill Down
      </button>

    </div>
  `;

}


function managerAttentionRow(item) {

  return `
    <div class="manager-attention-row">

      <span
        data-label="Severity"
        class="severity-pill ${item.severity.toLowerCase()}"
      >
        ${item.severity}
      </span>

      <div data-label="Location">

        <strong>
          ${item.location}
        </strong>

        <span>
          ${item.issue}
        </span>

      </div>

      <span data-label="Affected">
        ${item.affected}
      </span>

      <button class="small-button">
        Review
      </button>

    </div>
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
      "Drill into performance by BU, Brand, Mall, Store / Location and Ambassador."
    )}

    ${managerFilters()}

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

    ${managementPerformanceAnalysis("manager")}

    ${performanceDrilldown()}
  `;

}


function managementPerformanceAnalysis(type) {

  const manager =
    type === "manager";

  return `
    <section class="overall-analysis-card">

      <div>

        <span class="section-label light-label">
          AI PERFORMANCE ANALYSIS
        </span>

        <h2>
          ${
            manager
              ? "Analyse Entertainment UAE"
              : "Analyse Current Service Delivery View"
          }
        </h2>

        <p>
          Analyse the current filtered scope and identify recurring themes, severity and recommended interventions.
        </p>

      </div>

      <button
        class="analyse-overall-button"
        onclick="${
          manager
            ? "runManagerAnalysis()"
            : "runServiceAnalysis()"
        }"
      >

        <span class="overall-ai-icon">
          ✦
        </span>

        <div>

          <strong>
            Analyse Current View
          </strong>

          <small>
            Uses the filters above
          </small>

        </div>

      </button>

    </section>


    <section class="dashboard-card manager-ai-section">

      <span class="section-label">
        AI ORCHESTRATION
      </span>

      <h3>
        ${
          manager
            ? "BU performance agent team"
            : "Service Delivery agent team"
        }
      </h3>

      <div
        id="${
          manager
            ? "manager-agent-output"
            : "service-agent-output"
        }"
        class="agent-output empty-state"
      >
        Run Analyse Current View to start.
      </div>

    </section>
  `;

}


function performanceDrilldown() {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            PERFORMANCE BREAKDOWN
          </span>

          <h3>
            Drill-down view
          </h3>

          <p>
            BU → Brand → Mall → Store / Location → Ambassador.
          </p>

        </div>

        <select class="inline-selector">

          <option>BU</option>
          <option>Brand</option>
          <option>Mall</option>
          <option>Store / Location</option>
          <option>Ambassador</option>

        </select>

      </div>

      <div class="manager-drill-header">

        <span>Level</span>
        <span>Name</span>
        <span>Ambassadors</span>
        <span>Performance</span>
        <span>Action</span>

      </div>

      ${managerPerformanceBreakdown
        .map(managerDrillRow)
        .join("")}

    </section>
  `;

}


function managerDrillRow(item) {

  return `
    <div class="manager-drill-row">

      <span data-label="Level">
        ${item.level}
      </span>

      <strong data-label="Name">
        ${item.name}
      </strong>

      <span data-label="Ambassadors">
        ${item.ambassadors}
      </span>

      <strong
        data-label="Performance"
        class="${
          item.score < 80
            ? "score-attention"
            : "score-good"
        }"
      >
        ${item.score}%
      </strong>

      <button class="small-button">
        Drill Down
      </button>

    </div>
  `;

}


/* =========================================================
   ATTENTION
========================================================= */

function managerRequiresAttentionPage() {

  return attentionPage(false);

}


function serviceAttentionPage() {

  return attentionPage(true);

}


function attentionPage(isService) {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "Requires Attention",
      isService
        ? "Priority issues across the selected Service Delivery scope."
        : "Prioritised issues within Entertainment UAE."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <div class="dashboard-grid four">

      ${metricCard(
        "Critical",
        isService ? "3" : "1",
        "Immediate attention",
        "Highest-severity issues requiring immediate intervention."
      )}

      ${metricCard(
        "High",
        isService ? "9" : "4",
        "Priority follow-up",
        "High-priority issues requiring timely follow-up."
      )}

      ${metricCard(
        "Medium",
        isService ? "18" : "7",
        "Monitor",
        "Issues requiring monitoring or targeted support."
      )}

      ${metricCard(
        "Ambassadors Impacted",
        isService ? "96" : "34",
        "Selected scope",
        "Ambassadors affected by current priority issues."
      )}

    </div>


    <section class="dashboard-card">

      <div class="attention-table-header">

        <span>Severity</span>
        <span>Location</span>
        <span>Area</span>
        <span>Affected</span>
        <span>Action</span>

      </div>

      ${managerAttentionItems.map(item => `
        <div class="attention-table-row">

          <span
            data-label="Severity"
            class="severity-pill ${item.severity.toLowerCase()}"
          >
            ${item.severity}
          </span>

          <strong data-label="Location">
            ${item.location}
          </strong>

          <span data-label="Area">
            ${item.issue}
          </span>

          <span data-label="Affected">
            ${item.affected}
          </span>

          <button class="small-button">
            Review
          </button>

        </div>
      `).join("")}

    </section>
  `;

}


/* =========================================================
   AMBASSADORS + CSV EXPORT
========================================================= */

function managerAmbassadorsPage(isService = false) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassadors",
      "View and manage the Ambassador population within the selected scope."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <section class="dashboard-card population-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            AMBASSADOR POPULATION
          </span>

          <h3>
            ${
              isService
                ? "Cross-BU population"
                : "Entertainment UAE"
            }
          </h3>

          <p>
            Filter by BU, Brand, Mall or Store / Location and export the resulting population.
          </p>

        </div>

        <button
          class="export-button"
          onclick="exportAmbassadorList()"
        >
          ↓ Export CSV
        </button>

      </div>


      <div class="population-header">

        <span>Ambassador</span>
        <span>BU / Brand</span>
        <span>Mall / Location</span>
        <span>Performance</span>
        <span>Training</span>
        <span>Members</span>
        <span>Engagement</span>
        <span>Status</span>

      </div>


      ${ambassadorPopulation
        .map(ambassadorPopulationRow)
        .join("")}

    </section>
  `;

}


function ambassadorPopulationRow(ambassador) {

  return `
    <div class="population-row">

      <div data-label="Ambassador">

        <strong>
          ${ambassador.name}
        </strong>

        <span>
          Staff ID ${ambassador.staffId}
        </span>

      </div>

      <div data-label="BU / Brand">

        <strong>
          ${ambassador.bu}
        </strong>

        <span>
          ${ambassador.brand}
        </span>

      </div>

      <div data-label="Mall / Location">

        <strong>
          ${ambassador.mall}
        </strong>

        <span>
          ${ambassador.location}
        </span>

      </div>

      <strong
        data-label="Performance"
        class="${
          ambassador.performance < 80
            ? "score-attention"
            : "score-good"
        }"
      >
        ${ambassador.performance}%
      </strong>

      <strong data-label="Training">
        ${ambassador.training}%
      </strong>

      <strong data-label="Members">
        ${ambassador.members}
      </strong>

      <strong data-label="Engagement">
        ${ambassador.engagement}
      </strong>

      <span
        data-label="Status"
        class="status-block good"
      >
        ${ambassador.status}
      </span>

    </div>
  `;

}


function exportAmbassadorList() {

  const headers = [
    "Name",
    "Staff ID",
    "BU",
    "Brand",
    "Mall",
    "Location",
    "Performance",
    "Training Completion",
    "Members Onboarded",
    "Engagement Points",
    "Status"
  ];


  const rows =
    ambassadorPopulation.map(item => [

      item.name,
      item.staffId,
      item.bu,
      item.brand,
      item.mall,
      item.location,
      `${item.performance}%`,
      `${item.training}%`,
      item.members,
      item.engagement,
      item.status

    ]);


  const csv =
    [
      headers,
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
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");

  link.href =
    url;

  link.download =
    "share-lens-ambassador-population.csv";


  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

}


/* =========================================================
   TRAINING OVERVIEW
========================================================= */

function managerTrainingOverviewPage(isService = false) {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Training Overview",
      "Monitor assigned learning, completion, overdue learning and recommended development."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <div class="dashboard-grid four">

      ${metricCard(
        "Assigned",
        "594",
        "Training assignments",
        "Total training assignments in the selected scope."
      )}

      ${metricCard(
        "Completed",
        "545",
        "91% completion",
        "Assignments completed in the selected scope."
      )}

      ${metricCard(
        "In Progress",
        "32",
        "Current",
        "Assignments currently being worked on."
      )}

      ${metricCard(
        "Overdue",
        "17",
        "Needs follow-up",
        "Assignments past their due date and not completed."
      )}

    </div>


    <div class="training-layout">

      <section class="dashboard-card">

        <span class="section-label">
          ASSIGNED TRAINING
        </span>

        <h3>
          Team learning plan
        </h3>

        <div class="manager-training-header">

          <span>Training</span>
          <span>Assigned</span>
          <span>Completed</span>
          <span>In Progress</span>
          <span>Overdue</span>
          <span>Avg Aging</span>

        </div>

        ${managerTrainingOverview
          .map(managerTrainingRow)
          .join("")}

      </section>


      <section class="dashboard-card recommended-panel">

        <span class="section-label">
          RECOMMENDED TRAINING
        </span>

        <h3>
          Performance-driven recommendations
        </h3>

        ${managerRecommendedTrainingRow(
          "Refund Handling Refresher",
          "34 Ambassadors",
          "Refund SLA knowledge gap",
          "High"
        )}

        ${managerRecommendedTrainingRow(
          "Service Recovery Essentials",
          "18 Ambassadors",
          "Resolution quality",
          "Medium"
        )}

        ${managerRecommendedTrainingRow(
          "Customer Verification Refresher",
          "11 Ambassadors",
          "SOP adherence",
          "Medium"
        )}

      </section>

    </div>
  `;

}


function managerTrainingRow(item) {

  return `
    <div class="manager-training-row">

      <strong data-label="Training">
        ${item.training}
      </strong>

      <span data-label="Assigned">
        ${item.assigned}
      </span>

      <span data-label="Completed">
        ${item.completed}
      </span>

      <span data-label="In Progress">
        ${item.inProgress}
      </span>

      <strong
        data-label="Overdue"
        class="${
          item.overdue > 5
            ? "score-attention"
            : ""
        }"
      >
        ${item.overdue}
      </strong>

      <span data-label="Avg Aging">
        ${item.avgAging}
      </span>

    </div>
  `;

}


function managerRecommendedTrainingRow(
  title,
  affected,
  reason,
  priority
) {

  return `
    <div class="manager-recommended-training">

      <div>

        <strong>
          ${title}
        </strong>

        <span>
          ${reason}
        </span>

      </div>

      <div>

        <strong>
          ${affected}
        </strong>

        <span class="severity-pill ${priority.toLowerCase()}">
          ${priority}
        </span>

      </div>

      <button class="small-button">
        Review
      </button>

    </div>
  `;

}


/* =========================================================
   KNOWLEDGE GAPS
========================================================= */

function managerKnowledgeGapsPage(isService = false) {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Gaps",
      "Identify recurring knowledge themes affecting Ambassador performance."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <section class="dashboard-card">

      <div class="knowledge-gap-header">

        <span>Knowledge Theme</span>
        <span>Ambassadors Affected</span>
        <span>Avg Knowledge Score</span>
        <span>Related Performance</span>
        <span>Trend</span>
        <span>Action</span>

      </div>

      ${managerKnowledgeGaps.map(gap => `
        <div class="knowledge-gap-row">

          <strong data-label="Knowledge Theme">
            ${gap.theme}
          </strong>

          <span data-label="Ambassadors Affected">
            ${gap.ambassadors}
          </span>

          <strong
            data-label="Avg Knowledge Score"
            class="${
              gap.knowledgeScore < 80
                ? "score-attention"
                : "score-good"
            }"
          >
            ${gap.knowledgeScore}%
          </strong>

          <span data-label="Related Performance">
            ${gap.relatedPerformance}
          </span>

          <span data-label="Trend">
            ${gap.trend}
          </span>

          <button class="small-button">
            Review
          </button>

        </div>
      `).join("")}

    </section>
  `;

}


function managerKnowledgePage(isService = false) {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Browse and maintain the approved knowledge repository."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    ${knowledgeRepositorySection(true)}
  `;

}


/* =========================================================
   ONBOARDING / OFFBOARDING
========================================================= */

function lifecyclePage(isService = false) {

  const onboarding = [

    {
      name: "Noor Hassan",
      staffId: "100822",

      steps: [
        ["Account Created", "Complete"],
        ["First Login", "Complete"],
        ["Mandatory Training", "In Progress"],
        ["Knowledge Check", "Pending"],
        ["Personal QR Code", "Pending"],
        ["Active", "Pending"]
      ]
    },

    {
      name: "Rania Ali",
      staffId: "100845",

      steps: [
        ["Account Created", "Complete"],
        ["First Login", "Complete"],
        ["Mandatory Training", "Complete"],
        ["Knowledge Check", "Pending"],
        ["Personal QR Code", "Pending"],
        ["Active", "Pending"]
      ]
    }

  ];


  const offboarding = [

    {
      name: "Omar Faris",
      staffId: "100312",

      steps: [
        ["Offboarding Initiated", "Complete"],
        ["Access Disabled", "Complete"],
        ["Personal QR Code Deactivated", "Complete"],
        ["Outstanding Tasks Closed", "In Progress"],
        ["Offboarded", "Pending"]
      ]
    }

  ];


  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Onboarding & Offboarding",
      "Track task completion across the Ambassador lifecycle."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <section class="dashboard-card lifecycle-section">

      <span class="section-label">
        ONBOARDING JOURNEYS
      </span>

      <h3>
        Ambassadors joining the programme
      </h3>

      ${onboarding
        .map(journey =>
          lifecycleJourneyCard(
            journey,
            "Onboarding"
          )
        )
        .join("")}

    </section>


    <section class="dashboard-card lifecycle-section">

      <span class="section-label">
        OFFBOARDING JOURNEYS
      </span>

      <h3>
        Ambassadors leaving the programme
      </h3>

      ${offboarding
        .map(journey =>
          lifecycleJourneyCard(
            journey,
            "Offboarding"
          )
        )
        .join("")}

    </section>
  `;

}


function lifecycleJourneyCard(journey, type) {

  const initials =
    journey.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2);


  return `
    <div class="lifecycle-card">

      <div class="lifecycle-person">

        <div class="mini-avatar">
          ${initials}
        </div>

        <div>

          <strong>
            ${journey.name}
          </strong>

          <span>
            Staff ID ${journey.staffId}
          </span>

        </div>

      </div>

      <div class="lifecycle-steps">

        ${journey.steps
          .map(step =>
            lifecycleStep(
              step[0],
              step[1]
            )
          )
          .join("")}

      </div>

      <button class="small-button">
        View ${type}
      </button>

    </div>
  `;

}


function lifecycleStep(label, status) {

  const className =
    status === "Complete"
      ? "complete"
      : status === "In Progress"
        ? "progress"
        : "pending";


  return `
    <div class="lifecycle-step ${className}">

      <span class="lifecycle-dot">

        ${
          status === "Complete"
            ? "✓"
            : status === "In Progress"
              ? "•"
              : "○"
        }

      </span>

      <div>

        <strong>
          ${label}
        </strong>

        <small>
          ${status}
        </small>

      </div>

    </div>
  `;

}


/* =========================================================
   ACQUISITION
========================================================= */

function acquisitionPage(isService = false) {

  const onboarded =
    isService
      ? 7320
      : 1842;

  const target =
    isService
      ? 8200
      : 2100;

  const achievement =
    Math.round(
      (onboarded / target) * 100
    );

  const remaining =
    target - onboarded;


  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "SHARE Acquisition",
      "Track members onboarded through Ambassador activity."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <section class="manager-acquisition-hero">

      <div>

        <span class="section-label light-label">
          SHARE ACQUISITION
        </span>

        <h2>
          ${onboarded.toLocaleString()} members onboarded
        </h2>

        <p>
          ${
            isService
              ? "Selected Service Delivery scope"
              : "Entertainment UAE"
          }
          · ${currentPerformancePeriod.preset}
        </p>

      </div>

      <div class="acquisition-hero-score">

        <strong>
          ${achievement}%
        </strong>

        <span>
          of target
        </span>

      </div>

      <div class="manager-acquisition-progress">

        <div
          class="manager-acquisition-progress-fill"
          style="--manager-acquisition-progress:${achievement}%"
        ></div>

      </div>

      <div class="acquisition-hero-footer">

        <span>
          Target: ${target.toLocaleString()}
        </span>

        <span>
          Remaining: ${remaining.toLocaleString()}
        </span>

      </div>

    </section>


    ${leaderboardSection()}
  `;

}


function leaderboardSection() {

  return `
    <section class="dashboard-card">

      <span class="section-label">
        AMBASSADOR LEADERBOARD
      </span>

      <h3>
        Member onboarding & engagement
      </h3>

      <div class="leaderboard-header">

        <span>Rank</span>
        <span>Ambassador</span>
        <span>Brand</span>
        <span>Location</span>
        <span>Members</span>
        <span>Engagement</span>
        <span>% Target</span>

      </div>

      ${[
        ["1", "Noor Hassan", "VOX Cinemas", "City Centre Mirdif", "50", "240", "100%"],
        ["2", "Sami Omar", "VOX Cinemas", "City Centre Al Zahia", "44", "210", "88%"],
        ["3", "Layla Haddad", "VOX Cinemas", "Mall of the Emirates", "42", "185", "84%"],
        ["4", "Rania Ali", "VOX Cinemas", "City Centre Deira", "29", "135", "58%"],
        ["5", "Sara Khan", "VOX Cinemas", "City Centre Deira", "21", "120", "42%"]

      ].map(row =>
        leaderboardRow(...row)
      ).join("")}

    </section>
  `;

}


function leaderboardRow(
  rank,
  name,
  brand,
  location,
  members,
  engagement,
  target
) {

  return `
    <div class="leaderboard-row">

      <strong
        data-label="Rank"
        class="rank-cell"
      >
        ${rank}
      </strong>

      <strong data-label="Ambassador">
        ${name}
      </strong>

      <span data-label="Brand">
        ${brand}
      </span>

      <span data-label="Location">
        ${location}
      </span>

      <strong data-label="Members">
        ${members}
      </strong>

      <strong data-label="Engagement">
        ${engagement}
      </strong>

      <strong data-label="% Target">
        ${target}
      </strong>

    </div>
  `;

}


/* =========================================================
   COMMUNICATIONS
========================================================= */

function communicationsPage(isService = false) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Communications",
      "Broadcast updates, enable engagement and measure Ambassador response."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <section class="communications-hero">

      <div>

        <span class="section-label light-label">
          BROADCASTS & INTERACTIVE FEED
        </span>

        <h2>
          Engage the Ambassador community
        </h2>

        <p>
          Share announcements and updates, then track views, likes, cheers and comments.
        </p>

      </div>

      <button
        class="white-action-button"
        onclick="showNewBroadcast()"
      >
        + New Broadcast
      </button>

    </section>


    <div id="broadcast-compose-area"></div>


    <div class="dashboard-grid four">

      ${metricCard(
        "Broadcasts",
        "12",
        "This period",
        "Number of broadcasts sent."
      )}

      ${metricCard(
        "Reach",
        "94%",
        "Average",
        "Percentage of targeted Ambassadors reached."
      )}

      ${metricCard(
        "Engagement",
        "39%",
        "Likes + comments + cheers",
        metricDefinitions.engagement
      )}

      ${metricCard(
        "Interactions",
        "171",
        "This period",
        "Combined communication engagement."
      )}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        RECENT COMMUNICATIONS
      </span>

      <h3>
        Broadcast engagement report
      </h3>

      <div class="communications-header">

        <span>Broadcast</span>
        <span>Reach</span>
        <span>Views</span>
        <span>Likes</span>
        <span>Comments</span>
        <span>Action</span>

      </div>

      ${communicationsFeed
        .map(communicationsRow)
        .join("")}

    </section>
  `;

}


function communicationsRow(item) {

  return `
    <div class="communications-row">

      <div data-label="Broadcast">

        <strong>
          ${item.title}
        </strong>

        <span>
          ${item.type} · ${item.date}
        </span>

      </div>

      <span data-label="Reach">
        ${item.reach}
      </span>

      <strong data-label="Views">
        ${item.views}
      </strong>

      <strong data-label="Likes">
        ${item.likes}
      </strong>

      <strong data-label="Comments">
        ${item.comments}
      </strong>

      <button class="small-button">
        View
      </button>

    </div>
  `;

}


function showNewBroadcast() {

  const area =
    document.getElementById(
      "broadcast-compose-area"
    );

  if (!area) return;


  area.innerHTML = `
    <section class="dashboard-card broadcast-composer">

      <span class="section-label">
        NEW BROADCAST
      </span>

      <h3>
        Create Ambassador update
      </h3>

      <div class="broadcast-form-grid">

        ${editorField(
          "Audience",
          "Current filtered scope"
        )}

        ${editorField(
          "Brand",
          "All Brands"
        )}

        ${editorField(
          "Type",
          "Announcement"
        )}

        ${editorField(
          "Engagement",
          "Likes · Comments · Cheers"
        )}

        <div class="mock-field wide">

          <label>
            Message
          </label>

          <div class="mock-textarea">
            Enter announcement or update
          </div>

        </div>

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
   HUB
========================================================= */

function hubPage(isService = false) {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassador Hub",
      "Track feedback, suggestions and Ambassador-led submissions."
    )}

    ${
      isService
        ? serviceFilters()
        : managerFilters()
    }

    <div class="dashboard-grid four">

      ${ambassadorHubSubmissions
        .map(hubMetricCard)
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

        <span>Ambassador Submission</span>
        <b>→</b>
        <span>SHARE Lens</span>
        <b>→</b>
        <span>Categorisation</span>
        <b>→</b>
        <span>Alida</span>
        <b>→</b>
        <span>Reporting & Follow-up</span>

      </div>

    </section>
  `;

}


function hubMetricCard(item) {

  return `
    <section class="dashboard-card hub-metric-card">

      <span class="section-label">
        ${item.type}
      </span>

      <strong>
        ${item.submissions}
      </strong>

      <div class="hub-card-meta">

        <span>
          ${item.open} open
        </span>

        <span>
          ${item.integration}
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   SERVICE HOME
========================================================= */

function serviceHome() {

  const onboarded = 7320;
  const target = 8200;
  const achievement = Math.round((onboarded / target) * 100);
  const remaining = target - onboarded;


  return `
    ${pageTitle(
      "MAF MALLS",
      "Service Delivery",
      "Cross-BU visibility across service performance, Service Pulse, training, knowledge and the Ambassador Program."
    )}

    ${serviceFilters()}

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

      ${managerAcquisitionSummaryCard(
        onboarded,
        target,
        achievement,
        remaining
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              PERFORMANCE BREAKDOWN
            </span>

            <h3>
              Cross-BU performance
            </h3>

          </div>

          <button
            class="small-button"
            onclick="navigateTo('group-performance')"
          >
            View Performance
          </button>

        </div>

        ${managerPerformanceBreakdown
          .map(managerPerformanceRow)
          .join("")}

      </section>


      <section class="dashboard-card">

        <div class="card-heading-row">

          <div>

            <span class="section-label">
              REQUIRES ATTENTION
            </span>

            <h3>
              Priority issues across teams
            </h3>

          </div>

          <button
            class="small-button"
            onclick="navigateTo('group-attention')"
          >
            View All
          </button>

        </div>

        ${managerAttentionItems
          .map(managerAttentionRow)
          .join("")}

      </section>

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card pulse-preview">

        <div>

          <span class="section-label">
            SERVICE PULSE
          </span>

          <h3>
            62.34%
          </h3>

          <p>
            Average score across current submissions.
          </p>

        </div>

        <div class="pulse-mini-stats">

          <span>
            <strong>42</strong>
            Submissions
          </span>

          <span>
            <strong>24</strong>
            Locations
          </span>

          <span>
            <strong>11</strong>
            Open findings
          </span>

        </div>

        <button
          class="small-button"
          onclick="navigateTo('service-pulse')"
        >
          Open Service Pulse
        </button>

      </section>


      <section class="manager-home-acquisition compact-banner embedded-banner">

        <div>

          <span class="section-label light-label">
            SHARE ACQUISITION
          </span>

          <h2>
            ${onboarded.toLocaleString()} of ${target.toLocaleString()} members onboarded
          </h2>

          <p>
            Selected Service Delivery scope
          </p>

        </div>

        <div class="manager-acquisition-right">

          <strong>
            ${achievement}%
          </strong>

          <span>
            ${remaining} members remaining
          </span>

        </div>

        <div class="manager-progress-track">

          <div
            class="manager-progress-fill"
            style="--manager-progress:${achievement}%"
          ></div>

        </div>

      </section>

    </div>
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
      "Analyse service performance across the selected organisational scope."
    )}

    ${serviceFilters()}

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

    ${managementPerformanceAnalysis("service")}

    ${performanceDrilldown()}
  `;

}


/* =========================================================
   SERVICE PULSE
========================================================= */

function servicePulsePage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Service Pulse",
      "Create templates, review submissions and report Service Pulse performance."
    )}

    ${serviceFilters()}

    <div class="tab-bar">

      ${servicePulseTabButton(
        "dashboard",
        "Dashboard"
      )}

      ${servicePulseTabButton(
        "submissions",
        "Submissions"
      )}

      ${servicePulseTabButton(
        "templates",
        "Templates"
      )}

    </div>

    ${servicePulseTabContent()}
  `;

}


function servicePulseTabButton(id, label) {

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

  servicePulseTab = tab;

  navigateTo("service-pulse");

}


function servicePulseTabContent() {

  if (servicePulseTab === "submissions") {
    return servicePulseSubmissions();
  }

  if (servicePulseTab === "templates") {
    return servicePulseTemplatesView();
  }

  return servicePulseDashboard();

}


function servicePulseDashboard() {

  return `
    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Service Pulse Score",
        "62.34%",
        "Current period",
        "Average score across Service Pulse submissions."
      )}

      ${metricCard(
        "Submissions",
        "42",
        "Current period",
        "Number of Service Pulse submissions."
      )}

      ${metricCard(
        "Locations Assessed",
        "24",
        "Current period",
        "Unique locations assessed."
      )}

      ${metricCard(
        "Open Findings",
        "11",
        "Requires follow-up",
        "Findings requiring closure."
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          SCORE TREND
        </span>

        <h3>
          Service Pulse over time
        </h3>

        <div class="simple-trend-chart">

          <div style="height:42%"></div>
          <div style="height:58%"></div>
          <div style="height:66%"></div>
          <div style="height:52%"></div>
          <div style="height:71%"></div>
          <div style="height:62%"></div>

        </div>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          SECTION PERFORMANCE
        </span>

        <h3>
          Where scores are strongest / weakest
        </h3>

        ${servicePulseSectionRow(
          "Visit Details",
          "53.48%"
        )}

        ${servicePulseSectionRow(
          "Welcome & Greeting",
          "78%"
        )}

        ${servicePulseSectionRow(
          "Product Knowledge",
          "64%"
        )}

        ${servicePulseSectionRow(
          "Issue Resolution",
          "59%"
        )}

      </section>

    </div>


    ${servicePulseSubmissions()}
  `;

}


function servicePulseSubmissions() {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            SERVICE PULSE SUBMISSIONS
          </span>

          <h3>
            Recent results
          </h3>

        </div>

        <button
          class="export-button"
          onclick="showToast('Prototype Service Pulse export prepared')"
        >
          ↓ Export
        </button>

      </div>

      <div class="service-pulse-header">

        <span>Location</span>
        <span>BU</span>
        <span>Brand</span>
        <span>Score</span>
        <span>Status</span>
        <span>Action</span>

      </div>

      ${servicePulseRows.map(row => `
        <div class="service-pulse-row">

          <strong data-label="Location">
            ${row[0]}
          </strong>

          <span data-label="BU">
            ${row[1]}
          </span>

          <span data-label="Brand">
            ${row[2]}
          </span>

          <strong data-label="Score">
            ${row[3]}
          </strong>

          <span
            data-label="Status"
            class="status-block ${
              row[4] === "Needs Attention"
                ? "attention"
                : row[4] === "On Track"
                  ? "good"
                  : "strengthen"
            }"
          >
            ${row[4]}
          </span>

          <button class="small-button">
            View
          </button>

        </div>
      `).join("")}

    </section>
  `;

}


function servicePulseTemplatesView() {

  return `
    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            SERVICE PULSE TEMPLATES
          </span>

          <h3>
            Assessment templates
          </h3>

          <p>
            Create and manage Service Pulse templates.
          </p>

        </div>

        <button
          class="primary-small"
          onclick="showServicePulseTemplateCreator()"
        >
          + Create Template
        </button>

      </div>

      <div id="pulse-template-creator"></div>

      <div class="pulse-template-header">

        <span>Template</span>
        <span>Country</span>
        <span>Sections</span>
        <span>Questions</span>
        <span>Status</span>
        <span>Action</span>

      </div>

      ${servicePulseTemplates.map(row => `
        <div class="pulse-template-row">

          <strong data-label="Template">
            ${row[0]}
          </strong>

          <span data-label="Country">
            ${row[1]}
          </span>

          <span data-label="Sections">
            ${row[2]}
          </span>

          <span data-label="Questions">
            ${row[3]}
          </span>

          <span
            data-label="Status"
            class="status-block ${
              row[4] === "Published"
                ? "good"
                : "strengthen"
            }"
          >
            ${row[4]}
          </span>

          <button class="small-button">
            Edit
          </button>

        </div>
      `).join("")}

    </section>
  `;

}


function showServicePulseTemplateCreator() {

  const area =
    document.getElementById(
      "pulse-template-creator"
    );

  if (!area) return;


  area.innerHTML = `
    <div class="pulse-template-builder">

      <span class="section-label">
        NEW TEMPLATE
      </span>

      <h3>
        Create Service Pulse Template
      </h3>

      <div class="editor-grid">

        ${editorField(
          "Template Name",
          "UAE - Service Pulse"
        )}

        ${editorField(
          "Country",
          "UAE"
        )}

        ${editorField(
          "Business Unit",
          "All BUs"
        )}

        ${editorField(
          "Scoring",
          "Percentage score"
        )}

      </div>

      <div class="template-question-preview">

        <strong>
          + Add Section
        </strong>

        <span>
          Add questions, scoring and mandatory fields.
        </span>

      </div>

      <button
        class="primary-small"
        onclick="showToast('Prototype Service Pulse template saved')"
      >
        Save Template
      </button>

    </div>
  `;

}


function servicePulseSectionRow(name, score) {

  const value =
    parseFloat(score);


  return `
    <div class="pulse-section-row">

      <span>
        ${name}
      </span>

      <div class="bar-track">

        <div
          class="bar-fill ${
            value < 60
              ? "bar-low"
              : ""
          }"
          style="width:${value}%"
        ></div>

      </div>

      <strong>
        ${score}
      </strong>

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
      "Review audit and Mystery Shop findings and their impact on performance."
    )}

    ${serviceFilters()}

    <div class="dashboard-grid four">

      ${metricCard(
        "Audits Completed",
        "42",
        "Current period",
        "Service audits completed."
      )}

      ${metricCard(
        "Average Score",
        "84%",
        "Current period",
        "Average audit score."
      )}

      ${metricCard(
        "Critical Findings",
        "3",
        "Needs intervention",
        "Critical findings requiring immediate action."
      )}

      ${metricCard(
        "Open Actions",
        "11",
        "Current",
        "Corrective actions not yet closed."
      )}

    </div>

    <section class="dashboard-card">

      <span class="section-label">
        SOURCE-TO-DASHBOARD FLOW
      </span>

      <h3>
        How audit findings feed performance
      </h3>

      <div class="hub-flow">

        <span>Mystery Shop / Audit</span>
        <b>→</b>
        <span>Store / Mall Finding</span>
        <b>→</b>
        <span>Theme + Severity</span>
        <b>→</b>
        <span>Corrective Action</span>
        <b>→</b>
        <span>Performance</span>

      </div>

    </section>

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
   AI
========================================================= */

function runManagerAnalysis() {

  runAnimation({

    outputId:
      "manager-agent-output",

    title:
      "Analysing Entertainment UAE",

    steps: [

      {
        id: "manager-performance",
        title: "Performance Agent",
        message:
          "Assessing Service Quality, SOP Adherence and Compliance."
      },

      {
        id: "manager-pattern",
        title: "Pattern Agent",
        message:
          "Finding recurring themes."
      },

      {
        id: "manager-knowledge",
        title: "Knowledge Gap Agent",
        message:
          "Linking performance issues to knowledge gaps."
      },

      {
        id: "manager-intervention",
        title: "Intervention Agent",
        message:
          "Prioritising teams requiring intervention."
      },

      {
        id: "manager-combined",
        title: "Combined Analysis",
        message:
          "Preparing recommended actions."
      }

    ],

    onComplete:
      showManagerAnalysisResult

  });

}


function showManagerAnalysisResult() {

  const output =
    document.getElementById(
      "manager-agent-output"
    );

  if (!output) return;


  output.innerHTML = `
    ${analysisHeader(
      "BU AI ANALYSIS",
      "3 priority themes identified",
      86,
      "Entertainment UAE · Current filtered scope"
    )}

    <div class="dashboard-grid two no-bottom">

      <section class="analysis-section">

        <span class="section-label">
          RECURRING THEMES
        </span>

        <h3>
          Areas affecting performance
        </h3>

        ${severityRow(
          "Refund SLA knowledge",
          "34 Ambassadors · 3 locations",
          "High",
          "high"
        )}

        ${severityRow(
          "Customer verification consistency",
          "18 Ambassadors · 2 locations",
          "Medium",
          "medium"
        )}

      </section>

      <section class="analysis-section">

        <span class="section-label">
          PRIORITY LOCATIONS
        </span>

        <h3>
          Where intervention is required
        </h3>

        ${locationSeverityRow(
          "City Centre Deira",
          "8 Ambassadors affected",
          "Critical",
          "critical"
        )}

        ${locationSeverityRow(
          "City Centre Mirdif",
          "5 Ambassadors affected",
          "High",
          "high"
        )}

      </section>

    </div>
  `;

}


function runServiceAnalysis() {

  runAnimation({

    outputId:
      "service-agent-output",

    title:
      "Analysing Service Delivery scope",

    steps: [

      {
        id: "service-performance",
        title: "Performance Agent",
        message:
          "Assessing performance."
      },

      {
        id: "service-pattern",
        title: "Pattern Agent",
        message:
          "Identifying systemic themes."
      },

      {
        id: "service-severity",
        title: "Location Severity Agent",
        message:
          "Ranking locations."
      },

      {
        id: "service-intervention",
        title: "Intervention Agent",
        message:
          "Matching issues to interventions."
      },

      {
        id: "service-action",
        title: "Next Best Action",
        message:
          "Prioritising actions."
      },

      {
        id: "service-combined",
        title: "Combined Analysis",
        message:
          "Preparing the Service Delivery view."
      }

    ],

    onComplete:
      showServiceAnalysisResult

  });

}


function showServiceAnalysisResult() {

  const output =
    document.getElementById(
      "service-agent-output"
    );

  if (!output) return;


  output.innerHTML = `
    ${analysisHeader(
      "GROUP AI ANALYSIS",
      "Priority intervention required",
      88,
      "Current Service Delivery scope"
    )}

    <div class="dashboard-grid two no-bottom">

      <section class="analysis-section">

        <span class="section-label">
          SYSTEMIC THEMES
        </span>

        <h3>
          Cross-location patterns
        </h3>

        ${severityRow(
          "Refund SLA",
          "34 Ambassadors · 3 locations",
          "High",
          "high"
        )}

        ${severityRow(
          "Product Knowledge",
          "51 Ambassadors · 5 locations",
          "Medium",
          "medium"
        )}

      </section>

      <section class="analysis-section">

        <span class="section-label">
          LOCATION SEVERITY
        </span>

        <h3>
          Where to intervene first
        </h3>

        ${locationSeverityRow(
          "City Centre Deira",
          "Entertainment",
          "Critical",
          "critical"
        )}

        ${locationSeverityRow(
          "City Centre Mirdif",
          "Entertainment",
          "High",
          "high"
        )}

      </section>

    </div>
  `;

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
        "All roles",
        "Users provisioned in SHARE Lens."
      )}

      ${metricCard(
        "Active Ambassadors",
        "812",
        "Current",
        "Active programme Ambassadors."
      )}

      ${metricCard(
        "AI Agents",
        "13",
        "Configured",
        "Specialist AI capabilities represented in the prototype."
      )}

      ${metricCard(
        "Integrations",
        "11",
        "Prototype",
        "Configured or planned integrations."
      )}

    </div>

    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          OPERATIONAL VISIBILITY
        </span>

        <h3>
          Cross-team Requires Attention
        </h3>

        ${managerAttentionItems
          .map(managerAttentionRow)
          .join("")}

      </section>

      <section class="dashboard-card">

        <span class="section-label">
          ENGAGEMENT
        </span>

        <h3>
          Top Ambassadors
        </h3>

        ${adminLeaderboardPreview()}

      </section>

    </div>
  `;

}


function adminLeaderboardPreview() {

  return `
    <div class="admin-leader-row">

      <strong>
        1 · Noor Hassan
      </strong>

      <span>
        VOX Cinemas · 240 points
      </span>

    </div>

    <div class="admin-leader-row">

      <strong>
        2 · Sami Omar
      </strong>

      <span>
        VOX Cinemas · 210 points
      </span>

    </div>

    <div class="admin-leader-row">

      <strong>
        3 · Layla Haddad
      </strong>

      <span>
        VOX Cinemas · ${prototypeUsers.ambassador.engagementPoints} points
      </span>

    </div>
  `;

}


function adminEngagementLeaderboard() {

  return `
    ${pageTitle(
      "PLATFORM",
      "Engagement Leaderboard",
      "View Ambassador engagement by BU, Brand and Location."
    )}

    ${serviceFilters()}

    ${leaderboardSection()}
  `;

}


function integrationsPage() {

  const integrations = [

    ["Mitti / SafetyCulture", "Training / Service Pulse", "Prototype"],
    ["Knowmax", "Knowledge Base", "Prototype"],
    ["Infobip", "Communications", "Prototype"],
    ["Adjust", "Acquisition attribution", "Prototype"],
    ["Alida", "Ambassador Hub submissions", "Placeholder"],
    ["OneView", "Customer / service context", "Placeholder"],
    ["Asana", "Action / task connectivity", "Placeholder"],
    ["HR / Staff Master", "Identity and organisational scope", "Prototype"],
    ["Genesys", "Customer interactions", "Planned"]

  ];


  return `
    ${pageTitle(
      "PLATFORM",
      "Integrations",
      "Prototype representation of the integration landscape."
    )}

    <div class="dashboard-grid three">

      ${integrations.map(item => `
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

          <span class="status-block ${
            item[2] === "Placeholder"
              ? "strengthen"
              : "good"
          }">
            ${item[2]}
          </span>

        </section>
      `).join("")}

    </div>
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
        This section represents the role-specific capability within the SHARE Lens prototype.
      </p>

    </section>
  `;

}


/* =========================================================
   AI PIPELINE
========================================================= */

function runAnimation(config) {

  const output =
    document.getElementById(
      config.outputId
    );

  if (!output) return;


  output.classList.remove(
    "empty-state",
    "hidden-output"
  );


  output.innerHTML = `
    <div class="agent-pipeline">

      <div class="pipeline-heading">

        <div>

          <span class="section-label">
            AGENT-TO-AGENT ORCHESTRATION
          </span>

          <h3>
            ${config.title}
          </h3>

        </div>

        <span class="pipeline-running-badge">
          AI team running
        </span>

      </div>

      <div class="pipeline-steps">

        ${config.steps.map((step, index) => `

          ${
            index > 0
              ? `<div class="pipeline-line"></div>`
              : ""
          }

          ${pipelineStep(
            step.id,
            index + 1,
            step.title,
            index === 0
              ? "Running"
              : "Waiting",
            index === 0
              ? "active"
              : "waiting"
          )}

        `).join("")}

      </div>

      <div class="pipeline-status">

        <div class="processing-dot"></div>

        <span id="${config.outputId}-message">
          ${config.steps[0].message}
        </span>

      </div>

    </div>
  `;


  config.steps.forEach(
    (step, index) => {

      const startDelay =
        index * 800;


      if (index > 0) {

        setTimeout(() => {

          activateGenericStep(
            config.outputId,
            step.id,
            step.message
          );

        }, startDelay);

      }


      setTimeout(() => {

        completeGenericStep(
          step.id
        );


        if (
          index ===
          config.steps.length - 1
        ) {

          setTimeout(
            config.onComplete,
            250
          );

        }

      }, startDelay + 600);

    }
  );

}


function pipelineStep(
  id,
  number,
  title,
  status,
  state
) {

  return `
    <div
      id="step-${id}"
      class="pipeline-step ${state}"
    >

      <div class="pipeline-number">
        ${number}
      </div>

      <div>

        <strong>
          ${title}
        </strong>

        <span id="status-${id}">
          ${status}
        </span>

      </div>

    </div>
  `;

}


function activateGenericStep(
  outputId,
  id,
  message
) {

  const step =
    document.getElementById(
      `step-${id}`
    );

  if (step) {

    step.classList.remove(
      "waiting",
      "complete"
    );

    step.classList.add(
      "active"
    );

  }


  const status =
    document.getElementById(
      `status-${id}`
    );

  if (status) {
    status.textContent = "Running";
  }


  const messageNode =
    document.getElementById(
      `${outputId}-message`
    );

  if (messageNode) {
    messageNode.textContent = message;
  }

}


function completeGenericStep(id) {

  const step =
    document.getElementById(
      `step-${id}`
    );

  if (step) {

    step.classList.remove(
      "waiting",
      "active"
    );

    step.classList.add(
      "complete"
    );

  }


  const status =
    document.getElementById(
      `status-${id}`
    );

  if (status) {
    status.textContent = "Complete";
  }

}


/* =========================================================
   HELPERS
========================================================= */

function analysisHeader(
  label,
  title,
  score,
  subtitle
) {

  return `
    <div class="analysis-result-header">

      <div>

        <span class="section-label">
          ${label}
        </span>

        <h2>
          ${title}
        </h2>

        <p>
          ${subtitle}
        </p>

      </div>

      <div class="analysis-score">

        ${score}%

        <span>
          Overall
        </span>

      </div>

    </div>
  `;

}


function severityRow(
  title,
  detail,
  severity,
  className
) {

  return `
    <div class="severity-row">

      <div>

        <strong>
          ${title}
        </strong>

        <span>
          ${detail}
        </span>

      </div>

      <span class="severity-pill ${className}">
        ${severity}
      </span>

    </div>
  `;

}


function locationSeverityRow(
  title,
  detail,
  severity,
  className
) {

  return `
    <div class="location-severity-row">

      <div>

        <strong>
          ${title}
        </strong>

        <span>
          ${detail}
        </span>

      </div>

      <span class="severity-pill ${className}">
        ${severity}
      </span>

    </div>
  `;

}


function openPerformanceInteraction(interactionId) {

  expandedInteractionId =
    interactionId;

  navigateTo(
    "performance",
    {
      preserveInteraction: true
    }
  );


  setTimeout(() => {

    const node =
      document.getElementById(
        `interaction-expand-${interactionId}`
      );

    if (node) {

      node.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }

  }, 100);

}


/* =========================================================
   ROUTING
========================================================= */

function navigateTo(
  page,
  options = {}
) {

  /*
    IMPORTANT v0.9.0 FIX

    When users simply navigate to My Performance,
    interaction analysis must NOT remain expanded.

    Expansion is preserved only when the navigation
    explicitly came from Analyse Interaction / direct evidence.
  */

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


function renderCurrentPage() {

  let content = "";


  if (currentRole === "ambassador") {

    const pages = {

      home:
        ambassadorHome,

      performance:
        ambassadorPerformance,

      training:
        trainingPage,

      knowledge:
        knowledgePage,

      "knowledge-check":
        knowledgeCheckPage,

      status:
        statusPage

    };


    content =
      pages[currentPage]
        ? pages[currentPage]()
        : ambassadorHome();

  }


  if (currentRole === "manager") {

    const pages = {

      home:
        managerHome,

      "team-performance":
        managerPerformance,

      "team-attention":
        managerRequiresAttentionPage,

      "training-overview":
        () =>
          managerTrainingOverviewPage(false),

      "knowledge-gaps":
        () =>
          managerKnowledgeGapsPage(false),

      "manager-knowledge":
        () =>
          managerKnowledgePage(false),

      ambassadors:
        () =>
          managerAmbassadorsPage(false),

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


  if (currentRole === "service") {

    const pages = {

      home:
        serviceHome,

      "group-performance":
        servicePerformance,

      "group-attention":
        serviceAttentionPage,

      "service-pulse":
        servicePulsePage,

      audit:
        auditPage,

      "group-training":
        () =>
          managerTrainingOverviewPage(true),

      "group-gaps":
        () =>
          managerKnowledgeGapsPage(true),

      "group-knowledge":
        () =>
          managerKnowledgePage(true),

      "group-ambassadors":
        () =>
          managerAmbassadorsPage(true),

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

      "group-actions":
        () =>
          genericRolePage(
            "SERVICE DELIVERY",
            "Actions",
            "Track corrective actions and follow-up across the selected scope."
          ),

      "group-recognition":
        () =>
          acquisitionPage(true)

    };


    content =
      pages[currentPage]
        ? pages[currentPage]()
        : serviceHome();

  }


  if (currentRole === "admin") {

    const pages = {

      home:
        adminHome,

      integrations:
        integrationsPage,

      "engagement-leaderboard":
        adminEngagementLeaderboard,

      "users-access":
        () =>
          genericRolePage(
            "IDENTITY & ACCESS",
            "Users & Access",
            "Manage Staff ID, Microsoft SSO, roles and organisational scope."
          ),

      roles:
        () =>
          genericRolePage(
            "IDENTITY & ACCESS",
            "Roles & Permissions",
            "Configure role-based access and visibility."
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
            "View specialist AI capabilities and orchestration."
          ),

      "agent-config":
        () =>
          genericRolePage(
            "AI PLATFORM",
            "Agent Configuration",
            "Configure prompts, models and orchestration."
          ),

      "knowledge-sources":
        () =>
          managerKnowledgePage(true),

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
            "Configure programme notifications, reminders and alerts."
          ),

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

}


/* =========================================================
   GLOBALS
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

window.markAllNotificationsRead =
  markAllNotificationsRead;

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

window.filterKnowledgeBase =
  filterKnowledgeBase;

window.toggleKnowledgeEditor =
  toggleKnowledgeEditor;

window.exportAmbassadorList =
  exportAmbassadorList;

window.showNewBroadcast =
  showNewBroadcast;

window.calculateSharePoints =
  calculateSharePoints;

window.answerKnowledgeQuestion =
  answerKnowledgeQuestion;

window.nextKnowledgeQuestion =
  nextKnowledgeQuestion;

window.setServicePulseTab =
  setServicePulseTab;

window.showServicePulseTemplateCreator =
  showServicePulseTemplateCreator;


/* =========================================================
   ENTER LOGIN
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
