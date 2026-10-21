import {
  USERS,
  AMBASSADOR_KPIS,
  ACQUISITION,
  TRAINING,
  KNOWLEDGE_SOURCES,
  KNOWLEDGE_ARTICLES,
  SERVICE_PULSE,
  NEXT_BEST_ACTIONS,
  SCORE_FAMILIES
} from "../data/platformData.js";

import { getUserContext } from "../services/userContextService.js";
import {
  createSubmission,
  getSubmissions,
  getSubmissionsByType
} from "../services/submissionService.js";


/* =========================================================
   MODULE: Ambassador Pages v0.12.0

   PURPOSE:
   Owns the new Ambassador experience without increasing the
   size and coupling of the legacy app.js file.

   BUSINESS MEANING:
   Gives Ambassadors one operational workspace to view KPIs,
   complete programme actions and access specialist systems.

   INPUTS:
   User context, KPI configuration, training/knowledge
   integration configuration and native submissions.

   OUTPUTS:
   Screen HTML and structured prototype submissions.

   DEPENDENCIES:
   platformData.js
   userContextService.js
   submissionService.js

   CHANGE IMPACT:
   UI changes in this module affect the Ambassador persona
   only unless shared services/data contracts are changed.
========================================================= */

let selectedServicePulseScenario = SERVICE_PULSE.scenarios[0];


/* =========================================================
   COMPONENT: Shared Page Helpers

   PURPOSE:
   Keeps repeated markup and safety handling consistent.

   CHANGE IMPACT:
   Changes can affect all v0.12 Ambassador pages.
========================================================= */

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fieldValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function pageHeading(label, title, subtitle) {
  return `
    <div class="page-heading">
      <span class="section-label">${label}</span>
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
  `;
}

function contextStrip() {
  const user = getUserContext();

  return `
    <section class="v12-context-strip">
      <div>
        <span>Ambassador</span>
        <strong>${escapeHtml(user.name)}</strong>
      </div>
      <div>
        <span>Business Unit</span>
        <strong>${escapeHtml(user.businessUnit)}</strong>
      </div>
      <div>
        <span>Brand</span>
        <strong>${escapeHtml(user.brand)}</strong>
      </div>
      <div>
        <span>Location</span>
        <strong>${escapeHtml(user.location)}</strong>
      </div>
      <div class="v12-context-lock">
        <span>Context source</span>
        <strong>Authenticated profile</strong>
      </div>
    </section>
  `;
}

function statusPill(status) {
  const normalised = String(status).toLowerCase();
  const cls =
    normalised.includes("complete") || normalised.includes("submitted")
      ? "good"
      : normalised.includes("progress")
        ? "warning"
        : "neutral";

  return `<span class="v12-status-pill ${cls}">${escapeHtml(status)}</span>`;
}

function metricCard(metric) {
  const belowTarget = Number(metric.actual) < Number(metric.target);
  const trendPositive = Number(metric.trend) >= 0;

  return `
    <section class="dashboard-card v12-kpi-card ${belowTarget ? "needs-attention" : ""}">
      <div class="v12-kpi-topline">
        <span>${escapeHtml(metric.label)}</span>
        <span class="v12-target">Target ${metric.target}${metric.unit}</span>
      </div>

      <strong>
        ${metric.actual}${metric.unit}
      </strong>

      <div class="v12-kpi-bottom">
        <span class="${trendPositive ? "trend-up" : "trend-down"}">
          ${trendPositive ? "↑" : "↓"} ${Math.abs(metric.trend)}%
        </span>
        <span>${belowTarget ? "Below target" : "On target"}</span>
      </div>
    </section>
  `;
}

function submissionRows(type, emptyText = "No submissions yet.") {
  const rows = getSubmissionsByType(type).slice(0, 5);

  if (!rows.length) {
    return `<div class="v12-empty-state">${emptyText}</div>`;
  }

  return rows.map(item => {
    const date = new Date(item.createdAt).toLocaleString();
    const summary =
      item.data.feedback ||
      item.data.issueReason ||
      item.data.topics ||
      item.data.sessionType ||
      item.data.scenario ||
      item.data.comments ||
      item.type;

    return `
      <div class="v12-activity-row">
        <div>
          <strong>${escapeHtml(summary)}</strong>
          <span>${escapeHtml(date)}</span>
        </div>
        ${statusPill(item.status)}
      </div>
    `;
  }).join("");
}


/* =========================================================
   PAGE: Ambassador Home

   PURPOSE:
   Provides a simple operational view centred on the four
   agreed programme KPIs.

   BUSINESS MEANING:
   Next Best Actions are driven only by controlled KPI gaps.

   INPUTS:
   KPI configuration + local native activity.

   OUTPUTS:
   KPI status, approved actions and direct workflow entry.
========================================================= */

