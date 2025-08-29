import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, step, answers, type } = await request.json();

    if (!userId || !step || !answers || !type) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Calcular pontuação total
    const totalScore = Object.values(answers).reduce((sum: number, score: any) => sum + score, 0);
    const averageScore = totalScore / Object.keys(answers).length;

    const { data, error } = await supabase
      .from('scores')
      .insert([
        {
          user_id: userId,
          step,
          answers,
          type,
          total_score: totalScore,
          average_score: averageScore,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Erro ao salvar pontuação:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar pontuação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Pontuação salva com sucesso',
      score: data[0],
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
    const userId = searchParams.get('userId');
    const step = searchParams.get('step');
    const type = searchParams.get('type');

    let query = supabase.from('scores').select('*');

    if (userId) query = query.eq('user_id', userId);
    if (step) query = query.eq('step', step);
    if (type) query = query.eq('type', type);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pontuações:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar pontuações' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      scores: data,
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
