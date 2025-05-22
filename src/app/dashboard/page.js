// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

// export default function Dashboard() {
//   const router = useRouter();
//   const [scores, setScores] = useState([]);

//   useEffect(() => {
//     const fetchScores = async () => {
//       const token = localStorage.getItem('token');
//       const res = await fetch('/api/getUserScores', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setScores(data.scores || []);
//     };

//     fetchScores();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <button
//           onClick={() => router.push('/resume')}
//           className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700"
//         >
//           📄 ATS Resume Scorer
//         </button>
//         <button
//           onClick={() => router.push('/quiz')}
//           className="bg-green-600 text-white p-4 rounded shadow hover:bg-green-700"
//         >
//           🧠 Take Tech Quiz
//         </button>
//       </div>

//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">📈 Quiz Performance History</h2>
//         {scores.length === 0 ? (
//           <p>No quiz attempts yet.</p>
//         ) : (
//           <>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={scores.map(s => ({
//                 date: new Date(s.createdAt).toLocaleDateString(),
//                 score: (s.score / s.total) * 100,
//               }))}>
//                 <XAxis dataKey="date" />
//                 <YAxis domain={[0, 100]} />
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>

//             <h3 className="mt-6 mb-2 text-lg font-bold">📜 Previous Attempts</h3>
//             <ul className="space-y-2">
//               {scores.map((s, idx) => (
//                 <li key={idx} className="bg-gray-800 text-white p-3 rounded">
//                   <strong>{new Date(s.createdAt).toLocaleString()}</strong> — Scored {s.score}/{s.total}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/getUserScores', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setScores(data.scores || []);
    };

    fetchScores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        🚪 Logout
      </button>

      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => router.push('/resume')}
          className="bg-blue-600 text-white p-4 rounded shadow hover:bg-blue-700"
        >
          📄 ATS Resume Scorer
        </button>
        <button
          onClick={() => router.push('/quiz')}
          className="bg-green-600 text-white p-4 rounded shadow hover:bg-green-700"
        >
          🧠 Take Tech Quiz
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📈 Quiz Performance History</h2>
        {scores.length === 0 ? (
          <p>No quiz attempts yet.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scores.map(s => ({
                date: new Date(s.createdAt).toLocaleDateString(),
                score: (s.score / s.total) * 100,
              }))}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            <h3 className="mt-6 mb-2 text-lg font-bold">📜 Previous Attempts</h3>
            <ul className="space-y-2">
              {scores.map((s, idx) => (
                <li key={idx} className="bg-gray-800 text-white p-3 rounded">
                  <strong>{new Date(s.createdAt).toLocaleString()}</strong> — Scored {s.score}/{s.total}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
