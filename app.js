import { analyseInteraction } from "./agents/agentOrchestrator.js";


const app = document.getElementById("app");

let currentRole = null;
let currentPage = "home";
let expandedInteractionId = null;
let selectedTrainingId = null;


/* =========================================================
   SHARED PERIOD
========================================================= */

const currentPerformancePeriod = {
  from: "01 Oct 2026",
  to: "14 Oct 2026",
  preset: "MTD"
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
    ambassadorStatus: "Active Ambassador",
    shareMembersOnboarded: 42,
    shareMemberTarget: 50
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
   AMBASSADOR INTERACTIONS
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
    trainingTarget: "refund",
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check",
    transcript: `
Customer: I cancelled my booking yesterday but I still have not received my refund.
Agent: Let me check that for you.
Customer: Okay.
Agent: Can you confirm your booking reference?
Customer: VX92831.
Agent: Thank you. I can see the cancellation was completed successfully.
Customer: When will the refund reach me?
Agent: It should be processed shortly.
Customer: How many days?
Agent: It depends on the bank.
`
  },

  {
    id: "INT-0998",
    date: "07 Oct 2026",
    channel: "Chat",
    duration: "06:14",
    process: "Refund Status",
    score: 94,
    customer: "Omar Khalid",
    trainingTarget: "refund",
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check",
    transcript: `
Customer: My booking was cancelled. When will I receive the refund?
Agent: I can check that for you.
Agent: Please confirm your booking reference.
Customer: VX81442.
Agent: Thank you. Your cancellation is confirmed.
Agent: The refund can take several working days depending on the issuing bank.
Customer: Thank you.
`
  },

  {
    id: "INT-0984",
    date: "02 Oct 2026",
    channel: "Voice",
    duration: "07:31",
    process: "Cancellation Refund",
    score: 47,
    customer: "Sara Malik",
    trainingTarget: "refund",
    trainingTitle: "Refund Handling Refresher",
    knowledgeTarget: "Refund Handling Knowledge Check",
    transcript: `
Customer: I cancelled my tickets and need to know when the refund will arrive.
Agent: I can help with that.
Agent: May I have your booking reference?
Customer: VX77291.
Agent: Thank you. The booking is cancelled.
Customer: How many days does the refund take?
Agent: Processing times vary depending on the bank.
`
  }

];


/* =========================================================
   AMBASSADOR TRAINING
========================================================= */

const assignedTraining = [

  {
    id: "share-cx",
    title: "SHARE Customer Experience",
    duration: "20 min",
    assigned: "01 Oct 2026",
    due: "15 Oct 2026",
    aging: "13 days",
    status: "Completed",
    description:
      "Core customer experience expectations for SHARE Ambassadors."
  },

  {
    id: "product-knowledge",
    title: "Product Knowledge",
    duration: "30 min",
    assigned: "20 Sep 2026",
    due: "30 Sep 2026",
    aging: "Completed",
    status: "Completed",
    description:
      "Core SHARE proposition, benefits and product knowledge."
  },

  {
    id: "service-recovery",
    title: "Service Recovery Essentials",
    duration: "25 min",
    assigned: "12 Oct 2026",
    due: "19 Oct 2026",
    aging: "2 days",
    status: "In Progress",
    description:
      "How to recover customer interactions when expectations have not been met."
  }

];


const recommendedTraining = [

  {
    id: "refund",
    title: "Refund Handling Refresher",
    duration: "15 min",
    recommended: "14 Oct 2026",
    reason:
      "Recommended from your recent Refund Handling performance.",
    status: "Recommended",
    description:
      "Refresh refund timelines, customer communication expectations and required process steps."
  }

];


/* =========================================================
   KNOWLEDGE BASE
========================================================= */

const knowledgeRepository = [

  {
    title: "Refund Process",
    category: "Refunds & Cancellations",
    type: "Process Guidance",
    updated: "02 Oct 2026"
  },

  {
    title: "Cancellation & Refund Policy",
    category: "Refunds & Cancellations",
    type: "Policy",
    updated: "12 Sep 2026"
  },

  {
    title: "Customer Verification",
    category: "Customer Service",
    type: "Service Guidance",
    updated: "19 Sep 2026"
  },

  {
    title: "Customer Escalation Process",
    category: "Customer Service",
    type: "SOP",
    updated: "25 Sep 2026"
  },

  {
    title: "Service Recovery Guidelines",
    category: "Customer Service",
    type: "Service Guidance",
    updated: "06 Oct 2026"
  },

  {
    title: "SHARE Benefits",
    category: "SHARE Benefits",
    type: "Product Knowledge",
    updated: "09 Oct 2026"
  },

  {
    title: "Earning SHARE Points",
    category: "SHARE Benefits",
    type: "Product Knowledge",
    updated: "01 Oct 2026"
  },

  {
    title: "Redeeming SHARE Points",
    category: "SHARE Benefits",
    type: "Product Knowledge",
    updated: "01 Oct 2026"
  },

  {
    title: "Ambassador Role & Responsibilities",
    category: "Ambassador Program",
    type: "Program Guide",
    updated: "05 Oct 2026"
  },

  {
    title: "Personal QR Code Guidelines",
    category: "Ambassador Program",
    type: "Program Guide",
    updated: "07 Oct 2026"
  },

  {
    title: "SHARE Member Onboarding Guide",
    category: "Ambassador Program",
    type: "Program Guide",
    updated: "08 Oct 2026"
  },

  {
    title: "Customer Data Protection",
    category: "Policies",
    type: "Policy",
    updated: "21 Sep 2026"
  },

  {
    title: "Complaint Handling",
    category: "SOPs",
    type: "SOP",
    updated: "29 Sep 2026"
  },

  {
    title: "Customer Communication Standards",
    category: "SOPs",
    type: "SOP",
    updated: "30 Sep 2026"
  }

];


/* =========================================================
   BU LEAD DEMO DATA
========================================================= */

const managerPerformanceBreakdown = [
  {
    level: "BU",
    name: "Entertainment",
    score: 86,
    ambassadors: 238
  },
  {
    level: "Brand",
    name: "VOX Cinemas",
    score: 87,
    ambassadors: 172
  },
  {
    level: "Mall",
    name: "Mall of the Emirates",
    score: 91,
    ambassadors: 38
  },
  {
    level: "Mall",
    name: "City Centre Mirdif",
    score: 88,
    ambassadors: 31
  },
  {
    level: "Mall",
    name: "City Centre Deira",
    score: 74,
    ambassadors: 27
  },
  {
    level: "Mall",
    name: "City Centre Al Zahia",
    score: 86,
    ambassadors: 24
  }
];


const managerAttentionItems = [
  {
    severity: "Critical",
    location: "City Centre Deira",
    issue: "Refund SLA knowledge",
    affected: "8 Ambassadors",
    action: "Review"
  },
  {
    severity: "High",
    location: "City Centre Mirdif",
    issue: "Training overdue",
    affected: "5 Ambassadors",
    action: "Review"
  },
  {
    severity: "Medium",
    location: "Mall of the Emirates",
    issue: "Service Recovery",
    affected: "3 Ambassadors",
    action: "Review"
  }
];


