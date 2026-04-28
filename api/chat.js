export default async function handler(req, res) {
  // Apenas aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { messages } = req.body;
    
    // Puxando a sua chave secreta lá do "cofre" da Vercel
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'A chave da API (DEEPSEEK_API_KEY) não foi encontrada na Vercel.' });
    }

    // Fazendo a chamada para a DeepSeek (o formato é idêntico ao da OpenAI)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Usa o modelo principal da DeepSeek
        messages: [
          // O "system" diz como a IA deve se comportar
          { role: "system", content: "Você é o Prof. Dr. Ricardo Mestre, um especialista de alto nível em consórcios da Porto Seguro. Seu objetivo é ajudar o usuário a aprender sobre o tema, tirar dúvidas e simular vendas de consórcio. Seja didático, profissional e use emojis ocasionalmente." },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na comunicação com a IA.');
    }

    // Devolvendo a resposta da IA para o seu site
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
}
