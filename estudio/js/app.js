/* =====================================================================
   Estúdio de comunicação da AJIN
   Escolhe o modelo, monta o formulário pelo esquema, desenha a prévia
   em escala, exporta e conversa com o agente quando ele está ligado.
   ===================================================================== */
import { MODELOS, ORDEM, TIPOS_CARD, FALTAM_NO_SITE, pendencias, volumeDoBoletim, esc } from './modelos.js'
import * as exportar from './exportar.js'
import * as agente from './agente.js'

const $ = (s, el = document) => el.querySelector(s)
const el = (tag, attrs = {}, ...filhos) => {
  const n = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on')) n.addEventListener(k.slice(2), v)
    else if (k === 'html') n.innerHTML = v
    else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v)
  }
  for (const f of filhos.flat()) if (f != null && f !== false) n.append(f)
  return n
}
const clone = (o) => JSON.parse(JSON.stringify(o ?? {}))

/* ---------------------------------------------------------------------
   Estado: o que está na mesa fica guardado no navegador
   --------------------------------------------------------------------- */
const CHAVE = 'ajin-estudio-v1'
let estado = (() => {
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && MODELOS[s.modelo]) return s } catch { /* sem armazenamento */ }
  return { modelo: ORDEM[0], pecas: {}, retornos: [] }
})()
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(estado)) } catch { /* fotos grandes estouram o espaço: segue sem guardar */ } }
const modelo = () => MODELOS[estado.modelo]
const peca = () => (estado.pecas[estado.modelo] ||= clone(modelo().exemplo))
let ctx = { parceiros: [] }

function avisar(texto) {
  const t = $('#toque'); t.textContent = texto; t.classList.add('toque--mostra')
  clearTimeout(avisar.t); avisar.t = setTimeout(() => t.classList.remove('toque--mostra'), 2600)
}

/* ---------------------------------------------------------------------
   Escolha do modelo
   --------------------------------------------------------------------- */
function montarModelos() {
  $('#modelos').replaceChildren(...ORDEM.map((id) => el('button', {
    class: 'modelo', type: 'button', 'aria-pressed': String(id === estado.modelo),
    onclick: () => trocarModelo(id),
  }, el('b', {}, MODELOS[id].nome), el('span', {}, MODELOS[id].canal))))
}
function trocarModelo(id, novaPeca) {
  estado.modelo = id
  if (novaPeca) estado.pecas[id] = novaPeca
  salvar(); montarModelos(); montarFormulario(); desenhar()
}

/* ---------------------------------------------------------------------
   Formulário a partir do esquema
   --------------------------------------------------------------------- */
function contador(def, valor) {
  if (!def.limite) return null
  const [min, max] = def.limite, n = String(valor || '').length
  const c = el('span', { class: 'campo__conta' })
  const pintar = (k) => { c.textContent = `${k} / ${min} a ${max}`; c.className = 'campo__conta' + (k && k < min ? ' campo__conta--curto' : k > max ? ' campo__conta--longo' : '') }
  pintar(n); c.pintar = pintar
  return c
}