const ambassadorPopulation = [
  {
    name: "Layla Haddad",
    staffId: "100245",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "Mall of the Emirates",
    location: "VOX MOE",
    performance: 86,
    training: 100,
    members: 42,
    status: "Active"
  },
  {
    name: "Noor Hassan",
    staffId: "100822",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Mirdif",
    location: "VOX CCM",
    performance: 91,
    training: 100,
    members: 48,
    status: "Active"
  },
  {
    name: "Rania Ali",
    staffId: "100845",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Deira",
    location: "VOX CCD",
    performance: 74,
    training: 82,
    members: 29,
    status: "Active"
  },
  {
    name: "Sami Omar",
    staffId: "100901",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Al Zahia",
    location: "VOX CCAZ",
    performance: 88,
    training: 94,
    members: 44,
    status: "Active"
  },
  {
    name: "Sara Khan",
    staffId: "100928",
    bu: "Entertainment",
    brand: "VOX Cinemas",
    mall: "City Centre Deira",
    location: "VOX CCD",
    performance: 72,
    training: 69,
    members: 21,
    status: "Active"
  }
];


const managerKnowledgeGaps = [
  {
    theme: "Refund SLA",
    ambassadors: 34,
    knowledgeScore: 72,
    relatedPerformance: "Service Quality",
    trend: "Declining"
  },
  {
    theme: "Customer Verification",
    ambassadors: 18,
    knowledgeScore: 81,
    relatedPerformance: "SOP Adherence",
    trend: "Stable"
  },
  {
    theme: "SHARE Benefits",
    ambassadors: 11,
    knowledgeScore: 84,
    relatedPerformance: "Member Acquisition",
    trend: "Improving"
  }
];


const managerTrainingOverview = [
  {
    training: "SHARE Customer Experience",
    assigned: 238,
    completed: 224,
    inProgress: 9,
    overdue: 5,
    avgAging: "4 days"
  },
  {
    training: "Service Recovery Essentials",
    assigned: 118,
    completed: 91,
    inProgress: 19,
    overdue: 8,
    avgAging: "6 days"
  },
  {
    training: "Product Knowledge",
    assigned: 238,
    completed: 230,
    inProgress: 4,
    overdue: 4,
    avgAging: "3 days"
  }
];


