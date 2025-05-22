// 'use client';
// import { useState } from 'react';

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <div className="min-h-screen bg-blue-500 flex items-center justify-center px-4">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
//         {isLogin ? <LoginForm /> : <SignupForm />}

//         <p className="mt-6 text-center text-gray-700">
//           {isLogin ? (
//             <>
//               New here?{' '}
//               <button
//                 onClick={() => setIsLogin(false)}
//                 className="text-blue-700 font-semibold underline hover:text-blue-900"
//               >
//                 Sign Up
//               </button>
//             </>
//           ) : (
//             <>
//               Already have an account?{' '}
//               <button
//                 onClick={() => setIsLogin(true)}
//                 className="text-blue-700 font-semibold underline hover:text-blue-900"
//               >
//                 Log In
//               </button>
//             </>
//           )}
//         </p>
//       </div>
//     </div>
//   );
// }

// function LoginForm() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       localStorage.setItem('token', data.token);
//       alert('Logged in successfully!');
//       window.location.href = '/dashboard';
//     } else {
//       alert(data.error || 'Login failed');
//     }
//   };

//   return (
//     <form onSubmit={handleLogin} className="flex flex-col gap-6">
//       <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Log In</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         required
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//         className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         required
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-700 text-white rounded-md py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-50"
//       >
//         {loading ? 'Logging in...' : 'Log In'}
//       </button>
//     </form>
//   );
// }

// function SignupForm() {
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch('/api/auth/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       alert('Registration successful! Please log in.');
//       window.location.reload();
//     } else {
//       alert(data.error || 'Registration failed');
//     }
//   };

//   return (
//     <form onSubmit={handleSignup} className="flex flex-col gap-6">
//       <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Sign Up</h2>

//       <input
//         type="text"
//         placeholder="Name"
//         required
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <input
//         type="email"
//         placeholder="Email"
//         required
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//         className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         required
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-700 text-white rounded-md py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-50"
//       >
//         {loading ? 'Registering...' : 'Sign Up'}
//       </button>
//     </form>
//   );
// }

'use client';
import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
        {isLogin ? <LoginForm /> : <SignupForm />}

        <p className="mt-6 text-center text-gray-700">
          {isLogin ? (
            <>
              New here?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-700 font-semibold underline hover:text-blue-900"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-700 font-semibold underline hover:text-blue-900"
              >
                Log In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Log In</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white rounded-md py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      {errorMsg && (
        <p className="text-red-600 text-center text-sm mt-2">{errorMsg}</p>
      )}
    </form>
  );
}

function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        window.location.reload(); // Refresh to show login form
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Sign Up</h2>

      <input
        type="text"
        placeholder="Name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white rounded-md py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </button>

      {errorMsg && (
        <p className="text-red-600 text-center text-sm mt-2">{errorMsg}</p>
      )}
    </form>
  );
}

