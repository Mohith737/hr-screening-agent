import fetch from "node-fetch";

export async function triggerScreeningCall(candidate, screeningId) {
  if (!process.env.BOLNA_API_KEY) {
    throw new Error("Missing BOLNA_API_KEY");
  }

  if (!process.env.BOLNA_AGENT_ID) {
    throw new Error("Missing BOLNA_AGENT_ID");
  }

  const payload = {
    agent_id: process.env.BOLNA_AGENT_ID,
    recipient_phone_number: candidate.phone,
    user_data: {
      candidate_name: candidate.name,
      candidate_role: candidate.role,
      candidate_id: candidate.id,
      screening_id: screeningId,
      language_preference: candidate.language_preference
    }
  };

  const response = await fetch("https://api.bolna.dev/call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BOLNA_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Bolna API error (${response.status}): ${responseText}`);
  }

  const responseJson = JSON.parse(responseText);

  return {
    success: true,
    bolnaCallId: responseJson.call_id
  };
}