const onboardingJourneys = [
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


const offboardingJourneys = [
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


const communicationsFeed = [
  {
    title: "SHARE Member Week",
    type: "Announcement",
    date: "13 Oct 2026",
    reach: "221 / 238",
    views: 198,
    likes: 74,
    comments: 18
  },
  {
    title: "New Service Recovery Guide",
    type: "Knowledge Update",
    date: "09 Oct 2026",
    reach: "238 / 238",
    views: 215,
    likes: 61,
    comments: 11
  }
];


const ambassadorHubSubmissions = [
  {
    type: "Feedback",
    submissions: 18,
    open: 4,
    integration: "Alida"
  },
  {
    type: "Suggestion",
    submissions: 24,
    open: 7,
    integration: "Alida"
  },
  {
    type: "In-Store Training",
    submissions: 13,
    open: 2,
    integration: "Alida"
  },
  {
    type: "SHARE Walls",
    submissions: 9,
    open: 1,
    integration: "Alida"
  }
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
        ["audit", "Audit & Service Pulse"],
        ["group-actions", "Actions"]
      ]
    },

    {
      title: "Training & Knowledge",
      items: [
        ["group-training", "Training"],
        ["group-knowledge", "Knowledge Base"],
        ["group-gaps", "Knowledge Gaps"]
      ]
    },

    {
      title: "Ambassador Program",
      items: [
        ["group-ambassadors", "Ambassadors"],
        ["group-onboarding", "Onboarding"],
        ["group-acquisition", "Acquisition"],
        ["group-recognition", "Recognition"]
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
    document.getElementById(
      "login-error"
    );

  if (!node) return;

  node.textContent =
    message;

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


  loginAsRole(
    matchedRole
  );

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


  loginAsRole(
    matchedRole
  );

}


function loginAsRole(role) {

  currentRole =
    role;

  currentPage =
    "home";

  expandedInteractionId =
    null;

  selectedTrainingId =
    null;

  navigateTo(
    "home"
  );

}


function signOut() {

  location.reload();

}


/* =========================================================
   SHELL
========================================================= */

function topBar() {

  const user =
    prototypeUsers[
      currentRole
    ];


  return `
    <header class="topbar">

      <div class="topbar-left">

        <div class="topbar-logo">
          SL
        </div>

        <div class="topbar-brand">

          <strong>
            SHARE Lens
          </strong>

          <span>
            See. Understand. Act.
          </span>

        </div>

      </div>


      <div class="user-header">

        <div class="identity-pill">
          ${user.identityType}
        </div>

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


function sidebar() {

  const groups =
    navigation[
      currentRole
    ];


  return `
    <aside class="sidebar">

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

    </aside>
  `;

}


function renderShell(content) {

  app.innerHTML = `
    <div class="workspace">

      ${topBar()}

      <div class="workspace-body">

        ${sidebar()}

        <main class="content">
          ${content}
        </main>

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

  const remaining =
    Math.max(
      user.shareMemberTarget -
      user.shareMembersOnboarded,
      0
    );


  return `
    ${pageTitle(
      "MY SHARE",
      "Good morning, Layla",
      "Your Ambassador progress."
    )}


    ${ambassadorProgress()}


    <div class="home-kpi-grid">

      ${homeMetricCard(
        "Performance Score",
        "86%",
        "On Track",
        "performance"
      )}

      ${homeMetricCard(
        "Knowledge Score",
        "94%",
        "Strong",
        "knowledge"
      )}

      ${homeMetricCard(
        "Training",
        "100%",
        "Completed",
        "training"
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

        <span class="section-label">
          RECENT ACTIVITY
        </span>

        <h3>
          What to review
        </h3>


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
          onclick="openTrainingTarget('refund')"
        >

          <div>

            <strong>
              Refund Handling Refresher
            </strong>

            <p>
              Recommended · 15 min
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
  target
) {

  return `
    <section
      class="dashboard-card home-metric-card"
      onclick="navigateTo('${target}')"
    >

      <span class="home-metric-label">
        ${title}
      </span>

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

        <span class="home-metric-label">
          SHARE Acquisition
        </span>

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
   AMBASSADOR JOURNEY
========================================================= */

function ambassadorProgress() {

  return `
    <section class="ambassador-progress-card">

      <div class="progress-card-heading">

        <div>

          <span class="section-label">
            AMBASSADOR PROGRESS
          </span>

          <h2>
            Ambassador journey complete
          </h2>

          <p>
            You have completed the core steps to become an active Ambassador.
          </p>

        </div>

        <div class="active-ambassador-pill">
          ✓ Active Ambassador
        </div>

      </div>


      <div class="journey-step-track">

        ${journeyStep("Onboarded")}

        ${journeyConnector()}

        ${journeyStep("Mandatory Training")}

        ${journeyConnector()}

        ${journeyStep("Knowledge Check")}

        ${journeyConnector()}

        ${journeyStep("Personal QR Code")}

      </div>

    </section>
  `;

}


function journeyStep(label) {

  return `
    <div class="journey-step completed">

      <div class="journey-step-icon">
        ✓
      </div>

      <span>
        ${label}
      </span>

    </div>
  `;

}


function journeyConnector() {

  return `
    <div class="journey-step-connector complete"></div>
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
      "Understand your overall performance and the interactions behind it."
    )}


    <div class="performance-period">

      <div>

        <span>
          Performance period
        </span>

        <strong>
          ${currentPerformancePeriod.from} – ${currentPerformancePeriod.to}
        </strong>

      </div>

      <button>
        Change period
      </button>

    </div>


    <section class="performance-summary-intro">

      <div>

        <span class="section-label">
          OVERALL PERFORMANCE
        </span>

        <h2>
          Performance Score
        </h2>

        <p>
          Your overall score is based on all assessed interactions in the selected period.
          Recent interactions below are shown to help you understand individual strengths
          and opportunities.
        </p>

      </div>

      <div class="headline-performance-score">

        <strong>
          86%
        </strong>

        <span>
          On Track
        </span>

      </div>

    </section>


    <div class="dashboard-grid four performance-diagnostics">

      ${performanceMetricCard(
        "Performance Score",
        "86%",
        "Overall outcome",
        "Overall score for the selected period."
      )}

      ${performanceMetricCard(
        "Service Quality",
        "86%",
        "Evaluation",
        "Communication, issue understanding and resolution quality."
      )}

      ${performanceMetricCard(
        "SOP Adherence",
        "92%",
        "Process",
        "How consistently required service steps were followed."
      )}

      ${performanceMetricCard(
        "Compliance",
        "100%",
        "Controls",
        "Mandatory and critical controls completed correctly."
      )}

    </div>


    <section class="dashboard-card performance-table-card">

      <div class="table-heading">

        <span class="section-label">
          RECENT CUSTOMER INTERACTIONS
        </span>

        <h3>
          Your latest interactions
        </h3>

        <p>
          These are recent assessed interactions and are not the full population used
          to calculate your overall Performance Score.
        </p>

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
        .map(
          interaction =>
            interactionBlock(
              interaction
            )
        )
        .join("")}

    </section>
  `;

}


function performanceMetricCard(
  title,
  value,
  category,
  detail
) {

  return `
    <section class="dashboard-card performance-metric-card">

      <div class="performance-metric-top">

        <span>
          ${title}
        </span>

        <small>
          ${category}
        </small>

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

        <div>
          <strong>${interaction.id}</strong>
          <span>${interaction.date}</span>
        </div>

        <div>
          <strong>${interaction.channel}</strong>
          <span>${interaction.duration}</span>
        </div>

        <div>
          <strong>${interaction.process}</strong>
          <span>Customer interaction</span>
        </div>

        <div class="interaction-score ${
          interaction.score < 50
            ? "low"
            : ""
        }">
          ${interaction.score}%
        </div>

        <div>
          <span class="status-block ${status.className}">
            ${status.icon}
            ${status.label}
          </span>
        </div>

        <div>
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


function toggleInteractionDetails(
  interactionId
) {

  expandedInteractionId =
    expandedInteractionId ===
    interactionId
      ? null
      : interactionId;

  navigateTo(
    "performance"
  );

}


function renderExpandedInteraction(
  interaction
) {

  if (
    interaction.score >= 90
  ) {

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
            Customer verification, communication and process handling
            were completed successfully.
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
            SHARE Lens will run the specialist agent team
            against this interaction.
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


function analyseInlineInteraction(
  interactionId
) {

  if (
    expandedInteractionId ===
    interactionId
  ) {

    expandedInteractionId = null;

    navigateTo(
      "performance"
    );

    return;

  }


  expandedInteractionId =
    interactionId;

  navigateTo(
    "performance"
  );


  setTimeout(
    () => {

      startInlineAnalysis(
        interactionId
      );

    },
    100
  );

}


function startInlineAnalysis(
  interactionId
) {

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
        id:
          `evaluation-${interaction.id}`,
        title:
          "Evaluation Agent",
        message:
          "Reviewing service quality and customer handling."
      },

      {
        id:
          `sop-${interaction.id}`,
        title:
          "SOP Agent",
        message:
          "Checking required process steps."
      },

      {
        id:
          `compliance-${interaction.id}`,
        title:
          "Compliance Agent",
        message:
          "Checking mandatory controls and compliance."
      },

      {
        id:
          `combined-${interaction.id}`,
        title:
          "Combined Analysis",
        message:
          "Combining findings and identifying the next best action."
      }

    ],

    onComplete:
      () => {

        showInlineAnalysisResult(
          interaction
        );

      }

  });

}


function showInlineAnalysisResult(
  interaction
) {

  const output =
    document.getElementById(
      `inline-analysis-${interaction.id}`
    );

  if (!output) return;


  const analysis =
    analyseInteraction(
      interaction
    );

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
            The customer and booking reference were verified
            before discussing the booking.
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
            The expected refund timeframe could have been
            communicated more clearly to the customer.
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
            Review the relevant training and then complete the
            ${interaction.knowledgeTarget}.
          </p>

        </div>

        <button
          onclick="openTrainingTarget('${interaction.trainingTarget}')"
        >
          Go to Training
        </button>

      </div>

    </div>
  `;

}


/* =========================================================
   AMBASSADOR TRAINING
========================================================= */

function trainingPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "My Training",
      "Your assigned and recommended learning."
    )}


    <section class="completed-journey-card">

      <div>

        <span class="section-label">
          AMBASSADOR JOURNEY
        </span>

        <h3>
          Core journey complete
        </h3>

        <p>
          Onboarded, Mandatory Training, Knowledge Check and
          Personal QR Code are complete.
        </p>

      </div>

      <span class="status-block good">
        ✓ Complete
      </span>

    </section>


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
              Training assigned as part of your formal learning plan.
            </p>

          </div>

          <span class="training-count">
            ${assignedTraining.length}
          </span>

        </div>


        <div class="training-card-list">

          ${assignedTraining
            .map(
              item =>
                assignedTrainingCard(
                  item
                )
            )
            .join("")}

        </div>

      </section>


      <section class="dashboard-card training-panel recommended-panel">

        <div class="training-panel-heading">

          <div>

            <span class="section-label">
              RECOMMENDED TRAINING
            </span>

            <h3>
              Recommended for you
            </h3>

            <p>
              Development recommended from your recent performance.
            </p>

          </div>

          <span class="training-count recommended">
            ${recommendedTraining.length}
          </span>

        </div>


        <div class="training-card-list">

          ${recommendedTraining
            .map(
              item =>
                recommendedTrainingCard(
                  item
                )
            )
            .join("")}

        </div>

      </section>

    </div>


    <section
      id="training-focus-panel"
      class="training-focus-panel ${
        selectedTrainingId
          ? "visible"
          : ""
      }"
    >

      ${
        selectedTrainingId
          ? renderTrainingFocus(
              selectedTrainingId
            )
          : ""
      }

    </section>


    <section class="dashboard-card knowledge-check-section">

      <span class="section-label">
        KNOWLEDGE CHECK
      </span>

      <h3>
        Refund Handling Knowledge Check
      </h3>

      <p>
        Recommended after completing the Refund Handling Refresher.
      </p>


      <div class="knowledge-check-meta">

        <span>
          10 questions
        </span>

        <span>
          Approx. 5 min
        </span>

        <span class="status-block strengthen">
          Recommended
        </span>

      </div>

      <button class="primary-small">
        Start Knowledge Check
      </button>

    </section>
  `;

}


function assignedTrainingCard(item) {

  return `
    <div
      id="training-${item.id}"
      class="training-item-card"
    >

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


        <span class="training-status ${
          item.status === "Completed"
            ? "completed"
            : "progress"
        }">
          ${item.status}
        </span>

      </div>


      <div class="training-aging">

        <span>
          Aging
        </span>

        <strong>
          ${item.aging}
        </strong>

      </div>


      <button
        class="training-open-button"
        onclick="openTrainingTarget('${item.id}')"
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


