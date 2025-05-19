'use client';
import { useState } from 'react';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a file');

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    setScore(null);
    setFeedback('');

    try {
      const res = await fetch('/api/uploadResume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
        setFeedback(data.feedback);
      } else {
        setFeedback(data.error || 'Failed to score resume.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setFeedback('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900 text-center">Resume ATS Scorer</h1>

        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          {/* Custom file upload button */}
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Choose Resume File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          {file && (
            <p className="text-gray-700 text-sm truncate" title={file.name}>
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? 'Analyzing...' : 'Upload & Score'}
          </button>
        </form>

        {score !== null && (
          <div className="mt-8 bg-gray-100 p-6 rounded-md border border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">ATS Score: {score}/100</h2>
            <pre className="whitespace-pre-wrap text-gray-800 text-sm">{feedback}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
