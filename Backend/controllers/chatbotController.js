const asyncHandler = require('express-async-handler');

// @desc    Handle chatbot queries
// @route   POST /api/chatbot/query
// @access  Public
const handleChatQuery = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('A prompt is required.');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500);
    throw new Error('Server is missing the Gemini API Key.');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API Error:", data);
        throw new Error(data.error?.message || 'Failed to get response from AI.');
    }

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        res.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
        console.error("Unexpected Gemini API response structure:", data);
        throw new Error('Received an unexpected response from the AI.');
    }

  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  handleChatQuery,
};