function recommendedTrainingCard(item) {

  return `
    <div
      id="training-${item.id}"
      class="training-item-card recommended"
    >

      <div class="recommended-tag">
        Performance recommendation
      </div>


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
              Recommended ${item.recommended}
            </span>

          </div>

        </div>


        <span class="training-status recommended">
          Recommended
        </span>

      </div>


      <p class="training-reason">
        ${item.reason}
      </p>


      <button
        class="training-open-button primary"
        onclick="openTrainingTarget('${item.id}')"
      >
        Open
      </button>

    </div>
  `;

}


function openTrainingTarget(trainingId) {

  selectedTrainingId =
    trainingId;

  navigateTo(
    "training"
  );


  setTimeout(
    () => {

      const trainingCard =
        document.getElementById(
          `training-${trainingId}`
        );

      const focusPanel =
        document.getElementById(
          "training-focus-panel"
        );


      if (trainingCard) {

        trainingCard
          .classList
          .add(
            "highlight-training"
          );

      }


      if (focusPanel) {

        focusPanel
          .scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

      }

    },
    120
  );

}


function renderTrainingFocus(trainingId) {

  const item =
    assignedTraining.find(
      training =>
        training.id === trainingId
    )
    ||
    recommendedTraining.find(
      training =>
        training.id === trainingId
    );


  if (!item) return "";


  const isRecommended =
    recommendedTraining.some(
      training =>
        training.id === trainingId
    );


  return `
    <div class="training-focus-content">

      <div class="training-focus-heading">

        <div>

          <span class="section-label">
            ${
              isRecommended
                ? "RECOMMENDED TRAINING"
                : "ASSIGNED TRAINING"
            }
          </span>

          <h2>
            ${item.title}
          </h2>

          <p>
            ${item.description}
          </p>

        </div>

        <span class="training-focus-duration">
          ${item.duration}
        </span>

      </div>


      ${
        isRecommended
          ? `
            <div class="training-source-callout">

              <strong>
                Why this was recommended
              </strong>

              <p>
                ${item.reason}
              </p>

            </div>
          `
          : `
            <div class="training-detail-grid">

              <div>
                <span>Assigned</span>
                <strong>${item.assigned}</strong>
              </div>

              <div>
                <span>Due</span>
                <strong>${item.due}</strong>
              </div>

              <div>
                <span>Aging</span>
                <strong>${item.aging}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>${item.status}</strong>
              </div>

            </div>
          `
      }


      <button class="start-training-button">

        ${
          item.status === "Completed"
            ? "Review Training"
            : "Start Training"
        }

      </button>

    </div>
  `;

}


/* =========================================================
   KNOWLEDGE BASE
========================================================= */

function knowledgePage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Search and access approved SHARE knowledge."
    )}


    <section class="knowledge-recommended">

      <span class="section-label">
        RECOMMENDED FOR YOU
      </span>

      <h3>
        Based on your recent performance
      </h3>


      <div class="recommended-knowledge-grid">

        ${recommendedKnowledgeCard(
          "Refund Process",
          "Refunds & Cancellations",
          "Linked to your recent Refund Handling performance."
        )}

        ${recommendedKnowledgeCard(
          "Cancellation & Refund Policy",
          "Refunds & Cancellations",
          "Review expected refund timelines and customer communication."
        )}

      </div>

    </section>


    ${knowledgeRepositorySection()}
  `;

}


function managerKnowledgePage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Browse the approved knowledge available to your Ambassador population."
    )}

    ${managerFilters()}

    ${knowledgeRepositorySection()}
  `;

}


function knowledgeRepositorySection() {

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


        <div class="knowledge-count">

          ${knowledgeRepository.length}

          <span>
            Articles
          </span>

        </div>

      </div>


      <div class="knowledge-toolbar">

        <div class="knowledge-search">

          <span>
            ⌕
          </span>

          <input
            id="knowledge-search"
            type="text"
            placeholder="Search Knowledge Base"
            oninput="filterKnowledgeBase()"
          >

        </div>


        <select
          id="knowledge-category"
          onchange="filterKnowledgeBase()"
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
          Updated
        </span>

        <span>
          Action
        </span>

      </div>


      <div id="knowledge-results">

        ${renderKnowledgeRows(
          knowledgeRepository
        )}

      </div>

    </section>
  `;

}


function recommendedKnowledgeCard(
  title,
  category,
  reason
) {

  return `
    <div class="recommended-knowledge-card">

      <span class="knowledge-recommendation-icon">
        ✦
      </span>

      <div>

        <span class="knowledge-category">
          ${category}
        </span>

        <h3>
          ${title}
        </h3>

        <p>
          ${reason}
        </p>

      </div>

      <button class="small-button">
        Open
      </button>

    </div>
  `;

}


function renderKnowledgeRows(items) {

  if (!items.length) {

    return `
      <div class="knowledge-empty">
        No knowledge articles match your search.
      </div>
    `;

  }


  return items
    .map(
      item => `

        <div class="knowledge-row">

          <div>
            <strong>${item.title}</strong>
          </div>

          <span>${item.category}</span>
          <span>${item.type}</span>
          <span>${item.updated}</span>

          <button class="small-button">
            Open
          </button>

        </div>

      `
    )
    .join("");

}


function filterKnowledgeBase() {

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
    knowledgeRepository.filter(
      item => {

        const matchesSearch =
          !search
          ||
          item.title
            .toLowerCase()
            .includes(search)
          ||
          item.category
            .toLowerCase()
            .includes(search)
          ||
          item.type
            .toLowerCase()
            .includes(search);


        const matchesCategory =
          category === "all"
          ||
          item.category === category;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );


  resultsNode.innerHTML =
    renderKnowledgeRows(
      filtered
    );

}


/* =========================================================
   AMBASSADOR STATUS
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
      "Your profile, Personal QR Code and SHARE impact."
    )}


    <div class="dashboard-grid two">

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
            "Ambassador Status",
            "Active"
          )}

        </div>

      </section>


      <section class="dashboard-card qr-card">

        <span class="section-label">
          PERSONAL QR CODE
        </span>

        <h3>
          Active
        </h3>

        <div class="active-qr-wrapper">

          <img
            class="share-qr-image"
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwww.sharerewards.com%2F"
            alt="SHARE Rewards QR Code"
          >

        </div>

        <p>
          Use your Personal QR Code for attributable
          SHARE member onboarding activity.
        </p>

      </section>

    </div>


    <section class="share-impact-card">

      <div class="share-impact-heading">

        <div>

          <span class="section-label">
            MY SHARE IMPACT
          </span>

          <h2>
            SHARE Acquisition Progress
          </h2>

          <p>
            Your SHARE member onboarding progress for the current performance period.
          </p>

        </div>


        <div class="period-pill">

          <span>
            Performance period
          </span>

          <strong>
            ${currentPerformancePeriod.from} – ${currentPerformancePeriod.to}
          </strong>

        </div>

      </div>


      <div class="impact-metrics">

        ${impactMetric(
          "Members Onboarded",
          onboarded,
          "This period"
        )}

        ${impactMetric(
          "Target",
          target,
          "Members"
        )}

        ${impactMetric(
          "Achievement",
          `${achievement}%`,
          "Of target"
        )}

        ${impactMetric(
          "Remaining",
          remaining,
          remaining === 1
            ? "Member to target"
            : "Members to target"
        )}

      </div>


      <div class="acquisition-progress-section">

        <div class="acquisition-progress-heading">

          <div>

            <span class="section-label">
              PROGRESS TO TARGET
            </span>

            <h3>
              ${onboarded} of ${target} members onboarded
            </h3>

          </div>

          <strong class="achievement-value">
            ${achievement}%
          </strong>

        </div>


        <div class="acquisition-progress-track">

          <div
            class="acquisition-progress-fill"
            style="--target-width:${achievement}%"
          ></div>

        </div>


        <div class="impact-message">

          <div class="impact-message-icon">
            ✦
          </div>

          <div>

            <strong>
              ${remaining} members away from your target
            </strong>

            <p>
              You have achieved ${achievement}% of your SHARE onboarding target for this period.
            </p>

          </div>

        </div>


        <div class="impact-milestones">

          ${impactMilestone(
            "Started",
            "Your first SHARE member onboarded",
            true
          )}

          ${impactMilestone(
            "Halfway",
            `${Math.round(target / 2)} members onboarded`,
            onboarded >= Math.round(target / 2)
          )}

          ${impactMilestone(
            "Target",
            `${target} members onboarded`,
            onboarded >= target
          )}

        </div>

      </div>

    </section>
  `;

}


