import { analyseInteraction } from "./agents/agentOrchestrator.js";
import { runEvaluation } from "./agents/evaluationAgent.js";
import { runSopCheck } from "./agents/sopAgent.js";
import { runComplianceCheck } from "./agents/complianceAgent.js";


const app = document.getElementById("app");

let currentRole = null;
let currentPage = "home";
let selectedPersonaRole = null;


/* =========================================================
   PROTOTYPE USERS / RBAC
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

    onboardingStatus: "In Progress",
    onboardingProgress: 55

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

    scope: "Group"

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
   PROTOTYPE INTERACTIONS
========================================================= */

const interactions = [

  {

    id: "INT-1001",

    channel: "Voice",

    agent: "Layla Haddad",

    process: "Refund Follow-up",

    customer: "Aisha Rahman",

    businessUnit: "Entertainment",
    brand: "VOX Cinemas",
    store: "Mall of the Emirates",

    date: "10 Oct 2026",
    duration: "08:42",

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

    channel: "Chat",

    agent: "Layla Haddad",

    process: "Refund Status",

    customer: "Omar Khalid",

    businessUnit: "Entertainment",
    brand: "VOX Cinemas",
    store: "Mall of the Emirates",

    date: "07 Oct 2026",
    duration: "06:14",

    transcript: `
Customer: My booking was cancelled. When will I receive the refund?
Agent: I can check that for you.
Agent: Please confirm your booking reference.
Customer: VX81442.
Agent: Thank you. Your cancellation is confirmed.
Customer: How long will the refund take?
Agent: The refund has been initiated and timing will depend on your bank.
Customer: Is there an expected number of days?
Agent: Please continue checking with your bank.
`

  },


  {

    id: "INT-0984",

    channel: "Voice",

    agent: "Layla Haddad",

    process: "Cancellation Refund",

    customer: "Sara Malik",

    businessUnit: "Entertainment",
    brand: "VOX Cinemas",
    store: "Mall of the Emirates",

    date: "02 Oct 2026",
    duration: "07:31",

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
      title: "Service Delivery",
      items: [
        ["performance", "My Performance"],
        ["assessments", "My Assessments"],
        ["actions", "My Actions"]
      ]
    },

    {
      title: "Training & Knowledge",
      items: [
        ["training", "My Training"],
        ["knowledge", "Knowledge Base"],
        ["checks", "Knowledge Checks"]
      ]
    },

    {
      title: "Ambassador Program",
      items: [
        ["profile", "My Profile"],
        ["onboarding", "Activation Journey"],
        ["acquisition", "My QR & Acquisition"],
        ["recognition", "Recognition"]
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
        ["team-performance", "Team Performance"],
        ["team-assessments", "Assessments"],
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

function selectPersona(role) {

  selectedPersonaRole = role;

  const user =
    prototypeUsers[role];

  const cards =
    document.querySelectorAll(
      ".persona-card"
    );


  cards.forEach(card => {

    card.classList.remove(
      "selected"
    );

  });


  const selected =
    [...cards].find(card =>
      card.getAttribute(
        "onclick"
      ) ===
      `selectPersona('${role}')`
    );


  if (selected) {

    selected.classList.add(
      "selected"
    );

  }


  document
    .getElementById(
      "login-id"
    )
    .value =
    user.login;


  document
    .getElementById(
      "login-password"
    )
    .value =
    user.password;


  setLoginMessage("");
}


function setLoginMessage(
  message,
  type = "error"
) {

  const node =
    document.getElementById(
      "login-error"
    );

  if (!node) {
    return;
  }

  node.textContent =
    message;

  node.className =
    `login-error ${type}`;

}


function signIn() {

  const login =
    document
      .getElementById(
        "login-id"
      )
      .value
      .trim()
      .toLowerCase();


  const password =
    document
      .getElementById(
        "login-password"
      )
      .value;


  const matchedRole =
    Object
      .keys(
        prototypeUsers
      )
      .find(role => {

        const user =
          prototypeUsers[role];

        return (
          user.login
            .toLowerCase() ===
            login
          &&
          user.password ===
            password
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

  if (!selectedPersonaRole) {

    setLoginMessage(
      "Select a corporate prototype persona first, then continue with Microsoft SSO."
    );

    return;

  }


  if (
    selectedPersonaRole ===
    "ambassador"
  ) {

    setLoginMessage(
      "Ambassador access is currently demonstrated using Staff ID. Staff-ID SSO remains part of the target identity design.",
      "info"
    );

    return;

  }


  loginAsRole(
    selectedPersonaRole
  );

}


function loginAsRole(
  role
) {

  currentRole =
    role;

  currentPage =
    "home";

  navigateTo(
    "home"
  );

}


function signOut() {

  location.reload();

}


/* =========================================================
   APP SHELL
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

      ${groups
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
                  currentPage ===
                  item[0]
                    ? "active"
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

    </aside>
  `;

}


function renderShell(
  content
) {

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
      "Your service performance, learning and Ambassador journey in one place."
    )}


    <div class="activation-banner">

      <div>

        <span class="section-label">
          AMBASSADOR ACTIVATION
        </span>

        <h3>
          You're 55% of the way there
        </h3>

        <p>
          Complete your mandatory learning and
          knowledge check to automatically activate
          your personal SHARE QR.
        </p>

      </div>


      <div class="activation-banner-progress">

        <strong>
          55%
        </strong>

        <button
          onclick="navigateTo('training')"
        >
          Continue journey →
        </button>

      </div>

    </div>


    <div class="dashboard-grid three">

      ${pillarCard(
        "Service Delivery",
        "86%",
        "My Quality Score",
        "2 open actions",
        "performance"
      )}

      ${pillarCard(
        "Training & Knowledge",
        "55%",
        "Activation Journey",
        "2 mandatory milestones remaining",
        "training"
      )}

      ${pillarCard(
        "Ambassador Program",
        "Locked",
        "Personal SHARE QR",
        "Unlock through onboarding",
        "acquisition"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          NEXT BEST ACTIONS
        </span>

        <h3>
          What needs your attention
        </h3>


        ${actionItem(
          "Complete mandatory SHARE training",
          "Due 15 Oct",
          "training"
        )}


        ${actionItem(
          "Complete Ambassador knowledge check",
          "Locked",
          "training"
        )}


        ${actionItem(
          "Review Refund Knowledge article",
          "Recommended",
          "knowledge"
        )}

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          MY AMBASSADOR PROFILE
        </span>

        <h3>
          Identity & assignment
        </h3>


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
          "Status",
          "Onboarding"
        )}

      </section>

    </div>
  `;

}


/* =========================================================
   SERVICE DELIVERY — AMBASSADOR
========================================================= */

function ambassadorPerformance() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "My Performance",
      "Your service quality and performance."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Quality Score",
        "86%",
        "↑ 4%"
      )}

      ${metricCard(
        "SOP Compliance",
        "92%",
        "↑ 6%"
      )}

      ${metricCard(
        "Open Actions",
        "2",
        "1 due soon"
      )}

      ${metricCard(
        "Interactions Analysed",
        "12",
        "This month"
      )}

    </div>


    <section class="dashboard-card">

      <h3>
        Recent Performance
      </h3>


      ${assessmentRow(
        "Refund Handling",
        "10 Oct",
        "89%",
        "Needs Improvement",
        "amber"
      )}


      ${assessmentRow(
        "Service Pulse",
        "28 Sep",
        "94%",
        "Pass",
        "green"
      )}


      ${assessmentRow(
        "Customer Handling",
        "15 Sep",
        "91%",
        "Pass",
        "green"
      )}

    </section>


    <section class="insight-card">

      <span class="section-label">
        SHARE LENS INSIGHT
      </span>

      <h3>
        Refund SLA communication needs improvement
      </h3>

      <p>
        Verification performance remains strong,
        but refund timeline communication is a recurring gap.
      </p>

    </section>
  `;

}


function ambassadorAssessments() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "My Interactions & Assessments",
      "Select any interaction and let SHARE Lens run the complete AI analysis."
    )}


    <section class="dashboard-card">

      <div class="table-heading">

        <div>

          <span class="section-label">
            INTERACTIONS
          </span>

          <h3>
            Recent customer interactions
          </h3>

        </div>


        <span class="ai-team-label">
          Analyse = all AI agents
        </span>

      </div>


      ${interactions
        .map(
          interaction =>
            interactionRow(
              interaction
            )
        )
        .join("")}

    </section>


    <section class="dashboard-card agent-demo">

      <div class="agent-demo-heading">

        <div>

          <span class="section-label">
            SHARE LENS AGENT TEAM
          </span>

          <h3>
            One analysis. Multiple specialist agents.
          </h3>

          <p>
            Selecting <strong>Analyse Interaction</strong>
            runs the complete agent team against that interaction.
          </p>

        </div>

      </div>


      <div class="agent-team-strip">

        ${agentTeamMember(
          "1",
          "Evaluation Agent",
          "Service quality"
        )}

        <div class="agent-team-arrow">
          →
        </div>

        ${agentTeamMember(
          "2",
          "SOP Agent",
          "Process adherence"
        )}

        <div class="agent-team-arrow">
          →
        </div>

        ${agentTeamMember(
          "3",
          "Compliance Agent",
          "Mandatory controls"
        )}

        <div class="agent-team-arrow">
          →
        </div>

        ${agentTeamMember(
          "4",
          "Combined Analysis",
          "Insight & action"
        )}

      </div>


      <div
        id="selected-interaction"
        class="selected-interaction-placeholder"
      >

        Select <strong>Analyse Interaction</strong>
        against any interaction above.

      </div>


      <div
        id="agent-output"
        class="agent-output empty-state"
      >
        AI analysis will appear here.
      </div>

    </section>
  `;

}


function interactionRow(
  interaction
) {

  return `
    <div class="interaction-table-row">

      <div>

        <strong>
          ${interaction.id}
        </strong>

        <span>
          ${interaction.date}
        </span>

      </div>


      <div>

        <span class="row-label">
          Channel
        </span>

        <strong>
          ${interaction.channel}
        </strong>

      </div>


      <div>

        <span class="row-label">
          Process
        </span>

        <strong>
          ${interaction.process}
        </strong>

      </div>


      <div>

        <span class="row-label">
          Duration
        </span>

        <strong>
          ${interaction.duration}
        </strong>

      </div>


      <button
        class="analyse-button"
        onclick="runAllAgents('${interaction.id}')"
      >

        <span>
          ✦
        </span>

        <div>

          <strong>
            Analyse Interaction
          </strong>

          <small>
            Runs all AI agents
          </small>

        </div>

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


function ambassadorActions() {

  return genericListPage(
    "SERVICE DELIVERY",
    "My Actions",
    "Actions generated from service, learning and programme activity.",
    [

      [
        "Review Refund Knowledge article",
        "Due 13 Oct",
        "High"
      ],

      [
        "Complete mandatory SHARE learning",
        "Due 15 Oct",
        "Mandatory"
      ],

      [
        "Complete trainer coaching",
        "Due 18 Oct",
        "Open"
      ]

    ]
  );

}


/* =========================================================
   TRAINING / ACTIVATION JOURNEY
========================================================= */

function trainingPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "My Training",
      "Complete the mandatory activation journey and continue your ongoing learning."
    )}


    ${activationJourney()}


    <div class="dashboard-grid three">

      ${metricCard(
        "Activation Progress",
        "55%",
        "In progress"
      )}

      ${metricCard(
        "Training Completion",
        "67%",
        "Mandatory learning"
      )}

      ${metricCard(
        "Knowledge Readiness",
        "Pending",
        "Unlocks next"
      )}

    </div>


    <section class="dashboard-card">

      <div class="table-heading">

        <div>

          <span class="section-label">
            MY LEARNING
          </span>

          <h3>
            Mandatory & assigned training
          </h3>

        </div>

      </div>


      ${trainingRow(
        "Welcome to the SHARE Ambassador Program",
        "Completed · 08 Oct",
        "Completed"
      )}


      ${trainingRow(
        "Understand Your Ambassador Role",
        "Completed · 09 Oct",
        "Completed"
      )}


      ${trainingRow(
        "SHARE Benefits & Customer Proposition",
        "Due 15 Oct",
        "In Progress"
      )}


      ${trainingRow(
        "Customer Experience Standards",
        "Due 15 Oct",
        "Not Started"
      )}


      ${trainingRow(
        "Ambassador Knowledge Check",
        "Unlocks after mandatory learning",
        "Locked"
      )}

    </section>
  `;

}


function activationJourney() {

  return `
    <section class="activation-journey">

      <div class="journey-header">

        <div>

          <span class="section-label">
            MANDATORY ACTIVATION JOURNEY
          </span>

          <h2>
            Become an Active SHARE Ambassador
          </h2>

          <p>
            Complete each milestone in sequence.
            Your personal acquisition QR automatically
            activates when the mandatory journey is complete.
          </p>

        </div>


        <div class="journey-percent">

          <strong>
            55%
          </strong>

          <span>
            Complete
          </span>

        </div>

      </div>


      <div class="journey-progress">

        <div style="width:55%"></div>

      </div>


      <div class="journey-milestones">


        ${journeyMilestone(
          "1",
          "Identity & Role",
          "Staff ID verified",
          "complete"
        )}


        ${journeyConnector(
          "complete"
        )}


        ${journeyMilestone(
          "2",
          "Understand Your Role",
          "Completed 09 Oct",
          "complete"
        )}


        ${journeyConnector(
          "active"
        )}


        ${journeyMilestone(
          "3",
          "Mandatory Training",
          "Due 15 Oct",
          "active"
        )}


        ${journeyConnector(
          ""
        )}


        ${journeyMilestone(
          "4",
          "Knowledge Check",
          "Unlocks next",
          "locked"
        )}


        ${journeyConnector(
          ""
        )}


        ${journeyMilestone(
          "★",
          "QR Activation",
          "Automatic milestone",
          "celebration locked"
        )}

      </div>


      <div class="journey-current-task">

        <div class="current-task-icon">
          3
        </div>

        <div>

          <span>
            CURRENT MILESTONE
          </span>

          <strong>
            Complete Mandatory Training
          </strong>

          <p>
            2 of 4 required modules completed.
            Complete the remaining modules by
            <strong>15 October 2026</strong>.
          </p>

        </div>


        <button>
          Continue Training
        </button>

      </div>

    </section>
  `;

}


function journeyMilestone(
  icon,
  title,
  detail,
  state
) {

  return `
    <div class="journey-milestone ${state}">

      <div class="milestone-icon">
        ${icon}
      </div>

      <strong>
        ${title}
      </strong>

      <span>
        ${detail}
      </span>

    </div>
  `;

}


function journeyConnector(
  state
) {

  return `
    <div class="journey-connector ${state}">
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
      "Approved knowledge, policies and operating procedures relevant to your role."
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
          AI IDENTIFIED
        </span>

        <h3>
          Knowledge Gap
        </h3>


        <div class="knowledge-gap">

          <div class="knowledge-gap-score">

            <strong>
              Refund Timelines
            </strong>

            <span>
              Priority
            </span>

          </div>

          <p>
            Your recent interactions indicate a recurring
            gap around refund SLA communication.
          </p>

          <button
            class="primary-small"
            onclick="navigateTo('checks')"
          >
            Review Knowledge
          </button>

        </div>

      </section>

    </div>
  `;

}


function knowledgeChecks() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Checks",
      "Complete knowledge checks to validate programme readiness."
    )}


    <section class="locked-check-card">

      <div class="lock-symbol">
        🔒
      </div>

      <span class="section-label">
        ACTIVATION JOURNEY
      </span>

      <h2>
        Ambassador Knowledge Check
      </h2>

      <p>
        Complete your remaining mandatory training
        before this knowledge check is unlocked.
      </p>

      <strong>
        Next milestone unlocks after training completion.
      </strong>

      <button
        onclick="navigateTo('training')"
      >
        Return to My Training
      </button>

    </section>
  `;

}


/* =========================================================
   AMBASSADOR PROGRAM
========================================================= */

function ambassadorProfile() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "My Ambassador Profile",
      "Your Ambassador identity, assignment and programme status."
    )}


    <div class="dashboard-grid two">

      <section class="dashboard-card profile-card">

        <div class="large-avatar">
          LH
        </div>

        <h2>
          Layla Haddad
        </h2>

        <span class="badge amber">
          Onboarding · 55%
        </span>


        <div class="profile-details">

          ${profileLine(
            "Staff ID",
            "100245"
          )}

          ${profileLine(
            "RBAC Role",
            "Ambassador"
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
            "Trainer",
            "Ahmed Salah"
          )}

        </div>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          ACTIVATION
        </span>

        <h3>
          Programme Readiness
        </h3>

        ${profileLine(
          "Identity",
          "Complete"
        )}

        ${profileLine(
          "Role Orientation",
          "Complete"
        )}

        ${profileLine(
          "Mandatory Training",
          "In Progress"
        )}

        ${profileLine(
          "Knowledge Check",
          "Locked"
        )}

        ${profileLine(
          "Personal QR",
          "Locked"
        )}


        <button
          class="profile-action-button"
          onclick="navigateTo('training')"
        >
          Continue Activation Journey
        </button>

      </section>

    </div>
  `;

}


