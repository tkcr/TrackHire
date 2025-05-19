import { connectToDB } from '@/lib/db';
import Score from '@/models/score';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization');
    const token = auth?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectToDB();

    const scores = await Score.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ scores });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}
