import {
  MANAGEMENT_TARGETS,
  BU_LEAD_DASHBOARD,
  PROGRAMME_LEAD_DASHBOARD,
  MANAGEMENT_AMBASSADORS,
  MANAGEMENT_CAMPAIGNS,
  MANAGEMENT_TRAINING,
  MANAGEMENT_KNOWLEDGE_CHECKS,
  MANAGEMENT_ONBOARDING,
  MANAGEMENT_SUBMISSIONS,
  MANAGEMENT_RECOGNITION
} from "../data/managementData.js";

import {
  getCreatedCampaigns,
  createManagementCampaign,
  recordAmbassadorReview,
  getAmbassadorReviews
} from "../services/managementActionService.js";


let managementCampaignComposerOpen = false;


/* =========================================================
   COMPONENT: Management Dashboard Renderer
   Owner: Pradip

   PURPOSE:
   Renders the BU Lead and Programme Lead home experiences
   from a shared production-shaped data contract.

   BUSINESS MEANING:
   Both roles use the same programme KPI framework but at
   different organisational scopes.

   INPUTS:
   Management dashboard data contract.

   OUTPUTS:
   KPI summary, organisational drill-down, attention areas,
   campaigns, training, Service Pulse, recognition and
   submission summaries.

   PRODUCTION DATA REQUIREMENT:
   Replace prototype managementData.js values with repository
   / API responses. UI markup should not change when the
   persistence layer moves to PostgreSQL / Aurora, Databricks
   or approved enterprise sources.

   CHANGE IMPACT:
   BU Lead / Team Lead home and Marian / Programme Lead home.
========================================================= */

function formatNumber(value) {
  return Number(value).toLocaleString();
}


function statusClass(value, target, higherIsBetter = true) {

  const good =
    higherIsBetter
      ? value >= target
      : value <= target;

  return good
    ? "good"
    : "attention";
}


function managementKpiCard(
  label,
  value,
  target,
  suffix = "",
  route = "",
  helper = ""
) {

  const numeric =
    typeof value === "number"
      ? value
      : Number(value);

  const display =
    suffix === "%"
      ? `${numeric.toFixed(
          Number.isInteger(numeric)
            ? 0
            : 1
        )}%`
      : suffix
        ? `${formatNumber(numeric)}${suffix}`
        : formatNumber(numeric);

  const targetDisplay =
    target == null
      ? ""
      : `Target ${target}${suffix === "%" ? "%" : ""}`;

  return `
    <button
      class="v12-management-kpi"
      ${route ? `onclick="navigateTo('${route}')"` : ""}
    >
      <div class="v12-management-kpi-top">
        <span>${label}</span>
        ${targetDisplay
          ? `<em>${targetDisplay}</em>`
          : ""
        }
      </div>

      <strong>${display}</strong>

      <div class="v12-management-kpi-bottom">
        <span class="${
          target == null
            ? ""
            : statusClass(
                numeric,
                target
              )
        }">
          ${
            target == null
              ? helper
              : numeric >= target
                ? "On target"
                : "Below target"
          }
        </span>

        ${route
          ? "<span>View →</span>"
          : ""
        }
      </div>
    </button>
  `;
}


function managementHeader(
  eyebrow,
  title,
  subtitle,
  scope
) {

  return `
    <div class="v12-management-page-head">

      <div>
        <span class="v12-management-eyebrow">
          ${eyebrow}
        </span>

        <h1>${title}</h1>

        <p>${subtitle}</p>
      </div>

      <div class="v12-management-scope">
        <span>Current scope</span>
        <strong>${scope}</strong>
      </div>

    </div>
  `;
}


function managementFilterBar(isProgrammeLead) {

  return `
    <section class="v12-management-filterbar">

      ${isProgrammeLead
        ? `
          <label>
            <span>Country</span>
            <select>
              <option>All Countries</option>
              <option>UAE</option>
              <option>KSA</option>
              <option>Egypt</option>
              <option>Oman</option>
            </select>
          </label>
        `
        : ""
      }

      <label>
        <span>Business Unit</span>
        <select>
          <option>
            ${isProgrammeLead
              ? "All Business Units"
              : "Entertainment"
            }
          </option>
        </select>
      </label>

      <label>
        <span>Brand</span>
        <select>
          <option>All Brands</option>
        </select>
      </label>

      <label>
        <span>Period</span>
        <select>
          <option>Month to Date</option>
          <option>Quarter to Date</option>
          <option>Year to Date</option>
        </select>
      </label>

    </section>
  `;
}