export function renderAmbassadorHomeV012() {
  const user = getUserContext();
  const metrics = Object.values(AMBASSADOR_KPIS);

  const gapActions = metrics
    .filter(metric => Number(metric.actual) < Number(metric.target))
    .map(metric => {
      const action = NEXT_BEST_ACTIONS.find(item => item.kpi === metric.key);
      if (!action) return "";

      return `
        <div class="v12-nba-item">
          <div class="v12-nba-icon">✦</div>
          <div>
            <span class="section-label">NEXT BEST ACTION</span>
            <strong>${escapeHtml(action.title)}</strong>
            <p>${escapeHtml(action.action)}</p>
          </div>
          <button class="small-button" onclick="navigateTo('${metric.key === "penetration" || metric.key === "acquisition" ? "training-online" : "service-pulse"}')">
            Open
          </button>
        </div>
      `;
    })
    .join("");

  return `
    <div class="v12-home-heading">
      <div>
        <span class="section-label">MY SHARE</span>
        <h1>Good afternoon, ${escapeHtml(user.name.split(" ")[0])}</h1>
        <p>One place for your performance, programme actions, training and knowledge.</p>
      </div>

      <div class="v12-profile-chip">
        <span>Active Ambassador</span>
        <strong>${escapeHtml(user.brand)} · ${escapeHtml(user.location)}</strong>
      </div>
    </div>

    <div class="dashboard-grid four v12-kpi-grid">
      ${metrics.map(metricCard).join("")}
    </div>

    <div class="dashboard-grid two">
      <section class="dashboard-card">
        <div class="card-heading-row">
          <div>
            <span class="section-label">FOCUS</span>
            <h3>Next Best Actions</h3>
          </div>
          <span class="v12-evidence-label">KPI-driven</span>
        </div>

        ${gapActions || `
          <div class="v12-empty-state">
            All four primary KPIs are currently at or above target.
          </div>
        `}
      </section>

      <section class="dashboard-card">
        <span class="section-label">DIRECT ACTIONS</span>
        <h3>What do you need to do?</h3>

        <div class="v12-action-grid">
          <button onclick="navigateTo('service-pulse')">
            <span>◉</span>
            <strong>Start Service Pulse</strong>
          </button>
          <button onclick="navigateTo('feedback')">
            <span>✎</span>
            <strong>Submit Feedback</strong>
          </button>
          <button onclick="navigateTo('manual-transaction')">
            <span>▣</span>
            <strong>Manual Transaction</strong>
          </button>
          <button onclick="navigateTo('share-wall')">
            <span>▧</span>
            <strong>Update SHARE Wall</strong>
          </button>
          <button onclick="navigateTo('training-physical')">
            <span>✓</span>
            <strong>Log Training / Huddle</strong>
          </button>
          <button onclick="navigateTo('knowledge')">
            <span>?</span>
            <strong>Ask / Search Knowledge</strong>
          </button>
        </div>
      </section>
    </div>

    <div class="dashboard-grid two">
      <section class="dashboard-card">
        <div class="card-heading-row">
          <div>
            <span class="section-label">ACQUISITION</span>
            <h3>Your personalised QR</h3>
          </div>
          <span class="v12-source-badge">Source: ${ACQUISITION.provider}</span>
        </div>

        <div class="v12-acquisition-card">
          <div class="v12-qr-placeholder">
            <span>ADJUST</span>
            <strong>QR</strong>
          </div>

          <div>
            <strong>${ACQUISITION.membersAcquired} / ${ACQUISITION.target} members</strong>
            <p>${ACQUISITION.activeMemberRate}% active-member rate</p>
            <p>AED ${ACQUISITION.attributedSpend.toLocaleString()} attributed member spend</p>
            <small>QR reference: ${escapeHtml(ACQUISITION.qrReference)}</small>
          </div>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="card-heading-row">
          <div>
            <span class="section-label">TRAINING & KNOWLEDGE</span>
            <h3>Continue where you left off</h3>
          </div>
        </div>

        <div class="v12-system-card compact">
          <div class="v12-system-icon">M</div>
          <div>
            <strong>Online Training</strong>
            <span>Mitti / SafetyCulture</span>
          </div>
          <button class="small-button" onclick="navigateTo('training-online')">Open</button>
        </div>

        <div class="v12-system-card compact">
          <div class="v12-system-icon">K</div>
          <div>
            <strong>Knowledge Base</strong>
            <span>One experience, multiple approved sources</span>
          </div>
          <button class="small-button" onclick="navigateTo('knowledge')">Open</button>
        </div>
      </section>
    </div>
  `;
}


