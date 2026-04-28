export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { prompt } = req.body;
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'DEEPSEEK_API_KEY não configurada.' });

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
            content: "Você é um Diretor de Arte focado em Marketing e Conversão. O usuário dará uma ideia básica. Sua tarefa é transformar isso em um PROMPT DETALHADO (em português) para o gerador de imagens Flux. Adicione elementos de iluminação, estilo fotográfico profissional e sugira um pequeno TEXTO DE IMPACTO para incluir dentro da arte. IMPORTANTE: Retorne APENAS o texto aprimorado pronto para uso, sem saudações ou introduções." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Erro na comunicação com a IA.');

    res.status(200).json({ enhancedPrompt: data.choices[0].message.content });
  } catch (error) {
    console.error('Erro ao melhorar prompt:', error);
    res.status(500).json({ error: error.message });
  }
}