function campo(def, alvo) {
  const valor = alvo[def.id]
  const conta = contador(def, valor)
  const rot = el('span', { class: 'campo__rotulo' }, el('span', {}, def.rotulo), conta)
  const ajuda = def.ajuda ? el('span', { class: 'campo__ajuda' }, def.ajuda) : null
  const mudar = (v) => { alvo[def.id] = v; conta?.pintar(String(v || '').length); mudou() }

  switch (def.tipo) {
    case 'texto': case 'numero': case 'data': {
      const tipo = def.tipo === 'texto' ? 'text' : def.tipo === 'numero' ? 'number' : 'date'
      const inp = el('input', { type: tipo, value: valor ?? '', id: `f-${def.id}`, oninput: (e) => mudar(e.target.value) })
      return el('label', { class: 'campo' }, rot, inp, ajuda)
    }
    case 'area': {
      const ta = el('textarea', { rows: def.limite && def.limite[1] < 120 ? 2 : 4, oninput: (e) => mudar(e.target.value) })
      ta.value = valor ?? ''
      return el('label', { class: 'campo' }, rot, ta, ajuda)
    }
    case 'escolha': {
      const sel = el('select', { onchange: (e) => mudar(e.target.value) }, def.opcoes.map(([v, t]) => el('option', { value: v, selected: String(valor ?? '') === v }, t)))
      if (valor == null) alvo[def.id] = def.opcoes[0][0]
      return el('label', { class: 'campo' }, rot, sel, ajuda)
    }
    case 'imagem': {
      const mini = el('span', { class: 'imagem__mini', style: valor ? `background-image:url("${valor}")` : '' })
      const arquivo = el('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async (e) => {
        const f = e.target.files[0]; if (!f) return
        const url = await exportar.lerImagem(f); mini.style.backgroundImage = `url("${url}")`; mudar(url)
      } })
      return el('div', { class: 'campo' }, rot, el('div', { class: 'imagem' }, mini, el('div', { class: 'imagem__acoes' },
        el('label', { class: 'botao botao--linha botao--pequeno' }, 'Escolher foto', arquivo),
        el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: () => { mini.style.backgroundImage = ''; mudar('') } }, 'Tirar'),
      )), ajuda)
    }
    case 'imagens': {
      const lista = (alvo[def.id] ||= [])
      const caixa = el('div', { class: 'imagens' })
      const refazer = () => caixa.replaceChildren(
        ...lista.map((u, i) => el('span', { class: 'imagem__mini', style: `background-image:url("${u}")` }, el('button', { type: 'button', 'aria-label': 'Tirar foto', onclick: () => { lista.splice(i, 1); refazer(); mudou() } }, '×'))),
        lista.length < (def.max || 4) ? el('label', { class: 'botao botao--linha botao--pequeno' }, 'Adicionar', el('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true, onchange: async (e) => {
          for (const f of [...e.target.files].slice(0, (def.max || 4) - lista.length)) lista.push(await exportar.lerImagem(f))
          refazer(); mudou()
        } })) : null)
      refazer()
      return el('div', { class: 'campo' }, rot, caixa, ajuda)
    }
    case 'grupo': {
      const sub = (alvo[def.id] ||= {})
      return el('div', { class: 'grupo' }, el('div', { class: 'grupo__topo' }, el('b', {}, def.rotulo)), def.itens.map((d) => campo(d, sub)))
    }
    case 'lista': return lista(def, alvo)
    case 'cards': return cards(def, alvo)
  }
  return el('div')
}

function moverEm(arr, i, d) { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]] }
function controles(arr, i) {
  const refazer = () => { montarFormulario(); mudou() }
  return el('span', { class: 'grupo__mover' },
    el('button', { type: 'button', class: 'mini', 'aria-label': 'Subir', onclick: () => { moverEm(arr, i, -1); refazer() } }, '↑'),
    el('button', { type: 'button', class: 'mini', 'aria-label': 'Descer', onclick: () => { moverEm(arr, i, 1); refazer() } }, '↓'),
    el('button', { type: 'button', class: 'mini', 'aria-label': 'Tirar', onclick: () => { arr.splice(i, 1); refazer() } }, '×'))
}

function lista(def, alvo) {
  const arr = (alvo[def.id] ||= [])
  const itens = arr.map((item, i) => el('div', { class: 'grupo' },
    el('div', { class: 'grupo__topo' }, el('b', {}, `${def.rotulo} ${i + 1}`), controles(arr, i)),
    def.itens.map((d) => campo(d, item))))
  const mais = arr.length < (def.max || 20) ? el('div', { class: 'lista__mais' }, el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: () => { arr.push({}); montarFormulario(); mudou() } }, `Adicionar em ${def.rotulo.toLowerCase()}`)) : null
  return el('div', { class: 'campo' }, el('span', { class: 'campo__rotulo' }, el('span', {}, def.rotulo), el('span', { class: 'campo__conta' }, `${arr.length} de ${def.max || 20}`)), itens, mais)
}

