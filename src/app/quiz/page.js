'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  useEffect(() => {
    fetch('/api/getMCQs')
      .then(res => res.json())
      .then(data => setMcqs(data.mcqs || []));
  }, []);

  const handleChange = (questionId, selected) => {
    setAnswers(prev => ({ ...prev, [questionId]: selected }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    let wrong = [];

    mcqs.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      } else {
        wrong.push({
          id: q.id,
          question: q.question,
          selected: answers[q.id] || 'Not Answered',
          correct: q.answer,
          explanation: q.explanation,
          options: q.options,
        });
      }
    });

    setScore(correct);
    setWrongAnswers(wrong);
    setSubmitted(true);

    const token = localStorage.getItem('token');
    await fetch('/api/submitScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ score: correct, total: mcqs.length })
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-2xl font-bold mb-4">🧠 Tech Quiz</h1>

      {mcqs.length === 0 && <p>Loading questions...</p>}

      {mcqs.map((q) => (
        <div key={q.id} className="mb-6">
          <strong>{q.id}. {q.question}</strong>
          <div className="ml-4 mt-2">
            {Object.entries(q.options).map(([key, val]) => (
              <label key={key} className="block">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={key}
                  onChange={() => handleChange(q.id, key)}
                  disabled={submitted}
                  checked={answers[q.id] === key}
                /> {key}. {val}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">✅ You scored {score} out of {mcqs.length}</h2>

          {wrongAnswers.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2">🔍 Review Incorrect Answers</h3>
              {wrongAnswers.map((item, idx) => (
                <div key={idx} className="bg-red-50 border border-red-300 p-4 mb-4 rounded">
                  <p><strong>{item.id}. {item.question}</strong></p>
                  <p className="text-sm text-gray-700">
                    ❌ Your answer: <span className="text-red-700">{item.selected}</span><br />
                    ✅ Correct answer: <span className="text-green-700">{item.correct}</span><br />
                    💡 Explanation: {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
