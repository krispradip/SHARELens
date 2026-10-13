import { analyseInteraction } from "./agents/agentOrchestrator.js";
import { runEvaluation } from "./agents/evaluationAgent.js";
import { runSopCheck } from "./agents/sopAgent.js";
import { runComplianceCheck } from "./agents/complianceAgent.js";

const app = document.getElementById("app");

let currentRole = "ambassador";
let currentPage = "home";

const demoInteraction = {
  id: "INT-1001",
  channel: "Voice",
  agent: "Layla Haddad",
  process: "Refund",
  customer: "Aisha Rahman",
  businessUnit: "Entertainment",
  brand: "VOX Cinemas",
  store: "Mall of the Emirates",
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
};


/* =========================================================
   ROLE CONFIGURATION
========================================================= */

const roleConfig = {

  ambassador: {
    name: "Layla Haddad",
    subtitle: "SHARE Ambassador · VOX Cinemas · Mall of the Emirates",

    groups: [

      {
        title: "",
        items: [
          {
            id: "home",
            label: "Home"
          }
        ]
      },

      {
        title: "Service Delivery",
        items: [
          {
            id: "performance",
            label: "My Performance"
          },
          {
            id: "assessments",
            label: "My Assessments"
          },
          {
            id: "actions",
            label: "My Actions"
          }
        ]
      },

      {
        title: "Training & Knowledge",
        items: [
          {
            id: "training",
            label: "My Training"
          },
          {
            id: "knowledge",
            label: "Knowledge & SOP"
          },
          {
            id: "checks",
            label: "Knowledge Checks"
          }
        ]
      },

      {
        title: "Ambassador Program",
        items: [
          {
            id: "profile",
            label: "My Profile"
          },
          {
            id: "onboarding",
            label: "Onboarding"
          },
          {
            id: "acquisition",
            label: "My QR & Acquisition"
          },
          {
            id: "recognition",
            label: "Recognition"
          }
        ]
      }

    ]
  },


  manager: {
    name: "Ahmed Salah",
    subtitle: "BU Lead / Trainer · Entertainment UAE",

    groups: [

      {
        title: "",
        items: [
          {
            id: "home",
            label: "Home"
          }
        ]
      },

      {
        title: "Service Delivery",
        items: [
          {
            id: "team-performance",
            label: "Team Performance"
          },
          {
            id: "team-assessments",
            label: "Assessments"
          },
          {
            id: "team-actions",
            label: "Actions"
          }
        ]
      },

      {
        title: "Training & Knowledge",
        items: [
          {
            id: "training-overview",
            label: "Training Overview"
          },
          {
            id: "knowledge-gaps",
            label: "Knowledge Gaps"
          }
        ]
      },

      {
        title: "Ambassador Program",
        items: [
          {
            id: "ambassadors",
            label: "Ambassadors"
          },
          {
            id: "manager-onboarding",
            label: "Onboarding"
          },
          {
            id: "manager-acquisition",
            label: "Acquisition"
          },
          {
            id: "manager-recognition",
            label: "Recognition"
          }
        ]
      }

    ]
  },


  service: {
    name: "Marian Zakhary",
    subtitle: "Service Delivery · Group View",

    groups: [

      {
        title: "",
        items: [
          {
            id: "home",
            label: "Home"
          }
        ]
      },

      {
        title: "Service Delivery",
        items: [
          {
            id: "group-performance",
            label: "Performance"
          },
          {
            id: "audit",
            label: "Audit & Service Pulse"
          },
          {
            id: "group-actions",
            label: "Actions"
          }
        ]
      },

      {
        title: "Training & Knowledge",
        items: [
          {
            id: "group-training",
            label: "Training"
          },
          {
            id: "group-knowledge",
            label: "Knowledge"
          },
          {
            id: "group-gaps",
            label: "Knowledge Gaps"
          }
        ]
      },

      {
        title: "Ambassador Program",
        items: [
          {
            id: "group-ambassadors",
            label: "Ambassadors"
          },
          {
            id: "group-onboarding",
            label: "Onboarding"
          },
          {
            id: "group-acquisition",
            label: "Acquisition"
          },
          {
            id: "group-recognition",
            label: "Recognition"
          }
        ]
      },

      {
        title: "Platform",
        items: [
          {
            id: "ai-agents",
            label: "AI Agents"
          },
          {
            id: "integrations",
            label: "Integrations"
          },
          {
            id: "identity",
            label: "Identity & Access"
          }
        ]
      }

    ]
  }

};


/* =========================================================
   SHARED LAYOUT
========================================================= */