function attentionCard(items, route) {

  return `
    <section class="dashboard-card v12-management-panel">

      <div class="v12-management-panel-head">
        <h2>REQUIRES ATTENTION</h2>

        <button
          class="small-button"
          onclick="navigateTo('${route}')"
        >
          View all
        </button>
      </div>

      <div class="v12-management-attention-list">
        ${items.map(item => `
          <button
            onclick="navigateTo('${item.route}')"
            class="v12-management-attention-row"
          >
            <span class="v12-severity ${item.severity.toLowerCase()}">
              ${item.severity}
            </span>

            <div>
              <strong>${item.title}</strong>
              <small>${item.detail}</small>
            </div>

            <span>→</span>
          </button>
        `).join("")}
      </div>

    </section>
  `;
}


function brandPerformanceTable(items, route) {

  return `
    <section class="dashboard-card v12-management-panel">

      <div class="v12-management-panel-head">
        <h2>PERFORMANCE BY BRAND</h2>

        <button
          class="small-button"
          onclick="navigateTo('${route}')"
        >
          View details
        </button>
      </div>

      <div class="v12-management-table">

        <div class="v12-management-table-head">
          <span>Brand</span>
          <span>Ambassadors</span>
          <span>Active</span>
          <span>SHARE Perf.</span>
          <span>Ambassador Perf.</span>
          <span>Sales Pen.</span>
          <span>Service Pulse</span>
        </div>

        ${items.map(item => `
          <div class="v12-management-table-row">
            <strong>${item.name}</strong>
            <span>${formatNumber(item.ambassadors)}</span>
            <span>${item.activeRate}%</span>
            <span>${item.sharePerformance}%</span>
            <span>${item.ambassadorPerformance}%</span>
            <span class="${statusClass(item.salesPenetration, MANAGEMENT_TARGETS.salesPenetration)}">
              ${item.salesPenetration}%
            </span>
            <span class="${statusClass(item.servicePulse, MANAGEMENT_TARGETS.servicePulse)}">
              ${item.servicePulse}%
            </span>
          </div>
        `).join("")}

      </div>

    </section>
  `;
}


function buPerformanceTable(items, route) {

  return `
    <section class="dashboard-card v12-management-panel">

      <div class="v12-management-panel-head">
        <h2>PERFORMANCE BY BUSINESS UNIT</h2>

        <button
          class="small-button"
          onclick="navigateTo('${route}')"
        >
          View details
        </button>
      </div>

      <div class="v12-management-table">

        <div class="v12-management-table-head">
          <span>Business Unit</span>
          <span>Ambassadors</span>
          <span>Active</span>
          <span>SHARE Perf.</span>
          <span>Ambassador Perf.</span>
          <span>Sales Pen.</span>
          <span>Service Pulse</span>
        </div>

        ${items.map(item => `
          <div class="v12-management-table-row">
            <strong>${item.name}</strong>
            <span>${formatNumber(item.ambassadors)}</span>
            <span>${item.activeRate}%</span>
            <span>${item.sharePerformance}%</span>
            <span>${item.ambassadorPerformance}%</span>
            <span class="${statusClass(item.salesPenetration, MANAGEMENT_TARGETS.salesPenetration)}">
              ${item.salesPenetration}%
            </span>
            <span class="${statusClass(item.servicePulse, MANAGEMENT_TARGETS.servicePulse)}">
              ${item.servicePulse}%
            </span>
          </div>
        `).join("")}

      </div>

    </section>
  `;
}


