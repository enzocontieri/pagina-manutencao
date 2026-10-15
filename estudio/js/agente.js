/* =====================================================================
   Ligação do estúdio com o servidor do agente.
   O endereço vem da meta "ajin-agente". Sem ele, o estúdio funciona
   sozinho: monta, exporta e guarda retornos no próprio navegador.
   O acesso é por login da equipe (link mágico do Supabase); o servidor
   confere se o e-mail está na tabela equipe antes de responder.
   ===================================================================== */
const API = (document.querySelector('meta[name="ajin-agente"]')?.content || '').replace(/\/$/, '')
const SUPABASE_URL = 'https://akqiejrzzajvqrzvqoay.supabase.co'
const SUPABASE_CHAVE = 'sb_publishable_gwr-TU9yBMO0vz7DKnY20Q_iDjsqkO2'

let cliente = null
async function supabase() {
  if (!cliente) {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm')
    cliente = createClient(SUPABASE_URL, SUPABASE_CHAVE)
  }
  return cliente
}

export const configurado = () => Boolean(API)

export async function sessao() {
  if (!API) return null
  const { data } = await (await supabase()).auth.getSession()
  return data.session
}

export async function entrar(email) {
  const sb = await supabase()
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href.split('#')[0], shouldCreateUser: false } })
  if (error) throw error
}

export async function sair() { await (await supabase()).auth.signOut() }

async function pedir(caminho, { metodo = 'GET', corpo } = {}) {
  const s = await sessao()
  if (!s) throw new Error('sem-login')
  const r = await fetch(API + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}` },
    body: corpo ? JSON.stringify(corpo) : undefined,
  })
  const texto = await r.text()
  const dados = texto ? JSON.parse(texto) : {}
  if (!r.ok) throw new Error(dados.erro || `Falha ${r.status}`)
  return dados
}

export const quemSou = () => pedir('/api/eu')
/* conversa: devolve { resposta, modelo?, peca?, perguntas? } */
export const conversar = (dados) => pedir('/api/conversa', { metodo: 'POST', corpo: dados })
export const enviarParaAprovacao = (dados) => pedir('/api/pecas', { metodo: 'POST', corpo: dados })
export const fila = () => pedir('/api/pecas')
export const decidir = (id, decisao, nota = '') => pedir(`/api/pecas/${id}/decisao`, { metodo: 'POST', corpo: { decisao, nota } })
export const parceiros = () => pedir('/api/parceiros')
export const salvarParceiro = (p) => pedir('/api/parceiros', { metodo: 'POST', corpo: p })
export const licoes = () => pedir('/api/licoes')
export const decidirLicao = (id, aprovada) => pedir(`/api/licoes/${id}`, { metodo: 'POST', corpo: { aprovada } })
export const retorno = (dados) => pedir('/api/retornos', { metodo: 'POST', corpo: dados })
/* parceiros ativos para a faixa "Apoio": é a única leitura pública */
export async function parceirosAtivos() {
  if (!API) return []
  try { const r = await fetch(API + '/publico/parceiros'); return r.ok ? r.json() : [] } catch { return [] }
}
