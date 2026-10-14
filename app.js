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
  to: "14 Oct 2026"
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
    country: "UAE"
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
   TRAINING
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
      items: [["home", "Home"]]
    },

    {
      title: "Service Delivery",
      items: [
        ["team-performance", "Performance"],
        ["team-actions", "Actions"]
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
        ["manager-onboarding", "Onboarding"],
        ["manager-acquisition", "Acquisition"],
        ["manager-recognition", "Recognition"]
      ]
    }

  ],

  service: [

    {
      title: "",
      items: [["home", "Home"]]
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
      items: [["home", "Platform Overview"]]
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

  currentRole = role;
  currentPage = "home";
  expandedInteractionId = null;
  selectedTrainingId = null;

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

        ${journeyStep(
          "Onboarded"
        )}

        ${journeyConnector()}

        ${journeyStep(
          "Mandatory Training"
        )}

        ${journeyConnector()}

        ${journeyStep(
          "Knowledge Check"
        )}

        ${journeyConnector()}

        ${journeyStep(
          "Personal QR Code"
        )}

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
   PERFORMANCE
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

        <span>
          Interaction
        </span>

        <span>
          Channel / Duration
        </span>

        <span>
          Process / Theme
        </span>

        <span>
          Score
        </span>

        <span>
          Status
        </span>

        <span>
          Action
        </span>

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
          <span>
            ✦
          </span>

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

          <strong>
            ${interaction.id}
          </strong>

          <span>
            ${interaction.date}
          </span>

        </div>


        <div>

          <strong>
            ${interaction.channel}
          </strong>

          <span>
            ${interaction.duration}
          </span>

        </div>


        <div>

          <strong>
            ${interaction.process}
          </strong>

          <span>
            Customer interaction
          </span>

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

  if (
    score >= 90
  ) {

    return {
      label:
        "Good Interaction",

      className:
        "good",

      icon:
        "✓"
    };

  }


  if (
    score >= 50
  ) {

    return {
      label:
        "Opportunity to Strengthen",

      className:
        "strengthen",

      icon:
        "↗"
    };

  }


  return {
    label:
      "Needs Attention",

    className:
      "attention",

    icon:
      "!"
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

    expandedInteractionId =
      null;

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
        item.id ===
        interactionId
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
   TRAINING
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


function assignedTrainingCard(
  item
) {

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


function recommendedTrainingCard(
  item
) {

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


function openTrainingTarget(
  trainingId
) {

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


      if (
        trainingCard
      ) {

        trainingCard
          .classList
          .add(
            "highlight-training"
          );

      }


      if (
        focusPanel
      ) {

        focusPanel
          .scrollIntoView({
            behavior:
              "smooth",

            block:
              "center"
          });

      }

    },
    120
  );

}


function renderTrainingFocus(
  trainingId
) {

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
                <span>
                  Assigned
                </span>

                <strong>
                  ${item.assigned}
                </strong>
              </div>

              <div>
                <span>
                  Due
                </span>

                <strong>
                  ${item.due}
                </strong>
              </div>

              <div>
                <span>
                  Aging
                </span>

                <strong>
                  ${item.aging}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  ${item.status}
                </strong>
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


function renderKnowledgeRows(
  items
) {

  if (
    !items.length
  ) {

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

            <strong>
              ${item.title}
            </strong>

          </div>

          <span>
            ${item.category}
          </span>

          <span>
            ${item.type}
          </span>

          <span>
            ${item.updated}
          </span>

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
   MY STATUS
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

          <div
            class="acquisition-marker halfway"
            style="left:50%"
          >

            <span>
              ${Math.round(
                target / 2
              )}
            </span>

          </div>

          <div
            class="acquisition-marker target"
            style="left:100%"
          >

            <span>
              ${target}
            </span>

          </div>

        </div>


        <div class="progress-scale">

          <span>
            0
          </span>

          <span>
            Halfway
          </span>

          <span>
            Target
          </span>

        </div>


        <div class="impact-message">

          <div class="impact-message-icon">
            ✦
          </div>

          <div>

            ${
              remaining > 0
                ? `
                  <strong>
                    ${remaining} ${
                      remaining === 1
                        ? "member"
                        : "members"
                    } away from your target
                  </strong>

                  <p>
                    You have achieved ${achievement}% of your SHARE onboarding target for this period.
                  </p>
                `
                : `
                  <strong>
                    Target achieved
                  </strong>

                  <p>
                    You have reached your SHARE member onboarding target for this period.
                  </p>
                `
            }

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
            `${Math.round(
              target / 2
            )} members onboarded`,
            onboarded >=
              Math.round(
                target / 2
              )
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

      <span>
        ${title}
      </span>

      <strong>
        ${value}
      </strong>

      <small>
        ${detail}
      </small>

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
   OTHER PERSONAS
========================================================= */

function managerHome() {

  return `
    ${pageTitle(
      "ENTERTAINMENT UAE",
      "BU Lead / Trainer Dashboard",
      "Performance across your MAF mall locations and Ambassador population."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Active Ambassadors",
        "238",
        "Current"
      )}

      ${metricCard(
        "Onboarding",
        "18",
        "3 require attention"
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "Current"
      )}

      ${metricCard(
        "Knowledge Score",
        "84%",
        "Current"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          LOCATION PERFORMANCE
        </span>

        <h3>
          Service quality
        </h3>

        ${storeBar(
          "Mall of the Emirates",
          91
        )}

        ${storeBar(
          "City Centre Mirdif",
          88
        )}

        ${storeBar(
          "City Centre Deira",
          74
        )}

        ${storeBar(
          "City Centre Al Zahia",
          86
        )}

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          REQUIRES ATTENTION
        </span>

        <h3>
          Ambassador interventions
        </h3>

        ${attentionRow(
          "Layla Haddad",
          "Interaction review",
          "1"
        )}

        ${attentionRow(
          "Ahmed Ali",
          "Training overdue",
          "2 modules"
        )}

        ${attentionRow(
          "Sara Khan",
          "Performance",
          "72%"
        )}

      </section>

    </div>
  `;

}


function managerPerformance() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "BU Performance",
      "Identify themes and MAF mall locations requiring intervention."
    )}


    <section class="overall-analysis-card">

      <div>

        <span class="section-label">
          AI PERFORMANCE ANALYSIS
        </span>

        <h2>
          Analyse BU Performance
        </h2>

        <p>
          Analyse performance, training and knowledge signals
          across Entertainment UAE.
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
            Analyse BU Performance
          </strong>

          <small>
            Finds themes, severity and intervention needs
          </small>

        </div>

      </button>

    </section>


    <div class="dashboard-grid four">

      ${metricCard(
        "Performance Score",
        "86%",
        "On Track"
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "Current"
      )}

      ${metricCard(
        "Knowledge Score",
        "84%",
        "Current"
      )}

      ${metricCard(
        "Locations Requiring Focus",
        "3",
        "Current"
      )}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        AI ORCHESTRATION
      </span>

      <h3>
        BU performance agent team
      </h3>

      <div class="agent-team-strip manager-team">

        ${agentTeamMember(
          "1",
          "Performance Agent",
          "Measures outcomes"
        )}

        ${agentTeamMember(
          "2",
          "Theme Agent",
          "Finds repeated issues"
        )}

        ${agentTeamMember(
          "3",
          "Knowledge Gap Agent",
          "Finds development gaps"
        )}

        ${agentTeamMember(
          "4",
          "Intervention Agent",
          "Prioritises locations"
        )}

        ${agentTeamMember(
          "5",
          "Combined Analysis",
          "Focus & next action"
        )}

      </div>


      <div
        id="manager-agent-output"
        class="agent-output empty-state"
      >
        Run Analyse BU Performance to start.
      </div>

    </section>
  `;

}


function managerOnboarding() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Onboarding",
      "Track Ambassadors through the onboarding journey."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Invited",
        "7",
        "Awaiting first login"
      )}

      ${metricCard(
        "Onboarded",
        "11",
        "Current"
      )}

      ${metricCard(
        "Mandatory Training",
        "6",
        "In progress"
      )}

      ${metricCard(
        "Personal QR Code",
        "3",
        "Ready"
      )}

    </div>


    <section class="dashboard-card">

      ${personOnboardingRow(
        "Noor Hassan",
        "100822",
        "Mandatory Training",
        "In Progress"
      )}

      ${personOnboardingRow(
        "Rania Ali",
        "100845",
        "Knowledge Check",
        "Pending"
      )}

      ${personOnboardingRow(
        "Sami Omar",
        "100901",
        "Personal QR Code",
        "Ready"
      )}

    </section>
  `;

}


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
          "Assessing performance, training and knowledge indicators."
      },

      {
        id:
          "manager-theme",
        title:
          "Theme Agent",
        message:
          "Grouping recurring themes across locations and Ambassadors."
      },

      {
        id:
          "manager-knowledge",
        title:
          "Knowledge Gap Agent",
        message:
          "Identifying recurring development gaps."
      },

      {
        id:
          "manager-intervention",
        title:
          "Intervention Agent",
        message:
          "Ranking MAF mall locations requiring intervention."
      },

      {
        id:
          "manager-combined",
        title:
          "Combined Analysis",
        message:
          "Preparing recommended areas of focus."
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
      "3 locations require intervention",
      86,
      "Entertainment UAE"
    )}

    <div class="dashboard-grid two no-bottom">

      <section class="analysis-section">

        <span class="section-label">
          PERFORMANCE THEMES
        </span>

        <h3>
          Areas to focus on
        </h3>

        ${severityRow(
          "Refund SLA knowledge",
          "Detected across 3 locations",
          "High",
          "high"
        )}

        ${severityRow(
          "Customer verification consistency",
          "Detected across 2 locations",
          "Medium",
          "medium"
        )}

        ${severityRow(
          "Escalation handling",
          "Detected across 2 locations",
          "Medium",
          "medium"
        )}

      </section>


      <section class="analysis-section">

        <span class="section-label">
          LOCATIONS REQUIRING INTERVENTION
        </span>

        <h3>
          Prioritised by severity
        </h3>

        ${locationSeverityRow(
          "City Centre Deira",
          "72%",
          "Critical",
          "critical"
        )}

        ${locationSeverityRow(
          "City Centre Mirdif",
          "79%",
          "High",
          "high"
        )}

        ${locationSeverityRow(
          "Mall of the Emirates",
          "84%",
          "Medium",
          "medium"
        )}

      </section>

    </div>
  `;

}


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

        <span class="section-label">
          GROUP AI ANALYSIS
        </span>

        <h2>
          Analyse Group Performance
        </h2>

        <p>
          Analyse performance, audit, training and knowledge
          signals across MAF mall locations.
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
          "service-action",
        title:
          "Next Best Action",
        message:
          "Prioritising recommended actions."
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

    <div class="dashboard-grid two no-bottom">

      <section class="analysis-section">

        <span class="section-label">
          EMERGING THEMES
        </span>

        ${themeResult(
          "Refund SLA",
          "3 locations",
          "34 Ambassadors",
          "Worsening",
          "High"
        )}

        ${themeResult(
          "Product Knowledge",
          "5 locations",
          "51 Ambassadors",
          "Stable",
          "Medium"
        )}

      </section>


      <section class="analysis-section">

        <span class="section-label">
          LOCATION SEVERITY
        </span>

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

        ${locationSeverityRow(
          "Mall of the Emirates",
          "Entertainment",
          "Medium",
          "medium"
        )}

      </section>

    </div>
  `;

}


