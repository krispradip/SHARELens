import {
  KPI_CARD_DEFINITIONS,
  SCORE_FAMILIES
} from "../data/platformData.js";

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
  getAmbassadorReviews,
  getCreatedTrainingEvents,
  createTrainingEvent
} from "../services/managementActionService.js";


let managementCampaignComposerOpen = false;
let managementTrainingEventComposerOpen = false;
let managementKnowledgeCheckModalOpen = false;


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


function managementCardDefinition(
  label
) {

  const definitions = {
    "Total Ambassadors":
      KPI_CARD_DEFINITIONS.totalAmbassadors,
    "Ambassadors":
      KPI_CARD_DEFINITIONS.totalAmbassadors,
    "Active":
      KPI_CARD_DEFINITIONS.activeRate,
    "Active Rate":
      KPI_CARD_DEFINITIONS.activeRate,
    "SHARE Performance":
      KPI_CARD_DEFINITIONS.sharePerformance,
    "Ambassador Performance":
      KPI_CARD_DEFINITIONS.ambassadorPerformance,
    "SHARE Acquisition":
      KPI_CARD_DEFINITIONS.acquisition,
    "Members Acquired":
      KPI_CARD_DEFINITIONS.acquisition,
    "Sales Penetration":
      KPI_CARD_DEFINITIONS.salesPenetration,
    "Service Pulse":
      KPI_CARD_DEFINITIONS.servicePulse,
    "Training Completion":
      KPI_CARD_DEFINITIONS.trainingCompletion,
    "Current Knowledge Score":
      KPI_CARD_DEFINITIONS.knowledgeScore,
    "Knowledge Score":
      KPI_CARD_DEFINITIONS.knowledgeScore
  };

  return definitions[label] || "";
}


