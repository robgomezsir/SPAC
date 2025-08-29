import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { nome, email, telefone, empresa, cargo } = await request.json();

    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert([
        {
          nome,
          email,
          telefone,
          empresa,
          cargo,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Erro ao criar candidato:', error);
      return NextResponse.json(
        { error: 'Erro ao criar candidato' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Candidato criado com sucesso',
      candidate: data[0],
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar candidatos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar candidatos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      candidates: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
