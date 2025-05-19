import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req) {
  try {
    // Get file from form
    const formData = await req.formData();
    const file = formData.get('resume');

    if (!file || !file.arrayBuffer) {
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    // Compose the prompt
   const prompt = `
You are an ATS (Applicant Tracking System) simulator.

Read the following resume and provide a concise, structured evaluation.

1. Give an overall ATS compatibility score out of 100.
2. Then, list:
   - **Strengths** (bullet points)
   - **Weaknesses** (bullet points)
   - **Recommendations for Improvement** (bullet points)

Be brief and to the point. Do NOT include large blocks of analysis or excessive explanation. Stick to this exact format:

---
ATS Score: <number>/100

**Strengths:**
- <point 1>
- <point 2>

**Weaknesses:**
- <point 1>
- <point 2>

**Recommendations:**
- <suggestion 1>
- <suggestion 2>
---

Resume:
${resumeText}
`;


    // Gemini API call
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error('Gemini API error:', raw);
      return NextResponse.json({ error: 'Failed to get valid response from Gemini API' }, { status: 500 });
    }

    let dataJson;
    try {
      dataJson = JSON.parse(raw);
    } catch (err) {
      console.error('Invalid JSON from Gemini:', raw);
      return NextResponse.json({ error: 'Received invalid response from Gemini API' }, { status: 500 });
    }

    const result = dataJson.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const scoreMatch = result.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const feedback = result.replace(/Score:\s*\d+/i, '').replace(/Feedback:/i, '').trim();

    return NextResponse.json({ score, feedback });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
