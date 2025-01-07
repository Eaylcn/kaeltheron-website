import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Kullanıcıyı veritabanında ara
    const { rows } = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Kullanıcı adı veya şifre hatalı' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 