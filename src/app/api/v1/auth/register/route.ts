import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, nome, telefone, empresa, cargo } = await request.json();

    if (!email || !password || !nome) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          telefone,
          empresa,
          cargo,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (authData.user) {
      // Criar perfil do candidato na tabela candidates
      const { error: profileError } = await supabase
        .from('candidates')
        .insert([
          {
            id: authData.user.id,
            nome,
            email,
            telefone,
            empresa,
            cargo,
            created_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Não falhar se o perfil não puder ser criado
      }
    }

    return NextResponse.json({
      message: 'Usuário registrado com sucesso',
      user: authData.user,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
