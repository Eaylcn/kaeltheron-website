import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Kullanıcı adı kontrolü
    const existingUser = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existingEmail = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingEmail.rows.length > 0) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kullanıcıyı veritabanına ekle
    const { rows } = await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${hashedPassword})
      RETURNING username, email
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 