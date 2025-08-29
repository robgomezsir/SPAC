import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar todas as pontuações do usuário
    const { data: scores, error: scoresError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('step', { ascending: true });

    if (scoresError) {
      console.error('Erro ao buscar pontuações:', scoresError);
      return NextResponse.json(
        { error: 'Erro ao buscar pontuações' },
        { status: 500 }
      );
    }

    // Buscar informações do candidato
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', userId)
      .single();

    if (candidateError) {
      console.error('Erro ao buscar candidato:', candidateError);
    }

    // Calcular estatísticas
    const totalQuestions = scores.reduce((sum, score) => sum + Object.keys(score.answers).length, 0);
    const completedSteps = scores.length;
    const totalScore = scores.reduce((sum, score) => sum + score.total_score, 0);
    const averageScore = totalScore / totalQuestions;
    const estimatedScore = Math.round((averageScore / 5) * 100);

    const summary = {
      totalQuestions,
      completedSteps,
      completionDate: candidate?.completed_at || new Date().toISOString(),
      estimatedScore,
      scores: scores.map(score => ({
        step: score.step,
        type: score.type,
        totalScore: score.total_score,
        averageScore: score.average_score,
        questionCount: Object.keys(score.answers).length,
      })),
      candidate: candidate ? {
        nome: candidate.nome,
        email: candidate.email,
        empresa: candidate.empresa,
        cargo: candidate.cargo,
      } : null,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