function campaignCard(data, route) {

  return `
    <section class="dashboard-card v12-management-panel">

      <div class="v12-management-panel-head">
        <h2>CAMPAIGNS & COMMUNICATIONS</h2>

        <button
          class="primary-small"
          onclick="navigateTo('${route}')"
        >
          + New campaign
        </button>
      </div>

      <div class="v12-management-mini-grid">
        <div>
          <span>Active campaigns</span>
          <strong>${data.active}</strong>
        </div>

        <div>
          <span>Participation</span>
          <strong>${data.participationRate}%</strong>
        </div>

        ${data.broadcasts != null
          ? `
            <div>
              <span>Broadcasts</span>
              <strong>${data.broadcasts}</strong>
            </div>

            <div>
              <span>Acknowledgement</span>
              <strong>${data.acknowledgementRate}%</strong>
            </div>
          `
          : `
            <div>
              <span>Submissions</span>
              <strong>${formatNumber(data.submissions)}</strong>
            </div>

            <div>
              <span>Participating stores</span>
              <strong>${formatNumber(data.participatingStores)}</strong>
            </div>
          `
        }

      </div>

    </section>
  `;
}


function trainingCard(data, route) {

  return `
    <section class="dashboard-card v12-management-panel">

      <div class="v12-management-panel-head">
        <h2>TRAINING & DEVELOPMENT</h2>

        <button
          class="small-button"
          onclick="navigateTo('${route}')"
        >
          View training
        </button>
      </div>

      <div class="v12-management-mini-grid">
        <div>
          <span>Online completion</span>
          <strong>${data.onlineCompletion}%</strong>
        </div>

        <div>
          <span>${data.inPersonSessions != null ? "In-person sessions" : "Physical sessions"}</span>
          <strong>${data.inPersonSessions ?? data.physicalSessions}</strong>
        </div>

        <div>
          <span>${data.peopleReached != null ? "People reached" : "Evaluation score"}</span>
          <strong>${data.peopleReached != null ? data.peopleReached : `${data.evaluationScore}/5`}</strong>
        </div>

        <div>
          <span>Knowledge score</span>
          <strong>${data.knowledgeScore}%</strong>
        </div>
      </div>

    </section>
  `;
}


function submissionCard(data, route) {

  const entries =
    Object.entries(data);

  return `
    <section class="dashboard-card v12-management-panel">

      <div class="v12-management-panel-head">
        <h2>FORMS & SUBMISSIONS</h2>

        <button
          class="small-button"
          onclick="navigateTo('${route}')"
        >
          Open hub
        </button>
      </div>

      <div class="v12-management-submission-grid">
        ${entries.map(([key, value]) => `
          <div>
            <span>${key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, char => char.toUpperCase())
            }</span>
            <strong>${formatNumber(value)}</strong>
          </div>
        `).join("")}
      </div>

    </section>
  `;
}


export function renderBULeadHomeV012() {

  const d =
    BU_LEAD_DASHBOARD;

  return `
    ${managementHeader(
      "BU LEAD",
      "Entertainment UAE Dashboard",
      "Manage Ambassador performance, participation, learning and programme activity across your brands.",
      d.scopeLabel
    )}

    ${managementFilterBar(false)}

    <div class="v12-management-kpi-grid">
      ${managementKpiCard("Total Ambassadors", d.totalAmbassadors, null, "", "ambassadors", "Current scope")}
      ${managementKpiCard("Active Rate", d.activeRate, MANAGEMENT_TARGETS.activeRate, "%", "ambassadors")}
      ${managementKpiCard("SHARE Performance", d.sharePerformance, MANAGEMENT_TARGETS.sharePerformance, "%", "team-performance")}
      ${managementKpiCard("Ambassador Performance", d.ambassadorPerformance, MANAGEMENT_TARGETS.ambassadorPerformance, "%", "team-performance")}
      ${managementKpiCard("SHARE Acquisition", d.acquisition, d.acquisitionTarget, "", "manager-acquisition")}
      ${managementKpiCard("Sales Penetration", d.salesPenetration, MANAGEMENT_TARGETS.salesPenetration, "%", "team-performance")}
      ${managementKpiCard("Service Pulse", d.servicePulse, MANAGEMENT_TARGETS.servicePulse, "%", "team-service-pulse")}
      ${managementKpiCard("Training Completion", d.trainingCompletion, MANAGEMENT_TARGETS.trainingCompletion, "%", "training-overview")}
    </div>

    <div class="v12-management-main-grid">
      ${brandPerformanceTable(d.brands, "team-performance")}
      ${attentionCard(d.requiresAttention, "team-attention")}
    </div>

    <div class="v12-management-secondary-grid">
      ${campaignCard(d.campaignSummary, "manager-communications")}
      ${trainingCard(d.trainingSummary, "training-overview")}
    </div>

    ${submissionCard(d.submissions, "manager-hub")}
  `;
}