const GANCHO = { id: 'gancho', rotulo: 'Gancho para o próximo card', tipo: 'texto', limite: [3, 18] }
function cards(def, alvo) {
  const arr = (alvo[def.id] ||= [])
  const nomes = { ...Object.fromEntries(Object.entries(TIPOS_CARD).map(([k, v]) => [k, v.nome])), 'boletim-capa': 'Capa do boletim', 'boletim-link': 'Link do boletim' }
  const itens = arr.map((c, i) => {
    const tipos = TIPOS_CARD[c.tipo]?.campos || [{ id: 'titulo', rotulo: 'Título', tipo: 'texto' }, { id: 'texto', rotulo: 'Texto', tipo: 'area' }, { id: 'imagem', rotulo: 'Foto', tipo: 'imagem' }]
    const sel = el('select', { 'aria-label': 'Tipo do card', onchange: (e) => { c.tipo = e.target.value; montarFormulario(); mudou() } },
      Object.entries(nomes).map(([k, n]) => el('option', { value: k, selected: c.tipo === k }, n)))
    return el('div', { class: 'grupo' }, el('div', { class: 'grupo__topo' }, el('b', {}, `Card ${i + 1}`), sel, controles(arr, i)),
      tipos.map((d) => campo(d, c)), i < arr.length - 1 ? campo(GANCHO, c) : null)
  })
  const mais = arr.length < (def.max || 10) ? el('div', { class: 'lista__mais' }, Object.entries(TIPOS_CARD).map(([k, v]) =>
    el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: () => { arr.splice(Math.max(arr.length - (arr.at(-1)?.tipo === 'fecho' ? 1 : 0), 0), 0, { tipo: k }); montarFormulario(); mudou() } }, `+ ${v.nome}`))) : null
  return el('div', { class: 'campo' }, el('span', { class: 'campo__rotulo' }, el('span', {}, def.rotulo), el('span', { class: 'campo__conta' }, `${arr.length} de ${def.max || 10}`)), itens, mais)
}

function montarFormulario() {
  const p = peca()
  $('#formulario').replaceChildren(
    ...modelo().campos.map((d) => campo(d, p)),
    el('div', { class: 'lista__mais' },
      el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: () => { if (confirm('Voltar ao exemplo? O conteúdo atual some.')) { estado.pecas[estado.modelo] = clone(modelo().exemplo); salvar(); montarFormulario(); desenhar() } } }, 'Voltar ao exemplo'),
      el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: () => { if (confirm('Limpar todos os campos?')) { estado.pecas[estado.modelo] = {}; salvar(); montarFormulario(); desenhar() } } }, 'Começar do zero')))
  atualizarVolume()
}
function atualizarVolume() {
  const v = $('#f-volume'), d = $('#f-data')
  if (v && d) v.placeholder = `Automático: ${volumeDoBoletim(d.value || new Date().toISOString().slice(0, 10))}`
}

let temporizador
function mudou() { atualizarVolume(); clearTimeout(temporizador); temporizador = setTimeout(() => { salvar(); desenhar() }, 160) }

/* ---------------------------------------------------------------------
   Prévia
   --------------------------------------------------------------------- */
const LARGURA_PREVIA = { 'flyer-whatsapp': 440, 'carrossel-instagram': 380, boletim: 430, email: 680, apresentacao: 720, oficio: 560, 'ficha-adesao': 560 }
let paginasAtuais = []

function foraDoLimite(campos, alvo, achados = []) {
  for (const d of campos) {
    const v = alvo?.[d.id]
    if (d.limite && v && (v.length < d.limite[0] || v.length > d.limite[1])) achados.push(d.rotulo)
    if (d.tipo === 'grupo') foraDoLimite(d.itens, v, achados)
    if (d.tipo === 'lista') (v || []).forEach((it) => foraDoLimite(d.itens, it, achados))
    if (d.tipo === 'cards') (v || []).forEach((c) => foraDoLimite(TIPOS_CARD[c.tipo]?.campos || [], c, achados))
  }
  return achados
}