function topBar() {

  const config = roleConfig[currentRole];

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

        <div class="user-details">

          <strong>
            ${config.name}
          </strong>

          <span>
            ${config.subtitle}
          </span>

        </div>


        <button
          class="switch-role"
          onclick="showLogin()"
        >
          Switch role
        </button>

      </div>

    </header>
  `;
}


function sidebar() {

  const groups = roleConfig[currentRole].groups;

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
                  currentPage === item.id
                    ? "active"
                    : ""
                }"
                onclick="navigateTo('${item.id}')"
              >

                ${item.label}

              </div>

            `)
            .join("")}

        `)
        .join("")}

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
   LOGIN
========================================================= */

function showLogin() {

  location.reload();

}


/* =========================================================
   AMBASSADOR HOME
========================================================= */

function ambassadorHome() {

  return `
    <div class="page-heading">

      <span class="section-label">
        MY SHARE
      </span>

      <h1>
        Good morning, Layla
      </h1>

      <p class="content-subtitle">
        Your performance, learning and Ambassador activity in one place.
      </p>

    </div>


    <div class="dashboard-grid three">

      ${pillarCard(
        "Service Delivery",
        "86%",
        "My Quality Score",
        "2 Open Actions",
        "View My Performance",
        "performance"
      )}

      ${pillarCard(
        "Training & Knowledge",
        "92%",
        "Training Completion",
        "Knowledge Score 87%",
        "View My Training",
        "training"
      )}

      ${pillarCard(
        "Ambassador Program",
        "#6",
        "VOX Ambassador Rank",
        "34 Acquisitions",
        "View My Program",
        "profile"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <div class="card-heading">

          <div>

            <span class="section-label">
              NEXT BEST ACTIONS
            </span>

            <h3>
              What needs your attention
            </h3>

          </div>

        </div>


        ${actionItem(
          "Review Refund SOP",
          "High",
          "performance"
        )}

        ${actionItem(
          "Complete knowledge check: Refund Policy",
          "Due 15 Oct",
          "checks"
        )}

        ${actionItem(
          "Coaching session with your trainer",
          "Due 12 Oct",
          "actions"
        )}

      </section>


      <section class="dashboard-card">

        <div class="card-heading">

          <div>

            <span class="section-label">
              RECENT ACTIVITY
            </span>

            <h3>
              Your latest activity
            </h3>

          </div>

        </div>


        <div class="timeline-item">
          <strong>
            Training completed
          </strong>
          <p>
            Customer Verification
          </p>
        </div>


        <div class="timeline-item">
          <strong>
            Acquisition milestone
          </strong>
          <p>
            34 SHARE acquisitions this month
          </p>
        </div>


        <div class="timeline-item">
          <strong>
            Assessment completed
          </strong>
          <p>
            Refund Handling — 89%
          </p>
        </div>

      </section>

    </div>
  `;
}


function pillarCard(
  title,
  value,
  label,
  detail,
  button,
  page
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
        ${label}
      </h3>

      <p>
        ${detail}
      </p>

      <button
        class="text-button"
        onclick="navigateTo('${page}')"
      >
        ${button} →
      </button>

    </section>
  `;
}


/* =========================================================
   AMBASSADOR — SERVICE DELIVERY
========================================================= */

function performancePage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "My Performance",
      "Your quality, assessments and actions at a glance."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Overall Quality Score",
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
        "Assessments",
        "12",
        "this month"
      )}

    </div>


    <section class="dashboard-card">

      <div class="card-heading">

        <div>

          <span class="section-label">
            RECENT ASSESSMENTS
          </span>

          <h3>
            Service Delivery performance
          </h3>

        </div>

      </div>


      ${assessmentRow(
        "Refund Handling",
        "10 Oct 2026",
        "89%",
        "Needs Improvement",
        "amber"
      )}

      ${assessmentRow(
        "Service Pulse",
        "28 Sep 2026",
        "94%",
        "Pass",
        "green"
      )}

      ${assessmentRow(
        "Customer Handling",
        "15 Sep 2026",
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
        Your recent assessments show strong verification performance,
        but refund timeline communication requires attention.
      </p>

    </section>
  `;
}


function assessmentsPage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "My Assessments",
      "Review assessment results and run the SHARE Lens AI analysis."
    )}


    <section class="dashboard-card">

      ${assessmentRow(
        "Refund Handling",
        "10 Oct 2026",
        "89%",
        "Needs Improvement",
        "amber",
        true
      )}

      ${assessmentRow(
        "Service Pulse",
        "28 Sep 2026",
        "94%",
        "Pass",
        "green"
      )}

      ${assessmentRow(
        "Customer Handling",
        "15 Sep 2026",
        "91%",
        "Pass",
        "green"
      )}

    </section>


    <section class="placeholder-card agent-area">

      <div class="section-header">

        <span class="section-label">
          AGENTIC QUALITY
        </span>

        <h3>
          Analyse Demo Interaction
        </h3>

        <p>
          SHARE Lens uses specialist AI agents to analyse the interaction.
        </p>

      </div>


      ${interactionCard()}


      <div class="agent-buttons">

        <button onclick="runEvaluationAgent()">
          Evaluation Agent
        </button>

        <button onclick="runSopAgent()">
          SOP Agent
        </button>

        <button onclick="runComplianceAgent()">
          Compliance Agent
        </button>

        <button
          class="run-all"
          onclick="runAllAgents()"
        >
          Run All Agents
        </button>

      </div>


      <div
        id="agent-output"
        class="agent-output empty-state"
      >
        Select an agent to begin.
      </div>

    </section>
  `;
}


function actionsPage() {

  return `
    ${pageTitle(
      "SERVICE DELIVERY",
      "My Actions",
      "Actions assigned from assessments, training and programme activity."
    )}


    <section class="dashboard-card">

      ${fullActionRow(
        "Review Refund SOP",
        "Review Refund Process v3 following assessment INT-1001.",
        "Due 13 Oct",
        "red"
      )}

      ${fullActionRow(
        "Complete Trainer Coaching",
        "Refund SLA communication coaching.",
        "Due 15 Oct",
        "amber"
      )}

      ${fullActionRow(
        "Acknowledge policy update",
        "Cancellation & Refund Policy v3.",
        "Open",
        ""
      )}

    </section>
  `;
}


/* =========================================================
   AMBASSADOR — TRAINING & KNOWLEDGE
========================================================= */

function trainingPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "My Training",
      "Track your learning, completion and assigned modules."
    )}


    <div class="dashboard-grid three">

      ${metricCard(
        "Training Completion",
        "92%",
        "↑ 4%"
      )}

      ${metricCard(
        "Knowledge Score",
        "87%",
        "Latest"
      )}

      ${metricCard(
        "Modules Due",
        "1",
        "This month"
      )}

    </div>


    <section class="dashboard-card">

      <div class="card-heading">

        <div>
          <h3>
            Assigned Training
          </h3>
        </div>

      </div>


      ${trainingRow(
        "New SHARE Benefit Launch",
        "15 Oct 2026",
        "In Progress"
      )}

      ${trainingRow(
        "Refund Policy Update",
        "Completed",
        "Completed"
      )}

      ${trainingRow(
        "Customer Verification",
        "Completed",
        "Completed"
      )}

      ${trainingRow(
        "SOP Refresher — Entertainment",
        "22 Oct 2026",
        "Not Started"
      )}

    </section>
  `;
}


function knowledgePage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge & SOP",
      "Approved procedures, policies and knowledge relevant to your role."
    )}


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <h3>
          Relevant to Me
        </h3>

        ${knowledgeRow(
          "Refund Process",
          "SOP",
          "Updated 2 Oct"
        )}

        ${knowledgeRow(
          "Customer Verification",
          "SOP",
          "Updated 19 Sep"
        )}

        ${knowledgeRow(
          "Cancellation Policy",
          "Policy",
          "Updated 12 Sep"
        )}

        ${knowledgeRow(
          "SHARE Benefits",
          "Knowledge",
          "Updated 9 Oct"
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

          <strong>
            Refund Timelines
          </strong>

          <p>
            You answered 2 of 5 questions incorrectly
            in recent checks.
          </p>

          <button
            class="primary-small"
            onclick="navigateTo('checks')"
          >
            Review & Test
          </button>

        </div>

      </section>

    </div>
  `;
}