function impactMetric(
  title,
  value,
  detail
) {

  return `
    <div class="impact-metric">

      <span>${title}</span>

      <strong>${value}</strong>

      <small>${detail}</small>

    </div>
  `;

}


function impactMilestone(
  title,
  detail,
  complete
) {

  return `
    <div class="impact-milestone ${
      complete
        ? "complete"
        : "pending"
    }">

      <div class="impact-milestone-icon">

        ${
          complete
            ? "✓"
            : "○"
        }

      </div>

      <div>

        <strong>
          ${title}
        </strong>

        <span>
          ${detail}
        </span>

      </div>

    </div>
  `;

}


/* =========================================================
   BU LEAD FILTERS
========================================================= */

function managerFilters() {

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
          <option>UAE</option>
        </select>

      </div>


      <div class="filter-field">

        <label>
          BU
        </label>

        <select>
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
          Scoped to Entertainment UAE
        </strong>

        <span>
          You only see Ambassadors, locations and performance data within your assigned BU scope.
        </span>

      </div>

    </div>
  `;

}


/* =========================================================
   BU LEAD HOME
========================================================= */

function managerHome() {

  const onboarded = 1842;
  const target = 2100;
  const achievement =
    Math.round(
      (onboarded / target) * 100
    );

  const remaining =
    target - onboarded;


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
        "On Track"
      )}

      ${metricCard(
        "Active Ambassadors",
        "238",
        "Within your scope"
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "Current period"
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
              Drill from BU to Brand, Mall and Store / Location.
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
            .map(
              item =>
                managerPerformanceRow(
                  item
                )
            )
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
          .map(
            item =>
              managerAttentionRow(
                item
              )
          )
          .join("")}

      </section>

    </div>


    <section class="manager-home-acquisition">

      <div>

        <span class="section-label">
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


      <button
        class="manager-progress-link"
        onclick="navigateTo('manager-acquisition')"
      >
        View Acquisition →
      </button>

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
      onclick="navigateTo('manager-acquisition')"
    >

      <div class="manager-kpi-top">

        <span>
          SHARE Members Onboarded
        </span>

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

      <div>

        <span class="hierarchy-pill">
          ${item.level}
        </span>

        <strong>
          ${item.name}
        </strong>

      </div>

      <div class="manager-row-population">

        <span>
          Ambassadors
        </span>

        <strong>
          ${item.ambassadors}
        </strong>

      </div>

      <div class="manager-row-score">

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
        onclick="navigateTo('team-performance')"
      >
        Drill Down
      </button>

    </div>
  `;

}


function managerAttentionRow(item) {

  const severityClass =
    item.severity.toLowerCase();


  return `
    <div class="manager-attention-row">

      <span class="severity-pill ${severityClass}">
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
        ${item.action}
      </button>

    </div>
  `;

}


/* =========================================================
   BU LEAD PERFORMANCE
========================================================= */

function managerPerformance() {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "BU Performance",
      "Drill into performance by BU, Brand, Mall, Store / Location and Ambassador."
    )}


    ${managerFilters()}


    <section class="overall-analysis-card">

      <div>

        <span class="section-label light-label">
          AI PERFORMANCE ANALYSIS
        </span>

        <h2>
          Analyse Entertainment UAE
        </h2>

        <p>
          SHARE Lens will analyse the current filtered scope and identify recurring themes,
          affected teams and recommended interventions.
        </p>

      </div>


      <button
        class="analyse-overall-button"
        onclick="runManagerAnalysis()"
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


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Performance Score",
        "86%",
        "On Track"
      )}

      ${metricCard(
        "Service Quality",
        "84%",
        "Current period"
      )}

      ${metricCard(
        "SOP Adherence",
        "89%",
        "Current period"
      )}

      ${metricCard(
        "Compliance",
        "97%",
        "Current period"
      )}

    </div>


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
            Follow performance from BU through to individual Ambassador.
          </p>

        </div>


        <select class="inline-selector">

          <option>
            BU
          </option>

          <option>
            Brand
          </option>

          <option>
            Mall
          </option>

          <option>
            Store / Location
          </option>

          <option>
            Ambassador
          </option>

        </select>

      </div>


      <div class="manager-drill-header">

        <span>
          Level
        </span>

        <span>
          Name
        </span>

        <span>
          Ambassadors
        </span>

        <span>
          Performance
        </span>

        <span>
          Action
        </span>

      </div>


      ${managerPerformanceBreakdown
        .map(
          item =>
            managerDrillRow(
              item
            )
        )
        .join("")}

    </section>


    <section class="dashboard-card manager-ai-section">

      <span class="section-label">
        AI ORCHESTRATION
      </span>

      <h3>
        BU performance agent team
      </h3>

      <p>
        The agent team analyses only the currently selected BU Lead scope.
      </p>


      <div class="agent-team-strip manager-team">

        ${agentTeamMember(
          "1",
          "Performance Agent",
          "Measures outcomes"
        )}

        ${agentTeamMember(
          "2",
          "Pattern Agent",
          "Finds recurring issues"
        )}

        ${agentTeamMember(
          "3",
          "Knowledge Gap Agent",
          "Finds development gaps"
        )}

        ${agentTeamMember(
          "4",
          "Intervention Agent",
          "Prioritises teams"
        )}

        ${agentTeamMember(
          "5",
          "Combined Analysis",
          "Recommends action"
        )}

      </div>


      <div
        id="manager-agent-output"
        class="agent-output empty-state"
      >
        Run Analyse Current View to start.
      </div>

    </section>
  `;

}


function managerDrillRow(item) {

  return `
    <div class="manager-drill-row">

      <span>
        ${item.level}
      </span>

      <strong>
        ${item.name}
      </strong>

      <span>
        ${item.ambassadors}
      </span>

      <strong class="${
        item.score < 80
          ? "score-attention"
          : "score-good"
      }">
        ${item.score}%
      </strong>

      <button class="small-button">
        Drill Down
      </button>

    </div>
  `;

}


/* =========================================================
   BU LEAD REQUIRES ATTENTION
========================================================= */

function managerRequiresAttentionPage() {

  return `
    ${pageTitle(
      "PERFORMANCE",
      "Requires Attention",
      "Prioritised issues within your assigned Entertainment UAE scope."
    )}


    ${managerFilters()}


    <div class="dashboard-grid four">

      ${metricCard(
        "Critical",
        "1",
        "Immediate attention"
      )}

      ${metricCard(
        "High",
        "4",
        "Priority follow-up"
      )}

      ${metricCard(
        "Medium",
        "7",
        "Monitor"
      )}

      ${metricCard(
        "Ambassadors Impacted",
        "34",
        "Within your scope"
      )}

    </div>


    <section class="dashboard-card">

      <div class="attention-table-header">

        <span>
          Severity
        </span>

        <span>
          Location
        </span>

        <span>
          Area
        </span>

        <span>
          Affected
        </span>

        <span>
          Action
        </span>

      </div>


      ${managerAttentionItems
        .map(
          item =>
            managerAttentionTableRow(
              item
            )
        )
        .join("")}

    </section>
  `;

}


function managerAttentionTableRow(item) {

  return `
    <div class="attention-table-row">

      <span class="severity-pill ${item.severity.toLowerCase()}">
        ${item.severity}
      </span>

      <strong>
        ${item.location}
      </strong>

      <span>
        ${item.issue}
      </span>

      <span>
        ${item.affected}
      </span>

      <button class="small-button">
        Review
      </button>

    </div>
  `;

}


/* =========================================================
   BU LEAD AMBASSADOR POPULATION
========================================================= */

function managerAmbassadorsPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassadors",
      "View and manage the Ambassador population within your assigned scope."
    )}


    ${managerFilters()}


    <section class="dashboard-card">

      <div class="card-heading-row">

        <div>

          <span class="section-label">
            AMBASSADOR POPULATION
          </span>

          <h3>
            Entertainment UAE
          </h3>

          <p>
            Filter by BU, Brand, Mall or Store / Location and export the resulting population.
          </p>

        </div>


        <button
          class="export-button"
          onclick="exportAmbassadorList()"
        >
          ↓ Export List
        </button>

      </div>


      <div
        id="export-message"
        class="export-message"
      ></div>


      <div class="population-header">

        <span>
          Ambassador
        </span>

        <span>
          BU / Brand
        </span>

        <span>
          Mall / Location
        </span>

        <span>
          Performance
        </span>

        <span>
          Training
        </span>

        <span>
          Members Onboarded
        </span>

        <span>
          Status
        </span>

      </div>


      ${ambassadorPopulation
        .map(
          ambassador =>
            ambassadorPopulationRow(
              ambassador
            )
        )
        .join("")}

    </section>
  `;

}