/* =========================================================
   PAGE: Service Pulse

   PURPOSE:
   Makes Service Pulse directly usable after authentication.

   BUSINESS MEANING:
   Replaces QR-to-external-form dependency for the prototype.

   OUTPUTS:
   Structured Service Pulse submission with profile context.
========================================================= */

export function setServicePulseScenarioV012(scenario) {
  if (SERVICE_PULSE.scenarios.includes(scenario)) {
    selectedServicePulseScenario = scenario;
  }
}

export function renderServicePulseV012() {
  const questions = SERVICE_PULSE.questions[selectedServicePulseScenario] || [];

  return `
    ${pageHeading(
      "SERVICE DELIVERY",
      "Service Pulse",
      "Complete the applicable scenario directly in SHARE Lens. Your identity and location context are already known."
    )}

    ${contextStrip()}

    <div class="dashboard-grid two">
      <section class="dashboard-card">
        <div class="card-heading-row">
          <div>
            <span class="section-label">NEW ASSESSMENT</span>
            <h3>Select scenario</h3>
          </div>
          <span class="v12-target-chip">Target ≥ ${SERVICE_PULSE.threshold}%</span>
        </div>

        <div class="v12-scenario-list">
          ${SERVICE_PULSE.scenarios.map((scenario, index) => `
            <button
              class="${scenario === selectedServicePulseScenario ? "active" : ""}"
              onclick="selectServicePulseScenarioV012('${escapeHtml(scenario).replaceAll("'", "\\\\'")}')"
            >
              <span>0${index + 1}</span>
              <strong>${escapeHtml(scenario)}</strong>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="dashboard-card">
        <span class="section-label">CURRENT STATUS</span>
        <h3>Your recent Service Pulse activity</h3>
        ${submissionRows("service-pulse", "No Service Pulse assessments submitted from this prototype yet.")}
      </section>
    </div>

    <section class="dashboard-card v12-form-card">
      <div class="card-heading-row">
        <div>
          <span class="section-label">ASSESSMENT</span>
          <h3>${escapeHtml(selectedServicePulseScenario)}</h3>
        </div>
        <span class="v12-evidence-label">Yes / No / N/A</span>
      </div>

      <div class="v12-form-grid three">
        <label>
          <span>Employee / Cashier Name</span>
          <input id="sp-employee" placeholder="Enter employee name">
        </label>
        <label>
          <span>Counter / POS</span>
          <input id="sp-counter" placeholder="Optional">
        </label>
        <label>
          <span>Visit date</span>
          <input id="sp-date" type="date">
        </label>
      </div>

      <div class="v12-pulse-questions">
        ${questions.map((question, index) => `
          <div class="v12-pulse-question">
            <div>
              <span>Q${index + 1}</span>
              <strong>${escapeHtml(question)}</strong>
            </div>

            <div class="v12-choice-group">
              ${["Yes", "No", "N/A"].map(value => `
                <label>
                  <input type="radio" name="sp-q-${index}" value="${value}">
                  <span>${value}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>

      <div class="v12-form-grid two">
        <label>
          <span>Overall interaction rating (1–10)</span>
          <input id="sp-rating" type="number" min="1" max="10" value="8">
        </label>
        <label>
          <span>Assessment notes</span>
          <input id="sp-notes" placeholder="Optional evidence or context">
        </label>
      </div>

      <div class="v12-form-actions">
        <span>Profile and organisational fields will be attached automatically.</span>
        <button class="primary-small" onclick="submitServicePulseV012()">
          Submit Service Pulse
        </button>
      </div>
    </section>
  `;
}

export function submitServicePulseFormV012() {
  const questions = SERVICE_PULSE.questions[selectedServicePulseScenario] || [];
  const answers = questions.map((question, index) => ({
    question,
    answer: selectedValue(`sp-q-${index}`)
  }));

  if (!fieldValue("sp-employee")) {
    throw new Error("Enter the employee / cashier name.");
  }

  if (answers.some(item => !item.answer)) {
    throw new Error("Answer all applicable Service Pulse questions.");
  }

  const scored = answers.filter(item => item.answer !== "N/A");
  const yes = scored.filter(item => item.answer === "Yes").length;
  const score = scored.length ? Math.round((yes / scored.length) * 100) : 0;

  return createSubmission("service-pulse", {
    scenario: selectedServicePulseScenario,
    employee: fieldValue("sp-employee"),
    counter: fieldValue("sp-counter"),
    visitDate: fieldValue("sp-date"),
    answers,
    overallRating: Number(fieldValue("sp-rating") || 0),
    notes: fieldValue("sp-notes"),
    score,
    threshold: SERVICE_PULSE.threshold,
    status: "Submitted"
  });
}


/* =========================================================
   PAGE: Feedback

   PURPOSE:
   Replaces the current external feedback form pattern with a
   native authenticated workflow.

   OUTPUTS:
   Feedback category, source, text and optional image name.
========================================================= */

export function renderFeedbackV012() {
  return `
    ${pageHeading(
      "AMBASSADOR PROGRAM",
      "Submit Feedback",
      "Capture member or employee feedback directly in SHARE Lens."
    )}

    ${contextStrip()}

    <div class="dashboard-grid two">
      <section class="dashboard-card v12-form-card">
        <span class="section-label">NEW FEEDBACK</span>
        <h3>What did you hear?</h3>

        <div class="v12-form-grid two">
          <label>
            <span>Feedback From</span>
            <select id="feedback-from">
              <option>Member</option>
              <option>Employee</option>
              <option>Customer</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            <span>Feedback Category</span>
            <select id="feedback-category">
              <option>Promoter (Positive feedback)</option>
              <option>Passive (Neutral feedback)</option>
              <option>Detractor (To be improved)</option>
              <option>Suggestion</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label class="v12-full-field">
          <span>Feedback</span>
          <textarea id="feedback-text" rows="6" placeholder="Describe the feedback clearly..."></textarea>
        </label>

        <label class="v12-full-field">
          <span>Optional Image</span>
          <input id="feedback-image" type="file" accept="image/*">
          <small>Prototype stores the selected file name only. Production requires enterprise media storage.</small>
        </label>

        <div class="v12-form-actions">
          <span>Identity, BU, brand and location are added automatically.</span>
          <button class="primary-small" onclick="submitFeedbackV012()">Submit Feedback</button>
        </div>
      </section>

      <section class="dashboard-card">
        <span class="section-label">MY SUBMISSIONS</span>
        <h3>Recent feedback</h3>
        ${submissionRows("feedback", "No feedback submitted from this prototype yet.")}
      </section>
    </div>
  `;
}

export function submitFeedbackFormV012() {
  const feedback = fieldValue("feedback-text");

  if (!feedback) {
    throw new Error("Enter the feedback before submitting.");
  }

  const image = document.getElementById("feedback-image")?.files?.[0];

  return createSubmission("feedback", {
    feedbackFrom: fieldValue("feedback-from"),
    feedbackCategory: fieldValue("feedback-category"),
    feedback,
    imageFileName: image?.name || "",
    status: "Submitted"
  });
}


/* =========================================================
   PAGE: Manual Transaction

   PURPOSE:
   Demonstrates the target SHARE Lens → OneView workflow.

   BUSINESS MEANING:
   Removes Asana from the target flow where direct OneView
   ticket creation is technically approved.

   OUTPUTS:
   Structured request with prototype OneView ticket status.
========================================================= */

export function renderManualTransactionV012() {
  return `
    ${pageHeading(
      "AMBASSADOR PROGRAM",
      "Manual Transaction",
      "Submit a manual transaction request and track the resulting OneView case."
    )}

    ${contextStrip()}

    <div class="dashboard-grid two">
      <section class="dashboard-card v12-form-card">
        <div class="card-heading-row">
          <div>
            <span class="section-label">NEW REQUEST</span>
            <h3>Transaction details</h3>
          </div>
          <span class="v12-source-badge">Target: OneView / SAP C4C</span>
        </div>

        <div class="v12-form-grid two">
          <label>
            <span>Customer SHARE ID</span>
            <input id="mt-share-id" placeholder="Enter SHARE ID">
          </label>
          <label>
            <span>Customer Name</span>
            <input id="mt-name" placeholder="Enter customer name">
          </label>
          <label>
            <span>Phone</span>
            <input id="mt-phone" placeholder="+971...">
          </label>
          <label>
            <span>Email</span>
            <input id="mt-email" type="email" placeholder="customer@email.com">
          </label>
          <label>
            <span>Transaction Amount</span>
            <input id="mt-amount" type="number" min="0" step="0.01" placeholder="0.00">
          </label>
          <label>
            <span>Transaction Date</span>
            <input id="mt-date" type="date">
          </label>
        </div>

        <label class="v12-full-field">
          <span>Issue / Reason</span>
          <select id="mt-reason">
            <option>Missing SHARE points</option>
            <option>Transaction not reflected</option>
            <option>Receipt scan issue</option>
            <option>Member identification issue</option>
            <option>Other</option>
          </select>
        </label>

        <label class="v12-full-field">
          <span>Notes</span>
          <textarea id="mt-notes" rows="4" placeholder="Provide the details required for the contact-centre team..."></textarea>
        </label>

        <label class="v12-full-field">
          <span>Receipt Photo</span>
          <input id="mt-receipt" type="file" accept="image/*">
        </label>

        <div class="v12-flow-strip">
          <span>SHARE Lens</span><b>→</b>
          <span>Validation</span><b>→</b>
          <span>OneView</span><b>→</b>
          <span>Human Action</span>
        </div>

        <div class="v12-form-actions">
          <span>Ambassador and location context will be appended automatically.</span>
          <button class="primary-small" onclick="submitManualTransactionV012()">Create Request</button>
        </div>
      </section>

      <section class="dashboard-card">
        <span class="section-label">MY REQUESTS</span>
        <h3>Recent manual transactions</h3>
        ${submissionRows("manual-transaction", "No manual transaction requests submitted from this prototype yet.")}
      </section>
    </div>
  `;
}

export function submitManualTransactionFormV012() {
  const shareId = fieldValue("mt-share-id");
  const customerName = fieldValue("mt-name");
  const reason = fieldValue("mt-reason");

  if (!shareId || !customerName) {
    throw new Error("Customer SHARE ID and customer name are required.");
  }

  const receipt = document.getElementById("mt-receipt")?.files?.[0];

  return createSubmission("manual-transaction", {
    customerShareId: shareId,
    customerName,
    phone: fieldValue("mt-phone"),
    email: fieldValue("mt-email"),
    amount: Number(fieldValue("mt-amount") || 0),
    transactionDate: fieldValue("mt-date"),
    issueReason: reason,
    notes: fieldValue("mt-notes"),
    receiptFileName: receipt?.name || "",
    oneViewTicketId: `OV-${String(Date.now()).slice(-7)}`,
    status: "Submitted to OneView"
  });
}


/* =========================================================
   PAGE: SHARE Wall

   PURPOSE:
   Captures the existing physical wall process digitally.

   BUSINESS MEANING:
   The physical board remains. SHARE Lens records the update,
   evidence image and declared topics without QR dependency.
========================================================= */

export function renderShareWallV012() {
  return `
    ${pageHeading(
      "AMBASSADOR PROGRAM",
      "SHARE Wall",
      "Update the physical SHARE Wall, upload evidence and record what changed."
    )}

    ${contextStrip()}

    <div class="dashboard-grid two">
      <section class="dashboard-card v12-form-card">
        <span class="section-label">NEW WALL UPDATE</span>
        <h3>Capture this month's update</h3>

        <label class="v12-full-field">
          <span>Topics Added</span>
          <textarea id="wall-added" rows="3" placeholder="What was added to the wall?"></textarea>
        </label>

        <label class="v12-full-field">
          <span>Topics Removed / Outdated</span>
          <textarea id="wall-removed" rows="3" placeholder="What was removed or replaced?"></textarea>
        </label>

        <label class="v12-full-field">
          <span>Photo Evidence</span>
          <input id="wall-photo" type="file" accept="image/*" capture="environment">
          <small>Use the camera on mobile or upload an existing photo.</small>
        </label>

        <label class="v12-full-field">
          <span>Additional Comments</span>
          <textarea id="wall-comments" rows="3" placeholder="Optional notes"></textarea>
        </label>

        <div class="v12-form-actions">
          <span>The physical SHARE Wall remains the operational board.</span>
          <button class="primary-small" onclick="submitShareWallV012()">Submit Update</button>
        </div>
      </section>

      <section class="dashboard-card">
        <span class="section-label">MY UPDATES</span>
        <h3>Recent SHARE Wall submissions</h3>
        ${submissionRows("share-wall", "No SHARE Wall updates submitted from this prototype yet.")}
      </section>
    </div>
  `;
}

export function submitShareWallFormV012() {
  const added = fieldValue("wall-added");
  const removed = fieldValue("wall-removed");
  const photo = document.getElementById("wall-photo")?.files?.[0];

  if (!added && !removed) {
    throw new Error("Record at least one topic added or removed.");
  }

  if (!photo) {
    throw new Error("Add a photo of the updated SHARE Wall.");
  }

  return createSubmission("share-wall", {
    topics: added || removed,
    topicsAdded: added,
    topicsRemoved: removed,
    photoFileName: photo.name,
    comments: fieldValue("wall-comments"),
    status: "Submitted"
  });
}


/* =========================================================
   PAGE: Training Landing

   PURPOSE:
   Keeps online and physical learning visibly separate.
========================================================= */

export function renderTrainingLandingV012() {
  return `
    ${pageHeading(
      "TRAINING & KNOWLEDGE",
      "Training",
      "Choose between online learning in Mitti and physical / in-store training managed through SHARE Lens."
    )}

    <div class="dashboard-grid two">
      <section class="dashboard-card v12-training-choice">
        <div class="v12-large-system-icon">M</div>
        <span class="section-label">ONLINE TRAINING</span>
        <h2>Mitti / SafetyCulture</h2>
        <p>View assignment status, progress, due dates and scores in SHARE Lens. Launch the actual learning experience in Mitti.</p>

        <ul>
          <li>Assigned courses</li>
          <li>Progress and completion</li>
          <li>Due / overdue status</li>
          <li>Scores and completion date</li>
        </ul>

        <button class="primary-small" onclick="navigateTo('training-online')">Open Online Training</button>
      </section>

      <section class="dashboard-card v12-training-choice">
        <div class="v12-large-system-icon">P</div>
        <span class="section-label">PHYSICAL / IN-STORE</span>
        <h2>Training & Huddles</h2>
        <p>Capture physical sessions natively, including topics, people reached, completion and evidence.</p>

        <ul>
          <li>Training or Huddle</li>
          <li>Topics covered</li>
          <li>Team members reached</li>
          <li>Completion and evidence</li>
        </ul>

        <button class="primary-small" onclick="navigateTo('training-physical')">Open Physical Training</button>
      </section>
    </div>
  `;
}


/* =========================================================
   PAGE: Online Training

   SOURCE OF RECORD:
   Mitti / SafetyCulture.

   SHARE LENS ROLE:
   Front door + status / reporting layer.
========================================================= */

export function renderOnlineTrainingV012() {
  const courses = TRAINING.online.courses;

  return `
    ${pageHeading(
      "TRAINING · ONLINE",
      "Online Training",
      "Your Mitti learning status in SHARE Lens, with direct access to the learning platform."
    )}

    <section class="dashboard-card v12-integration-hero">
      <div>
        <span class="section-label">CONNECTED LEARNING ENGINE</span>
        <h2>${escapeHtml(TRAINING.online.provider)}</h2>
        <p>SHARE Lens displays training progress and results. Course delivery remains in Mitti.</p>
      </div>

      <a class="v12-primary-link" href="${TRAINING.online.launchUrl}" target="_blank" rel="noopener noreferrer">
        Open Mitti ↗
      </a>
    </section>

    <div class="dashboard-grid three">
      ${courses.map(course => `
        <section class="dashboard-card v12-course-card">
          <div class="card-heading-row">
            ${statusPill(course.status)}
            <span class="v12-source-badge">Mitti</span>
          </div>

          <h3>${escapeHtml(course.title)}</h3>
          <p>Due ${escapeHtml(course.due)}</p>

          <div class="v12-progress-track">
            <div style="width:${course.progress}%"></div>
          </div>

          <div class="v12-course-footer">
            <strong>${course.progress}%</strong>
            <span>${course.score == null ? "Score pending" : `Score ${course.score}%`}</span>
          </div>
        </section>
      `).join("")}
    </div>

    <section class="dashboard-card v12-architecture-note">
      <strong>Integration model</strong>
      <span>SHARE Lens</span><b>→</b>
      <span>Mitti course/completion data</span><b>+</b>
      <span>Launch to Mitti for learning</span>
    </section>
  `;
}


/* =========================================================
   PAGE: Physical / In-Store Training

   PURPOSE:
   Native logging of training and huddles.
========================================================= */

export function renderPhysicalTrainingV012() {
  return `
    ${pageHeading(
      "TRAINING · PHYSICAL",
      "Physical / In-Store Training",
      "Log training and huddles conducted with your team."
    )}

    ${contextStrip()}

    <div class="dashboard-grid two">
      <section class="dashboard-card v12-form-card">
        <span class="section-label">LOG SESSION</span>
        <h3>Session details</h3>

        <div class="v12-form-grid two">
          <label>
            <span>Session Type</span>
            <select id="training-type">
              ${TRAINING.physical.sessionTypes.map(type => `<option>${type}</option>`).join("")}
            </select>
          </label>

          <label>
            <span>Team Members Reached</span>
            <input id="training-reached" type="number" min="1" placeholder="0">
          </label>
        </div>

        <label class="v12-full-field">
          <span>SHARE Topics</span>
          <textarea id="training-topics" rows="3" placeholder="Topics covered in this session"></textarea>
        </label>

        <label class="v12-full-field">
          <span>Completion</span>
          <select id="training-completion">
            <option>21–40%</option>
            <option>41–60%</option>
            <option>61–80%</option>
            <option>81–99%</option>
            <option>100%</option>
          </select>
        </label>

        <div class="v12-form-grid two">
          <label>
            <span>Evidence Image 1</span>
            <input id="training-image-1" type="file" accept="image/*">
          </label>
          <label>
            <span>Evidence Image 2</span>
            <input id="training-image-2" type="file" accept="image/*">
          </label>
        </div>

        <label class="v12-full-field">
          <span>Additional Comments</span>
          <textarea id="training-comments" rows="3" placeholder="Optional notes"></textarea>
        </label>

        <div class="v12-form-actions">
          <span>Session context is linked automatically to your profile.</span>
          <button class="primary-small" onclick="submitPhysicalTrainingV012()">Log Session</button>
        </div>
      </section>

      <section class="dashboard-card">
        <span class="section-label">MY SESSIONS</span>
        <h3>Recent training / huddles</h3>
        ${submissionRows("physical-training", "No physical training sessions submitted from this prototype yet.")}
      </section>
    </div>
  `;
}

export function submitPhysicalTrainingFormV012() {
  const topics = fieldValue("training-topics");
  const reached = Number(fieldValue("training-reached") || 0);

  if (!topics || reached < 1) {
    throw new Error("Enter the topics and number of team members reached.");
  }

  const image1 = document.getElementById("training-image-1")?.files?.[0];
  const image2 = document.getElementById("training-image-2")?.files?.[0];

  return createSubmission("physical-training", {
    sessionType: fieldValue("training-type"),
    topics,
    teamMembersReached: reached,
    completion: fieldValue("training-completion"),
    image1FileName: image1?.name || "",
    image2FileName: image2?.name || "",
    comments: fieldValue("training-comments"),
    status: "Submitted"
  });
}


/* =========================================================
   PAGE: Knowledge Base

   PURPOSE:
   Creates one knowledge experience independent from source.

   BUSINESS MEANING:
   Users search SHARE Lens while approved content can be
   supplied by Knowmax, Databricks, the training portal or
   another approved repository.
========================================================= */

export function renderKnowledgeV012() {
  return `
    ${pageHeading(
      "TRAINING & KNOWLEDGE",
      "Knowledge Base",
      "Search approved SHARE knowledge without needing to know which source system holds it."
    )}

    <section class="dashboard-card v12-knowledge-search-card">
      <span class="section-label">ASK SHARE</span>
      <h2>What do you need to know?</h2>

      <div class="v12-search-bar">
        <input id="v12-knowledge-search" placeholder="Search SHARE benefits, acquisition, Service Pulse...">
        <button class="primary-small" onclick="filterV12Knowledge()">Search</button>
      </div>

      <p>Answers must be grounded only in approved connected knowledge sources.</p>
    </section>

    <div class="dashboard-grid three">
      ${KNOWLEDGE_SOURCES.map(source => `
        <section class="dashboard-card v12-source-card">
          <div class="v12-source-icon">${escapeHtml(source.name.charAt(0))}</div>
          <strong>${escapeHtml(source.name)}</strong>
          <span>${escapeHtml(source.type)}</span>
          ${statusPill(source.status)}
        </section>
      `).join("")}
    </div>

    <section class="dashboard-card">
      <div class="card-heading-row">
        <div>
          <span class="section-label">APPROVED CONTENT</span>
          <h3>Knowledge results</h3>
        </div>
        <span class="v12-source-badge">Connector-independent UI</span>
      </div>

      <div id="v12-knowledge-results">
        ${renderKnowledgeResultsV012("")}
      </div>
    </section>
  `;
}

export function renderKnowledgeResultsV012(query = "") {
  const q = query.toLowerCase().trim();

  const results = KNOWLEDGE_ARTICLES.filter(item =>
    !q ||
    item.title.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.source.toLowerCase().includes(q)
  );

  if (!results.length) {
    return '<div class="v12-empty-state">No approved knowledge matched that search.</div>';
  }

  return results.map(item => `
    <div class="v12-knowledge-row">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.category)} · Updated ${escapeHtml(item.updated)}</span>
      </div>
      <span class="v12-source-badge">${escapeHtml(item.source)}</span>
      <button class="small-button" onclick="showToast('Opening approved knowledge article in the prototype.')">Open</button>
    </div>
  `).join("");
}


/* =========================================================
   PAGE: Reports

   PURPOSE:
   Shows the Ambassador's own native platform activity.

   BUSINESS MEANING:
   Gives the user traceability without exposing wider
   population reporting.
========================================================= */

export function renderReportsV012() {
  const all = getSubmissions();

  const counts = {
    feedback: getSubmissionsByType("feedback").length,
    wall: getSubmissionsByType("share-wall").length,
    training: getSubmissionsByType("physical-training").length,
    pulse: getSubmissionsByType("service-pulse").length,
    manual: getSubmissionsByType("manual-transaction").length
  };

  return `
    ${pageHeading(
      "MY ACTIVITY",
      "Reports",
      "Your own SHARE Lens submissions and programme activity."
    )}

    <div class="dashboard-grid four">
      <section class="dashboard-card metric-card"><span>Feedback</span><strong>${counts.feedback}</strong><small>Submitted</small></section>
      <section class="dashboard-card metric-card"><span>SHARE Wall</span><strong>${counts.wall}</strong><small>Updates</small></section>
      <section class="dashboard-card metric-card"><span>Training / Huddles</span><strong>${counts.training}</strong><small>Sessions</small></section>
      <section class="dashboard-card metric-card"><span>Service Pulse</span><strong>${counts.pulse}</strong><small>Assessments</small></section>
    </div>

    <section class="dashboard-card">
      <div class="card-heading-row">
        <div>
          <span class="section-label">ACTIVITY LOG</span>
          <h3>Recent submissions</h3>
        </div>
        <span class="v12-source-badge">${all.length} total prototype records</span>
      </div>

      ${all.length ? all.slice(0, 20).map(item => `
        <div class="v12-report-row">
          <div>
            <strong>${escapeHtml(item.type.replaceAll("-", " "))}</strong>
            <span>${new Date(item.createdAt).toLocaleString()}</span>
          </div>
          <span>${escapeHtml(item.submissionId)}</span>
          ${statusPill(item.status)}
        </div>
      `).join("") : '<div class="v12-empty-state">Complete a workflow to create your first activity record.</div>'}
    </section>
  `;
}


/* =========================================================
   PAGE: My Status / Profile

   PURPOSE:
   Shows reusable profile context and programme journey.

   SOURCE:
   Prototype identity master + Adjust attribution reference.
========================================================= */

export function renderStatusV012() {
  const user = USERS.ambassador;

  return `
    ${pageHeading(
      "AMBASSADOR",
      "My Status",
      "Your programme identity, organisational context and Ambassador journey."
    )}

    <div class="dashboard-grid two">
      <section class="dashboard-card">
        <span class="section-label">PROFILE</span>
        <div class="v12-profile-hero">
          <div class="large-avatar">${escapeHtml(user.initials)}</div>
          <div>
            <h2>${escapeHtml(user.name)}</h2>
            <p>${escapeHtml(user.accountStatus)}</p>
          </div>
        </div>

        <div class="v12-profile-list">
          <div><span>Staff ID</span><strong>${escapeHtml(user.staffId)}</strong></div>
          <div><span>SHARE ID</span><strong>${escapeHtml(user.shareId)}</strong></div>
          <div><span>Country</span><strong>${escapeHtml(user.country)}</strong></div>
          <div><span>Business Unit</span><strong>${escapeHtml(user.businessUnit)}</strong></div>
          <div><span>Brand</span><strong>${escapeHtml(user.brand)}</strong></div>
          <div><span>Location</span><strong>${escapeHtml(user.location)}</strong></div>
          <div><span>Manager</span><strong>${escapeHtml(user.manager)}</strong></div>
        </div>
      </section>

      <section class="dashboard-card">
        <span class="section-label">AMBASSADOR JOURNEY</span>
        <h3>Programme status</h3>

        <div class="v12-journey-list">
          ${["Onboarded", "Mandatory Training", "Knowledge Check", "Personal QR Code"].map((step, index) => `
            <div>
              <span class="v12-journey-check">✓</span>
              <div>
                <strong>${index + 1}. ${step}</strong>
                <span>Complete</span>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="v12-adjust-reference">
          <span>Personal acquisition attribution</span>
          <strong>Adjust · ${escapeHtml(ACQUISITION.qrReference)}</strong>
        </div>
      </section>
    </div>

    <div class="dashboard-grid three">
      ${Object.values(SCORE_FAMILIES).map(family => `
        <section class="dashboard-card">
          <span class="section-label">SCORE FAMILY</span>
          <h3>${escapeHtml(family.label)}</h3>
          <ul class="v12-component-list">
            ${family.components.map(component => `<li>${escapeHtml(component)}</li>`).join("")}
          </ul>
          <small>Final weighting remains configurable / to be confirmed.</small>
        </section>
      `).join("")}
    </div>
  `;
}
