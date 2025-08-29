import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, completed, completedAt } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('candidates')
      .update({
        completed: completed || true,
        completed_at: completedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Erro ao atualizar candidato:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar candidato' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Candidato marcado como completo',
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