function managementInfoTooltip(
  text
) {

  if (!text) {
    return "";
  }

  return `
    <span
      class="v12-tooltip-wrap v12-management-tooltip-wrap"
      onclick="event.stopPropagation()"
    >
      <button
        type="button"
        class="v12-tooltip-trigger"
        aria-label="More information"
        onclick="event.stopPropagation()"
      >
        i
      </button>

      <span class="v12-tooltip-content">
        ${text}
      </span>
    </span>
  `;
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

  const definition =
    managementCardDefinition(
      label
    );

  return `
    <div
      class="v12-management-kpi ${route ? "is-clickable" : ""}"
      ${route
        ? `
          role="button"
          tabindex="0"
          onclick="navigateTo('${route}')"
          onkeydown="if(event.key==='Enter' || event.key===' '){event.preventDefault();navigateTo('${route}')}"
        `
        : ""
      }
    >
      <div class="v12-management-kpi-top">

        <span class="v12-management-kpi-label">
          ${label}
          ${managementInfoTooltip(
            definition
          )}
        </span>

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
    </div>
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


/* =========================================================
   MANAGEMENT DRILL-DOWN PAGES
   Owner: Pradip

   PURPOSE:
   Working operational layouts for BU Lead and Programme
   Lead personas.

   BUSINESS MEANING:
   These pages turn the management dashboard into a usable
   operating workspace rather than a collection of summary
   cards.

   PRODUCTION DATA REQUIREMENT:
   Read models should come from APIs / repositories. Actions
   should write through authenticated services to the
   approved transactional database and external systems.
========================================================= */

function scopedAmbassadors(
  programmeLead
) {

  return programmeLead
    ? MANAGEMENT_AMBASSADORS
    : MANAGEMENT_AMBASSADORS
        .filter(
          item =>
            item.bu ===
            "Entertainment"
        );
}


function pageShell(
  programmeLead,
  eyebrow,
  title,
  subtitle,
  body
) {

  const scope =
    programmeLead
      ? PROGRAMME_LEAD_DASHBOARD.scopeLabel
      : BU_LEAD_DASHBOARD.scopeLabel;

  return `
    ${managementHeader(
      eyebrow,
      title,
      subtitle,
      scope
    )}

    ${managementFilterBar(
      programmeLead
    )}

    ${body}
  `;
}


function attentionSummaryGrid(
  programmeLead
) {

  const ambassadors =
    scopedAmbassadors(
      programmeLead
    );

  const inactivity =
    ambassadors.filter(
      item =>
        item.activity !==
        "Active"
    ).length;

  const belowSales =
    ambassadors.filter(
      item =>
        item.salesPenetration <
        MANAGEMENT_TARGETS
          .salesPenetration
    ).length;

  const belowPulse =
    ambassadors.filter(
      item =>
        item.servicePulse <
        MANAGEMENT_TARGETS
          .servicePulse
    ).length;

  const overdueTraining =
    ambassadors.filter(
      item =>
        item.trainingCompletion <
        MANAGEMENT_TARGETS
          .trainingCompletion
    ).length;

  return `
    <div class="v12-management-kpi-grid">
      ${managementKpiCard(
        "Inactivity Reviews",
        inactivity,
        null,
        "",
        programmeLead
          ? "group-ambassadors"
          : "ambassadors",
        "Human review required"
      )}

      ${managementKpiCard(
        "Below Sales Target",
        belowSales,
        null,
        "",
        programmeLead
          ? "group-performance"
          : "team-performance",
        "Ambassadors in scope"
      )}

      ${managementKpiCard(
        "Below Service Pulse",
        belowPulse,
        null,
        "",
        "service-pulse",
        "Below 85% threshold"
      )}

      ${managementKpiCard(
        "Training Follow-up",
        overdueTraining,
        null,
        "",
        programmeLead
          ? "group-training"
          : "training-overview",
        "Below completion target"
      )}
    </div>
  `;
}


export function renderManagementPerformanceV012(
  programmeLead = false
) {

  const source =
    programmeLead
      ? PROGRAMME_LEAD_DASHBOARD
      : BU_LEAD_DASHBOARD;

  const hierarchy =
    programmeLead
      ? source.businessUnits
      : source.brands;

  const label =
    programmeLead
      ? "Business Unit"
      : "Brand";

  return pageShell(
    programmeLead,
    "PERFORMANCE",
    programmeLead
      ? "Programme Performance"
      : "BU Programme Performance",
    "Review the same programme KPI framework used by Ambassadors, rolled up to your authorised organisational scope.",
    `
      <div class="v12-management-kpi-grid">
        ${managementKpiCard(
          "SHARE Performance",
          source.sharePerformance,
          MANAGEMENT_TARGETS.sharePerformance,
          "%"
        )}

        ${managementKpiCard(
          "Ambassador Performance",
          source.ambassadorPerformance,
          MANAGEMENT_TARGETS.ambassadorPerformance,
          "%"
        )}

        ${managementKpiCard(
          "Sales Penetration",
          source.salesPenetration,
          MANAGEMENT_TARGETS.salesPenetration,
          "%"
        )}

        ${managementKpiCard(
          "Service Pulse",
          source.servicePulse,
          MANAGEMENT_TARGETS.servicePulse,
          "%"
        )}

        ${managementKpiCard(
          "Training Completion",
          source.trainingCompletion,
          MANAGEMENT_TARGETS.trainingCompletion,
          "%"
        )}

        ${managementKpiCard(
          "Knowledge Score",
          source.knowledgeScore,
          MANAGEMENT_TARGETS.knowledgeScore,
          "%"
        )}
      </div>

      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>
            PERFORMANCE BY ${label.toUpperCase()}
          </h2>

          <span class="v12-data-source-note">
            Prototype read model
          </span>
        </div>

        <div class="v12-management-table">

          <div class="v12-management-table-head">
            <span>${label}</span>
            <span>Ambassadors</span>
            <span>Active</span>
            <span>SHARE Perf.</span>
            <span>Ambassador Perf.</span>
            <span>Sales Pen.</span>
            <span>Service Pulse</span>
          </div>

          ${hierarchy
            .map(
              item => `
                <div class="v12-management-table-row">
                  <strong>${item.name}</strong>
                  <span>${formatNumber(item.ambassadors)}</span>
                  <span>${item.activeRate}%</span>
                  <span>${item.sharePerformance}%</span>
                  <span>${item.ambassadorPerformance}%</span>
                  <span class="${statusClass(
                    item.salesPenetration,
                    MANAGEMENT_TARGETS.salesPenetration
                  )}">
                    ${item.salesPenetration}%
                  </span>
                  <span class="${statusClass(
                    item.servicePulse,
                    MANAGEMENT_TARGETS.servicePulse
                  )}">
                    ${item.servicePulse}%
                  </span>
                </div>
              `
            )
            .join("")}

        </div>

      </section>
    `
  );
}


export function renderManagementAttentionV012(
  programmeLead = false
) {

  const source =
    programmeLead
      ? PROGRAMME_LEAD_DASHBOARD
      : BU_LEAD_DASHBOARD;

  return pageShell(
    programmeLead,
    "PERFORMANCE",
    "Requires Attention",
    "Focus only on areas where the programme can take action, using controlled KPI gaps and activity signals.",
    `
      ${attentionSummaryGrid(
        programmeLead
      )}

      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>PRIORITY ACTION QUEUE</h2>
        </div>

        <div class="v12-management-attention-list">

          ${source
            .requiresAttention
            .map(
              item => `
                <button
                  class="v12-management-attention-row large"
                  onclick="navigateTo('${item.route}')"
                >
                  <span class="v12-severity ${item.severity.toLowerCase()}">
                    ${item.severity}
                  </span>

                  <div>
                    <strong>${item.title}</strong>
                    <small>${item.detail}</small>
                  </div>

                  <span>Review →</span>
                </button>
              `
            )
            .join("")}

        </div>

      </section>
    `
  );
}


export function renderManagementAmbassadorsV012(
  programmeLead = false
) {

  const items =
    scopedAmbassadors(
      programmeLead
    );

  const reviews =
    getAmbassadorReviews();

  return pageShell(
    programmeLead,
    "PEOPLE & AMBASSADORS",
    "Ambassadors",
    "Monitor active status, programme performance and intervention needs at individual Ambassador level.",
    `
      <div class="v12-management-kpi-grid">
        ${managementKpiCard(
          "Ambassadors",
          items.length,
          null,
          "",
          "",
          "Visible in current scope"
        )}

        ${managementKpiCard(
          "Active",
          items.filter(
            item =>
              item.activity ===
              "Active"
          ).length,
          null,
          "",
          "",
          "Based on Last Login"
        )}

        ${managementKpiCard(
          "Inactivity Review",
          items.filter(
            item =>
              item.activity !==
              "Active"
          ).length,
          null,
          "",
          "",
          "Human review required"
        )}

        ${managementKpiCard(
          "Reviews Recorded",
          reviews.length,
          null,
          "",
          "",
          "Prototype workflow"
        )}
      </div>

      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>AMBASSADOR POPULATION</h2>
        </div>

        <div class="v12-ambassador-table">

          <div class="v12-ambassador-table-head">
            <span>Ambassador</span>
            <span>Brand / Store</span>
            <span>Last Login</span>
            <span>Activity</span>
            <span>SHARE Perf.</span>
            <span>Ambassador Perf.</span>
            <span>Sales Pen.</span>
            <span>Service Pulse</span>
            <span></span>
          </div>

          ${items.map(item => `
            <div class="v12-ambassador-table-row">

              <div>
                <strong>${item.name}</strong>
                <small>${item.staffId} · ${item.bu}</small>
              </div>

              <div>
                <strong>${item.brand}</strong>
                <small>${item.store}</small>
              </div>

              <span>${item.lastLogin}</span>

              <span class="v12-activity-chip ${
                item.activity ===
                "Active"
                  ? "active"
                  : "review"
              }">
                ${item.activity}
              </span>

              <strong>${item.sharePerformance}%</strong>
              <strong>${item.ambassadorPerformance}%</strong>

              <strong class="${statusClass(
                item.salesPenetration,
                MANAGEMENT_TARGETS.salesPenetration
              )}">
                ${item.salesPenetration}%
              </strong>

              <strong class="${statusClass(
                item.servicePulse,
                MANAGEMENT_TARGETS.servicePulse
              )}">
                ${item.servicePulse}%
              </strong>

              <button
                class="small-button"
                onclick="reviewManagementAmbassadorV012('${item.id}')"
              >
                Review
              </button>

            </div>
          `).join("")}

        </div>

      </section>
    `
  );
}


export function renderManagementLifecycleV012(
  programmeLead = false
) {

  const inactivity =
    scopedAmbassadors(
      programmeLead
    ).filter(
      item =>
        item.activity !==
        "Active"
    );

  return pageShell(
    programmeLead,
    "PEOPLE & AMBASSADORS",
    "Onboarding & Offboarding",
    "Manage the Ambassador lifecycle while keeping offboarding a human-controlled decision.",
    `
      <div class="v12-management-lifecycle-grid">

        <section class="dashboard-card v12-management-panel">

          <div class="v12-management-panel-head">
            <h2>ONBOARDING</h2>

            <button class="primary-small">
              + Invite Ambassador
            </button>
          </div>

          ${MANAGEMENT_ONBOARDING
            .map(
              item => `
                <div class="v12-lifecycle-card">

                  <div class="v12-lifecycle-card-head">
                    <div>
                      <strong>${item.name}</strong>
                      <span>${item.brand} · ${item.store}</span>
                    </div>

                    <span class="v12-activity-chip active">
                      ${item.status}
                    </span>
                  </div>

                  <div class="v12-lifecycle-step-grid">
                    ${[
                      ["Account", item.account],
                      ["First Login", item.firstLogin],
                      ["Training", item.training],
                      ["Knowledge", item.knowledge],
                      ["Personal QR", item.personalQr]
                    ].map(step => `
                      <div>
                        <span>${step[0]}</span>
                        <strong>${step[1]}</strong>
                      </div>
                    `).join("")}
                  </div>

                </div>
              `
            )
            .join("")}

        </section>

        <section class="dashboard-card v12-management-panel">

          <div class="v12-management-panel-head">
            <h2>INACTIVITY REVIEW</h2>
          </div>

          <p class="v12-management-note">
            More than 60 days without a login is a review trigger only. Do not automatically offboard the Ambassador.
          </p>

          ${inactivity.length
            ? inactivity.map(item => `
                <div class="v12-inactivity-row">
                  <div>
                    <strong>${item.name}</strong>
                    <span>${item.brand} · Last login ${item.lastLogin}</span>
                  </div>

                  <button
                    class="small-button"
                    onclick="reviewManagementAmbassadorV012('${item.id}')"
                  >
                    Record Review
                  </button>
                </div>
              `).join("")
            : `
                <div class="empty-state">
                  No inactivity reviews in this scope.
                </div>
              `
          }

        </section>

      </div>
    `
  );
}


function campaignComposer(
  programmeLead
) {

  if (!managementCampaignComposerOpen) {
    return "";
  }

  return `
    <section class="dashboard-card v12-management-composer">

      <div class="v12-management-panel-head">
        <h2>CREATE CAMPAIGN / BROADCAST</h2>

        <button
          class="small-button"
          onclick="toggleManagementCampaignComposerV012()"
        >
          Close
        </button>
      </div>

      <div class="v12-management-form-grid">

        <label>
          <span>Type</span>
          <select id="mgmt-campaign-type">
            <option>Campaign</option>
            <option>Broadcast</option>
          </select>
        </label>

        <label>
          <span>Audience</span>
          <select id="mgmt-campaign-audience">
            <option>
              ${programmeLead
                ? "All Ambassadors"
                : "Entertainment UAE"
              }
            </option>
            <option>Selected Brand</option>
            <option>Selected Store</option>
          </select>
        </label>

        <label class="wide">
          <span>Title</span>
          <input
            id="mgmt-campaign-title"
            placeholder="Campaign / broadcast title"
          >
        </label>

        <label class="wide">
          <span>Message</span>
          <textarea
            id="mgmt-campaign-message"
            rows="4"
            placeholder="What should the Ambassador know or do?"
          ></textarea>
        </label>

        <label>
          <span>Start date</span>
          <input
            id="mgmt-campaign-start"
            type="date"
          >
        </label>

        <label>
          <span>End date</span>
          <input
            id="mgmt-campaign-end"
            type="date"
          >
        </label>

      </div>

      <div class="v12-management-form-actions">
        <span>
          Prototype writes through managementActionService.
        </span>

        <button
          class="primary-small"
          onclick="submitManagementCampaignV012()"
        >
          Publish
        </button>
      </div>

    </section>
  `;
}


export function renderManagementCampaignsV012(
  programmeLead = false
) {

  const created =
    getCreatedCampaigns();

  const items = [
    ...created,
    ...MANAGEMENT_CAMPAIGNS
  ];

  return pageShell(
    programmeLead,
    "CAMPAIGNS & COMMUNICATIONS",
    "Campaigns & Broadcasts",
    "Create programme communications, target the right audience and measure participation or acknowledgement.",
    `
      <div class="v12-management-actionbar">
        <div>
          <strong>${items.length}</strong>
          <span>campaigns / broadcasts visible</span>
        </div>

        <button
          class="primary-small"
          onclick="toggleManagementCampaignComposerV012()"
        >
          + New Campaign / Broadcast
        </button>
      </div>

      ${campaignComposer(
        programmeLead
      )}

      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>COMMUNICATION HISTORY</h2>
        </div>

        <div class="v12-campaign-list">

          ${items
            .map(
              item => `
                <div class="v12-campaign-row">

                  <span class="v12-campaign-type ${String(item.type).toLowerCase()}">
                    ${item.type}
                  </span>

                  <div>
                    <strong>${item.title}</strong>
                    <small>
                      ${item.audience} ·
                      ${item.start || "Today"} →
                      ${item.end || "Open"}
                    </small>
                  </div>

                  <span>${item.status}</span>

                  <div>
                    <strong>${item.rate || 0}%</strong>
                    <small>
                      ${item.type === "Broadcast"
                        ? "acknowledged"
                        : "participated"
                      }
                    </small>
                  </div>

                  <span>
                    ${formatNumber(
                      item.participated || 0
                    )}
                    /
                    ${formatNumber(
                      item.sent || 0
                    )}
                  </span>

                </div>
              `
            )
            .join("")}

        </div>

      </section>
    `
  );
}


function trainingEventComposer() {

  if (!managementTrainingEventComposerOpen) {
    return "";
  }

  return `
    <section class="dashboard-card v12-management-composer">

      <div class="v12-management-panel-head">
        <h2>CREATE PHYSICAL / IN-STORE EVENT</h2>

        <button
          class="small-button"
          onclick="toggleManagementTrainingEventComposerV012()"
        >
          Close
        </button>
      </div>

      <div class="v12-management-form-grid">

        <label>
          <span>Event type</span>
          <select id="mgmt-event-type">
            <option>Training</option>
            <option>Huddle</option>
          </select>
        </label>

        <label>
          <span>Topic</span>
          <input
            id="mgmt-event-topic"
            placeholder="e.g. SHARE Member Onboarding"
          >
        </label>

        <label>
          <span>Date</span>
          <input
            id="mgmt-event-date"
            type="date"
          >
        </label>

        <label>
          <span>Start time</span>
          <input
            id="mgmt-event-time"
            type="time"
          >
        </label>

        <label>
          <span>Location</span>
          <input
            id="mgmt-event-location"
            placeholder="Mall / store / training room"
          >
        </label>

        <label>
          <span>Facilitator / Ambassador</span>
          <input
            id="mgmt-event-facilitator"
            placeholder="Name"
          >
        </label>

        <label>
          <span>Expected audience</span>
          <input
            id="mgmt-event-audience"
            type="number"
            min="1"
            placeholder="Number of people"
          >
        </label>

        <label class="wide">
          <span>Notes</span>
          <textarea
            id="mgmt-event-notes"
            rows="3"
            placeholder="Purpose, preparation or follow-up notes"
          ></textarea>
        </label>

      </div>

      <div class="v12-management-form-actions">
        <span>
          Production write path: authenticated API → training_events datastore.
        </span>

        <button
          class="primary-small"
          onclick="submitManagementTrainingEventV012()"
        >
          Create Event
        </button>
      </div>

    </section>
  `;
}


function knowledgeCheckMittiModal() {

  if (!managementKnowledgeCheckModalOpen) {
    return "";
  }

  return `
    <div class="v12-management-modal-backdrop">

      <section
        class="v12-management-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mitti-modal-title"
      >

        <span class="v12-management-eyebrow">
          KNOWLEDGE CHECK
        </span>

        <h2 id="mitti-modal-title">
          Create in Mitti / SafetyCulture
        </h2>

        <p>
          Knowledge Checks are authored and managed in Mitti / SafetyCulture.
          SHARE Lens will surface participation, scores and knowledge gaps once
          the assessment data is available.
        </p>

        <div class="v12-management-modal-actions">

          <button
            class="small-button"
            onclick="closeManagementKnowledgeCheckModalV012()"
          >
            Cancel
          </button>

          <button
            class="primary-small"
            onclick="openMittiKnowledgeCheckV012()"
          >
            Continue to Mitti
          </button>

        </div>

      </section>

    </div>
  `;
}


export function renderManagementTrainingV012(
  programmeLead = false
) {

  const summary =
    programmeLead
      ? PROGRAMME_LEAD_DASHBOARD
          .trainingSummary
      : BU_LEAD_DASHBOARD
          .trainingSummary;

  const createdEvents =
    getCreatedTrainingEvents();

  const physicalSessions = [
    ...createdEvents,
    ...MANAGEMENT_TRAINING.physicalSessions
  ];

  return pageShell(
    programmeLead,
    "TRAINING & DEVELOPMENT",
    "Training",
    "Keep online learning and physical / in-store learning separate while presenting both through one management experience.",
    `
      <div class="v12-training-mode-grid">

        <section class="dashboard-card v12-management-panel">

          <div class="v12-management-panel-head">
            <h2>ONLINE TRAINING</h2>

            <span class="v12-data-source-note">
              Mitti / SafetyCulture
            </span>
          </div>

          <div class="v12-management-mini-grid">
            <div>
              <span>Completion</span>
              <strong>${summary.onlineCompletion}%</strong>
            </div>

            <div>
              <span>Courses tracked</span>
              <strong>${MANAGEMENT_TRAINING.onlineCourses.length}</strong>
            </div>
          </div>

          <div class="v12-training-list">
            ${MANAGEMENT_TRAINING
              .onlineCourses
              .map(
                item => `
                  <div class="v12-training-row">
                    <div>
                      <strong>${item.title}</strong>
                      <small>
                        ${item.assigned} assigned ·
                        ${item.overdue} overdue
                      </small>
                    </div>

                    <strong>${item.completion}%</strong>
                  </div>
                `
              )
              .join("")}
          </div>

          <button class="small-button">
            Open Mitti
          </button>

        </section>

        <section class="dashboard-card v12-management-panel">

          <div class="v12-management-panel-head">
            <h2>PHYSICAL / IN-STORE TRAINING</h2>

            <button
              class="primary-small"
              onclick="toggleManagementTrainingEventComposerV012()"
            >
              + Create Event
            </button>
          </div>

          ${trainingEventComposer()}

          <div class="v12-training-list">
            ${physicalSessions
              .map(
                item => `
                  <div class="v12-training-row">
                    <div>
                      <strong>
                        ${item.type} · ${item.topic}
                      </strong>

                      <small>
                        ${item.date} ·
                        ${item.location} ·
                        ${item.ambassador || item.facilitator}
                      </small>
                    </div>

                    <div class="v12-training-row-metrics">
                      <span>${item.reached} reached</span>
                      <strong>${item.completion}</strong>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>

        </section>

      </div>
    `
  );
}


export function renderManagementKnowledgeChecksV012(
  programmeLead = false
) {

  return pageShell(
    programmeLead,
    "TRAINING & DEVELOPMENT",
    "Knowledge Checks",
    "Monitor participation, score and question-level gaps and use those gaps to target corrective learning.",
    `
      <div class="v12-management-kpi-grid">
        ${managementKpiCard(
          "Current Knowledge Score",
          programmeLead
            ? PROGRAMME_LEAD_DASHBOARD.knowledgeScore
            : BU_LEAD_DASHBOARD.knowledgeScore,
          MANAGEMENT_TARGETS.knowledgeScore,
          "%"
        )}

        ${managementKpiCard(
          "Checks Available",
          MANAGEMENT_KNOWLEDGE_CHECKS.length,
          null,
          "",
          "",
          "Current prototype"
        )}
      </div>

      ${knowledgeCheckMittiModal()}

      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>KNOWLEDGE CHECKS</h2>

          <button
            class="primary-small"
            onclick="openManagementKnowledgeCheckModalV012()"
          >
            + Create Knowledge Check
          </button>
        </div>

        ${MANAGEMENT_KNOWLEDGE_CHECKS
          .map(
            item => `
              <div class="v12-knowledge-check-row">

                <div>
                  <strong>${item.title}</strong>
                  <small>${item.period} · ${item.status}</small>
                </div>

                <div>
                  <span>Responses</span>
                  <strong>${item.responses}</strong>
                </div>

                <div>
                  <span>Participation</span>
                  <strong>${item.participation}%</strong>
                </div>

                <div>
                  <span>Knowledge</span>
                  <strong>${item.score}%</strong>
                </div>

                <div>
                  <span>Top gap</span>
                  <strong>${item.topGap}</strong>
                </div>

              </div>
            `
          )
          .join("")}

      </section>
    `
  );
}


export function renderManagementAcquisitionV012(
  programmeLead = false
) {

  const source =
    programmeLead
      ? PROGRAMME_LEAD_DASHBOARD
      : BU_LEAD_DASHBOARD;

  const achievement =
    Math.round(
      source.acquisition /
      source.acquisitionTarget *
      100
    );

  const items =
    scopedAmbassadors(
      programmeLead
    )
      .sort(
        (a, b) =>
          b.acquisition -
          a.acquisition
      );

  return pageShell(
    programmeLead,
    "PROGRAMME ACTIVITY",
    "SHARE Acquisition",
    "Track acquisition attributed to individual Ambassador QR activity and roll it up through store, brand and business unit.",
    `
      <div class="v12-management-kpi-grid">
        ${managementKpiCard(
          "Members Acquired",
          source.acquisition,
          source.acquisitionTarget
        )}

        ${managementKpiCard(
          "Target Achievement",
          achievement,
          100,
          "%"
        )}
      </div>

      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>AMBASSADOR ACQUISITION</h2>

          <span class="v12-data-source-note">
            Production source: Adjust
          </span>
        </div>

        <div class="v12-acquisition-management-list">
          ${items.map(item => `
            <div class="v12-acquisition-management-row">
              <div>
                <strong>${item.name}</strong>
                <small>${item.brand} · ${item.store}</small>
              </div>

              <div>
                <span>Members</span>
                <strong>${item.acquisition}</strong>
              </div>

              <div>
                <span>Sales penetration</span>
                <strong>${item.salesPenetration}%</strong>
              </div>

              <div>
                <span>SHARE performance</span>
                <strong>${item.sharePerformance}%</strong>
              </div>
            </div>
          `).join("")}
        </div>

      </section>
    `
  );
}


export function renderManagementSubmissionsV012(
  programmeLead = false
) {

  const multiplier =
    programmeLead
      ? 8
      : 1;

  return pageShell(
    programmeLead,
    "PROGRAMME ACTIVITY",
    "Forms & Submissions",
    "Consolidated operational submissions captured through SHARE Lens and connected systems.",
    `
      <div class="v12-submission-management-grid">

        ${MANAGEMENT_SUBMISSIONS
          .map(
            item => `
              <button class="dashboard-card v12-submission-management-card">

                <span>${item.type}</span>

                <strong>
                  ${formatNumber(
                    item.total *
                    multiplier
                  )}
                </strong>

                <div>
                  <span>
                    ${item.awaitingReview *
                    multiplier}
                    awaiting review
                  </span>

                  <em>${item.source}</em>
                </div>

              </button>
            `
          )
          .join("")}

      </div>
    `
  );
}


export function renderManagementRecognitionV012() {

  return pageShell(
    true,
    "REWARDS & RECOGNITION",
    "Recognition & Leaderboard",
    "Bring together SHARE programme recognition and Spark / SuccessFactors recognition without recreating the source system.",
    `
      <section class="dashboard-card v12-management-panel">

        <div class="v12-management-panel-head">
          <h2>TOP AMBASSADORS</h2>

          <span class="v12-data-source-note">
            Spark integration candidate
          </span>
        </div>

        <div class="v12-recognition-list">
          ${MANAGEMENT_RECOGNITION
            .map(
              item => `
                <div class="v12-recognition-row">

                  <span class="v12-recognition-rank">
                    ${item.rank}
                  </span>

                  <div>
                    <strong>${item.ambassador}</strong>
                    <small>
                      ${item.bu} · ${item.brand}
                    </small>
                  </div>

                  <div>
                    <span>Performance</span>
                    <strong>${item.performance}%</strong>
                  </div>

                  <div>
                    <span>Acquisition</span>
                    <strong>${item.acquisition}</strong>
                  </div>

                  <span class="v12-recognition-badge">
                    ${item.recognition}
                  </span>

                </div>
              `
            )
            .join("")}
        </div>

      </section>
    `
  );
}


/* =========================================================
   MANAGEMENT ACTION HANDLERS
========================================================= */

export function toggleManagementCampaignComposerV012() {
  managementCampaignComposerOpen =
    !managementCampaignComposerOpen;
}


export function submitManagementCampaignFormV012() {

  const type =
    document
      .getElementById(
        "mgmt-campaign-type"
      )
      ?.value ||
    "Campaign";

  const audience =
    document
      .getElementById(
        "mgmt-campaign-audience"
      )
      ?.value ||
    "All Ambassadors";

  const title =
    document
      .getElementById(
        "mgmt-campaign-title"
      )
      ?.value
      ?.trim();

  const message =
    document
      .getElementById(
        "mgmt-campaign-message"
      )
      ?.value
      ?.trim();

  const start =
    document
      .getElementById(
        "mgmt-campaign-start"
      )
      ?.value ||
    "";

  const end =
    document
      .getElementById(
        "mgmt-campaign-end"
      )
      ?.value ||
    "";

  if (!title) {
    throw new Error(
      "Enter a campaign or broadcast title."
    );
  }

  const created =
    createManagementCampaign({
      type,
      audience,
      title,
      message,
      start,
      end
    });

  managementCampaignComposerOpen =
    false;

  return created;
}


export function reviewManagementAmbassadorFormV012(
  ambassadorId
) {

  return recordAmbassadorReview(
    ambassadorId,
    "Reviewed — retain active pending confirmation"
  );
}


export function toggleManagementTrainingEventComposerV012() {
  managementTrainingEventComposerOpen =
    !managementTrainingEventComposerOpen;
}


export function submitManagementTrainingEventFormV012() {

  const type =
    document
      .getElementById(
        "mgmt-event-type"
      )
      ?.value ||
    "Training";

  const topic =
    document
      .getElementById(
        "mgmt-event-topic"
      )
      ?.value
      ?.trim();

  const date =
    document
      .getElementById(
        "mgmt-event-date"
      )
      ?.value ||
    "";

  const time =
    document
      .getElementById(
        "mgmt-event-time"
      )
      ?.value ||
    "";

  const location =
    document
      .getElementById(
        "mgmt-event-location"
      )
      ?.value
      ?.trim();

  const facilitator =
    document
      .getElementById(
        "mgmt-event-facilitator"
      )
      ?.value
      ?.trim();

  const audience =
    Number(
      document
        .getElementById(
          "mgmt-event-audience"
        )
        ?.value ||
      0
    );

  const notes =
    document
      .getElementById(
        "mgmt-event-notes"
      )
      ?.value
      ?.trim();

  if (
    !topic ||
    !date ||
    !location
  ) {
    throw new Error(
      "Topic, date and location are required."
    );
  }

  const created =
    createTrainingEvent({
      type,
      topic,
      date,
      time,
      location,
      facilitator:
        facilitator ||
        "To be assigned",
      audience,
      notes
    });

  managementTrainingEventComposerOpen =
    false;

  return created;
}


export function openManagementKnowledgeCheckModalStateV012() {
  managementKnowledgeCheckModalOpen = true;
}


export function closeManagementKnowledgeCheckModalStateV012() {
  managementKnowledgeCheckModalOpen = false;
}