function desenhar() {
  const m = modelo(), p = peca()
  $('#peca-nome').textContent = m.nome
  $('#peca-canal').textContent = `${m.canal} · ${m.descricao}`
  let pgs = []
  try { pgs = m.paginas(p, ctx) } catch (e) { console.error(e) }
  paginasAtuais = pgs
  const alvo = Math.min(LARGURA_PREVIA[m.id] || 480, ($('#paginas').clientWidth || 9999) - 2)
  $('#paginas').replaceChildren(...pgs.map((pg, i) => {
    const k = Math.min(1, alvo / pg.w)
    const moldura = el('div', { class: 'pagina__moldura', style: `width:${pg.w * k}px;height:${(pg.h || 900) * k}px`, html: pg.html })
    moldura.firstElementChild.style.transform = `scale(${k})`
    if (!pg.h) requestAnimationFrame(() => { moldura.style.height = moldura.firstElementChild.offsetHeight * k + 'px' })
    return el('div', { class: 'pagina' }, moldura, el('div', { class: 'pagina__rodape' },
      el('span', {}, `Página ${i + 1} de ${pgs.length}`),
      el('button', { type: 'button', onclick: () => baixarPng(i) }, 'Baixar imagem')))
  }))

  /* avisos: dado sem fonte, texto fora do tamanho, campos do associado */
  const avisos = []
  const pend = pendencias(p)
  if (pend.length) avisos.push(el('div', { class: 'aviso aviso--erro' }, el('b', {}, 'Falta confirmar'), el('span', {}, pend.join(' · ') + '. A peça não sai com dado sem fonte.')))
  const fora = [...new Set(foraDoLimite(m.campos, p))]
  if (fora.length) avisos.push(el('div', { class: 'aviso' }, el('b', {}, 'Fora do tamanho'), el('span', {}, fora.join(' · ') + '. O texto pode apertar ou sobrar no desenho.')))
  if (m.id === 'ficha-adesao') {
    const faltam = FALTAM_NO_SITE.filter(([k]) => !p[k]).map(([, t]) => t)
    if (faltam.length) avisos.push(el('div', { class: 'aviso' }, el('b', {}, 'Completar com o associado'), el('span', {}, faltam.join(' · '))))
  }
  $('#avisos').replaceChildren(...avisos)

  const leg = m.legenda ? m.legenda(p) : ''
  $('#legenda').hidden = !leg
  $('#legenda-texto').textContent = leg
  montarAcoes()
}

/* ---------------------------------------------------------------------
   Ações
   --------------------------------------------------------------------- */
const nomeArquivo = () => `ajin-${estado.modelo}-${new Date().toISOString().slice(0, 10)}`
async function baixarPng(i) {
  avisar('Gerando imagem…')
  try { exportar.baixar(await exportar.pngDaPagina(paginasAtuais[i]), `${nomeArquivo()}-${String(i + 1).padStart(2, '0')}.png`); avisar('Imagem pronta.') }
  catch (e) { console.error(e); avisar('Não foi possível gerar a imagem.') }
}
async function baixarTudo() {
  if (paginasAtuais.length === 1) return baixarPng(0)
  avisar('Gerando as imagens…')
  try { exportar.baixar(await exportar.zipDasPaginas(paginasAtuais, nomeArquivo()), `${nomeArquivo()}.zip`); avisar('Arquivo pronto.') }
  catch (e) { console.error(e); avisar('Não foi possível gerar as imagens.') }
}

function montarAcoes() {
  const m = modelo(), p = peca(), b = []
  const botao = (texto, fn, cls = 'botao botao--linha botao--pequeno', extra = {}) => el('button', { type: 'button', class: cls, onclick: fn, ...extra }, texto)
  if (m.id !== 'email') b.push(botao(paginasAtuais.length > 1 ? 'Baixar imagens (ZIP)' : 'Baixar imagem', baixarTudo))
  if (['boletim', 'apresentacao', 'oficio', 'ficha-adesao', 'carrossel-instagram'].includes(m.id)) b.push(botao('Baixar PDF', () => exportar.imprimir(paginasAtuais)))
  if (m.email) {
    b.push(botao('Copiar HTML do e-mail', async () => avisar(await exportar.copiar(m.email(p, ctx)) ? 'HTML copiado.' : 'Não deu para copiar.')))
    b.push(botao('Baixar HTML', () => exportar.baixar(new Blob([m.email(p, ctx)], { type: 'text/html' }), `${nomeArquivo()}.html`)))
  }
  if (m.derivar) b.push(botao('Gerar carrossel do boletim', () => { const d = m.derivar(p); trocarModelo(d.modelo, d.peca); avisar('Carrossel do boletim pronto para revisar.') }))
  const pend = pendencias(p).length
  b.push(botao('Enviar para aprovação', enviarAprovacao, 'botao botao--pequeno', {
    disabled: !agenteLigado || pend > 0,
    title: !agenteLigado ? 'Ligue o servidor do agente para enviar à diretoria.' : pend ? 'Resolva o que falta confirmar antes de enviar.' : 'A diretoria aprova e o agente publica no canal.',
  }))
  $('#acoes').replaceChildren(...b)
}

