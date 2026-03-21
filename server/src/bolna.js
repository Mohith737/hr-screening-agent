import fetch from 'node-fetch';

export async function triggerScreeningCall(candidate) {
  const agentId = "ab272a30-9405-4c18-8297-173a0eeac823";
  const apiKey = process.env.BOLNA_API_KEY;

  console.log('Agent ID:', agentId);
  console.log('API Key:', apiKey ? 'loaded' : 'MISSING');

  const body = JSON.stringify({
    agent_id: agentId,
    recipient_phone_number: candidate.phone,
    user_data: {
      candidate_name: candidate.name,
      candidate_role: candidate.role
    }
  });

  console.log('Sending body:', body);

  const response = await fetch('https://api.bolna.dev/call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: body
  });

  const responseText = await response.text();
  console.log('Bolna status:', response.status);
  console.log('Bolna body:', responseText);

  if (!response.ok) {
    throw new Error(`Bolna API error: ${responseText}`);
  }

  return JSON.parse(responseText);
}
