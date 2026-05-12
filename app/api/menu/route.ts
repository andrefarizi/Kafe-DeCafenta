import { NextResponse } from 'next/server';

import { getGuestMenuList } from '@/src/controllers/menu-controller';

export async function GET() {
  const data = await getGuestMenuList();
  return NextResponse.json({ data });
}
