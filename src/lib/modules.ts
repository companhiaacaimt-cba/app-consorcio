import { Module } from './types';

export const MODULES: Module[] = [
  {
    id: 1, icon: '🧠', title: 'Venda Socrática', nivel: 'Iniciante',
    desc: 'Perguntas que fazem o cliente se convencer sozinho',
    subs: [
      { id: '1.1', icon: '❓', title: 'O que é Venda Socrática?', desc: 'Entenda o método de perguntas que gera convicção no cliente' },
      { id: '1.2', icon: '🎯', title: 'Perguntas de Diagnóstico', desc: 'Como descobrir o sonho, a dor e o prazo do cliente' },
      { id: '1.3', icon: '🔄', title: 'Perguntas de Implicação', desc: 'Fazendo o cliente sentir o custo de não agir agora' },
      { id: '1.4', icon: '💡', title: 'Perguntas de Solução', desc: 'O cliente chega à resposta antes de você oferecer' },
      { id: '1.5', icon: '🎬', title: 'Roteiro Socrático Completo', desc: 'Praticando um atendimento do início ao fim com o método' },
    ],
  },
  {
    id: 2, icon: '👥', title: 'Perfis de Clientes', nivel: 'Iniciante',
    desc: 'Médicos, empresários, autônomos, jovens — cada um tem linguagem diferente',
    subs: [
      { id: '2.1', icon: '🩺', title: 'Médicos e Profissionais de Saúde', desc: 'Linguagem técnica, tempo escasso e alto poder aquisitivo' },
      { id: '2.2', icon: '💼', title: 'Empresários e Donos de Negócio', desc: 'Foco em patrimônio, expansão e otimização fiscal' },
      { id: '2.3', icon: '🔨', title: 'Autônomos e MEIs', desc: 'Renda variável, desconfiança de compromisso fixo' },
      { id: '2.4', icon: '🎓', title: 'Jovens e Primeira Compra', desc: 'Sem entrada, sonho do primeiro imóvel ou carro' },
      { id: '2.5', icon: '👨‍👩‍👧', title: 'Famílias e Casais', desc: 'Decisão em dupla, emoção x razão no mesmo atendimento' },
      { id: '2.6', icon: '🏢', title: 'Investidores', desc: 'Visão de longo prazo, rentabilidade e carteira diversificada' },
    ],
  },
  {
    id: 3, icon: '🛑', title: 'Objeções Matadoras', nivel: 'Intermediário',
    desc: 'As 10 objeções mais comuns e como contornar cada uma',
    subs: [
      { id: '3.1', icon: '⏳', title: '"Vou pensar..."', desc: 'Como identificar a objeção real por trás da procrastinação' },
      { id: '3.2', icon: '💸', title: '"Tá caro / não tenho dinheiro"', desc: 'Quebrando a objeção de preço com contexto de valor' },
      { id: '3.3', icon: '🎲', title: '"E se eu nunca for sorteado?"', desc: 'Reposicionando o sorteio como bônus, não como base' },
      { id: '3.4', icon: '🏦', title: '"Prefiro financiar"', desc: 'Comparativo de juros que faz o cliente refazer a conta' },
      { id: '3.5', icon: '🤔', title: '"Vou falar com minha esposa/sócio"', desc: 'Como manter o processo vivo sem pressionar' },
      { id: '3.6', icon: '📰', title: '"Já ouvi falar mal de consórcio"', desc: 'Resgatando credibilidade com dados e Porto Seguro' },
      { id: '3.7', icon: '📅', title: '"Não é o momento certo"', desc: 'Revelando o custo real de esperar' },
      { id: '3.8', icon: '🔍', title: '"Deixa eu pesquisar mais"', desc: 'Ancorando o cliente antes que ele vá embora' },
      { id: '3.9', icon: '💰', title: '"Tenho dinheiro guardado"', desc: 'Mostrando como consórcio potencializa quem já tem reserva' },
      { id: '3.10', icon: '🏁', title: '"Já tenho um consórcio"', desc: 'Oportunidade de upgrade, segundo bem ou transferência' },
    ],
  },
  {
    id: 4, icon: '🔢', title: 'Matemática do Consórcio', nivel: 'Intermediário',
    desc: 'Números na ponta da língua — taxa, lance, fundo de reserva',
    subs: [
      { id: '4.1', icon: '📐', title: 'Como Calcular a Parcela', desc: 'Fórmula simples: crédito × (taxa + fundo) ÷ prazo' },
      { id: '4.2', icon: '🏷️', title: 'Taxa de Administração', desc: 'O que é, como incide e como apresentar sem assustar' },
      { id: '4.3', icon: '🛡️', title: 'Fundo de Reserva', desc: 'Para que serve, quem paga e o que acontece com o saldo' },
      { id: '4.4', icon: '🚀', title: 'Cálculo de Lance', desc: 'Lance livre, fixo e embutido — quanto precisa e quando vale' },
      { id: '4.5', icon: '📊', title: 'Consórcio vs Financiamento', desc: 'Simulação lado a lado: quanto o cliente economiza' },
      { id: '4.6', icon: '💹', title: 'Reajuste do Crédito', desc: 'INCC, IPCA e índices — como o crédito cresce junto com o mercado' },
    ],
  },
  {
    id: 5, icon: '🎯', title: 'Prospecção', nivel: 'Intermediário',
    desc: 'Como encontrar clientes, abordar e qualificar',
    subs: [
      { id: '5.1', icon: '🗺️', title: 'Mapeando seu Mercado', desc: 'Definindo nichos, regiões e perfis prioritários' },
      { id: '5.2', icon: '📱', title: 'Prospecção no WhatsApp', desc: 'Abordagem direta, listas e grupos sem parecer spam' },
      { id: '5.3', icon: '📸', title: 'Prospecção no Instagram', desc: 'Conteúdo que atrai, DM que converte, stories que educam' },
      { id: '5.4', icon: '🗺️', title: 'Google Maps + Apify', desc: 'Extraindo listas de clínicas, empresas e negócios locais' },
      { id: '5.5', icon: '🤝', title: 'Parcerias Estratégicas', desc: 'Corretores, concessionárias, contadores — rede de indicação' },
      { id: '5.6', icon: '🔎', title: 'Qualificação de Leads', desc: 'Perguntas rápidas para saber se vale o tempo do atendimento' },
    ],
  },
  {
    id: 6, icon: '✅', title: 'Fechamento', nivel: 'Avançado',
    desc: 'Técnicas de fechamento para cada perfil',
    subs: [
      { id: '6.1', icon: '⏱️', title: 'Urgência Real x Urgência Falsa', desc: 'Como criar senso de urgência sem manipular' },
      { id: '6.2', icon: '🔑', title: 'Fechamento Alternativo', desc: 'Duas opções onde qualquer resposta é sim' },
      { id: '6.3', icon: '🧩', title: 'Fechamento por Resumo', desc: 'Recapitulando os ganhos antes de pedir a decisão' },
      { id: '6.4', icon: '😶', title: 'O Silêncio como Técnica', desc: 'Quem fala primeiro depois da proposta, perde' },
      { id: '6.5', icon: '📝', title: 'Fechamento por Formulário', desc: 'Avançar para o preenchimento como gesto natural' },
      { id: '6.6', icon: '🔄', title: 'Pós-venda e Indicações', desc: 'Pedindo 2 nomes após o fechamento — duplicando a carteira' },
    ],
  },
  {
    id: 7, icon: '🆕', title: 'Guia NewCon', nivel: 'Avançado',
    desc: 'Atualizações e novidades do sistema NewCon — Porto Bank (v.20250725)',
    subs: [
      { id: '7.1', icon: '🔄', title: 'Por que mudamos para o NewCon?', desc: 'Porto dobrou de tamanho, Pleno não suportava mais — o que muda' },
      { id: '7.2', icon: '📝', title: 'Novo Fluxo de Contratação', desc: '1º assinatura eletrônica, 2º geração do boleto — diferente do Pleno' },
      { id: '7.3', icon: '🏦', title: 'Dados Bancários e Seguro Prestamista', desc: 'Dados obrigatórios na proposta, taxa 0,038%, faixa etária 18–75 anos' },
      { id: '7.4', icon: '🏢', title: 'Grupos e Titularidade PJ', desc: 'Nova nomenclatura com 1 caractere a mais e regras de titularidade' },
      { id: '7.5', icon: '📱', title: 'Canais Digitais e Pós-venda', desc: 'App PF, App PJ, área do cliente, 2º titular e gestão de carteira' },
      { id: '7.6', icon: '🎰', title: 'Assembleias e Contemplação', desc: 'Loteria Federal às 15h, prazo de lance até 22h do dia anterior' },
      { id: '7.7', icon: '🔁', title: 'Substituição de Lance', desc: '2 dias úteis para pagar, máx. 1 substituição/mês, sem contemplação se não pagar' },
      { id: '7.8', icon: '💱', title: 'Troca de Crédito', desc: 'Nova taxa: 0,3% móveis e 0,5% imóveis cobrada na próxima parcela' },
      { id: '7.9', icon: '🔗', title: 'Junção de Cotas', desc: '2+ cotas contempladas para um único bem — unificação foi descontinuada' },
      { id: '7.10', icon: '♻️', title: 'Reativação e Descontemplação', desc: 'Reativar em até 6 meses; descontemplação = cancelamento automático desde 01/07/2024' },
      { id: '7.11', icon: '⚠️', title: 'Fluxo de Inadimplência', desc: 'D+90 cotas não contempladas; D+91 contempladas sem bem indicado' },
    ],
  },
];

