export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { messages } = req.body;
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'DEEPSEEK_API_KEY ausente.' });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: "system", 
            content: "Você é o Prof. Dr. Ricardo Mestre. REGRA DE OURO: Responda em no máximo 3 parágrafos curtos. Seja direto e didático. Explique um conceito e sempre termine com uma pergunta curta para o aluno. Não use tabelas complexas." 
          },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro de comunicação');

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}