function ambassadorOnboarding() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Activation Journey",
      "Your mandatory journey from Ambassador selection to activation."
    )}


    ${activationJourney()}


    <section class="dashboard-card">

      <span class="section-label">
        IDENTITY & RBAC
      </span>

      <h3>
        Access setup
      </h3>


      ${onboardingRow(
        "Staff record matched",
        "Staff ID 100245",
        true
      )}


      ${onboardingRow(
        "Staff ID verified",
        "Identity confirmed",
        true
      )}


      ${onboardingRow(
        "Ambassador RBAC role assigned",
        "Role: SHARE Ambassador",
        true
      )}


      ${onboardingRow(
        "Business Unit assigned",
        "Entertainment",
        true
      )}


      ${onboardingRow(
        "Brand assigned",
        "VOX Cinemas",
        true
      )}


      ${onboardingRow(
        "Store assigned",
        "Mall of the Emirates",
        true
      )}


      ${onboardingRow(
        "Trainer assigned",
        "Ahmed Salah",
        true
      )}

    </section>
  `;

}


function acquisitionPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "My QR & Acquisition",
      "Your personal SHARE acquisition identity."
    )}


    <div class="dashboard-grid two">

      <section class="dashboard-card qr-card">

        <span class="section-label">
          PERSONAL SHARE QR
        </span>

        <h3>
          Your QR is almost ready
        </h3>


        <div class="qr-preview-wrapper">

          <img
            class="share-qr-image"
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fwww.sharerewards.com%2F"
            alt="SHARE Rewards QR Code"
          >


          <div class="qr-lock-overlay">

            <div class="qr-lock-icon">
              🔒
            </div>

            <strong>
              Locked
            </strong>

            <span>
              Complete your activation journey
            </span>

          </div>

        </div>


        <div class="qr-destination">

          <span>
            QR destination
          </span>

          <strong>
            sharerewards.com
          </strong>

        </div>


        <div class="qr-unlock-message">

          <span class="milestone-star">
            ★
          </span>

          <div>

            <strong>
              Automatic activation milestone
            </strong>

            <p>
              Your personal QR automatically activates
              after mandatory training and the knowledge
              check are successfully completed.
            </p>

          </div>

        </div>


        <button
          class="primary-small"
          onclick="navigateTo('training')"
        >
          Continue Activation Journey
        </button>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          ACQUISITION PERFORMANCE
        </span>

        <h3>
          Starts after QR activation
        </h3>


        <div class="future-state">

          <div class="future-number">
            —
          </div>

          <strong>
            New SHARE members
          </strong>

          <p>
            Your acquisition activity, ranking and
            recognition will appear here after your
            personal QR becomes active.
          </p>

        </div>

      </section>

    </div>
  `;

}


function recognitionPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Recognition",
      "Recognition begins once your Ambassador activation journey is complete."
    )}


    <div class="dashboard-grid three">

      ${awardCard(
        "Knowledge Champion",
        "Future milestone"
      )}

      ${awardCard(
        "Acquisition Leader",
        "Future milestone"
      )}

      ${awardCard(
        "Customer Experience Star",
        "Future milestone"
      )}

    </div>
  `;

}


/* =========================================================
   MANAGER
========================================================= */

function managerHome() {

  return `
    ${pageTitle(
      "ENTERTAINMENT UAE",
      "BU Lead / Trainer Dashboard",
      "Performance across your stores and Ambassador population."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Active Ambassadors",
        "238",
        "↑ 5%"
      )}

      ${metricCard(
        "Currently Onboarding",
        "18",
        "3 require attention"
      )}

      ${metricCard(
        "Training Completion",
        "91%",
        "↑ 4%"
      )}

      ${metricCard(
        "Knowledge Score",
        "84%",
        "↑ 6%"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          STORE PERFORMANCE
        </span>

        <h3>
          Service quality
        </h3>

        ${storeBar(
          "MOE",
          91
        )}

        ${storeBar(
          "MCC",
          88
        )}

        ${storeBar(
          "DFC",
          74
        )}

        ${storeBar(
          "YAS",
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
          "Training",
          "55%"
        )}


        ${attentionRow(
          "Ahmed Ali",
          "Training overdue",
          "2 modules"
        )}


        ${attentionRow(
          "Sara Khan",
          "Low assessment",
          "72%"
        )}

      </section>

    </div>
  `;

}


function managerOnboarding() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassador Onboarding",
      "Track Ambassadors from selection through activation."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Selected",
        "21",
        "Current"
      )}

      ${metricCard(
        "Identity Pending",
        "3",
        "Current"
      )}

      ${metricCard(
        "Training",
        "9",
        "In progress"
      )}

      ${metricCard(
        "Ready to Activate",
        "3",
        "Current"
      )}

    </div>


    <section class="dashboard-card">

      ${personOnboardingRow(
        "Layla Haddad",
        "100245",
        "Mandatory Training",
        "55%"
      )}


      ${personOnboardingRow(
        "Noor Hassan",
        "100822",
        "Identity Verified",
        "35%"
      )}


      ${personOnboardingRow(
        "Rania Ali",
        "100845",
        "Knowledge Check",
        "80%"
      )}


      ${personOnboardingRow(
        "Sami Omar",
        "100901",
        "Ready to Activate",
        "100%"
      )}

    </section>
  `;

}


function managerGenericPage(
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

      ${genericPerformanceRow(
        "Mall of the Emirates",
        "91%",
        "On Track"
      )}

      ${genericPerformanceRow(
        "City Centre Mirdif",
        "88%",
        "On Track"
      )}

      ${genericPerformanceRow(
        "Dubai Festival City",
        "74%",
        "Attention"
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
      "GROUP VIEW",
      "Service Delivery",
      "Cross-business visibility across the three SHARE Lens pillars."
    )}


    <div class="filter-bar">

      <span>
        Country: UAE
      </span>

      <span>
        Business Unit: All
      </span>

      <span>
        Brand: All
      </span>

      <span>
        Store: All
      </span>

    </div>


    <div class="dashboard-grid four">

      ${metricCard(
        "Ambassadors",
        "850",
        "UAE"
      )}

      ${metricCard(
        "Currently Onboarding",
        "38",
        "Across UAE"
      )}

      ${metricCard(
        "Brands",
        "12",
        "Active"
      )}

      ${metricCard(
        "Stores",
        "94",
        "Active"
      )}

    </div>


    <div class="dashboard-grid three">

      ${pillarCard(
        "Service Delivery",
        "88%",
        "Assessment Score",
        "37 open actions",
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
          TOP RISKS
        </span>

        <h3>
          Areas requiring intervention
        </h3>

        <ul class="risk-list">

          <li>
            Refund SLA knowledge gap across three stores
          </li>

          <li>
            22 Ambassadors overdue mandatory training
          </li>

          <li>
            3 stores below service threshold
          </li>

          <li>
            6 Ambassador onboarding journeys delayed
          </li>

        </ul>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          SHARE LENS AI
        </span>

        <h3>
          Recommended next actions
        </h3>

        <ul class="risk-list">

          <li>
            Assign targeted refund refresher
          </li>

          <li>
            Notify relevant BU trainers
          </li>

          <li>
            Prioritise low-performing stores
          </li>

          <li>
            Escalate delayed Ambassador onboarding
          </li>

        </ul>

      </section>

    </div>
  `;

}


function serviceGenericPage(
  label,
  title
) {

  return `
    ${pageTitle(
      label,
      title,
      "Drill down by country, BU, brand, store and Ambassador."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Current Score",
        "88%",
        "Group"
      )}

      ${metricCard(
        "On Track",
        "81%",
        "Population"
      )}

      ${metricCard(
        "Attention",
        "14%",
        "Population"
      )}

      ${metricCard(
        "Critical",
        "5%",
        "Population"
      )}

    </div>


    <section class="dashboard-card">

      ${genericPerformanceRow(
        "Entertainment",
        "91%",
        "On Track"
      )}

      ${genericPerformanceRow(
        "Retail",
        "87%",
        "On Track"
      )}

      ${genericPerformanceRow(
        "Properties",
        "79%",
        "Attention"
      )}

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
      "Manage identity, RBAC, AI agents, integrations and configuration."
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
        "3 active"
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
          IDENTITY & ACCESS
        </span>

        <h3>
          RBAC Overview
        </h3>

        ${profileLine(
          "Ambassadors",
          "850"
        )}

        ${profileLine(
          "BU Leads / Trainers",
          "42"
        )}

        ${profileLine(
          "Service Delivery",
          "18"
        )}

        ${profileLine(
          "Platform Admin",
          "5"
        )}

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
  `;

}


function usersAccessPage() {

  return `
    ${pageTitle(
      "IDENTITY & ACCESS",
      "Users & Access",
      "Manage user identity, RBAC scope and Ambassador activation."
    )}


    <section class="dashboard-card">

      <div class="admin-table-header">

        <span>
          User
        </span>

        <span>
          Identity
        </span>

        <span>
          Role
        </span>

        <span>
          Scope
        </span>

        <span>
          Status
        </span>

      </div>


      ${userAccessRow(
        "Layla Haddad",
        "Staff ID 100245",
        "Ambassador",
        "VOX · MOE",
        "Onboarding"
      )}


      ${userAccessRow(
        "Noor Hassan",
        "Staff ID 100822",
        "Ambassador",
        "VOX · MOE",
        "Onboarding"
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
        "Group",
        "Active"
      )}

    </section>


    <section class="notice-card">

      <strong>
        Ambassador access model
      </strong>

      <p>
        Staff ID → identity match → RBAC role →
        BU / brand / store assignment →
        activation journey → authorised experience.
      </p>

    </section>
  `;

}


function rolesPage() {

  return `
    ${pageTitle(
      "IDENTITY & ACCESS",
      "Roles & Permissions",
      "Prototype role-based access model."
    )}


    <div class="dashboard-grid two">

      ${roleCard(
        "Ambassador",
        "Staff ID",
        [
          "Own performance",
          "Mandatory training",
          "Knowledge Base",
          "Activation journey",
          "Personal QR after activation",
          "Recognition"
        ]
      )}


      ${roleCard(
        "BU Lead / Trainer",
        "Entra ID",
        [
          "Assigned population",
          "Store performance",
          "Training",
          "Knowledge gaps",
          "Onboarding",
          "Acquisition"
        ]
      )}


      ${roleCard(
        "Service Delivery",
        "Entra ID",
        [
          "Cross-BU performance",
          "Service Delivery",
          "Training & Knowledge",
          "Ambassador Program",
          "Actions & insights"
        ]
      )}


      ${roleCard(
        "Platform Admin",
        "Entra ID",
        [
          "Identity",
          "RBAC",
          "AI agents",
          "Integrations",
          "Frameworks",
          "Audit"
        ]
      )}

    </div>
  `;

}


function identityProvidersPage() {

  return `
    ${pageTitle(
      "IDENTITY & ACCESS",
      "Identity Providers",
      "Target identity setup represented in the prototype."
    )}


    <div class="dashboard-grid two">

      ${identityCard(
        "Staff ID",
        "Frontline Ambassador",
        "Validation Required",
        "Prototype uses Staff ID and password. Target Staff-ID authentication design remains to be validated."
      )}


      ${identityCard(
        "Microsoft Entra ID",
        "Corporate Roles",
        "Target State",
        "BU leads, trainers, Service Delivery and Platform Admin."
      )}

    </div>
  `;

}


function aiAgentsPage() {

  return `
    ${pageTitle(
      "AI PLATFORM",
      "AI Agents",
      "Specialist AI capabilities used by SHARE Lens to automate requested business outcomes."
    )}


    <section class="notice-card">

      <strong>
        SHARE Lens agentic design
      </strong>

      <p>
        The business defines the required outcomes.
        SHARE Lens uses specialist agents to automate
        analysis, knowledge retrieval, recommendations
        and follow-up.
      </p>

    </section>


    <h2 class="pillar-heading">
      Service Delivery
    </h2>


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
        "Root Cause Agent",
        "Finds recurring causes.",
        "Proposed"
      )}

      ${agentCard(
        "Next Best Action Agent",
        "Recommends interventions.",
        "Proposed"
      )}

    </div>


    <h2 class="pillar-heading">
      Training & Knowledge
    </h2>


    <div class="dashboard-grid three">

      ${agentCard(
        "Knowledge Agent",
        "Finds approved knowledge.",
        "Proposed"
      )}

      ${agentCard(
        "Knowledge Gap Agent",
        "Identifies knowledge weaknesses.",
        "Proposed"
      )}

      ${agentCard(
        "Training Recommendation Agent",
        "Assigns targeted development.",
        "Proposed"
      )}

      ${agentCard(
        "Knowledge Check Agent",
        "Generates targeted checks.",
        "Proposed"
      )}

    </div>


    <h2 class="pillar-heading">
      Ambassador Program
    </h2>


    <div class="dashboard-grid three">

      ${agentCard(
        "Onboarding Agent",
        "Tracks readiness and missing milestones.",
        "Proposed"
      )}

      ${agentCard(
        "Engagement Agent",
        "Identifies engagement needs.",
        "Proposed"
      )}

      ${agentCard(
        "Recognition Agent",
        "Surfaces recognition opportunities.",
        "Proposed"
      )}

      ${agentCard(
        "Communication Agent",
        "Supports targeted communication.",
        "Proposed"
      )}

    </div>
  `;

}


function integrationsPage() {

  return `
    ${pageTitle(
      "PLATFORM",
      "Integrations",
      "Prototype representation of the SHARE Lens integration landscape."
    )}


    <div class="dashboard-grid three">

      ${integrationCard(
        "Mitti / SafetyCulture",
        "Training, completion and scores",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Knowmax",
        "Knowledge content",
        "Connected — Mock"
      )}

      ${integrationCard(
        "SharePoint",
        "Documents and content",
        "Planned"
      )}

      ${integrationCard(
        "Infobip",
        "Communications",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Adjust",
        "QR acquisition attribution",
        "Connected — Mock"
      )}

      ${integrationCard(
        "HR / Staff Master",
        "Staff ID, joiners and leavers",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Performance Data",
        "Store and programme KPIs",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Power BI",
        "Existing reporting",
        "Under Assessment"
      )}

      ${integrationCard(
        "Genesys",
        "Customer interactions",
        "Planned"
      )}

    </div>
  `;

}


function simpleAdminPage(
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
        PROTOTYPE MODULE
      </span>

      <h3>
        ${title}
      </h3>

      <p>
        Configuration capability represented
        within the SHARE Lens prototype.
      </p>

    </section>
  `;

}


/* =========================================================
   NAVIGATION ROUTER
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

      assessments:
        ambassadorAssessments,

      actions:
        ambassadorActions,

      training:
        trainingPage,

      knowledge:
        knowledgePage,

      checks:
        knowledgeChecks,

      profile:
        ambassadorProfile,

      onboarding:
        ambassadorOnboarding,

      acquisition:
        acquisitionPage,

      recognition:
        recognitionPage

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
      page ===
      "home"
    ) {

      content =
        managerHome();

    }

    else if (
      page ===
      "manager-onboarding"
    ) {

      content =
        managerOnboarding();

    }

    else {

      const managerPages = {

        "team-performance":
          [
            "SERVICE DELIVERY",
            "Team Performance",
            "Quality and service performance across your assigned population."
          ],

        "team-assessments":
          [
            "SERVICE DELIVERY",
            "Assessments",
            "Monitor assessments and performance gaps."
          ],

        "team-actions":
          [
            "SERVICE DELIVERY",
            "Actions",
            "Track required interventions."
          ],

        "training-overview":
          [
            "TRAINING & KNOWLEDGE",
            "Training Overview",
            "Training completion, deadlines and overdue learning."
          ],

        "knowledge-gaps":
          [
            "TRAINING & KNOWLEDGE",
            "Knowledge Gaps",
            "Identify recurring knowledge weaknesses."
          ],

        "manager-knowledge":
          [
            "TRAINING & KNOWLEDGE",
            "Knowledge Base",
            "Approved knowledge for your assigned population."
          ],

        ambassadors:
          [
            "AMBASSADOR PROGRAM",
            "Ambassadors",
            "View your Ambassador population."
          ],

        "manager-acquisition":
          [
            "AMBASSADOR PROGRAM",
            "Acquisition",
            "Track acquisition performance."
          ],

        "manager-recognition":
          [
            "AMBASSADOR PROGRAM",
            "Recognition",
            "Identify recognition opportunities."
          ]

      };


      const config =
        managerPages[
          page
        ];


      content =
        managerGenericPage(
          config[0],
          config[1],
          config[2]
        );

    }

  }


  if (
    currentRole ===
    "service"
  ) {

    if (
      page ===
      "home"
    ) {

      content =
        serviceHome();

    }

    else {

      const servicePages = {

        "group-performance":
          [
            "SERVICE DELIVERY",
            "Performance"
          ],

        audit:
          [
            "SERVICE DELIVERY",
            "Audit & Service Pulse"
          ],

        "group-actions":
          [
            "SERVICE DELIVERY",
            "Actions"
          ],

        "group-training":
          [
            "TRAINING & KNOWLEDGE",
            "Training"
          ],

        "group-knowledge":
          [
            "TRAINING & KNOWLEDGE",
            "Knowledge Base"
          ],

        "group-gaps":
          [
            "TRAINING & KNOWLEDGE",
            "Knowledge Gaps"
          ],

        "group-ambassadors":
          [
            "AMBASSADOR PROGRAM",
            "Ambassadors"
          ],

        "group-onboarding":
          [
            "AMBASSADOR PROGRAM",
            "Onboarding"
          ],

        "group-acquisition":
          [
            "AMBASSADOR PROGRAM",
            "Acquisition"
          ],

        "group-recognition":
          [
            "AMBASSADOR PROGRAM",
            "Recognition"
          ]

      };


      const config =
        servicePages[
          page
        ];


      content =
        serviceGenericPage(
          config[0],
          config[1]
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

      identity:
        identityProvidersPage,

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

      const placeholders = {

        "agent-config":
          [
            "AI PLATFORM",
            "Agent Configuration",
            "Configure agent models, prompts, rules and versions."
          ],

        "knowledge-sources":
          [
            "AI PLATFORM",
            "Knowledge Sources",
            "Configure approved knowledge and retrieval sources."
          ],

        frameworks:
          [
            "PLATFORM",
            "Assessment Frameworks",
            "Configure assessment templates and scoring."
          ],

        notifications:
          [
            "PLATFORM",
            "Notifications",
            "Configure alerts and communication rules."
          ],

        "audit-log":
          [
            "PLATFORM",
            "Audit Log",
            "Review platform and configuration activity."
          ]

      };


      const config =
        placeholders[
          page
        ];


      content =
        simpleAdminPage(
          config[0],
          config[1],
          config[2]
        );

    }

  }


  renderShell(
    content
  );

}


/* =========================================================
   AI AGENT ORCHESTRATION
========================================================= */

function runAllAgents(
  interactionId
) {

  const interaction =
    interactions.find(
      item =>
        item.id ===
        interactionId
    );


  if (!interaction) {

    return;

  }


  const selectedNode =
    document.getElementById(
      "selected-interaction"
    );


  if (
    selectedNode
  ) {

    selectedNode.innerHTML = `
      <div class="selected-interaction-card">

        <div>

          <span class="section-label">
            SELECTED INTERACTION
          </span>

          <h3>
            ${interaction.id} · ${interaction.process}
          </h3>

        </div>


        <div class="selected-interaction-meta">

          <span>
            ${interaction.channel}
          </span>

          <span>
            ${interaction.customer}
          </span>

          <span>
            ${interaction.duration}
          </span>

        </div>

      </div>
    `;

  }


  const output =
    document.getElementById(
      "agent-output"
    );


  if (!output) {

    return;

  }


  output.classList.remove(
    "empty-state"
  );


  output.innerHTML = `
    <div class="agent-pipeline">

      <div class="pipeline-heading">

        <div>

          <span class="section-label">
            AGENT ORCHESTRATION
          </span>

          <h3>
            Analysing ${interaction.id}
          </h3>

        </div>


        <span class="pipeline-running-badge">
          AI team running
        </span>

      </div>


      <div class="pipeline-steps">


        ${pipelineStep(
          "interaction",
          "✓",
          "Interaction",
          "Preparing",
          "active"
        )}


        <div class="pipeline-line"></div>


        ${pipelineStep(
          "evaluation",
          "1",
          "Evaluation",
          "Waiting",
          "waiting"
        )}


        <div class="pipeline-line"></div>


        ${pipelineStep(
          "sop",
          "2",
          "SOP",
          "Waiting",
          "waiting"
        )}


        <div class="pipeline-line"></div>


        ${pipelineStep(
          "compliance",
          "3",
          "Compliance",
          "Waiting",
          "waiting"
        )}


        <div class="pipeline-line"></div>


        ${pipelineStep(
          "result",
          "4",
          "Combined",
          "Waiting",
          "waiting"
        )}

      </div>


      <div class="pipeline-status">

        <div class="processing-dot">
        </div>

        <span id="pipeline-message">

          Preparing ${interaction.id}
          for the AI agent team...

        </span>

      </div>

    </div>
  `;


  setTimeout(
    () => {

      completeStep(
        "interaction",
        "Ready"
      );


      activateStep(
        "evaluation",
        "Analysing",
        "Evaluation Agent is reviewing service quality."
      );

    },
    700
  );


  setTimeout(
    () => {

      completeStep(
        "evaluation",
        "Complete"
      );


      activateStep(
        "sop",
        "Checking",
        "SOP Agent is reviewing process adherence."
      );

    },
    1800
  );


  setTimeout(
    () => {

      completeStep(
        "sop",
        "Complete"
      );


      activateStep(
        "compliance",
        "Checking",
        "Compliance Agent is validating mandatory controls."
      );

    },
    2900
  );


  setTimeout(
    () => {

      completeStep(
        "compliance",
        "Complete"
      );


      activateStep(
        "result",
        "Combining",
        "SHARE Lens is combining agent findings and next actions."
      );

    },
    4000
  );


  setTimeout(
    () => {

      completeStep(
        "result",
        "Complete"
      );


      showCombinedResult(
        interaction
      );

    },
    5200
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


function activateStep(
  stepName,
  statusText,
  message
) {

  const step =
    document.getElementById(
      `step-${stepName}`
    );


  const status =
    document.getElementById(
      `status-${stepName}`
    );


  const messageNode =
    document.getElementById(
      "pipeline-message"
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


  if (status) {

    status.textContent =
      statusText;

  }


  if (messageNode) {

    messageNode.textContent =
      message;

  }

}


function completeStep(
  stepName,
  statusText
) {

  const step =
    document.getElementById(
      `step-${stepName}`
    );


  const status =
    document.getElementById(
      `status-${stepName}`
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


  if (status) {

    status.textContent =
      statusText;

  }

}


function showCombinedResult(
  interaction
) {

  const analysis =
    analyseInteraction(
      interaction
    );


  const output =
    document.getElementById(
      "agent-output"
    );


  output.innerHTML = `

    <div class="analysis-result-header">

      <div>

        <span class="section-label">
          SHARE LENS ANALYSIS
        </span>

        <h2>
          ${analysis.finalStatus}
        </h2>

        <p>
          ${interaction.id} ·
          ${interaction.process}
        </p>

      </div>


      <div class="analysis-score">

        ${analysis.overallScore}%

        <span>
          Overall
        </span>

      </div>

    </div>


    <div class="analysis-agent-results">


      ${agentResultCard(
        "Evaluation Agent",
        `${analysis.evaluation.score}%`,
        analysis.evaluation.result
      )}


      ${agentResultCard(
        "SOP Agent",
        `${analysis.sop.compliance}%`,
        analysis.sop.result
      )}


      ${agentResultCard(
        "Compliance Agent",
        `${analysis.compliance.complianceScore}%`,
        analysis.compliance.result
      )}

    </div>


    <div class="analysis-summary">

      <span class="section-label">
        COMBINED FINDING
      </span>

      <h3>
        ${analysis.evaluation.summary}
      </h3>


      <div class="recommendation-card">

        <span>
          NEXT BEST ACTION
        </span>

        <strong>
          ${analysis.recommendedAction}
        </strong>

      </div>

    </div>
  `;

}


function agentResultCard(
  title,
  score,
  status
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
        ${status}
      </small>

    </div>
  `;

}


/* =========================================================
   GENERIC UI HELPERS
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


function statusLine(
  label,
  value
) {

  return `
    <div class="profile-line">

      <span>
        ${label}
      </span>

      <span class="badge green">
        ${value}
      </span>

    </div>
  `;

}


function actionItem(
  title,
  status,
  target
) {

  return `
    <div
      class="action-item"
      onclick="navigateTo('${target}')"
    >

      <strong>
        ${title}
      </strong>

      <span class="badge amber">
        ${status}
      </span>

    </div>
  `;

}


function assessmentRow(
  title,
  date,
  score,
  status,
  colour
) {

  return `
    <div class="assessment-row">

      <div>

        <strong>
          ${title}
        </strong>

        <small>
          ${date}
        </small>

      </div>


      <span class="score-pill ${colour}">
        ${score}
      </span>


      <span>
        ${status}
      </span>


      <button class="small-button">
        View
      </button>

    </div>
  `;

}


function trainingRow(
  title,
  detail,
  status
) {

  const className =
    status === "Completed"
      ? "green"
      :
      status === "In Progress"
        ? "amber"
        : "";


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


      <span class="badge ${className}">
        ${status}
      </span>


      <button class="small-button">
        Open
      </button>

    </div>
  `;

}


function knowledgeRow(
  title,
  detail
) {

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


function onboardingRow(
  title,
  detail,
  complete
) {

  return `
    <div class="onboarding-row">

      <div class="onboarding-check ${complete ? "complete" : ""}">
        ${complete ? "✓" : ""}
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


function awardCard(
  title,
  subtitle
) {

  return `
    <section class="dashboard-card award-card">

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

      <span class="badge amber">
        ${issue}
      </span>

      <span>
        ${detail}
      </span>

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
  progress
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
        ${progress}
      </strong>

      <button class="small-button">
        View
      </button>

    </div>
  `;

}


function genericPerformanceRow(
  name,
  score,
  status
) {

  return `
    <div class="generic-row">

      <strong>
        ${name}
      </strong>

      <span>
        ${score}
      </span>

      <span>
        ${status}
      </span>

      <button class="small-button">
        View
      </button>

    </div>
  `;

}


function genericListPage(
  label,
  title,
  subtitle,
  items
) {

  return `
    ${pageTitle(
      label,
      title,
      subtitle
    )}


    <section class="dashboard-card">

      ${items
        .map(
          item => `

            <div class="list-row">

              <div>

                <strong>
                  ${item[0]}
                </strong>

                <small>
                  ${item[1]}
                </small>

              </div>

              <span class="badge">
                ${item[2]}
              </span>

              <button class="small-button">
                Open
              </button>

            </div>

          `
        )
        .join("")}

    </section>
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

      <span class="badge ${
        status === "Active"
          ? "green"
          : "amber"
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
          .map(
            item =>
              `<li>${item}</li>`
          )
          .join("")}

      </ul>

    </section>
  `;

}


function identityCard(
  title,
  subtitle,
  status,
  description
) {

  return `
    <section class="dashboard-card">

      <span class="section-label">
        IDENTITY
      </span>

      <h3>
        ${title}
      </h3>

      <strong>
        ${subtitle}
      </strong>

      <p>
        ${description}
      </p>

      <span class="badge amber">
        ${status}
      </span>

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

        <span class="badge ${
          status === "Active"
            ? "green"
            : ""
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


/* =========================================================
   EXPOSE FUNCTIONS
========================================================= */

window.selectPersona =
  selectPersona;

window.signIn =
  signIn;

window.continueWithSSO =
  continueWithSSO;

window.signOut =
  signOut;

window.navigateTo =
  navigateTo;

window.runAllAgents =
  runAllAgents;


/* =========================================================
   ENTER KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
      &&
      document.getElementById(
        "login-id"
      )
    ) {

      signIn();

    }

  }
);
