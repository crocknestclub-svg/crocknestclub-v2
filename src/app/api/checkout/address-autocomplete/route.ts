import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.length < 3) return NextResponse.json({ ok: true, suggestions: [] });
  // Stub suggestions; replace with Places API call if needed
  const suggestions = [
    `${q} Street, Area, City`,
    `${q} Nagar, City`,
    `${q} Road, Locality, City`
  ];
  return NextResponse.json({ ok: true, suggestions });
}