function auditPage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Audit & Service Pulse",
      "Service Audit and Mystery Shop findings across MAF mall locations."
    )}

    <section class="dashboard-card">

      <span class="section-label">
        SERVICE PULSE
      </span>

      <h3>
        Prototype view
      </h3>

      <p>
        Detailed Service Pulse reporting will be expanded during
        the Service Delivery persona review.
      </p>

    </section>
  `;

}


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


function usersAccessPage() {

  return `
    ${pageTitle(
      "IDENTITY & ACCESS",
      "Users & Access",
      "Manage Staff ID, Microsoft SSO, roles and scope."
    )}

    <section class="dashboard-card">

      ${userAccessRow(
        "Layla Haddad",
        "Staff ID 100245",
        "Ambassador",
        "VOX · Mall of the Emirates",
        "Active"
      )}

      ${userAccessRow(
        "Ahmed Salah",
        "Entra ID",
        "BU Lead / Trainer",
        "Entertainment UAE",
        "Active"
      )}

      ${userAccessRow(
        "Marian Zakhary",
        "Entra ID",
        "Service Delivery",
        "MAF Malls",
        "Active"
      )}

    </section>
  `;

}


function rolesPage() {

  return genericRolePage(
    "IDENTITY & ACCESS",
    "Roles & Permissions",
    "Role-based access used by the SHARE Lens prototype."
  );

}


function aiAgentsPage() {

  return genericRolePage(
    "AI PLATFORM",
    "AI Agents",
    "Specialist AI capabilities used by SHARE Lens."
  );

}


function integrationsPage() {

  return genericRolePage(
    "PLATFORM",
    "Integrations",
    "Prototype integration landscape."
  );

}


/* =========================================================
   AI ANIMATION
========================================================= */

function runAnimation(
  config
) {

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

  if (
    step
  ) {

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

  if (
    status
  ) {

    status.textContent =
      "Running";

  }


  const messageNode =
    document.getElementById(
      `${outputId}-message`
    );

  if (
    messageNode
  ) {

    messageNode.textContent =
      message;

  }

}


function completeGenericStep(
  id
) {

  const step =
    document.getElementById(
      `step-${id}`
    );

  if (
    step
  ) {

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

  if (
    status
  ) {

    status.textContent =
      "Complete";

  }

}


/* =========================================================
   ROUTING
========================================================= */

function navigateTo(
  page
) {

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

    if (
      page === "home"
    ) {

      content =
        managerHome();

    }

    else if (
      page ===
      "team-performance"
    ) {

      content =
        managerPerformance();

    }

    else if (
      page ===
      "manager-onboarding"
    ) {

      content =
        managerOnboarding();

    }

    else {

      const configs = {

        "team-actions": [
          "SERVICE DELIVERY",
          "Actions",
          "Track interventions and follow-up activity."
        ],

        "training-overview": [
          "TRAINING & KNOWLEDGE",
          "Training Overview",
          "Training completion, aging and overdue learning."
        ],

        "knowledge-gaps": [
          "TRAINING & KNOWLEDGE",
          "Knowledge Gaps",
          "Recurring knowledge opportunities across your population."
        ],

        "manager-knowledge": [
          "TRAINING & KNOWLEDGE",
          "Knowledge Base",
          "Approved knowledge for your assigned population."
        ],

        ambassadors: [
          "AMBASSADOR PROGRAM",
          "Ambassadors",
          "View your assigned Ambassador population."
        ],

        "manager-acquisition": [
          "AMBASSADOR PROGRAM",
          "Acquisition",
          "Track SHARE members onboarded through Ambassador Personal QR Codes."
        ],

        "manager-recognition": [
          "AMBASSADOR PROGRAM",
          "Recognition",
          "Recognise Ambassador contribution and programme impact."
        ]

      };


      content =
        genericRolePage(
          ...configs[page]
        );

    }

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

      const configs = {

        "group-actions": [
          "SERVICE DELIVERY",
          "Actions",
          "Track Service Delivery interventions."
        ],

        "group-training": [
          "TRAINING & KNOWLEDGE",
          "Training",
          "Training performance across MAF mall locations."
        ],

        "group-knowledge": [
          "TRAINING & KNOWLEDGE",
          "Knowledge Base",
          "Approved programme knowledge."
        ],

        "group-gaps": [
          "TRAINING & KNOWLEDGE",
          "Knowledge Gaps",
          "Recurring knowledge themes."
        ],

        "group-ambassadors": [
          "AMBASSADOR PROGRAM",
          "Ambassadors",
          "Ambassador population across MAF malls."
        ],

        "group-onboarding": [
          "AMBASSADOR PROGRAM",
          "Onboarding",
          "Ambassador onboarding progression."
        ],

        "group-acquisition": [
          "AMBASSADOR PROGRAM",
          "Acquisition",
          "Track SHARE members onboarded through Ambassador activity."
        ],

        "group-recognition": [
          "AMBASSADOR PROGRAM",
          "Recognition",
          "Recognise Ambassador contribution and programme impact."
        ]

      };


      content =
        genericRolePage(
          ...configs[page]
        );

    }

  }


  if (
    currentRole ===
    "admin"
  ) {

    const pages = {

      home:
        adminHome,

      "users-access":
        usersAccessPage,

      roles:
        rolesPage,

      "ai-agents":
        aiAgentsPage,

      integrations:
        integrationsPage

    };


    if (
      pages[page]
    ) {

      content =
        pages[page]();

    }

    else {

      const configs = {

        identity: [
          "IDENTITY & ACCESS",
          "Identity Providers",
          "Staff ID and Microsoft SSO configuration."
        ],

        "agent-config": [
          "AI PLATFORM",
          "Agent Configuration",
          "Configure agent prompts, models and orchestration."
        ],

        "knowledge-sources": [
          "AI PLATFORM",
          "Knowledge Sources",
          "Configure approved retrieval sources."
        ],

        frameworks: [
          "PLATFORM",
          "Assessment Frameworks",
          "Configure assessment templates and scoring."
        ],

        notifications: [
          "PLATFORM",
          "Notifications",
          "Configure platform notifications."
        ],

        "audit-log": [
          "PLATFORM",
          "Audit Log",
          "Review platform activity."
        ]

      };


      content =
        genericRolePage(
          ...configs[page]
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


function storeBar(
  name,
  score
) {

  return `
    <div class="store-bar">

      <span>
        ${name}
      </span>

      <div class="bar-track">

        <div
          class="bar-fill"
          style="width:${score}%"
        ></div>

      </div>

      <strong>
        ${score}%
      </strong>

    </div>
  `;

}


function attentionRow(
  name,
  issue,
  detail
) {

  return `
    <div class="attention-row">

      <strong>
        ${name}
      </strong>

      <span>
        ${issue}
      </span>

      <strong>
        ${detail}
      </strong>

      <button class="small-button">
        View
      </button>

    </div>
  `;

}


function personOnboardingRow(
  name,
  staffId,
  stage,
  status
) {

  return `
    <div class="generic-row">

      <div>

        <strong>
          ${name}
        </strong>

        <small>
          Staff ID ${staffId}
        </small>

      </div>

      <span>
        ${stage}
      </span>

      <strong>
        ${status}
      </strong>

      <button class="small-button">
        View
      </button>

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


function themeResult(
  title,
  locations,
  population,
  trend,
  severity
) {

  return `
    <div class="theme-result">

      <div>

        <strong>
          ${title}
        </strong>

        <span>
          ${locations} · ${population}
        </span>

      </div>

      <div class="theme-meta">

        <span>
          ${trend}
        </span>

        <strong>
          ${severity}
        </strong>

      </div>

    </div>
  `;

}


function userAccessRow(
  user,
  identity,
  role,
  scope,
  status
) {

  return `
    <div class="admin-table-row">

      <strong>
        ${user}
      </strong>

      <span>
        ${identity}
      </span>

      <span>
        ${role}
      </span>

      <span>
        ${scope}
      </span>

      <span class="status-block good">
        ${status}
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

      if (
        node
      ) {

        node.scrollIntoView({
          behavior:
            "smooth",

          block:
            "center"
        });

      }

    },
    100
  );

}


/* =========================================================
   EXPOSE FUNCTIONS
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