function ambassadorPopulationRow(
  ambassador
) {

  return `
    <div class="population-row">

      <div>

        <strong>
          ${ambassador.name}
        </strong>

        <span>
          Staff ID ${ambassador.staffId}
        </span>

      </div>


      <div>

        <strong>
          ${ambassador.bu}
        </strong>

        <span>
          ${ambassador.brand}
        </span>

      </div>


      <div>

        <strong>
          ${ambassador.mall}
        </strong>

        <span>
          ${ambassador.location}
        </span>

      </div>


      <strong class="${
        ambassador.performance < 80
          ? "score-attention"
          : "score-good"
      }">
        ${ambassador.performance}%
      </strong>


      <strong>
        ${ambassador.training}%
      </strong>


      <strong>
        ${ambassador.members}
      </strong>


      <span class="status-block good">
        ${ambassador.status}
      </span>

    </div>
  `;

}


function exportAmbassadorList() {

  const message =
    document.getElementById(
      "export-message"
    );

  if (!message) return;


  message.innerHTML = `
    <strong>
      Export prepared
    </strong>

    <span>
      The Ambassador population export reflects the current BU Lead filter scope.
    </span>
  `;


  message.classList.add(
    "visible"
  );

}


/* =========================================================
   BU LEAD TRAINING
========================================================= */

function managerTrainingOverviewPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Training Overview",
      "Monitor assigned learning, completion, aging and recommended development."
    )}


    ${managerFilters()}


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


    <div class="training-layout">

      <section class="dashboard-card">

        <span class="section-label">
          ASSIGNED TRAINING
        </span>

        <h3>
          Team learning plan
        </h3>


        <div class="manager-training-header">

          <span>
            Training
          </span>

          <span>
            Assigned
          </span>

          <span>
            Completed
          </span>

          <span>
            In Progress
          </span>

          <span>
            Overdue
          </span>

          <span>
            Avg Aging
          </span>

        </div>


        ${managerTrainingOverview
          .map(
            item =>
              managerTrainingRow(
                item
              )
          )
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

      <strong>
        ${item.training}
      </strong>

      <span>
        ${item.assigned}
      </span>

      <span>
        ${item.completed}
      </span>

      <span>
        ${item.inProgress}
      </span>

      <strong class="${
        item.overdue > 5
          ? "score-attention"
          : ""
      }">
        ${item.overdue}
      </strong>

      <span>
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

        <span class="severity-pill ${
          priority.toLowerCase()
        }">
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
   BU LEAD KNOWLEDGE GAPS
========================================================= */

function managerKnowledgeGapsPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Gaps",
      "Identify recurring knowledge themes affecting Ambassador performance."
    )}


    ${managerFilters()}


    <section class="dashboard-card">

      <div class="knowledge-gap-header">

        <span>
          Knowledge Theme
        </span>

        <span>
          Ambassadors Affected
        </span>

        <span>
          Avg Knowledge Score
        </span>

        <span>
          Related Performance
        </span>

        <span>
          Trend
        </span>

        <span>
          Action
        </span>

      </div>


      ${managerKnowledgeGaps
        .map(
          gap =>
            managerKnowledgeGapRow(
              gap
            )
        )
        .join("")}

    </section>
  `;

}


function managerKnowledgeGapRow(gap) {

  return `
    <div class="knowledge-gap-row">

      <strong>
        ${gap.theme}
      </strong>

      <span>
        ${gap.ambassadors}
      </span>

      <strong class="${
        gap.knowledgeScore < 80
          ? "score-attention"
          : "score-good"
      }">
        ${gap.knowledgeScore}%
      </strong>

      <span>
        ${gap.relatedPerformance}
      </span>

      <span>
        ${gap.trend}
      </span>

      <button class="small-button">
        Review
      </button>

    </div>
  `;

}


/* =========================================================
   BU LEAD ONBOARDING / OFFBOARDING
========================================================= */

function managerOnboardingPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Onboarding & Offboarding",
      "Track task completion across the Ambassador lifecycle."
    )}


    ${managerFilters()}


    <section class="dashboard-card lifecycle-section">

      <span class="section-label">
        ONBOARDING JOURNEYS
      </span>

      <h3>
        Ambassadors joining the programme
      </h3>


      ${onboardingJourneys
        .map(
          journey =>
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


      ${offboardingJourneys
        .map(
          journey =>
            lifecycleJourneyCard(
              journey,
              "Offboarding"
            )
        )
        .join("")}

    </section>
  `;

}


