import { NextResponse } from 'next/server';
import pjson from '~/package.json';

export async function GET() {
  return NextResponse.json({ version: pjson.version });
}