async function enviarAprovacao() {
  try {
    const r = await agente.enviarParaAprovacao({ modelo: estado.modelo, peca: peca(), legenda: modelo().legenda?.(peca()) || '' })
    avisar(`Enviado à diretoria. Código ${r.codigo}.`)
  } catch (e) { avisar(e.message === 'sem-login' ? 'Entre com seu e-mail da equipe primeiro.' : 'Não foi possível enviar agora.') }
}

$('#copiar-legenda').addEventListener('click', async () => avisar(await exportar.copiar($('#legenda-texto').textContent) ? 'Texto copiado.' : 'Não deu para copiar.'))

/* retorno: nota e comentário, que viram lição depois de aprovados */
let nota = 0
$('#retorno-notas').replaceChildren(...[1, 2, 3, 4, 5].map((n) => el('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': `Nota ${n}`, onclick: (e) => {
  nota = n; [...$('#retorno-notas').children].forEach((x, k) => x.setAttribute('aria-pressed', String(k + 1 === n)))
} }, String(n))))
$('#retorno-enviar').addEventListener('click', async () => {
  const texto = $('#retorno-texto').value.trim()
  if (!nota && !texto) return avisar('Dê uma nota ou escreva o que mudar.')
  const dados = { modelo: estado.modelo, nota, texto, peca: peca() }
  try { if (!agenteLigado) throw new Error('local'); await agente.retorno(dados); avisar('Retorno registrado. Vira proposta de lição.') }
  catch { estado.retornos = [...(estado.retornos || []), { ...dados, peca: undefined, quando: new Date().toISOString() }].slice(-50); salvar(); avisar('Retorno guardado neste navegador.') }
  $('#retorno-texto').value = ''
})

/* ---------------------------------------------------------------------
   Conversa com o agente
   --------------------------------------------------------------------- */
let agenteLigado = false
const historico = []
function msg(quem, texto) { const n = el('div', { class: `msg msg--${quem}` }, texto); $('#conversa-lista').append(n); n.scrollIntoView({ block: 'nearest' }); return n }

async function iniciarAgente() {
  const estadoEl = $('#estado-agente')
  if (!agente.configurado()) {
    msg('sistema', 'O agente ainda não está ligado a este estúdio. Os modelos, a prévia e a exportação já funcionam: escolha a peça e preencha o conteúdo.')
    return
  }
  const s = await agente.sessao().catch(() => null)
  if (!s) { pedirLogin(); return }
  try {
    const eu = await agente.quemSou()
    agenteLigado = true
    estadoEl.textContent = `Agente ligado · ${eu.nome || eu.email}`
    estadoEl.classList.add('topo__estado--ligado')
    msg('agente', `Olá, ${eu.nome || ''}. O que vamos comunicar hoje? Pode contar do jeito que vier: eu pergunto o que faltar e monto a peça.`)
    ctx.parceiros = await agente.parceirosAtivos()
    desenhar()
  } catch (e) { msg('sistema', e.message === 'Falha 403' ? 'Este e-mail não está na equipe do estúdio. Peça acesso à diretoria.' : 'O servidor do agente não respondeu. O estúdio segue funcionando sem ele.') }
}

function pedirLogin() {
  const email = el('input', { type: 'email', placeholder: 'seu e-mail da equipe', required: true, style: 'width:100%;padding:10px 12px;border:1.5px solid var(--linha);border-radius:10px;margin:8px 0' })
  const form = el('form', { onsubmit: async (e) => {
    e.preventDefault()
    try { await agente.entrar(email.value.trim()); form.replaceWith(el('div', { class: 'msg msg--sistema' }, 'Enviamos um link de acesso para o seu e-mail. Abra por ele para entrar.')) }
    catch { avisar('Este e-mail não tem acesso ao estúdio.') }
  } }, el('div', { class: 'msg msg--sistema' }, 'Entre com o e-mail da equipe para conversar com o agente e enviar peças à diretoria.'), email, el('button', { class: 'botao botao--pequeno' }, 'Receber link de acesso'))
  $('#conversa-lista').append(form)
}

const anexos = []
$('#conversa-anexo').addEventListener('change', async (e) => {
  for (const f of e.target.files) {
    if (f.type.startsWith('image/')) anexos.push({ nome: f.name, tipo: 'imagem', dados: await exportar.lerImagem(f, 1800) })
    else anexos.push({ nome: f.name, tipo: f.type || 'arquivo', dados: await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(f) }) })
  }
  msg('sistema', `${anexos.length} anexo(s) prontos para ir com a próxima mensagem.`)
  e.target.value = ''
})