export function renderProgrammeLeadHomeV012() {

  const d =
    PROGRAMME_LEAD_DASHBOARD;

  return `
    ${managementHeader(
      "PROGRAMME LEAD",
      "SHARE Ambassador Programme",
      "Cross-business, cross-market view of programme performance and where intervention is required.",
      d.scopeLabel
    )}

    ${managementFilterBar(true)}

    <div class="v12-management-kpi-grid">
      ${managementKpiCard("Total Ambassadors", d.totalAmbassadors, null, "", "group-ambassadors", "Current scope")}
      ${managementKpiCard("Active Rate", d.activeRate, MANAGEMENT_TARGETS.activeRate, "%", "group-ambassadors")}
      ${managementKpiCard("SHARE Performance", d.sharePerformance, MANAGEMENT_TARGETS.sharePerformance, "%", "group-performance")}
      ${managementKpiCard("Ambassador Performance", d.ambassadorPerformance, MANAGEMENT_TARGETS.ambassadorPerformance, "%", "group-performance")}
      ${managementKpiCard("SHARE Acquisition", d.acquisition, d.acquisitionTarget, "", "group-acquisition")}
      ${managementKpiCard("Sales Penetration", d.salesPenetration, MANAGEMENT_TARGETS.salesPenetration, "%", "group-performance")}
      ${managementKpiCard("Service Pulse", d.servicePulse, MANAGEMENT_TARGETS.servicePulse, "%", "service-pulse")}
      ${managementKpiCard("Training Completion", d.trainingCompletion, MANAGEMENT_TARGETS.trainingCompletion, "%", "group-training")}
    </div>

    <div class="v12-management-main-grid">
      ${buPerformanceTable(d.businessUnits, "group-performance")}
      ${attentionCard(d.requiresAttention, "group-attention")}
    </div>

    <div class="v12-management-secondary-grid">
      ${campaignCard(d.campaignSummary, "group-communications")}
      ${trainingCard(d.trainingSummary, "group-training")}

      <section class="dashboard-card v12-management-panel">
        <div class="v12-management-panel-head">
          <h2>SERVICE PULSE</h2>

          <button
            class="small-button"
            onclick="navigateTo('service-pulse')"
          >
            Open Service Pulse
          </button>
        </div>

        <div class="v12-management-mini-grid">
          <div>
            <span>Average score</span>
            <strong>${d.servicePulseSummary.score}%</strong>
          </div>

          <div>
            <span>Assessments</span>
            <strong>${formatNumber(d.servicePulseSummary.assessments)}</strong>
          </div>

          <div>
            <span>Compliant stores</span>
            <strong>${d.servicePulseSummary.compliantStores}%</strong>
          </div>
        </div>
      </section>

      <section class="dashboard-card v12-management-panel">
        <div class="v12-management-panel-head">
          <h2>REWARDS & RECOGNITION</h2>

          <button
            class="small-button"
            onclick="navigateTo('group-recognition')"
          >
            View all
          </button>
        </div>

        <div class="v12-management-mini-grid">
          <div>
            <span>Spark recognition</span>
            <strong>${formatNumber(d.recognition.sparks)}</strong>
          </div>

          <div>
            <span>Service Pulse winners</span>
            <strong>${d.recognition.servicePulseWinners}</strong>
          </div>

          <div>
            <span>Top Ambassadors</span>
            <strong>${d.recognition.topAmbassadors}</strong>
          </div>
        </div>
      </section>
    </div>

    ${submissionCard(d.submissions, "group-hub")}
  `;
}