function lifecycleJourneyCard(
  journey,
  type
) {

  return `
    <div class="lifecycle-card">

      <div class="lifecycle-person">

        <div class="mini-avatar">
          ${journey.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .slice(0,2)}
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
          .map(
            step =>
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


function lifecycleStep(
  label,
  status
) {

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
   BU LEAD ACQUISITION
========================================================= */

function managerAcquisitionPage() {

  const onboarded = 1842;
  const target = 2100;

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


    ${managerFilters()}


    <section class="manager-acquisition-hero">

      <div>

        <span class="section-label light-label">
          SHARE ACQUISITION
        </span>

        <h2>
          ${onboarded.toLocaleString()} members onboarded
        </h2>

        <p>
          Entertainment UAE · ${currentPerformancePeriod.preset}
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


    <div class="dashboard-grid four">

      ${metricCard(
        "Members Onboarded",
        onboarded.toLocaleString(),
        "Current period"
      )}

      ${metricCard(
        "Target",
        target.toLocaleString(),
        "Entertainment UAE"
      )}

      ${metricCard(
        "Achievement",
        `${achievement}%`,
        "Of target"
      )}

      ${metricCard(
        "Active Ambassadors",
        "238",
        "Eligible population"
      )}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        AMBASSADOR LEADERBOARD
      </span>

      <h3>
        Member onboarding contribution
      </h3>


      <div class="leaderboard-header">

        <span>
          Rank
        </span>

        <span>
          Ambassador
        </span>

        <span>
          Brand
        </span>

        <span>
          Location
        </span>

        <span>
          Members Onboarded
        </span>

        <span>
          % Target
        </span>

      </div>


      ${[
        ["1", "Noor Hassan", "VOX Cinemas", "City Centre Mirdif", "48", "96%"],
        ["2", "Sami Omar", "VOX Cinemas", "City Centre Al Zahia", "44", "88%"],
        ["3", "Layla Haddad", "VOX Cinemas", "Mall of the Emirates", "42", "84%"],
        ["4", "Rania Ali", "VOX Cinemas", "City Centre Deira", "29", "58%"],
        ["5", "Sara Khan", "VOX Cinemas", "City Centre Deira", "21", "42%"]
      ]
        .map(
          row =>
            leaderboardRow(
              ...row
            )
        )
        .join("")}

    </section>
  `;

}


function leaderboardRow(
  rank,
  name,
  brand,
  location,
  members,
  target
) {

  return `
    <div class="leaderboard-row">

      <strong class="rank-cell">
        ${rank}
      </strong>

      <strong>
        ${name}
      </strong>

      <span>
        ${brand}
      </span>

      <span>
        ${location}
      </span>

      <strong>
        ${members}
      </strong>

      <strong>
        ${target}
      </strong>

    </div>
  `;

}


/* =========================================================
   BU LEAD COMMUNICATIONS
========================================================= */

function managerCommunicationsPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Communications",
      "Broadcast updates and measure Ambassador engagement."
    )}


    ${managerFilters()}


    <section class="communications-hero">

      <div>

        <span class="section-label light-label">
          BROADCASTS & INTERACTIVE FEED
        </span>

        <h2>
          Engage your Ambassador community
        </h2>

        <p>
          Share announcements and updates, then track views, likes and comments.
        </p>

      </div>

      <button
        class="white-action-button"
        onclick="showNewBroadcast()"
      >
        + New Broadcast
      </button>

    </section>


    <div
      id="broadcast-compose-area"
    ></div>


    <div class="dashboard-grid four">

      ${metricCard(
        "Broadcasts",
        "12",
        "This period"
      )}

      ${metricCard(
        "Reach",
        "94%",
        "Average"
      )}

      ${metricCard(
        "Engagement",
        "39%",
        "Likes + comments"
      )}

      ${metricCard(
        "Comments",
        "86",
        "This period"
      )}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        RECENT COMMUNICATIONS
      </span>

      <h3>
        Broadcast engagement
      </h3>


      <div class="communications-header">

        <span>
          Broadcast
        </span>

        <span>
          Reach
        </span>

        <span>
          Views
        </span>

        <span>
          Likes
        </span>

        <span>
          Comments
        </span>

        <span>
          Action
        </span>

      </div>


      ${communicationsFeed
        .map(
          item =>
            communicationsRow(
              item
            )
        )
        .join("")}

    </section>


    <section class="notice-card">

      <strong>
        Engagement reporting
      </strong>

      <p>
        Future-state engagement points can feed Ambassador profiles and BU / Brand leaderboards.
        This prototype currently demonstrates the reporting experience only.
      </p>

    </section>
  `;

}


function communicationsRow(item) {

  return `
    <div class="communications-row">

      <div>

        <strong>
          ${item.title}
        </strong>

        <span>
          ${item.type} · ${item.date}
        </span>

      </div>

      <span>
        ${item.reach}
      </span>

      <strong>
        ${item.views}
      </strong>

      <strong>
        ${item.likes}
      </strong>

      <strong>
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

        <div class="mock-field">
          <label>
            Audience
          </label>

          <div>
            Entertainment UAE
          </div>
        </div>

        <div class="mock-field">
          <label>
            Brand
          </label>

          <div>
            All Brands
          </div>
        </div>

        <div class="mock-field wide">
          <label>
            Title
          </label>

          <div>
            Enter broadcast title
          </div>
        </div>

        <div class="mock-field wide">
          <label>
            Message
          </label>

          <div class="mock-textarea">
            Enter announcement or update
          </div>
        </div>

      </div>

      <button class="primary-small">
        Publish Broadcast
      </button>

    </section>
  `;

}


/* =========================================================
   BU LEAD AMBASSADOR HUB
========================================================= */

function managerHubPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassador Hub",
      "Track feedback, suggestions and Ambassador-led submissions."
    )}


    ${managerFilters()}


    <div class="dashboard-grid four">

      ${ambassadorHubSubmissions
        .map(
          item =>
            hubMetricCard(
              item
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

        <b>
          →
        </b>

        <span>
          SHARE Lens
        </span>

        <b>
          →
        </b>

        <span>
          Categorisation
        </span>

        <b>
          →
        </b>

        <span>
          Alida Integration
        </span>

        <b>
          →
        </b>

        <span>
          Reporting & Follow-up
        </span>

      </div>

    </section>


    <section class="notice-card">

      <strong>
        Integration placeholder: Alida
      </strong>

      <p>
        Feedback, Suggestions, In-Store Training and SHARE Walls are represented
        as future Alida-connected submission categories in this prototype.
      </p>

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
   SERVICE DELIVERY - CURRENT VERSION PRESERVED
========================================================= */

function serviceHome() {

  return `
    ${pageTitle(
      "MAF MALLS",
      "Service Delivery",
      "Cross-location visibility across Service Delivery, Training & Knowledge and the Ambassador Program."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Ambassadors",
        "850",
        "Current"
      )}

      ${metricCard(
        "Onboarding",
        "38",
        "Current"
      )}

      ${metricCard(
        "Locations",
        "24",
        "MAF malls"
      )}

      ${metricCard(
        "Open Interventions",
        "37",
        "Current"
      )}

    </div>
  `;

}


function servicePerformance() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Performance",
      "Identify systemic themes and MAF mall locations requiring intervention."
    )}


    <section class="overall-analysis-card">

      <div>

        <span class="section-label light-label">
          GROUP AI ANALYSIS
        </span>

        <h2>
          Analyse Group Performance
        </h2>

        <p>
          Analyse performance, audit, training and knowledge signals across MAF mall locations.
        </p>

      </div>


      <button
        class="analyse-overall-button"
        onclick="runServiceAnalysis()"
      >

        <span class="overall-ai-icon">
          ✦
        </span>

        <div>

          <strong>
            Analyse Group Performance
          </strong>

          <small>
            Finds themes and priority interventions
          </small>

        </div>

      </button>

    </section>


    <div
      id="service-agent-output"
      class="agent-output empty-state"
    >
      Run Analyse Group Performance to start.
    </div>
  `;

}


