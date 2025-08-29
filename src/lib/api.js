import supabaseClient from './supabase_client.js';

export async function getQuestionsAndOptions() {
    const { data: questions, error: questionsError } = await supabaseClient
        .from('perguntas')
        .select('*')
        .order('pagina', { ascending: true })
        .order('ordem', { ascending: true });
    
    if (questionsError) throw questionsError;

    const { data: options, error: optionsError } = await supabaseClient
        .from('opcoes_resposta')
        .select('*');

    if (optionsError) throw optionsError;

    return { questions, options };
}

export async function checkCandidateExists(name, email) {
    const { data, error, count } = await supabaseClient
        .from('candidatos')
        .select('*', { count: 'exact', head: true })
        .eq('nome_completo', name)
        .eq('email', email);

    if (error) {
        console.error('Error checking candidate:', error);
        throw error;
    }
    
    return count > 0;
}

export async function submitAssessment(candidate, answers) {
    const { data: candidateData, error: candidateError } = await supabaseClient
        .from('candidatos')
        .insert({
            nome_completo: candidate.name,
            email: candidate.email
        })
        .select()
        .single();
    
    if (candidateError) throw candidateError;

    const { data: evaluationData, error: evaluationError } = await supabaseClient
        .from('avaliacoes')
        .insert({
            candidato_id: candidateData.id,
            status: 'em_andamento'
        })
        .select()
        .single();

    if (evaluationError) throw evaluationError;

    const responses = [];
    for (const questionId in answers) {
        for (const optionId of answers[questionId]) {
            responses.push({
                avaliacao_id: evaluationData.id,
                opcao_id: optionId
            });
        }
    }

    const { error: responsesError } = await supabaseClient
        .from('respostas_candidato')
        .insert(responses);

    if (responsesError) throw responsesError;

    const { error: updateError } = await supabaseClient
        .from('avaliacoes')
        .update({ status: 'concluido', finalizado_em: new Date().toISOString() })
        .eq('id', evaluationData.id);

    if (updateError) throw updateError;

    return { success: true };
}