function knowledgeChecksPage() {

  return `
    ${pageTitle(
      "TRAINING & KNOWLEDGE",
      "Knowledge Checks",
      "Check your understanding of key procedures and programme updates."
    )}


    <section class="dashboard-card knowledge-check-card">

      <div class="check-progress">

        <strong>
          Refund Policy Knowledge Check
        </strong>

        <span>
          Question 3 of 10
        </span>

      </div>


      <div class="progress-bar">

        <div style="width:30%"></div>

      </div>


      <h3>
        What is the standard refund processing time
        for SHARE purchases?
      </h3>


      <div class="answer-option">
        A. Immediate refund
      </div>

      <div class="answer-option selected">
        B. Within 3–5 business days
      </div>

      <div class="answer-option">
        C. Within 24 hours
      </div>

      <div class="answer-option">
        D. Up to 14 days
      </div>

    </section>
  `;
}


/* =========================================================
   AMBASSADOR PROGRAM
========================================================= */

function ambassadorProfilePage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "My Ambassador Profile",
      "Your role, progress, acquisition and recognition."
    )}


    <div class="dashboard-grid three">

      <section class="dashboard-card profile-card">

        <div class="avatar">
          LH
        </div>

        <h3>
          Layla Haddad
        </h3>

        <p>
          VOX Cinemas
        </p>

        <p>
          Mall of the Emirates
        </p>

        <span class="badge green">
          Active Ambassador
        </span>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          MY ACQUISITION
        </span>

        <strong class="big-number">
          34
        </strong>

        <p>
          New SHARE members this month
        </p>

        <p>
          Rank #6 in VOX Cinemas
        </p>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          RECOGNITION
        </span>

        <h3>
          Top 10 VOX Ambassador
        </h3>

        <p>
          September 2026
        </p>

        <h3>
          Knowledge Champion
        </h3>

      </section>

    </div>
  `;
}


function onboardingPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Your Onboarding Journey",
      "Complete all steps to become an active SHARE Ambassador."
    )}


    <section class="dashboard-card onboarding-card">

      <div class="onboarding-top">

        <strong>
          60% Complete
        </strong>

        <div class="progress-bar">

          <div style="width:60%"></div>

        </div>

      </div>


      ${onboardingStep(
        "Profile created",
        "Your profile has been added.",
        true
      )}

      ${onboardingStep(
        "Staff ID verified",
        "Your identity has been confirmed.",
        true
      )}

      ${onboardingStep(
        "Store and brand assigned",
        "VOX Cinemas · Mall of the Emirates.",
        true
      )}

      ${onboardingStep(
        "Understand your Ambassador role",
        "Learn about responsibilities and programme benefits.",
        false,
        true
      )}

      ${onboardingStep(
        "Complete mandatory training",
        "Complete all assigned modules.",
        false
      )}

      ${onboardingStep(
        "Complete knowledge check",
        "Test your understanding.",
        false
      )}

      ${onboardingStep(
        "Activate personal QR",
        "Your QR will be generated after training.",
        false
      )}

      ${onboardingStep(
        "Complete initial assessment",
        "Demonstrate knowledge and service skills.",
        false
      )}

      ${onboardingStep(
        "Become an Active Ambassador",
        "You're ready to start.",
        false
      )}

    </section>
  `;
}


function acquisitionPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "My QR & Acquisition",
      "Track customers acquired through your personal SHARE QR."
    )}


    <div class="dashboard-grid two">

      <section class="dashboard-card qr-card">

        <span class="section-label">
          MY PERSONAL QR
        </span>

        <div class="fake-qr">

          <div>█ ███ █</div>
          <div>██ █ ██</div>
          <div>█ ██ █</div>
          <div>███ ██</div>
          <div>█ ███ █</div>

        </div>

        <p>
          Scan to join SHARE
        </p>

        <button class="primary-small">
          Download QR
        </button>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          MY ACQUISITION
        </span>

        <strong class="big-number">
          34
        </strong>

        <p>
          New SHARE members this month
        </p>

        <div class="rank-row">
          <strong>#6</strong>
          <span>VOX Cinemas</span>
        </div>

        <div class="rank-row">
          <strong>#18</strong>
          <span>Entertainment</span>
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
      "Celebrate your contribution and programme achievements."
    )}


    <div class="dashboard-grid three">

      ${awardCard(
        "Top 10 VOX Ambassador",
        "September 2026"
      )}

      ${awardCard(
        "Knowledge Champion",
        "September 2026"
      )}

      ${awardCard(
        "Customer Experience Star",
        "August 2026"
      )}

    </div>
  `;
}


/* =========================================================
   MANAGER VIEW
========================================================= */

function managerHome() {

  return `
    ${pageTitle(
      "ENTERTAINMENT — UAE",
      "BU Lead / Trainer Dashboard",
      "Overview of your stores and SHARE Ambassadors."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Active Ambassadors",
        "238",
        "↑ 5%"
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

      ${metricCard(
        "Acquisition Growth",
        "12%",
        "↑ 12%"
      )}

    </div>


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <h3>
          Store Performance
        </h3>

        ${storeBar("MOE", 91)}
        ${storeBar("MCC", 88)}
        ${storeBar("DFC", 74)}
        ${storeBar("YAS", 86)}

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          AMBASSADORS REQUIRING ATTENTION
        </span>

        <h3>
          Priority intervention
        </h3>

        ${attentionRow(
          "Layla Haddad",
          "Knowledge Gap",
          "Refund SLA"
        )}

        ${attentionRow(
          "Ahmed Ali",
          "Training Overdue",
          "2 modules"
        )}

        ${attentionRow(
          "Sara Khan",
          "Low Assessment",
          "72%"
        )}

      </section>

    </div>


    <section class="insight-card">

      <span class="section-label">
        SHARE LENS INSIGHTS
      </span>

      <h3>
        What needs attention
      </h3>

      <p>
        Refund knowledge gaps are increasing across three stores.
        18 Ambassadors have overdue training.
        MOE acquisition is up 14%.
      </p>

    </section>
  `;
}


function managerGenericPage(title, subtitle) {

  return `
    ${pageTitle(
      currentManagerPillar(),
      title,
      subtitle
    )}

    <section class="dashboard-card">

      <h3>
        ${title}
      </h3>

      <p class="muted">
        This module is represented in the POC and will use
        role-specific data for the selected BU, brand and store.
      </p>

      <div class="mock-table">

        ${mockTableRow(
          "Mall of the Emirates",
          "91%",
          "On Track"
        )}

        ${mockTableRow(
          "City Centre Mirdif",
          "88%",
          "On Track"
        )}

        ${mockTableRow(
          "Dubai Festival City",
          "74%",
          "Attention"
        )}

      </div>

    </section>
  `;
}


function managerOnboardingPage() {

  return `
    ${pageTitle(
      "AMBASSADOR PROGRAM",
      "Ambassador Onboarding",
      "Track new Ambassadors from selection through activation."
    )}


    <div class="dashboard-grid four">

      ${metricCard(
        "Invited",
        "18",
        "Current"
      )}

      ${metricCard(
        "Training Pending",
        "9",
        "Current"
      )}

      ${metricCard(
        "Assessment Pending",
        "6",
        "Current"
      )}

      ${metricCard(
        "Ready to Activate",
        "3",
        "Current"
      )}

    </div>


    <section class="dashboard-card">

      ${onboardingPerson(
        "Noor Hassan",
        "VOX · MOE",
        "Training Pending",
        "60%"
      )}

      ${onboardingPerson(
        "Rania Ali",
        "VOX · MCC",
        "Knowledge Check",
        "75%"
      )}

      ${onboardingPerson(
        "Sami Omar",
        "Magic Planet · DFC",
        "Ready to Activate",
        "100%"
      )}

    </section>
  `;
}


/* =========================================================
   SERVICE DELIVERY / GROUP
========================================================= */

function serviceHome() {

  return `
    ${pageTitle(
      "GROUP VIEW",
      "SHARE Lens — Service Delivery",
      "One view across country, business unit, brand, store and Ambassador."
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
        "Brands",
        "12",
        "Active"
      )}

      ${metricCard(
        "Business Units",
        "6",
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
        "37 Open Actions",
        "View Performance",
        "group-performance"
      )}

      ${pillarCard(
        "Training & Knowledge",
        "91%",
        "Training Completion",
        "Knowledge Score 84%",
        "View Training",
        "group-training"
      )}

      ${pillarCard(
        "Ambassador Program",
        "812",
        "Active Ambassadors",
        "4,286 Acquisitions",
        "View Programme",
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
            Knowledge gap: Refund SLA
          </li>

          <li>
            3 stores below assessment threshold
          </li>

          <li>
            22 Ambassadors overdue training
          </li>

          <li>
            Inconsistent acquisition tracking
          </li>

        </ul>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          NEXT BEST ACTIONS
        </span>

        <h3>
          Recommended interventions
        </h3>

        <ul class="risk-list">

          <li>
            Assign refresher training
          </li>

          <li>
            Notify BU trainer
          </li>

          <li>
            Schedule store intervention
          </li>

          <li>
            Review acquisition source data
          </li>

        </ul>

      </section>

    </div>
  `;
}


function aiAgentsPage() {

  return `
    ${pageTitle(
      "PLATFORM",
      "AI Agents",
      "Specialist AI capabilities proposed to automate the business outcomes requested by Service Delivery."
    )}


    <div class="notice-card">

      <strong>
        Design principle
      </strong>

      <p>
        The business requirements define the outcomes.
        SHARE Lens uses specialist AI agents behind the scenes
        to automate analysis, recommendations and follow-up.
      </p>

    </div>


    <h2 class="pillar-heading">
      Service Delivery
    </h2>


    <div class="dashboard-grid three">

      ${agentCard(
        "Evaluation Agent",
        "Evaluates quality and assessment performance.",
        "Active"
      )}

      ${agentCard(
        "SOP Agent",
        "Checks required process steps and SOP adherence.",
        "Active"
      )}

      ${agentCard(
        "Compliance Agent",
        "Checks mandatory controls and critical failures.",
        "Active"
      )}

      ${agentCard(
        "Root Cause Agent",
        "Identifies recurring causes across assessments.",
        "Proposed"
      )}

      ${agentCard(
        "Next Best Action Agent",
        "Recommends the most appropriate intervention.",
        "Proposed"
      )}

    </div>


    <h2 class="pillar-heading">
      Training & Knowledge
    </h2>


    <div class="dashboard-grid three">

      ${agentCard(
        "Knowledge Agent",
        "Finds relevant knowledge and approved guidance.",
        "Proposed"
      )}

      ${agentCard(
        "Knowledge Gap Agent",
        "Identifies recurring knowledge weaknesses.",
        "Proposed"
      )}

      ${agentCard(
        "Training Recommendation Agent",
        "Recommends targeted learning based on gaps.",
        "Proposed"
      )}

      ${agentCard(
        "Knowledge Check Agent",
        "Generates role-relevant knowledge checks.",
        "Proposed"
      )}

    </div>


    <h2 class="pillar-heading">
      Ambassador Program
    </h2>


    <div class="dashboard-grid three">

      ${agentCard(
        "Onboarding Agent",
        "Tracks onboarding readiness and missing steps.",
        "Proposed"
      )}

      ${agentCard(
        "Engagement Agent",
        "Identifies Ambassadors requiring engagement.",
        "Proposed"
      )}

      ${agentCard(
        "Recognition Agent",
        "Identifies high performers and recognition opportunities.",
        "Proposed"
      )}

      ${agentCard(
        "Communication Agent",
        "Supports targeted alerts and communications.",
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
      "Mock integration layer for the SHARE Lens POC."
    )}


    <h2 class="pillar-heading">
      Training & Knowledge
    </h2>


    <div class="dashboard-grid three">

      ${integrationCard(
        "Mitti / SafetyCulture",
        "Training, completion and scores",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Knowmax",
        "Knowledge and SOP content",
        "Connected — Mock"
      )}

      ${integrationCard(
        "SharePoint",
        "Documents, SOPs and training material",
        "Planned"
      )}

    </div>


    <h2 class="pillar-heading">
      Communication
    </h2>


    <div class="dashboard-grid three">

      ${integrationCard(
        "Infobip",
        "Alerts and Ambassador communications",
        "Connected — Mock"
      )}

      ${integrationCard(
        "WhatsApp",
        "Communication channel via Infobip",
        "Represented"
      )}

    </div>


    <h2 class="pillar-heading">
      Performance & Ambassador Data
    </h2>


    <div class="dashboard-grid three">

      ${integrationCard(
        "Performance Data",
        "Sales and penetration source data",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Power BI",
        "Current reporting layer",
        "Under Assessment"
      )}

      ${integrationCard(
        "Adjust",
        "QR and acquisition attribution",
        "Connected — Mock"
      )}

      ${integrationCard(
        "HR / Staff Master",
        "Joiners, leavers and staff details",
        "Connected — Mock"
      )}

      ${integrationCard(
        "Genesys",
        "Interactions and transcripts",
        "Planned"
      )}

    </div>
  `;
}


function identityPage() {

  return `
    ${pageTitle(
      "PLATFORM",
      "Identity & Access",
      "Role-based access for corporate and frontline users."
    )}


    <div class="dashboard-grid two">

      <section class="dashboard-card">

        <span class="section-label">
          AMBASSADORS
        </span>

        <h3>
          Staff ID Access
        </h3>

        <p class="muted">
          Intended for frontline Ambassadors who do not
          have corporate email accounts.
        </p>

        <span class="badge amber">
          Validation Required
        </span>

      </section>


      <section class="dashboard-card">

        <span class="section-label">
          CORPORATE USERS
        </span>

        <h3>
          Microsoft Entra ID
        </h3>

        <p class="muted">
          SSO for Service Delivery, BU leads, trainers
          and other corporate users.
        </p>

        <span class="badge green">
          Target State
        </span>

      </section>

    </div>
  `;
}


/* =========================================================
   GENERIC GROUP PAGES
========================================================= */

function serviceGenericPage(title, pillar) {

  return `
    ${pageTitle(
      pillar,
      title,
      "Group-level view across country, BU, brand, store and Ambassador."
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
        "Requires Attention",
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

      <h3>
        ${title}
      </h3>

      <p class="muted">
        Drill-down available by country, BU, brand,
        store and individual Ambassador.
      </p>


      ${mockTableRow(
        "Entertainment",
        "91%",
        "On Track"
      )}

      ${mockTableRow(
        "Retail",
        "87%",
        "On Track"
      )}

      ${mockTableRow(
        "Properties",
        "79%",
        "Attention"
      )}

    </section>
  `;
}


/* =========================================================
   NAVIGATION
========================================================= */

function navigateTo(page) {

  currentPage = page;

  let content = "";


  if (currentRole === "ambassador") {

    if (page === "home") {
      content = ambassadorHome();
    }

    if (page === "performance") {
      content = performancePage();
    }

    if (page === "assessments") {
      content = assessmentsPage();
    }

    if (page === "actions") {
      content = actionsPage();
    }

    if (page === "training") {
      content = trainingPage();
    }

    if (page === "knowledge") {
      content = knowledgePage();
    }

    if (page === "checks") {
      content = knowledgeChecksPage();
    }

    if (page === "profile") {
      content = ambassadorProfilePage();
    }

    if (page === "onboarding") {
      content = onboardingPage();
    }

    if (page === "acquisition") {
      content = acquisitionPage();
    }

    if (page === "recognition") {
      content = recognitionPage();
    }

  }


  if (currentRole === "manager") {

    if (page === "home") {
      content = managerHome();
    }

    if (page === "team-performance") {
      content = managerGenericPage(
        "Team Performance",
        "Quality and performance across your stores and Ambassadors."
      );
    }

    if (page === "team-assessments") {
      content = managerGenericPage(
        "Assessments",
        "Monitor completed and outstanding assessments."
      );
    }

    if (page === "team-actions") {
      content = managerGenericPage(
        "Actions",
        "Track interventions and follow-up actions."
      );
    }

    if (page === "training-overview") {
      content = managerGenericPage(
        "Training Overview",
        "Training completion and overdue learning."
      );
    }

    if (page === "knowledge-gaps") {
      content = managerGenericPage(
        "Knowledge Gaps",
        "Identify recurring knowledge weaknesses."
      );
    }

    if (page === "ambassadors") {
      content = managerGenericPage(
        "Ambassadors",
        "Your active Ambassador population."
      );
    }

    if (page === "manager-onboarding") {
      content = managerOnboardingPage();
    }

    if (page === "manager-acquisition") {
      content = managerGenericPage(
        "Acquisition",
        "Individual and store acquisition performance."
      );
    }

    if (page === "manager-recognition") {
      content = managerGenericPage(
        "Recognition",
        "Identify and recognise high-performing Ambassadors."
      );
    }

  }


  if (currentRole === "service") {

    if (page === "home") {
      content = serviceHome();
    }

    if (page === "group-performance") {
      content = serviceGenericPage(
        "Performance",
        "SERVICE DELIVERY"
      );
    }

    if (page === "audit") {
      content = serviceGenericPage(
        "Audit & Service Pulse",
        "SERVICE DELIVERY"
      );
    }

    if (page === "group-actions") {
      content = serviceGenericPage(
        "Actions",
        "SERVICE DELIVERY"
      );
    }

    if (page === "group-training") {
      content = serviceGenericPage(
        "Training",
        "TRAINING & KNOWLEDGE"
      );
    }

    if (page === "group-knowledge") {
      content = serviceGenericPage(
        "Knowledge",
        "TRAINING & KNOWLEDGE"
      );
    }

    if (page === "group-gaps") {
      content = serviceGenericPage(
        "Knowledge Gaps",
        "TRAINING & KNOWLEDGE"
      );
    }

    if (page === "group-ambassadors") {
      content = serviceGenericPage(
        "Ambassadors",
        "AMBASSADOR PROGRAM"
      );
    }

    if (page === "group-onboarding") {
      content = managerOnboardingPage();
    }

    if (page === "group-acquisition") {
      content = serviceGenericPage(
        "Acquisition",
        "AMBASSADOR PROGRAM"
      );
    }

    if (page === "group-recognition") {
      content = serviceGenericPage(
        "Recognition",
        "AMBASSADOR PROGRAM"
      );
    }

    if (page === "ai-agents") {
      content = aiAgentsPage();
    }

    if (page === "integrations") {
      content = integrationsPage();
    }

    if (page === "identity") {
      content = identityPage();
    }

  }


  renderShell(content);
}


/* =========================================================
   ROLE ENTRY
========================================================= */

function showAmbassador() {

  currentRole = "ambassador";
  currentPage = "home";

  navigateTo("home");
}


function showManager() {

  currentRole = "manager";
  currentPage = "home";

  navigateTo("home");
}


function showServiceDelivery() {

  currentRole = "service";
  currentPage = "home";

  navigateTo("home");
}


/* =========================================================
   UI HELPERS
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

      <p class="content-subtitle">
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
    <div class="dashboard-card metric-card">

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


function assessmentRow(
  title,
  date,
  score,
  status,
  colour,
  showAgent = false
) {

  return `
    <div class="assessment-row">

      <div>

        <strong>
          ${title}
        </strong>

        <p>
          ${date}
        </p>

      </div>

      <span class="score-pill ${colour}">
        ${score}
      </span>

      <span class="assessment-status">
        ${status}
      </span>

      ${
        showAgent
          ? `
            <button
              class="small-button"
              onclick="runAllAgents()"
            >
              Analyse
            </button>
          `
          : `
            <button class="small-button">
              View
            </button>
          `
      }

    </div>
  `;
}


function interactionCard() {

  return `
    <div class="interaction-card">

      <div class="interaction-top">

        <div>

          <span class="interaction-label">
            Demo Interaction
          </span>

          <h4>
            ${demoInteraction.id}
          </h4>

        </div>

        <span class="channel-badge">
          ${demoInteraction.channel}
        </span>

      </div>


      <div class="interaction-grid">

        <div>
          <span>Agent</span>
          <strong>${demoInteraction.agent}</strong>
        </div>

        <div>
          <span>Customer</span>
          <strong>${demoInteraction.customer}</strong>
        </div>

        <div>
          <span>Process</span>
          <strong>${demoInteraction.process}</strong>
        </div>

        <div>
          <span>Brand</span>
          <strong>${demoInteraction.brand}</strong>
        </div>

      </div>

    </div>
  `;
}


function actionItem(
  title,
  badge,
  page
) {

  return `
    <div
      class="list-item clickable"
      onclick="navigateTo('${page}')"
    >

      <div>
        <strong>
          ${title}
        </strong>
      </div>

      <span class="badge amber">
        ${badge}
      </span>

    </div>
  `;
}


function fullActionRow(
  title,
  description,
  badge,
  colour
) {

  return `
    <div class="action-row">

      <div class="action-marker ${colour}"></div>

      <div class="action-content">

        <strong>
          ${title}
        </strong>

        <p>
          ${description}
        </p>

      </div>

      <span class="badge ${colour}">
        ${badge}
      </span>

      <button class="small-button">
        Open
      </button>

    </div>
  `;
}


function trainingRow(
  title,
  due,
  status
) {

  return `
    <div class="training-row">

      <div>

        <strong>
          ${title}
        </strong>

        <p>
          ${due}
        </p>

      </div>

      <span class="badge">
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
  type,
  updated
) {

  return `
    <div class="knowledge-item">

      <div>

        <strong>
          ${title}
        </strong>

        <p>
          ${type} · ${updated}
        </p>

      </div>

      <button class="small-button">
        Open
      </button>

    </div>
  `;
}


function onboardingStep(
  title,
  detail,
  complete,
  current = false
) {

  return `
    <div class="onboarding-step">

      <div class="step-dot ${
        complete
          ? "complete"
          : current
            ? "current"
            : ""
      }">

        ${
          complete
            ? "✓"
            : ""
        }

      </div>

      <div class="step-content">

        <strong>
          ${title}
        </strong>

        <p>
          ${detail}
        </p>

      </div>

      ${
        current
          ? `
            <button class="primary-small">
              Start
            </button>
          `
          : ""
      }

    </div>
  `;
}


function awardCard(
  title,
  date
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
        ${date}
      </p>

    </section>
  `;
}


function storeBar(
  name,
  value
) {

  return `
    <div class="store-bar">

      <span>
        ${name}
      </span>

      <div class="bar-track">

        <div
          class="bar-fill"
          style="width:${value}%"
        ></div>

      </div>

      <strong>
        ${value}%
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


function onboardingPerson(
  name,
  location,
  stage,
  progress
) {

  return `
    <div class="attention-row">

      <div>

        <strong>
          ${name}
        </strong>

        <p>
          ${location}
        </p>

      </div>

      <span class="badge amber">
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


function mockTableRow(
  name,
  score,
  status
) {

  return `
    <div class="mock-table-row">

      <strong>
        ${name}
      </strong>

      <span>
        ${score}
      </span>

      <span>
        ${status}
      </span>

    </div>
  `;
}


function agentCard(
  name,
  description,
  status
) {

  return `
    <section class="dashboard-card agent-card">

      <div class="agent-card-top">

        <div class="agent-symbol">
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
  description,
  status
) {

  return `
    <section class="dashboard-card integration-card">

      <div>

        <span class="section-label">
          INTEGRATION
        </span>

        <h3>
          ${name}
        </h3>

        <p>
          ${description}
        </p>

      </div>

      <span class="integration-status">
        ${status}
      </span>

    </section>
  `;
}


/* =========================================================
   AI AGENT RESULT UI
========================================================= */

function showAgentResult(
  title,
  result
) {

  const output =
    document.getElementById("agent-output");

  if (!output) {
    return;
  }

  output.classList.remove(
    "empty-state"
  );


  if (
    title ===
    "Evaluation Agent"
  ) {

    output.innerHTML = `
      <div class="result-header">

        <div>

          <span class="section-label">
            EVALUATION AGENT
          </span>

          <h3>
            ${result.result}
          </h3>

        </div>

        <span class="result-status">
          ${result.score}%
        </span>

      </div>


      <div class="score-grid">

        ${resultScore(
          "Quality Score",
          `${result.score}%`
        )}

        ${resultScore(
          "Agent",
          result.agent
        )}

        ${resultScore(
          "Interaction",
          result.interactionId
        )}

        ${resultScore(
          "Result",
          result.result
        )}

      </div>


      <div class="result-section">

        <h4>
          Summary
        </h4>

        <p>
          ${result.summary}
        </p>

      </div>


      <div class="result-section">

        <h4>
          Findings
        </h4>

        ${result.findings
          .map(finding => findingRow(
            finding.criterion,
            finding.evidence,
            finding.result
          ))
          .join("")}

      </div>
    `;

    return;
  }


  if (
    title ===
    "SOP Agent"
  ) {

    output.innerHTML = `
      <div class="result-header">

        <div>

          <span class="section-label">
            SOP AGENT
          </span>

          <h3>
            ${result.sop}
          </h3>

        </div>

        <span class="result-status">
          ${result.compliance}%
        </span>

      </div>


      <div class="score-grid">

        ${resultScore(
          "SOP Compliance",
          `${result.compliance}%`
        )}

        ${resultScore(
          "Result",
          result.result
        )}

        ${resultScore(
          "Missed Steps",
          result.missedSteps.length
        )}

      </div>


      ${result.steps
        .map(step => findingRow(
          step.step,
          step.evidence,
          step.status
        ))
        .join("")}
    `;

    return;
  }


  if (
    title ===
    "Compliance Agent"
  ) {

    output.innerHTML = `
      <div class="result-header">

        <div>

          <span class="section-label">
            COMPLIANCE AGENT
          </span>

          <h3>
            ${result.result}
          </h3>

        </div>

        <span class="result-status">
          ${result.complianceScore}%
        </span>

      </div>


      <div class="score-grid">

        ${resultScore(
          "Compliance",
          `${result.complianceScore}%`
        )}

        ${resultScore(
          "Critical Failure",
          result.criticalFailure
            ? "Yes"
            : "No"
        )}

      </div>


      ${result.findings
        .map(finding => findingRow(
          finding.rule,
          finding.evidence,
          finding.result
        ))
        .join("")}
    `;

    return;
  }


  if (
    title ===
    "Combined SHARE Lens Analysis"
  ) {

    output.innerHTML = `
      <div class="result-header">

        <div>

          <span class="section-label">
            SHARE LENS ANALYSIS
          </span>

          <h3>
            ${result.finalStatus}
          </h3>

        </div>

        <span class="result-status">
          ${result.overallScore}%
        </span>

      </div>


      <div class="score-grid">

        ${resultScore(
          "Overall Score",
          `${result.overallScore}%`
        )}

        ${resultScore(
          "Evaluation",
          `${result.evaluation.score}%`
        )}

        ${resultScore(
          "SOP Compliance",
          `${result.sop.compliance}%`
        )}

        ${resultScore(
          "Compliance",
          `${result.compliance.complianceScore}%`
        )}

      </div>


      <div class="result-section">

        <h4>
          Summary
        </h4>

        <p>
          ${result.evaluation.summary}
        </p>

      </div>


      <div class="result-section">

        <h4>
          Key Findings
        </h4>

        ${result.evaluation.findings
          .map(finding => findingRow(
            finding.criterion,
            finding.evidence,
            finding.result
          ))
          .join("")}

      </div>


      <div class="recommendation-card">

        <span>
          Recommended Action
        </span>

        <strong>
          ${result.recommendedAction}
        </strong>

      </div>
    `;
  }
}


function resultScore(
  label,
  value
) {

  return `
    <div class="score-card">

      <span>
        ${label}
      </span>

      <strong>
        ${value}
      </strong>

    </div>
  `;
}


function findingRow(
  title,
  evidence,
  result
) {

  return `
    <div class="finding-row">

      <div>

        <strong>
          ${title}
        </strong>

        <p>
          ${evidence}
        </p>

      </div>

      <span class="finding-status ${
        result.toLowerCase()
      }">

        ${result}

      </span>

    </div>
  `;
}


/* =========================================================
   AI ORCHESTRATION ANIMATION
========================================================= */

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

  const messageElement =
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


  if (messageElement) {

    messageElement.textContent =
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


function runEvaluationAgent() {

  showAgentResult(
    "Evaluation Agent",
    runEvaluation(
      demoInteraction
    )
  );
}


function runSopAgent() {

  showAgentResult(
    "SOP Agent",
    runSopCheck(
      demoInteraction
    )
  );
}


function runComplianceAgent() {

  showAgentResult(
    "Compliance Agent",
    runComplianceCheck(
      demoInteraction
    )
  );
}


function runAllAgents() {

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

      <div class="pipeline-header">

        <span class="section-label">
          SHARE LENS AGENT ORCHESTRATION
        </span>

        <h3>
          Running quality analysis
        </h3>

        <p>
          SHARE Lens is evaluating the interaction
          across multiple specialist AI agents.
        </p>

      </div>


      <div class="pipeline-steps">

        ${pipelineStep(
          "interaction",
          "1",
          "Interaction",
          "Preparing data...",
          "active"
        )}

        <div class="pipeline-line"></div>

        ${pipelineStep(
          "evaluation",
          "2",
          "Evaluation Agent",
          "Waiting",
          "waiting"
        )}

        <div class="pipeline-line"></div>

        ${pipelineStep(
          "sop",
          "3",
          "SOP Agent",
          "Waiting",
          "waiting"
        )}

        <div class="pipeline-line"></div>

        ${pipelineStep(
          "compliance",
          "4",
          "Compliance Agent",
          "Waiting",
          "waiting"
        )}

        <div class="pipeline-line"></div>

        ${pipelineStep(
          "result",
          "5",
          "Combined Analysis",
          "Waiting",
          "waiting"
        )}

      </div>


      <div class="pipeline-footer">

        <div class="processing-dot"></div>

        <span id="pipeline-message">
          Preparing interaction for analysis...
        </span>

      </div>

    </div>
  `;


  setTimeout(() => {

    completeStep(
      "interaction",
      "Interaction ready"
    );

    activateStep(
      "evaluation",
      "Evaluating quality criteria...",
      "Evaluation Agent is reviewing the interaction."
    );

  }, 700);


  setTimeout(() => {

    completeStep(
      "evaluation",
      "Evaluation complete"
    );

    activateStep(
      "sop",
      "Checking SOP adherence...",
      "SOP Agent is validating required process steps."
    );

  }, 1800);


  setTimeout(() => {

    completeStep(
      "sop",
      "SOP review complete"
    );

    activateStep(
      "compliance",
      "Checking compliance controls...",
      "Compliance Agent is reviewing mandatory controls."
    );

  }, 2900);


  setTimeout(() => {

    completeStep(
      "compliance",
      "Compliance review complete"
    );

    activateStep(
      "result",
      "Combining agent results...",
      "SHARE Lens is consolidating findings and recommendations."
    );

  }, 4000);


  setTimeout(() => {

    completeStep(
      "result",
      "Analysis complete"
    );

    showAgentResult(
      "Combined SHARE Lens Analysis",
      analyseInteraction(
        demoInteraction
      )
    );

  }, 5200);
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
      class="pipeline-step ${state}"
      id="step-${id}"
    >

      <div class="pipeline-icon">
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


/* =========================================================
   WINDOW FUNCTIONS
========================================================= */

window.showAmbassador =
  showAmbassador;

window.showManager =
  showManager;

window.showServiceDelivery =
  showServiceDelivery;

window.showLogin =
  showLogin;

window.navigateTo =
  navigateTo;

window.runEvaluationAgent =
  runEvaluationAgent;

window.runSopAgent =
  runSopAgent;

window.runComplianceAgent =
  runComplianceAgent;

window.runAllAgents =
  runAllAgents;