export const QUICK_ACTIONS = [
  { label: '🧠 Praticar venda socrática', msg: 'Quero praticar venda socrática. Você faz o papel de um cliente médico interessado em imóvel e eu uso o método socrático.', mode: 'roleplay' },
  { label: '🛑 Treinar objeções', msg: 'Me dê a objeção mais difícil que um cliente pode falar e me ensine como contornar com um exemplo prático.', mode: 'study' },
  { label: '🔢 Calcular ao vivo', msg: 'Exemplo prático: crédito de R$200k em 120 meses, como apresento os números para o cliente de forma simples?', mode: 'study' },
  { label: '🎯 Simular fechamento', msg: 'Simule um cliente que está quase fechando mas hesita. Quero praticar técnicas de fechamento.', mode: 'roleplay' },
];

export const WELCOME_MESSAGE = `Olá! 🎯 Bem-vindo à **Academia Porto Seguro Consórcio**!

Sou o **Prof. Dr. Ricardo Mestre**, seu mentor de vendas de alto desempenho.

Aqui você vai dominar desde a **abordagem socrática** até o **fechamento certeiro**, passando por matemática, prospecção, objeções e o **Guia NewCon** completo.

**7 módulos, 45 seções práticas** — incluindo todas as novidades do sistema Porto Bank v.20250725.

Por onde quer começar? 🚀`;
