import clientPromise from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email });

  if (!user || user.password !== password) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
    expiresIn: '1d',
  });

  return Response.json({ message: 'Login successful', token }, { status: 200 });
}