function auditPage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Audit & Service Pulse",
      "Service Audit and Service Pulse reporting."
    )}

    <section class="dashboard-card">

      <span class="section-label">
        SERVICE PULSE
      </span>

      <h3>
        Service Delivery persona review next
      </h3>

      <p>
        The detailed Service Pulse reporting model will be implemented
        during the Service Delivery persona update using the report shared by Ops.
      </p>

    </section>
  `;

}


/* =========================================================
   ADMIN - CURRENT VERSION PRESERVED
========================================================= */

function adminHome() {

  return `
    ${pageTitle(
      "PLATFORM ADMINISTRATION",
      "SHARE Lens Platform",
      "Manage identity, access, AI agents and integrations."
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
        "9",
        "Prototype"
      )}

    </div>
  `;

}


/* =========================================================
   AI ANALYSIS
========================================================= */

function runManagerAnalysis() {

  runAnimation({

    outputId:
      "manager-agent-output",

    title:
      "Analysing Entertainment UAE",

    steps: [

      {
        id:
          "manager-performance",
        title:
          "Performance Agent",
        message:
          "Assessing Service Quality, SOP Adherence and Compliance."
      },

      {
        id:
          "manager-pattern",
        title:
          "Pattern Agent",
        message:
          "Finding recurring themes across your filtered population."
      },

      {
        id:
          "manager-knowledge",
        title:
          "Knowledge Gap Agent",
        message:
          "Linking recurring performance issues to knowledge gaps."
      },

      {
        id:
          "manager-intervention",
        title:
          "Intervention Agent",
        message:
          "Prioritising locations, teams and Ambassadors requiring intervention."
      },

      {
        id:
          "manager-combined",
        title:
          "Combined Analysis",
        message:
          "Preparing recommended actions for the current scope."
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

        ${severityRow(
          "Service recovery",
          "11 Ambassadors · 2 locations",
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

        ${locationSeverityRow(
          "Mall of the Emirates",
          "3 Ambassadors affected",
          "Medium",
          "medium"
        )}

      </section>

    </div>


    <section class="intervention-focus">

      <div class="severity-marker critical">
        1
      </div>

      <div>

        <span class="section-label">
          RECOMMENDED INTERVENTION
        </span>

        <h3>
          Refund SLA refresher for City Centre Deira
        </h3>

        <p>
          Eight Ambassadors show a recurring refund timeline knowledge gap.
          Assign targeted learning followed by a Knowledge Check and review performance again.
        </p>

      </div>

      <div class="intervention-actions">

        <strong>
          Next Steps
        </strong>

        <span>
          Assign targeted refresher
        </span>

        <span>
          Trigger Knowledge Check
        </span>

        <span>
          Reassess performance
        </span>

      </div>

    </section>
  `;

}


function runServiceAnalysis() {

  runAnimation({

    outputId:
      "service-agent-output",

    title:
      "Analysing MAF Mall Performance",

    steps: [

      {
        id:
          "service-performance",
        title:
          "Performance Agent",
        message:
          "Assessing performance across MAF mall locations."
      },

      {
        id:
          "service-pattern",
        title:
          "Pattern Agent",
        message:
          "Identifying recurring themes across locations."
      },

      {
        id:
          "service-severity",
        title:
          "Location Severity Agent",
        message:
          "Ranking locations by intervention need."
      },

      {
        id:
          "service-intervention",
        title:
          "Intervention Agent",
        message:
          "Matching issues to targeted interventions."
      },

      {
        id:
          "service-combined",
        title:
          "Combined Analysis",
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
      "MAF Mall Estate"
    )}
  `;

}


function runAnimation(config) {

  const output =
    document.getElementById(
      config.outputId
    );

  if (!output) return;


  output.classList.remove(
    "empty-state"
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

        ${config.steps.map(
          (
            step,
            index
          ) => `

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

          `
        ).join("")}

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
    (
      step,
      index
    ) => {

      const startDelay =
        index * 1050;


      if (
        index > 0
      ) {

        setTimeout(
          () => {

            activateGenericStep(
              config.outputId,
              step.id,
              step.message
            );

          },
          startDelay
        );

      }


      setTimeout(
        () => {

          completeGenericStep(
            step.id
          );


          if (
            index ===
            config.steps.length - 1
          ) {

            setTimeout(
              () => {

                config.onComplete();

              },
              350
            );

          }

        },
        startDelay + 850
      );

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

    status.textContent =
      "Running";

  }


  const messageNode =
    document.getElementById(
      `${outputId}-message`
    );

  if (messageNode) {

    messageNode.textContent =
      message;

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

    status.textContent =
      "Complete";

  }

}


/* =========================================================
   ROUTING
========================================================= */

function navigateTo(page) {

  currentPage =
    page;

  let content =
    "";


  if (
    currentRole ===
    "ambassador"
  ) {

    const pages = {

      home:
        ambassadorHome,

      performance:
        ambassadorPerformance,

      training:
        trainingPage,

      knowledge:
        knowledgePage,

      status:
        statusPage

    };


    content =
      pages[page]
        ? pages[page]()
        : ambassadorHome();

  }


  if (
    currentRole ===
    "manager"
  ) {

    const pages = {

      home:
        managerHome,

      "team-performance":
        managerPerformance,

      "team-attention":
        managerRequiresAttentionPage,

      "training-overview":
        managerTrainingOverviewPage,

      "knowledge-gaps":
        managerKnowledgeGapsPage,

      "manager-knowledge":
        managerKnowledgePage,

      ambassadors:
        managerAmbassadorsPage,

      "manager-onboarding":
        managerOnboardingPage,

      "manager-acquisition":
        managerAcquisitionPage,

      "manager-communications":
        managerCommunicationsPage,

      "manager-hub":
        managerHubPage

    };


    content =
      pages[page]
        ? pages[page]()
        : managerHome();

  }


  if (
    currentRole ===
    "service"
  ) {

    if (
      page === "home"
    ) {

      content =
        serviceHome();

    }

    else if (
      page ===
      "group-performance"
    ) {

      content =
        servicePerformance();

    }

    else if (
      page === "audit"
    ) {

      content =
        auditPage();

    }

    else {

      content =
        genericRolePage(
          "SERVICE DELIVERY",
          "Prototype View",
          "This area will be expanded during the Service Delivery persona update."
        );

    }

  }


  if (
    currentRole ===
    "admin"
  ) {

    if (
      page === "home"
    ) {

      content =
        adminHome();

    }

    else {

      content =
        genericRolePage(
          "PLATFORM ADMINISTRATION",
          "Prototype View",
          "This area will be expanded during the Platform Admin persona update."
        );

    }

  }


  renderShell(
    content
  );

}


/* =========================================================
   HELPERS
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
        This section represents the role-specific capability
        within the SHARE Lens prototype.
      </p>

    </section>
  `;

}


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


function metricCard(
  title,
  value,
  detail
) {

  return `
    <section class="dashboard-card metric-card">

      <span>
        ${title}
      </span>

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


function agentTeamMember(
  number,
  title,
  description
) {

  return `
    <div class="agent-team-card">

      <div class="agent-team-number">
        ${number}
      </div>

      <div>

        <strong>
          ${title}
        </strong>

        <span>
          ${description}
        </span>

      </div>

    </div>
  `;

}


function analysisMiniCard(
  title,
  score,
  detail
) {

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


function openPerformanceInteraction(
  interactionId
) {

  expandedInteractionId =
    interactionId;

  navigateTo(
    "performance"
  );


  setTimeout(
    () => {

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

    },
    100
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

window.toggleInteractionDetails =
  toggleInteractionDetails;

window.analyseInlineInteraction =
  analyseInlineInteraction;

window.startInlineAnalysis =
  startInlineAnalysis;

window.openTrainingTarget =
  openTrainingTarget;

window.openPerformanceInteraction =
  openPerformanceInteraction;

window.runManagerAnalysis =
  runManagerAnalysis;

window.runServiceAnalysis =
  runServiceAnalysis;

window.filterKnowledgeBase =
  filterKnowledgeBase;

window.exportAmbassadorList =
  exportAmbassadorList;

window.showNewBroadcast =
  showNewBroadcast;


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
