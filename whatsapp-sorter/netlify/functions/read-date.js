exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { image, mediaType } = body;
  if (!image) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No image provided' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType || 'image/png', data: image }
            },
            {
              type: 'text',
              text: `What date and time is shown in this WhatsApp chat header?

It could be in two formats:
1. Full date: "9/26/24, 15:10" (month/day/2-digit-year, time) 
2. No year: "18 January, 15:43" or "5 February, 09:04" or "23 March, 14:39" (day MonthName, time) — treat these as year 2026

Reply ONLY with JSON:
{"found":true,"raw":"9/26/24, 15:10","month":9,"day":26,"year":24,"time":"15:10"}

For no-year format like "18 January, 15:43":
{"found":true,"raw":"18 January, 15:43","month":1,"day":18,"year":2026,"time":"15:43"}

If no date found: {"found":false,"raw":""}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
