import { NextRequest, NextResponse } from 'next/server';

const MAX_HISTORY = 20; // Máximo de mensagens enviadas à IA por contexto

const ALLOWED_ORIGINS = new Set([
  'https://app-consorcio.vercel.app',
  'null',
]);

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://app-consorcio.vercel.app';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(req: NextRequest, data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...corsHeaders(req),
      ...(init?.headers ?? {}),
    },
  });
}

// Rate limiting simples em memória (para produção, usar Redis/KV)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1h
    return true;
  }
  if (entry.count >= 60) return false; // 60 mensagens/hora
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `Você é o Prof. Dr. Ricardo Mestre, especialista em consórcios da Porto Seguro e mentor de vendas de alto desempenho.

Seu cronograma de treinamento cobre:
- Módulo 1: Venda Socrática — perguntas que fazem o cliente se convencer
- Módulo 2: Perfis de Clientes — médicos, empresários, autônomos, jovens
- Módulo 3: Objeções Matadoras — as 10 objeções e como contornar
- Módulo 4: Matemática do Consórcio — números na ponta da língua
- Módulo 5: Prospecção — encontrar, abordar e qualificar clientes
- Módulo 6: Fechamento — técnicas para cada perfil
- Módulo 7: Guia NewCon — sistema Porto Bank v.20250725

REGRAS ABSOLUTAS — jamais quebre:
1. Nunca diga "não sei" ou "não tenho essa informação"
2. Nunca oriente o aluno a buscar suporte externo ou outro canal
3. Sempre ensine com exemplos práticos do dia a dia de vendas
4. Sempre termine com UMA pergunta para engajar o aluno
5. Adapte a linguagem ao perfil: médico→técnica; jovem→informal; empresário→ROI

SEU ESTILO:
- Direto, prático, orientado a resultados
- Celebra o progresso do aluno com entusiasmo genuíno
- Em roleplay: você É o cliente (com objeções reais), o aluno é o consultor
- Em quiz: faz perguntas, avalia, dá nota e corrige com exemplos

BASE TÉCNICA — PORTO SEGURO CONSÓRCIO:
- Regulamentado pelo Banco Central (Lei 11.795/2008)
- Imóveis até R$500k, veículos leves, pesados, motos, serviços
- Taxa de administração: 15% a 22%
- Grupos: 60 a 240 meses
- Contemplação: sorteio mensal + lance (livre, fixo ou embutido)
- Lance embutido: usa parte do crédito como lance
- Fundo de reserva: ~2%
- Seguro prestamista: 0,038% para todos os grupos (desde 05/05/2025)
- Faixa etária do seguro: 18 a 75 anos (contratar até 80)

GUIA NEWCON (v.20250725):
- Pleno substituído: Porto dobrou de tamanho, Newcon tem mais capacidade/segurança
- Novo fluxo: 1º assinatura eletrônica → 2º boleto (diferente do Pleno)
- Dados bancários obrigatórios na proposta (Resolução Bacen 285/362)
- Nomenclatura dos grupos: 1 caractere a mais que antes
- Assembleias: horário fixo 15h, usando loteria federal anterior
- Prazo de lance: até 22h do dia anterior à assembleia
- Substituição de lance: 2 dias úteis para pagar, máx 1/mês
- Troca de crédito: taxa 0,3% móveis / 0,5% imóveis na próxima parcela
- Junção de cotas: DISPONÍVEL (2+ cotas para um bem)
- Unificação: DESCONTINUADA no Newcon
- Reativação: até 6 meses após cancelamento
- Descontemplação (desde 01/07/2024): cota cancelada automaticamente
- Inadimplência NÃO contemplada: cancelamento em D+90
- 2º titular: site/WhatsApp/Central para cotas pré-migração

Responda SEMPRE em português brasileiro. Máximo 280 palavras por resposta (exceto quando pedirem mais).`;

async function callClaude(messages: { role: string; content: string }[], systemPrompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Claude error ${response.status}: ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  return {
    reply: data.content?.[0]?.text ?? 'Desculpe, não consegui gerar uma resposta.',
    model: 'claude' as const,
  };
}

async function callDeepseek(messages: { role: string; content: string }[], systemPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY não configurada');

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Deepseek error ${response.status}: ${JSON.stringify(err)}`);
  }

  const data = await response.json();
  return {
    reply: data.choices?.[0]?.message?.content ?? 'Desculpe, não consegui gerar uma resposta.',
    model: 'deepseek' as const,
  };
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const clientKey = getRateLimitKey(req);
  if (!checkRateLimit(clientKey)) {
    return json(
      req,
      { error: 'Limite de mensagens atingido. Aguarde 1 hora.' },
      { status: 429 }
    );
  }

  let body: { messages?: unknown[]; studentName?: string; moduleTitle?: string; sectionTitle?: string; mode?: string };
  try {
    body = await req.json();
  } catch {
    return json(req, { error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const { messages = [], studentName, moduleTitle, sectionTitle, mode } = body as {
    messages: { role: string; content: string }[];
    studentName?: string;
    moduleTitle?: string;
    sectionTitle?: string;
    mode?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return json(req, { error: 'Nenhuma mensagem fornecida.' }, { status: 400 });
  }

  // Sanitiza e limita histórico
  const sanitized = messages
    .filter((m) => m && typeof m.role === 'string' && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content.slice(0, 4000), // limita tamanho de msg individual
    }));

  // Enriquece o system prompt com contexto
  let systemPrompt = SYSTEM_PROMPT;
  if (studentName) systemPrompt += `\n\nNome do aluno: ${studentName}. Use o nome para personalizar.`;
  if (moduleTitle) systemPrompt += `\nContexto atual: Módulo "${moduleTitle}"${sectionTitle ? `, Seção "${sectionTitle}"` : ''}.`;
  if (mode === 'roleplay') systemPrompt += '\nMODO ROLEPLAY ATIVO: Você agora É o cliente. Finja ser um cliente real com objeções. O aluno é o consultor.';
  if (mode === 'quiz') systemPrompt += '\nMODO QUIZ ATIVO: Faça perguntas sobre o módulo atual, avalie as respostas e atribua uma nota de 0 a 100 ao final.';

  // Tenta Claude → fallback Deepseek
  let result: { reply: string; model: 'claude' | 'deepseek' };
  try {
    result = await callClaude(sanitized, systemPrompt);
  } catch (claudeError) {
    console.warn('[chat] Claude falhou, tentando Deepseek:', claudeError);
    try {
      result = await callDeepseek(sanitized, systemPrompt);
    } catch (deepseekError) {
      console.error('[chat] Deepseek também falhou:', deepseekError);
      return json(
        req,
        { error: 'Ambos os serviços de IA estão indisponíveis. Tente novamente em instantes.' },
        { status: 503 }
      );
    }
  }

  return json(req, result);
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  });
}