$('#conversa-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const texto = $('#conversa-texto').value.trim()
  if (!texto && !anexos.length) return
  msg('eu', texto || `${anexos.length} anexo(s)`)
  $('#conversa-texto').value = ''
  if (!agenteLigado) { msg('sistema', 'Sem o servidor do agente, a conversa não é respondida. Preencha o conteúdo abaixo e a prévia aparece ao lado.'); return }
  historico.push({ papel: 'usuario', texto })
  const espera = msg('agente', 'Pensando…')
  try {
    const r = await agente.conversar({ historico, anexos: anexos.splice(0), modelo: estado.modelo, peca: peca() })
    espera.textContent = r.resposta
    historico.push({ papel: 'agente', texto: r.resposta })
    if (r.modelo && r.peca) { trocarModelo(r.modelo, r.peca); avisar('Peça atualizada pelo agente.') }
  } catch { espera.textContent = 'Não consegui responder agora. Tente de novo em instantes.' }
})
$('#conversa-texto').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) $('#conversa-form').requestSubmit() })

/* ---------------------------------------------------------------------
   Abas de gestão: aprovação, parceiros, aprendizado
   --------------------------------------------------------------------- */
const semAgente = () => el('div', { class: 'vazio' }, 'Esta parte depende do servidor do agente. Quando ele estiver ligado, aparece aqui.')
const ETIQUETA = { aguardando: ['Aguardando', 'espera'], aprovada: ['Aprovada', 'ok'], publicada: ['Publicada', 'ok'], recusada: ['Recusada', 'nao'], ajustar: ['Pediram ajuste', 'espera'] }

async function abrirFila() {
  const alvo = $('#fila')
  if (!agenteLigado) return alvo.replaceChildren(semAgente())
  const itens = await agente.fila().catch(() => [])
  if (!itens.length) return alvo.replaceChildren(el('div', { class: 'vazio' }, 'Nenhuma peça na fila.'))
  alvo.replaceChildren(...itens.map((it) => {
    const [rot, cls] = ETIQUETA[it.estado] || [it.estado, '']
    return el('div', { class: 'item' }, el('span', { class: 'item__mini', style: it.miniatura ? `background-image:url("${it.miniatura}")` : '' }),
      el('div', {}, el('b', {}, it.titulo || MODELOS[it.modelo]?.nome), el('span', {}, el('span', { class: `etiqueta etiqueta--${cls}` }, rot), `${MODELOS[it.modelo]?.nome || it.modelo} · código ${it.codigo} · ${new Date(it.criado_em).toLocaleString('pt-BR')}`)),
      el('div', { class: 'item__acoes' },
        it.pdf || it.arquivos?.[0] ? el('a', { class: 'botao botao--linha botao--pequeno', href: it.pdf || it.arquivos[0], target: '_blank', rel: 'noopener' }, 'Ver') : null,
        el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: () => { trocarModelo(it.modelo, it.peca); trocarAba('criar') } }, 'Abrir'),
        it.estado === 'aguardando' && it.posso_aprovar ? [
          el('button', { type: 'button', class: 'botao botao--pequeno', onclick: async () => { await agente.decidir(it.id, 'aprovada'); avisar('Aprovada. O agente publica no canal.'); abrirFila() } }, 'Aprovar'),
          el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: async () => { const n = prompt('O que ajustar?'); if (n) { await agente.decidir(it.id, 'ajustar', n); abrirFila() } } }, 'Pedir ajuste'),
        ] : null))
  }))
}

