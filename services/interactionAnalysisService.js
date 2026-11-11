/* =========================================================
   INTERACTION ANALYSIS SERVICE

   Show-and-tell only: deterministic findings on illustrative
   interactions. This is not LLM inference or autonomous agents.
   Production integration will use governed assessment data and
   authenticated corporate APIs.
========================================================= */

function runEvaluation(interaction) {
  return {
    interactionId: interaction.id,

    agent: interaction.agent,

    score: 86,

    result: "Needs Improvement",

    summary:
      "The interaction was handled professionally, but the refund timeline was not clearly explained.",

    findings: [
      {
        criterion: "Customer Verification",
        result: "Pass",
        score: 100,
        evidence:
          "The agent requested and confirmed the booking reference."
      },
      {
        criterion: "Issue Understanding",
        result: "Pass",
        score: 100,
        evidence:
          "The agent correctly identified that the customer was following up on a cancelled booking."
      },
      {
        criterion: "Resolution Explanation",
        result: "Fail",
        score: 50,
        evidence:
          "The customer asked for the refund timeframe, but the agent only stated that it depends on the bank."
      },
      {
        criterion: "Communication Quality",
        result: "Pass",
        score: 95,
        evidence:
          "The interaction remained clear, calm and professional."
      }
    ],

    opportunities: [
      "Clearly communicate the expected refund SLA.",
      "Confirm whether the customer has any additional questions before closing."
    ]
  };
}

function runSopCheck(interaction) {
  return {
    interactionId: interaction.id,

    sop: "Refund Process",

    compliance: 80,

    result: "Partial Compliance",

    steps: [
      {
        step: "Identify customer request",
        status: "Pass",
        evidence:
          "Customer stated that a cancelled booking refund had not yet been received."
      },
      {
        step: "Verify booking reference",
        status: "Pass",
        evidence:
          "Agent requested booking reference VX92831."
      },
      {
        step: "Confirm cancellation status",
        status: "Pass",
        evidence:
          "Agent confirmed that the cancellation was successfully completed."
      },
      {
        step: "Explain refund timeline",
        status: "Fail",
        evidence:
          "The expected refund SLA was not provided."
      },
      {
        step: "Confirm customer understanding",
        status: "Fail",
        evidence:
          "No confirmation was obtained that the customer understood the next steps."
      }
    ],

    missedSteps: [
      "Explain refund timeline",
      "Confirm customer understanding"
    ]
  };
}

function runComplianceCheck(interaction) {
  return {
    interactionId: interaction.id,

    result: "Pass",

    criticalFailure: false,

    complianceScore: 100,

    findings: [
      {
        rule: "Customer information protection",
        result: "Pass",
        evidence:
          "No sensitive information was disclosed before validation."
      },
      {
        rule: "Booking reference validation",
        result: "Pass",
        evidence:
          "The booking reference was requested before discussing booking details."
      },
      {
        rule: "Restricted language",
        result: "Pass",
        evidence:
          "No prohibited or misleading language was detected."
      }
    ],

    criticalFindings: []
  };
}

export function analyseInteraction(interaction) {
  const evaluation = runEvaluation(interaction);

  const sop = runSopCheck(interaction);

  const compliance = runComplianceCheck(interaction);

  let finalStatus = "Pass";

  if (compliance.criticalFailure) {
    finalStatus = "Critical Fail";
  } else if (
    evaluation.score < 90 ||
    sop.compliance < 90
  ) {
    finalStatus = "Needs Improvement";
  }

  return {
    interactionId: interaction.id,

    finalStatus,

    overallScore: Math.round(
      (
        evaluation.score +
        sop.compliance +
        compliance.complianceScore
      ) / 3
    ),

    evaluation,

    sop,

    compliance,

    recommendedAction:
      finalStatus === "Needs Improvement"
        ? "Assign targeted coaching on refund timeline communication."
        : "No intervention required."
  };
}
