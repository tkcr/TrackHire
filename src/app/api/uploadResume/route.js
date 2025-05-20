import { NextResponse } from 'next/server';
import { extractText } from 'unpdf';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume');

    if (!file?.arrayBuffer) {
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // ✅ Only one call to extractText
    const { text } = await extractText(uint8, { mergePages: true });

    const prompt = `
You are an ATS (Applicant Tracking System) simulator.

Read the following resume and provide a concise, structured evaluation.

1. Give an overall ATS compatibility score out of 100.
2. Then, list:
   - **Strengths**
   - **Weaknesses**
   - **Recommendations for Improvement**

Stick to this format:

---
ATS Score: <number>/100

**Strengths:**
- …

**Weaknesses:**
- …

**Recommendations:**
- …
---

Resume:
${text}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const raw = await response.text();
    if (!response.ok) {
      console.error('Gemini API error:', raw);
      return NextResponse.json({ error: 'Failed to get valid response from Gemini API' }, { status: 500 });
    }

    const dataJson = JSON.parse(raw);
    const result = dataJson.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const match = result.match(/ATS Score:\s*(\d+)/i);
    const score = match ? parseInt(match[1], 10) : null;
    const feedback = result;

    return NextResponse.json({ score, feedback });
  } catch (err) {
    console.error('UploadResume Error:', err);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