async function abrirParceiros() {
  const alvo = $('#parceiros')
  if (!agenteLigado) return alvo.replaceChildren(semAgente())
  const lista = await agente.parceiros().catch(() => [])
  const nome = el('input', { type: 'text', placeholder: 'Nome do parceiro', required: true })
  const site = el('input', { type: 'text', placeholder: 'Site ou Instagram' })
  let logo = ''
  const form = el('form', { class: 'item', onsubmit: async (e) => {
    e.preventDefault(); await agente.salvarParceiro({ nome: nome.value.trim(), site: site.value.trim(), logo, ativo: false }); avisar('Parceiro cadastrado. Ative quando a parceria for aprovada.'); abrirParceiros()
  } }, el('label', { class: 'item__mini', style: 'cursor:pointer;display:grid;place-items:center;font-size:13px', title: 'Logo' }, 'Logo', el('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async (e) => { logo = await exportar.lerImagem(e.target.files[0], 800); e.target.parentElement.style.backgroundImage = `url("${logo}")` } })),
  el('div', { class: 'campo', style: 'margin:0;display:grid;gap:8px' }, nome, site), el('div', { class: 'item__acoes' }, el('button', { class: 'botao botao--pequeno' }, 'Cadastrar')))
  alvo.replaceChildren(form, ...(lista.length ? lista.map((p) => el('div', { class: 'item' }, el('span', { class: 'item__mini', style: p.logo ? `background-image:url("${p.logo}");background-size:contain;background-color:#fff` : '' }),
    el('div', {}, el('b', {}, p.nome), el('span', {}, el('span', { class: `etiqueta etiqueta--${p.ativo ? 'ok' : 'espera'}` }, p.ativo ? 'Ativo nas peças' : 'Inativo'), p.site || '')),
    el('div', { class: 'item__acoes' }, el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: async () => { await agente.salvarParceiro({ ...p, ativo: !p.ativo }); ctx.parceiros = await agente.parceirosAtivos(); abrirParceiros(); desenhar() } }, p.ativo ? 'Desativar' : 'Ativar'))))
    : [el('div', { class: 'vazio' }, 'Ainda não há parceiros. As peças saem sem a faixa de apoio.')]))
}

async function abrirLicoes() {
  const alvo = $('#licoes')
  if (!agenteLigado) {
    const locais = estado.retornos || []
    return alvo.replaceChildren(semAgente(), ...locais.map((r) => el('div', { class: 'item' }, el('span', { class: 'item__mini', style: 'display:grid;place-items:center;font-weight:900;font-size:28px' }, String(r.nota || '·')), el('div', {}, el('b', {}, MODELOS[r.modelo]?.nome), el('span', {}, r.texto || 'Sem comentário')))))
  }
  const lista = await agente.licoes().catch(() => [])
  if (!lista.length) return alvo.replaceChildren(el('div', { class: 'vazio' }, 'Nenhuma lição ainda. Dê retorno nas peças e elas aparecem aqui.'))
  alvo.replaceChildren(...lista.map((l) => el('div', { class: 'item' }, el('span', { class: 'item__mini', style: 'display:grid;place-items:center;font-weight:900;font-size:13px;text-align:center;padding:6px' }, MODELOS[l.modelo]?.nome || 'Geral'),
    el('div', {}, el('b', {}, l.texto), el('span', {}, el('span', { class: `etiqueta etiqueta--${l.aprovada === true ? 'ok' : l.aprovada === false ? 'nao' : 'espera'}` }, l.aprovada === true ? 'Em uso' : l.aprovada === false ? 'Descartada' : 'Proposta'), l.origem || '')),
    el('div', { class: 'item__acoes' }, l.aprovada !== true ? el('button', { type: 'button', class: 'botao botao--pequeno', onclick: async () => { await agente.decidirLicao(l.id, true); abrirLicoes() } }, 'Aprovar') : null,
      l.aprovada !== false ? el('button', { type: 'button', class: 'botao botao--linha botao--pequeno', onclick: async () => { await agente.decidirLicao(l.id, false); abrirLicoes() } }, 'Descartar') : null))))
}

function trocarAba(nome) {
  document.querySelectorAll('[role=tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.aba === nome)))
  document.querySelectorAll('.aba').forEach((a) => { a.hidden = a.dataset.painel !== nome })
  if (nome === 'fila') abrirFila()
  if (nome === 'parceiros') abrirParceiros()
  if (nome === 'licoes') abrirLicoes()
}
document.querySelectorAll('[role=tab]').forEach((b) => b.addEventListener('click', () => trocarAba(b.dataset.aba)))

/* começa */
const pedido = new URLSearchParams(location.search).get('modelo')
if (pedido && MODELOS[pedido]) estado.modelo = pedido
montarModelos(); montarFormulario(); desenhar(); iniciarAgente()
let largura = innerWidth
addEventListener('resize', () => { if (Math.abs(innerWidth - largura) > 40) { largura = innerWidth; desenhar() } })
