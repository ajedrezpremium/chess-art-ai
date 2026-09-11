import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
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
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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