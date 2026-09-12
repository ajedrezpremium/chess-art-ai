import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DEMO_COMBINATIONS } from '@/lib/data/combinations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const player = searchParams.get('player') || '';
    const year = searchParams.get('year') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'number';
    const order = searchParams.get('order') || 'asc';

    let data: any[] | null = null;
    let count: number | null = null;

    try {
      const supabase = await createClient();
      let query = supabase
        .from('combinations')
        .select('*', { count: 'exact' });
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,white_player.ilike.%${search}%,black_player.ilike.%${search}%`);
      }
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }
      if (player) {
        query = query.or(`white_player.ilike.%${player}%,black_player.ilike.%${player}%`);
      }
      if (year) {
        query = query.eq('year', parseInt(year));
      }
      if (category) {
        query = query.eq('category', category);
      }
      
      query = query.order(sort, { ascending: order === 'asc' });
      query = query.range((page - 1) * limit, page * limit - 1);
      
      const res = await query;
      if (!res.error && res.data && res.data.length > 0) {
        data = res.data;
        count = res.count;
      }
    } catch {
      // Use fallback
    }

    if (!data) {
      let filtered = [...DEMO_COMBINATIONS];
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(s) || 
          c.white_player.toLowerCase().includes(s) || 
          c.black_player.toLowerCase().includes(s)
        );
      }
      if (difficulty) {
        filtered = filtered.filter(c => c.difficulty === difficulty);
      }
      if (player) {
        const p = player.toLowerCase();
        filtered = filtered.filter(c => 
          c.white_player.toLowerCase().includes(p) || 
          c.black_player.toLowerCase().includes(p)
        );
      }
      if (year) {
        filtered = filtered.filter(c => c.year === parseInt(year));
      }
      if (category) {
        filtered = filtered.filter(c => c.category === category);
      }

      filtered.sort((a: any, b: any) => {
        const valA = a[sort] ?? '';
        const valB = b[sort] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return order === 'asc' ? valA - valB : valB - valA;
        }
        return order === 'asc' 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });

      count = filtered.length;
      data = filtered.slice((page - 1) * limit, page * limit);
    }
    
    return NextResponse.json({
      combinations: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}