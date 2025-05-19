import { connectToDB } from '@/lib/db';
import Score from '@/models/score';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const auth = req.headers.get('authorization');
    const token = auth?.split(' ')[1];
    const { score, total } = await req.json();

    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectToDB();

    await Score.create({ user: userId, score, total });
    console.log('Saving score for user:', userId, score, total);


    return NextResponse.json({ message: 'Score saved' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error saving score' }, { status: 500 });
  }
}
