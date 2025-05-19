import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prompt = `
Generate 5 multiple-choice questions on the following topics:
- Data Structures and Algorithms
- Operating Systems
- Computer Networks

For each question, format it exactly like this:

Q: <question text>
A. <option A>
B. <option B>
C. <option C>
D. <option D>
Answer: <correct option letter>
Explanation: <brief explanation of why it's correct>

Only output the formatted questions. Do not include any commentary.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const raw = await res.json();
    const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: 'Gemini returned no MCQs' }, { status: 500 });
    }

    // Parse the text into an array of MCQ objects
    const mcqs = text
      .split(/\nQ:/)
      .filter(Boolean)
      .map((block, i) => {
        const lines = block.trim().split('\n');
        const question = lines[0]?.trim();
        const options = {
          A: lines[1]?.replace(/^A\.\s*/, '') || '',
          B: lines[2]?.replace(/^B\.\s*/, '') || '',
          C: lines[3]?.replace(/^C\.\s*/, '') || '',
          D: lines[4]?.replace(/^D\.\s*/, '') || '',
        };
        const answerLine = lines.find(line => line.startsWith('Answer:'));
        const explanationLine = lines.find(line => line.startsWith('Explanation:'));
        const answer = answerLine?.split('Answer:')[1]?.trim();
        const explanation = explanationLine?.split('Explanation:')[1]?.trim();

        return {
          id: i + 1,
          question,
          options,
          answer,
          explanation: explanation || 'No explanation provided.',
        };
      });

    return NextResponse.json({ mcqs });
  } catch (error) {
    console.error('MCQ Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch MCQs' }, { status: 500 });
  }
}
