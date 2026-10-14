import { analyseInteraction } from "./agents/agentOrchestrator.js";


const app = document.getElementById("app");

let currentRole = null;
let currentPage = "home";
let expandedInteractionId = null;


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
    ambassadorStatus: "Bronze Status",
    targetStatus: "Silver Status"
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
    trainingTarget: "Refund Handling Refresher",
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
    trainingTarget: "Refund Handling Refresher",
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
    trainingTarget: "Refund Handling Refresher",
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
        ["ambassador", "My Ambassador"]
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
   AUTHENTICATION
========================================================= */

function setLoginMessage(message, type = "error") {

  const node = document.getElementById("login-error");

  if (!node) return;

  node.textContent = message;
  node.className = `login-error ${type}`;

}


function signIn() {

  const login = document
    .getElementById("login-id")
    .value
    .trim()
    .toLowerCase();

  const password = document
    .getElementById("login-password")
    .value;

  const matchedRole = Object.keys(prototypeUsers).find(role => {

    const user = prototypeUsers[role];

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

  const login = document
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

  const matchedRole = Object.keys(prototypeUsers).find(role => {

    const user = prototypeUsers[role];

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

  navigateTo("home");

}


function signOut() {
  location.reload();
}


/* =========================================================
   APP SHELL
========================================================= */

function topBar() {

  const user = prototypeUsers[currentRole];

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

  const groups = navigation[currentRole];

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

  return `
    ${pageTitle(
      "MY SHARE",
      "Good morning, Layla",
      "Your Ambassador progress."
    )}


    ${ambassadorProgress()}


    <div class="dashboard-grid four">

      ${metricCard(
        "Performance Score",
        "86%",
        "Needs Improvement"
      )}

      ${metricCard(
        "Knowledge Score",
        "94%",
        "On track"
      )}

      ${metricCard(
        "Mandatory Training",
        "100%",
        "Completed"
      )}

      ${clickableMetricCard(
        "Open Actions",
        "2",
        "Needs your attention",
        "performance"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          NEEDS YOUR ATTENTION
        </span>

        <h3>
          What to work on next
        </h3>


        <div
          class="home-action-card high"
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
            Start →
          </span>

        </div>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          MY AMBASSADOR
        </span>

        <h3>
          Current status
        </h3>

        ${profileLine(
          "Status",
          "Bronze Status"
        )}

        ${profileLine(
          "Next Status",
          "Silver Status"
        )}

        ${profileLine(
          "Personal QR Code",
          "Active"
        )}

        ${profileLine(
          "Store",
          "Mall of the Emirates"
        )}

        <button
          class="profile-action-button"
          onclick="navigateTo('ambassador')"
        >
          View My Ambassador
        </button>

      </section>

    </div>
  `;

}


/* =========================================================
   AMBASSADOR PROGRESS
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
            Progressing to Silver Status
          </h2>

          <p>
            You're 65% of the way to Silver Status.
          </p>

        </div>


        <div class="current-status-pill">
          Bronze Status
        </div>

      </div>


      <div class="ambassador-progress-track">

        <div class="progress-line-background"></div>

        <div class="progress-line-fill"></div>


        ${progressMilestone(
          0,
          "Onboarded",
          "complete"
        )}

        ${progressMilestone(
          16.5,
          "Mandatory Training",
          "complete"
        )}

        ${progressMilestone(
          33,
          "Knowledge Check",
          "complete"
        )}

        ${progressMilestone(
          49.5,
          "Personal QR Code",
          "complete"
        )}

        ${progressMilestone(
          66,
          "Bronze Status",
          "complete current"
        )}

        ${progressMilestone(
          83,
          "Silver Status",
          "target"
        )}

        ${progressMilestone(
          100,
          "Gold Status",
          "future"
        )}

      </div>


      <div class="progress-target-callout">

        <div class="progress-target-icon">
          ↑
        </div>

        <div>

          <strong>
            Your next milestone: Silver Status
          </strong>

          <p>
            Improve your Performance Score from 86% to the
            required level to continue progressing.
          </p>

        </div>

        <button
          onclick="navigateTo('performance')"
        >
          Work on Performance
        </button>

      </div>

    </section>
  `;

}


function progressMilestone(position, label, state) {

  return `
    <div
      class="progress-milestone ${state}"
      style="left:${position}%"
    >

      <div class="progress-dot"></div>

      <span>
        ${label}
      </span>

    </div>
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
      "See how you're performing and where to focus next."
    )}


    <div class="performance-period">

      <div>

        <span>
          Assessment period
        </span>

        <strong>
          01 Oct 2026 – 14 Oct 2026
        </strong>

      </div>

      <button>
        Change period
      </button>

    </div>


    <div class="dashboard-grid four">

      ${metricCard(
        "Performance Score",
        "86%",
        "Current period"
      )}

      ${metricCard(
        "SOP Compliance",
        "92%",
        "Current period"
      )}

      ${metricCard(
        "Compliance",
        "100%",
        "No critical failures"
      )}

      ${metricCard(
        "Open Actions",
        "2",
        "Needs attention"
      )}

    </div>


    <section class="dashboard-card performance-table-card">

      <div class="table-heading">

        <div>

          <span class="section-label">
            RECENT CUSTOMER INTERACTIONS
          </span>

          <h3>
            Your latest interactions
          </h3>

          <p>
            Review your scores and analyse interactions that need improvement.
          </p>

        </div>

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


      ${interactions.map(interaction => {

        return interactionBlock(interaction);

      }).join("")}

    </section>
  `;

}


function interactionBlock(interaction) {

  const status = getInteractionStatus(interaction.score);

  const isExpanded =
    expandedInteractionId === interaction.id;

  const action =
    interaction.score >= 90
      ? `
        <button
          class="details-button"
          onclick="toggleInteractionDetails('${interaction.id}')"
        >
          ${isExpanded ? "Collapse Details" : "View Details"}
        </button>
      `
      : `
        <button
          class="analyse-button compact"
          onclick="analyseInlineInteraction('${interaction.id}')"
        >
          <span>✦</span>
          ${isExpanded ? "Collapse Analysis" : "Analyse Interaction"}
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
          interaction.score < 50 ? "low" : ""
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
          isExpanded ? "open" : ""
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
      label: "Needs Improvement",
      className: "improvement",
      icon: "!"
    };

  }

  return {
    label: "Needs Attention",
    className: "attention",
    icon: "!"
  };

}


function toggleInteractionDetails(interactionId) {

  if (expandedInteractionId === interactionId) {

    expandedInteractionId = null;

  } else {

    expandedInteractionId = interactionId;

  }

  navigateTo("performance");

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
            SHARE Lens will run the complete specialist agent team
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


function analyseInlineInteraction(interactionId) {

  if (expandedInteractionId === interactionId) {

    expandedInteractionId = null;

    navigateTo("performance");

    return;

  }

  expandedInteractionId = interactionId;

  navigateTo("performance");

  setTimeout(() => {

    startInlineAnalysis(interactionId);

  }, 100);

}


function startInlineAnalysis(interactionId) {

  const interaction =
    interactions.find(item => item.id === interactionId);

  if (!interaction) return;


  runAnimation({

    outputId: `inline-analysis-${interaction.id}`,

    title: `Analysing ${interaction.id}`,

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

    onComplete: () => {
      showInlineAnalysisResult(interaction);
    }

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
                ? "Immediate Attention Required"
                : "Needs Improvement"
            }
          </h3>

          <p>
            ${interaction.process} · ${interaction.score}%
          </p>

        </div>

        <span class="status-block ${
          urgent ? "attention" : "improvement"
        }">
          ${
            urgent
              ? "! Needs Attention"
              : "! Needs Improvement"
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
            NEEDS ATTENTION
          </span>

          <h4>
            Refund timeline communication
          </h4>

          <p>
            The expected refund timeframe was not clearly
            communicated to the customer.
          </p>

        </section>

      </div>


      <div class="analysis-score-row">

        ${analysisMiniCard(
          "Evaluation",
          `${analysis.evaluation.score}%`,
          "Service quality"
        )}

        ${analysisMiniCard(
          "SOP Compliance",
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
            ${interaction.trainingTarget}
          </h3>

          <p>
            Complete the relevant training before taking the
            ${interaction.knowledgeTarget}.
          </p>

        </div>

        <button
          onclick="openTrainingTarget('refund')"
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
          Activation complete
        </h3>

        <p>
          You have completed Onboarding, Mandatory Training,
          Knowledge Check and Personal QR Code activation.
          You are now progressing through Ambassador Status levels.
        </p>

      </div>

      <span class="status-block good">
        ✓ Bronze Status
      </span>

    </section>


    <div class="training-summary">

      ${metricCard(
        "Completed",
        "6",
        "Modules"
      )}

      ${metricCard(
        "In Progress",
        "1",
        "Module"
      )}

      ${metricCard(
        "Recommended",
        "1",
        "From performance"
      )}

      ${metricCard(
        "Overdue",
        "0",
        "No overdue learning"
      )}

    </div>


    <section class="dashboard-card">

      <div class="table-heading">

        <div>

          <span class="section-label">
            LEARNING
          </span>

          <h3>
            Assigned & recommended training
          </h3>

        </div>

      </div>


      <div class="training-header">

        <span>Training</span>
        <span>Duration</span>
        <span>Assigned</span>
        <span>Due</span>
        <span>Aging</span>
        <span>Status</span>
        <span>Action</span>

      </div>


      ${trainingTableRow(
        "SHARE Customer Experience",
        "20 min",
        "01 Oct",
        "15 Oct",
        "13 days",
        "Completed",
        "completed"
      )}


      ${trainingTableRow(
        "Product Knowledge",
        "30 min",
        "20 Sep",
        "30 Sep",
        "Completed",
        "Completed",
        "completed"
      )}


      <div
        id="training-refund"
      >

        ${trainingTableRow(
          "Refund Handling Refresher",
          "15 min",
          "14 Oct",
          "21 Oct",
          "New",
          "Recommended",
          "recommended"
        )}

      </div>


      ${trainingTableRow(
        "Service Recovery Essentials",
        "25 min",
        "12 Oct",
        "19 Oct",
        "2 days",
        "In Progress",
        "progress"
      )}

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

        <span class="status-block improvement">
          Recommended
        </span>

      </div>

      <button class="primary-small">
        Start Knowledge Check
      </button>

    </section>
  `;

}


function trainingTableRow(
  title,
  duration,
  assigned,
  due,
  aging,
  status,
  state
) {

  return `
    <div class="training-row ${state}">

      <div>

        <strong>
          ${title}
        </strong>

      </div>

      <span>
        ${duration}
      </span>

      <span>
        ${assigned}
      </span>

      <span>
        ${due}
      </span>

      <span>
        ${aging}
      </span>

      <span class="training-status ${state}">
        ${status}
      </span>

      <button class="small-button">
        ${
          status === "Completed"
            ? "Review"
            : "Open"
        }
      </button>

    </div>
  `;

}


function openTrainingTarget(target) {

  navigateTo("training");

  setTimeout(() => {

    const node =
      document.getElementById(
        `training-${target}`
      );

    if (node) {

      node.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      node.classList.add(
        "highlight-training"
      );

    }

  }, 100);

}


/* =========================================================
   KNOWLEDGE BASE
========================================================= */

function knowledgePage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Approved knowledge relevant to your role."
    )}


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          RECOMMENDED FOR YOU
        </span>

        <h3>
          Relevant Knowledge
        </h3>

        ${knowledgeRow(
          "Refund Process",
          "Process Guidance · Updated 2 Oct"
        )}

        ${knowledgeRow(
          "Customer Verification",
          "Service Guidance · Updated 19 Sep"
        )}

        ${knowledgeRow(
          "Cancellation & Refund Policy",
          "Policy · Updated 12 Sep"
        )}

        ${knowledgeRow(
          "SHARE Benefits",
          "Product Knowledge · Updated 9 Oct"
        )}

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          PERFORMANCE INSIGHT
        </span>

        <h3>
          Refund timeline communication
        </h3>

        <p>
          Your recent performance indicates an opportunity
          to strengthen refund timeline communication.
        </p>

        <button
          class="primary-small"
          onclick="openTrainingTarget('refund')"
        >
          Go to Training
        </button>

      </section>

    </div>
  `;

}


/* =========================================================
   MY AMBASSADOR
========================================================= */

function ambassadorPage() {

  return `
    ${pageTitle(
      "AMBASSADOR",
      "My Ambassador",
      "Your Ambassador status, Personal QR Code and recognition."
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
            "Current Status",
            "Bronze Status"
          )}

          ${profileLine(
            "Next Status",
            "Silver Status"
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
          SHARE acquisition activity.
        </p>

      </section>

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        RECOGNITION
      </span>

      <h3>
        Ambassador achievements
      </h3>

      <div class="dashboard-grid three no-bottom">

        ${awardCard(
          "Bronze Status",
          "Achieved"
        )}

        ${awardCard(
          "Silver Status",
          "In progress"
        )}

        ${awardCard(
          "Gold Status",
          "Future milestone"
        )}

      </div>

    </section>
  `;

}


/* =========================================================
   MANAGER HOME
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
          "Performance",
          "86%"
        )}

        ${attentionRow(
          "Ahmed Ali",
          "Training overdue",
          "2 modules"
        )}

        ${attentionRow(
          "Sara Khan",
          "Low performance",
          "72%"
        )}

      </section>

    </div>
  `;

}


/* =========================================================
   MANAGER PERFORMANCE
========================================================= */

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
        "Entertainment UAE"
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

      <p>
        SHARE Lens combines specialist agents to identify
        recurring themes and prioritise interventions.
      </p>


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


function runManagerAnalysis() {

  runAnimation({

    outputId: "manager-agent-output",

    title: "Analysing Entertainment UAE",

    steps: [

      {
        id: "manager-performance",
        title: "Performance Agent",
        message:
          "Assessing performance, training and knowledge indicators."
      },

      {
        id: "manager-theme",
        title: "Theme Agent",
        message:
          "Grouping recurring themes across locations and Ambassadors."
      },

      {
        id: "manager-knowledge",
        title: "Knowledge Gap Agent",
        message:
          "Identifying recurring development gaps."
      },

      {
        id: "manager-intervention",
        title: "Intervention Agent",
        message:
          "Ranking MAF mall locations requiring intervention."
      },

      {
        id: "manager-combined",
        title: "Combined Analysis",
        message:
          "Preparing recommended areas of focus."
      }

    ],

    onComplete: showManagerAnalysisResult

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


    <section class="intervention-focus">

      <div class="severity-marker critical">
        1
      </div>

      <div>

        <span class="section-label">
          PRIORITY INTERVENTION
        </span>

        <h3>
          City Centre Deira
        </h3>

        <p>
          8 Ambassadors affected. Refund SLA is the dominant theme.
          Training completion is 71% and performance has declined
          by 9% during the current assessment period.
        </p>

      </div>


      <div class="intervention-actions">

        <strong>
          Recommended
        </strong>

        <span>
          Assign targeted refresher
        </span>

        <span>
          Complete Knowledge Check
        </span>

        <span>
          Trainer intervention within 3 days
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   MANAGER ONBOARDING
========================================================= */

function managerOnboarding() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Onboarding",
      "Track Ambassadors from account creation through active status."
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
        "Ready for Bronze Status",
        "3",
        "Current"
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


/* =========================================================
   SERVICE DELIVERY
========================================================= */

function serviceHome() {

  return `
    ${pageTitle(
      "MAF MALLS",
      "Service Delivery",
      "Cross-location visibility across Service Delivery, Training & Knowledge and the Ambassador Program."
    )}


    <div class="filter-bar">

      <span>
        Country: UAE
      </span>

      <span>
        MAF Mall: All
      </span>

      <span>
        Brand: All
      </span>

      <span>
        Ambassador: All
      </span>

    </div>


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


    <div class="dashboard-grid three">

      ${pillarCard(
        "Service Delivery",
        "88%",
        "Performance Score",
        "3 locations need intervention",
        "group-performance"
      )}

      ${pillarCard(
        "Training & Knowledge",
        "91%",
        "Training Completion",
        "Knowledge score 84%",
        "group-training"
      )}

      ${pillarCard(
        "Ambassador Program",
        "812",
        "Active Ambassadors",
        "38 onboarding",
        "group-ambassadors"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          PRIORITY RISKS
        </span>

        <h3>
          Areas requiring attention
        </h3>

        <ul class="risk-list">

          <li>
            Refund SLA knowledge gap across three MAF mall locations
          </li>

          <li>
            22 Ambassadors have overdue learning
          </li>

          <li>
            3 locations are below performance threshold
          </li>

          <li>
            6 Ambassador onboarding journeys are delayed
          </li>

        </ul>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          RECOMMENDED ACTIONS
        </span>

        <h3>
          Where to focus
        </h3>

        <ul class="risk-list">

          <li>
            Assign targeted refund handling refresher
          </li>

          <li>
            Notify relevant BU trainers
          </li>

          <li>
            Prioritise low-performing MAF mall locations
          </li>

          <li>
            Follow up delayed Ambassador onboarding
          </li>

        </ul>

      </section>

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


    <div class="dashboard-grid four">

      ${metricCard(
        "Performance Score",
        "88%",
        "MAF malls"
      )}

      ${metricCard(
        "Critical Locations",
        "3",
        "Immediate attention"
      )}

      ${metricCard(
        "High Severity Themes",
        "4",
        "Cross-location"
      )}

      ${metricCard(
        "Ambassadors Impacted",
        "96",
        "Current"
      )}

    </div>


    <section class="dashboard-card">

      <span class="section-label">
        AI ORCHESTRATION
      </span>

      <h3>
        Service Delivery agent team
      </h3>

      <p>
        SHARE Lens identifies systemic patterns and converts
        them into prioritised interventions.
      </p>


      <div class="agent-team-strip service-team">

        ${agentTeamMember(
          "1",
          "Performance Agent",
          "Measures outcomes"
        )}

        ${agentTeamMember(
          "2",
          "Pattern Agent",
          "Finds systemic themes"
        )}

        ${agentTeamMember(
          "3",
          "Location Severity Agent",
          "Ranks locations"
        )}

        ${agentTeamMember(
          "4",
          "Intervention Agent",
          "Defines response"
        )}

        ${agentTeamMember(
          "5",
          "Next Best Action",
          "Prioritises action"
        )}

        ${agentTeamMember(
          "6",
          "Combined Analysis",
          "Group insight"
        )}

      </div>


      <div
        id="service-agent-output"
        class="agent-output empty-state"
      >
        Run Analyse Group Performance to start.
      </div>

    </section>
  `;

}


function runServiceAnalysis() {

  runAnimation({

    outputId: "service-agent-output",

    title: "Analysing MAF Mall Performance",

    steps: [

      {
        id: "service-performance",
        title: "Performance Agent",
        message:
          "Assessing performance across MAF mall locations."
      },

      {
        id: "service-pattern",
        title: "Pattern Agent",
        message:
          "Identifying recurring themes across locations."
      },

      {
        id: "service-severity",
        title: "Location Severity Agent",
        message:
          "Ranking locations by intervention need."
      },

      {
        id: "service-intervention",
        title: "Intervention Agent",
        message:
          "Matching issues to targeted interventions."
      },

      {
        id: "service-action",
        title: "Next Best Action",
        message:
          "Prioritising recommended actions."
      },

      {
        id: "service-combined",
        title: "Combined Analysis",
        message:
          "Preparing the Service Delivery view."
      }

    ],

    onComplete: showServiceAnalysisResult

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

        <h3>
          Systemic patterns
        </h3>

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

        ${themeResult(
          "Escalation Handling",
          "2 locations",
          "19 Ambassadors",
          "Worsening",
          "High"
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

        ${locationSeverityRow(
          "City Centre Al Zahia",
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


    <section class="intervention-focus">

      <div class="severity-marker critical">
        1
      </div>

      <div>

        <span class="section-label">
          PRIORITY INTERVENTION
        </span>

        <h3>
          City Centre Deira
        </h3>

        <p>
          Lowest current Service Delivery score. Eight failed
          Knowledge Checks, six repeated SOP misses and five
          Ambassadors with overdue learning.
        </p>

      </div>


      <div class="intervention-actions">

        <strong>
          Next Best Action
        </strong>

        <span>
          Assign Refund Handling refresher
        </span>

        <span>
          Trigger Knowledge Check
        </span>

        <span>
          BU trainer intervention
        </span>

        <span>
          Reassess in 7 days
        </span>

      </div>

    </section>
  `;

}


/* =========================================================
   AUDIT & SERVICE PULSE
========================================================= */

function auditPage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "Audit & Service Pulse",
      "Service Audit and Mystery Shop findings across MAF mall locations."
    )}


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


    <section class="dashboard-card">

      <span class="section-label">
        RECENT SERVICE AUDITS
      </span>

      <h3>
        Location results
      </h3>

      ${auditRow(
        "Mall of the Emirates",
        "91%",
        "On Track",
        "good"
      )}

      ${auditRow(
        "City Centre Mirdif",
        "82%",
        "Needs Improvement",
        "improvement"
      )}

      ${auditRow(
        "City Centre Deira",
        "71%",
        "Needs Attention",
        "attention"
      )}

      ${auditRow(
        "City Centre Al Zahia",
        "88%",
        "Needs Improvement",
        "improvement"
      )}

    </section>


    <section class="dashboard-card">

      <span class="section-label">
        MYSTERY SHOP FINDINGS
      </span>

      <h3>
        Emerging themes
      </h3>

      <div class="audit-theme-header">

        <span>
          Theme
        </span>

        <span>
          Locations
        </span>

        <span>
          Severity
        </span>

      </div>

      ${auditThemeRow(
        "Greeting & Welcome",
        "3",
        "High",
        "high"
      )}

      ${auditThemeRow(
        "Product Knowledge",
        "4",
        "High",
        "high"
      )}

      ${auditThemeRow(
        "Queue / Waiting Experience",
        "2",
        "Medium",
        "medium"
      )}

      ${auditThemeRow(
        "Issue Resolution",
        "2",
        "Medium",
        "medium"
      )}

    </section>


    <section class="audit-flow-card">

      <span class="section-label">
        PERFORMANCE FLOW
      </span>

      <h3>
        How Service Audit feeds performance
      </h3>

      <div class="audit-flow">

        <span>
          Mystery Shop
        </span>

        <b>→</b>

        <span>
          Location Finding
        </span>

        <b>→</b>

        <span>
          Theme & Severity
        </span>

        <b>→</b>

        <span>
          Corrective Action
        </span>

        <b>→</b>

        <span>
          BU Performance
        </span>

        <b>→</b>

        <span>
          Service Delivery Performance
        </span>

      </div>


      <div class="prototype-assumption">

        <strong>
          Prototype assumption
        </strong>

        <p>
          Mystery Shop data structure, scoring and report ingestion
          will be aligned once the current reporting format is reviewed.
        </p>

      </div>

    </section>
  `;

}


/* =========================================================
   PLATFORM ADMIN
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


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          AMBASSADOR PROVISIONING
        </span>

        <h3>
          Add an Ambassador
        </h3>

        <p>
          Invite an Ambassador or create the account manually.
        </p>

        <div class="admin-action-buttons">

          <button
            class="primary-small"
            onclick="showInviteAmbassador()"
          >
            Invite Ambassador
          </button>

          <button
            class="secondary-small"
            onclick="showManualAmbassador()"
          >
            Create Manually
          </button>

        </div>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          PLATFORM STATUS
        </span>

        <h3>
          Prototype capabilities
        </h3>

        ${statusLine(
          "Identity",
          "Prototype"
        )}

        ${statusLine(
          "AI Agents",
          "Enabled"
        )}

        ${statusLine(
          "Integrations",
          "Mocked"
        )}

        ${statusLine(
          "Audit",
          "Enabled"
        )}

      </section>

    </div>


    <div
      id="admin-provisioning-output"
    ></div>
  `;

}


function showInviteAmbassador() {

  const output =
    document.getElementById(
      "admin-provisioning-output"
    );

  if (!output) return;


  output.innerHTML = `
    <section class="dashboard-card provisioning-card">

      <span class="section-label">
        INVITE AMBASSADOR
      </span>

      <h3>
        Create onboarding invitation
      </h3>

      <div class="provisioning-grid">

        ${mockInput(
          "Staff ID",
          "100955"
        )}

        ${mockInput(
          "Ambassador Name",
          "New Ambassador"
        )}

        ${mockInput(
          "MAF Mall",
          "City Centre Mirdif"
        )}

        ${mockInput(
          "Contact",
          "Mobile / Email"
        )}

      </div>

      <button class="primary-small">
        Send Onboarding Invite
      </button>

    </section>
  `;

}


function showManualAmbassador() {

  const output =
    document.getElementById(
      "admin-provisioning-output"
    );

  if (!output) return;


  output.innerHTML = `
    <section class="dashboard-card provisioning-card">

      <span class="section-label">
        MANUAL SETUP
      </span>

      <h3>
        Create Ambassador account
      </h3>

      <div class="provisioning-grid">

        ${mockInput(
          "Staff ID",
          "100955"
        )}

        ${mockInput(
          "Ambassador Name",
          "New Ambassador"
        )}

        ${mockInput(
          "MAF Mall",
          "City Centre Mirdif"
        )}

        ${mockInput(
          "Temporary Password",
          "Generated on create"
        )}

      </div>

      <button class="primary-small">
        Create Account
      </button>

    </section>
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

      <div class="admin-table-header">

        <span>User</span>
        <span>Identity</span>
        <span>Role</span>
        <span>Scope</span>
        <span>Status</span>

      </div>

      ${userAccessRow(
        "Layla Haddad",
        "Staff ID 100245",
        "Ambassador",
        "VOX · Mall of the Emirates",
        "Active"
      )}

      ${userAccessRow(
        "Noor Hassan",
        "Staff ID 100822",
        "Ambassador",
        "VOX · City Centre Mirdif",
        "Onboarded"
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


    <section class="notice-card">

      <strong>
        Ambassador access
      </strong>

      <p>
        Staff ID → account → first login → Onboarded →
        Mandatory Training → Knowledge Check → Personal QR Code →
        Bronze Status → Silver Status → Gold Status.
      </p>

    </section>
  `;

}


function rolesPage() {

  return `
    ${pageTitle(
      "IDENTITY & ACCESS",
      "Roles & Permissions",
      "Role-based access used by the SHARE Lens prototype."
    )}


    <div class="dashboard-grid two">

      ${roleCard(
        "Ambassador",
        "Staff ID",
        [
          "Own Performance",
          "My Training",
          "Knowledge Base",
          "My Ambassador",
          "Personal QR Code"
        ]
      )}

      ${roleCard(
        "BU Lead / Trainer",
        "Microsoft SSO",
        [
          "Assigned Ambassador population",
          "Performance analysis",
          "Training",
          "Knowledge gaps",
          "Onboarding"
        ]
      )}

      ${roleCard(
        "Service Delivery",
        "Microsoft SSO",
        [
          "MAF mall estate visibility",
          "Group Performance",
          "Audit & Service Pulse",
          "Intervention prioritisation"
        ]
      )}

      ${roleCard(
        "Platform Admin",
        "Microsoft SSO",
        [
          "Identity",
          "Roles & permissions",
          "AI agents",
          "Integrations",
          "Configuration"
        ]
      )}

    </div>
  `;

}


function aiAgentsPage() {

  return `
    ${pageTitle(
      "AI PLATFORM",
      "AI Agents",
      "Specialist capabilities used by SHARE Lens."
    )}


    <div class="dashboard-grid three">

      ${agentCard(
        "Evaluation Agent",
        "Evaluates service quality.",
        "Active"
      )}

      ${agentCard(
        "SOP Agent",
        "Checks process adherence.",
        "Active"
      )}

      ${agentCard(
        "Compliance Agent",
        "Checks mandatory controls.",
        "Active"
      )}

      ${agentCard(
        "Performance Agent",
        "Assesses population performance.",
        "Prototype"
      )}

      ${agentCard(
        "Pattern Agent",
        "Finds recurring themes.",
        "Prototype"
      )}

      ${agentCard(
        "Location Severity Agent",
        "Prioritises MAF mall locations.",
        "Prototype"
      )}

    </div>
  `;

}


function integrationsPage() {

  return `
    ${pageTitle(
      "PLATFORM",
      "Integrations",
      "Prototype representation of the integration landscape."
    )}


    <div class="dashboard-grid three">

      ${integrationCard(
        "Mitti / SafetyCulture",
        "Training data",
        "Mock"
      )}

      ${integrationCard(
        "Knowmax",
        "Knowledge Base",
        "Mock"
      )}

      ${integrationCard(
        "Infobip",
        "Communications",
        "Mock"
      )}

      ${integrationCard(
        "Adjust",
        "Acquisition attribution",
        "Mock"
      )}

      ${integrationCard(
        "HR / Staff Master",
        "Staff identity and assignments",
        "Mock"
      )}

      ${integrationCard(
        "Performance Data",
        "Location and Ambassador performance",
        "Mock"
      )}

      ${integrationCard(
        "Genesys",
        "Customer interactions",
        "Planned"
      )}

    </div>
  `;

}


/* =========================================================
   AGENT ANIMATION
========================================================= */

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


  config.steps.forEach((step, index) => {

    const startDelay =
      index * 1050;


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

        setTimeout(() => {

          config.onComplete();

        }, 350);

      }

    }, startDelay + 850);

  });

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
   ROUTING
========================================================= */

function navigateTo(page) {

  currentPage = page;

  let content = "";


  if (currentRole === "ambassador") {

    const pages = {
      home: ambassadorHome,
      performance: ambassadorPerformance,
      training: trainingPage,
      knowledge: knowledgePage,
      ambassador: ambassadorPage
    };

    content =
      pages[page]
        ? pages[page]()
        : ambassadorHome();

  }


  if (currentRole === "manager") {

    if (page === "home") {

      content = managerHome();

    }

    else if (page === "team-performance") {

      content = managerPerformance();

    }

    else if (page === "manager-onboarding") {

      content = managerOnboarding();

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
          "Track Personal QR Code acquisition activity."
        ],

        "manager-recognition": [
          "AMBASSADOR PROGRAM",
          "Recognition",
          "View Bronze, Silver and Gold Status progression."
        ]

      };

      content =
        genericRolePage(
          ...configs[page]
        );

    }

  }


  if (currentRole === "service") {

    if (page === "home") {

      content = serviceHome();

    }

    else if (page === "group-performance") {

      content = servicePerformance();

    }

    else if (page === "audit") {

      content = auditPage();

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
          "Personal QR Code acquisition performance."
        ],

        "group-recognition": [
          "AMBASSADOR PROGRAM",
          "Recognition",
          "Bronze, Silver and Gold Status progression."
        ]

      };

      content =
        genericRolePage(
          ...configs[page]
        );

    }

  }


  if (currentRole === "admin") {

    const pages = {
      home: adminHome,
      "users-access": usersAccessPage,
      roles: rolesPage,
      "ai-agents": aiAgentsPage,
      integrations: integrationsPage
    };


    if (pages[page]) {

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


  renderShell(content);

}


/* =========================================================
   GENERIC PAGES / HELPERS
========================================================= */

function genericRolePage(label, title, description) {

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


function pageTitle(label, title, subtitle) {

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


function metricCard(title, value, detail) {

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


function clickableMetricCard(
  title,
  value,
  detail,
  target
) {

  return `
    <section
      class="dashboard-card metric-card clickable-card"
      onclick="navigateTo('${target}')"
    >

      <span>
        ${title}
      </span>

      <strong>
        ${value}
      </strong>

      <small>
        ${detail} →
      </small>

    </section>
  `;

}


function pillarCard(
  title,
  value,
  metric,
  detail,
  target
) {

  return `
    <section class="dashboard-card pillar-card">

      <span class="section-label">
        ${title}
      </span>

      <strong class="pillar-value">
        ${value}
      </strong>

      <h3>
        ${metric}
      </h3>

      <p>
        ${detail}
      </p>

      <button
        class="text-button"
        onclick="navigateTo('${target}')"
      >
        View →
      </button>

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


function statusLine(label, value) {

  return `
    <div class="profile-line">

      <span>
        ${label}
      </span>

      <span class="status-block good">
        ${value}
      </span>

    </div>
  `;

}


function knowledgeRow(title, detail) {

  return `
    <div class="list-row">

      <div>

        <strong>
          ${title}
        </strong>

        <small>
          ${detail}
        </small>

      </div>

      <button class="small-button">
        Open
      </button>

    </div>
  `;

}


function awardCard(title, subtitle) {

  return `
    <section class="award-mini-card">

      <div class="award-icon">
        ★
      </div>

      <h3>
        ${title}
      </h3>

      <p>
        ${subtitle}
      </p>

    </section>
  `;

}


function storeBar(name, score) {

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


function attentionRow(name, issue, detail) {

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


function auditRow(
  location,
  score,
  status,
  className
) {

  return `
    <div class="audit-row">

      <strong>
        ${location}
      </strong>

      <strong>
        ${score}
      </strong>

      <span class="status-block ${className}">
        ${status}
      </span>

      <button class="small-button">
        View
      </button>

    </div>
  `;

}


function auditThemeRow(
  theme,
  locations,
  severity,
  className
) {

  return `
    <div class="audit-theme-row">

      <strong>
        ${theme}
      </strong>

      <span>
        ${locations}
      </span>

      <span class="severity-pill ${className}">
        ${severity}
      </span>

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

      <span class="status-block ${
        status === "Active"
          ? "good"
          : "improvement"
      }">
        ${status}
      </span>

    </div>
  `;

}


function roleCard(
  role,
  identity,
  permissions
) {

  return `
    <section class="dashboard-card">

      <span class="section-label">
        ${identity}
      </span>

      <h3>
        ${role}
      </h3>

      <ul class="risk-list">

        ${permissions
          .map(item => `<li>${item}</li>`)
          .join("")}

      </ul>

    </section>
  `;

}


function agentCard(
  name,
  description,
  status
) {

  return `
    <section class="dashboard-card">

      <div class="agent-card-top">

        <div class="agent-icon">
          AI
        </div>

        <span class="status-block ${
          status === "Active"
            ? "good"
            : "improvement"
        }">
          ${status}
        </span>

      </div>

      <h3>
        ${name}
      </h3>

      <p>
        ${description}
      </p>

    </section>
  `;

}


function integrationCard(
  name,
  purpose,
  status
) {

  return `
    <section class="dashboard-card">

      <span class="section-label">
        INTEGRATION
      </span>

      <h3>
        ${name}
      </h3>

      <p>
        ${purpose}
      </p>

      <strong>
        ${status}
      </strong>

    </section>
  `;

}


function mockInput(label, value) {

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


function openPerformanceInteraction(interactionId) {

  expandedInteractionId =
    interactionId;

  navigateTo("performance");

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
   WINDOW FUNCTIONS
========================================================= */

window.signIn = signIn;
window.continueWithSSO = continueWithSSO;
window.signOut = signOut;
window.navigateTo = navigateTo;

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

window.showInviteAmbassador =
  showInviteAmbassador;

window.showManualAmbassador =
  showManualAmbassador;


/* =========================================================
   ENTER KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" &&
      document.getElementById("login-id")
    ) {

      signIn();

    }

  }
);
