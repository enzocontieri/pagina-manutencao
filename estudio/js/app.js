/* =====================================================================
   Mostra dos moldes das peças da AJIN.
   Só leitura: cada modelo aparece com TODAS as suas páginas, inteiras,
   lado a lado num trilho horizontal, desenhadas a partir do exemplo em
   modelos.js (a mesma fonte do agente). As peças de verdade são pedidas
   ao agente no grupo de WhatsApp.
   ===================================================================== */
import { MODELOS, ORDEM } from './modelos.js'

const $ = (s) => document.querySelector(s)
const el = (tag, attrs = {}, ...filhos) => {
  const n = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'html') n.innerHTML = v
    else if (v !== false && v != null) n.setAttribute(k, v === true ? '' : v)
  }
  for (const f of filhos.flat()) if (f != null && f !== false) n.append(f)
  return n
}
const ctx = { parceiros: [] }

/* largura de cada página por modelo: peças deitadas ganham mais espaço; o resto segue um só tamanho */
const LARGURA = { apresentacao: 820, email: 460 }
const PADRAO = 480
const larguraDe = (id) => Math.min(LARGURA[id] || PADRAO, innerWidth - (innerWidth < 720 ? 32 : 64))
/* página sem altura fixa (e-mail) rola dentro do quadro em vez de ser cortada */
const ALTURA_ROLAVEL = 900

/* nos exemplos, o marcador [CONFIRMAR: ...] que o agente usa vira um valor de amostra: aqui é só mostra */
const AMOSTRA = { data: '24/10', dia: '24/10', 'horário': '10h', hora: '10h', local: 'Sede da AJIN', nome: 'nome a confirmar' }
const semMarcadores = (o) => JSON.parse(JSON.stringify(o ?? {}).replace(/\[CONFIRMAR:?\s*([^\]]*)\]/g, (_, k) => AMOSTRA[k.trim().toLowerCase()] || 'a confirmar'))

function quadroDe(pg, largura, i, total) {
  const k = largura / pg.w
  const alturaFixa = pg.h ? Math.round(pg.h * k) : 0
  const quadro = el('div', { class: 'molde__quadro', style: `width:${largura}px;height:${alturaFixa || ALTURA_ROLAVEL}px` })
  quadro.innerHTML = pg.html
  const peca = quadro.firstElementChild
  if (peca) {
    peca.style.transform = `scale(${k})`
    /* altura automática (e-mail): mede depois de desenhar; se passar do limite, o quadro rola */
    if (!pg.h) requestAnimationFrame(() => {
      const h = Math.round(peca.offsetHeight * k)
      quadro.style.height = Math.min(h, ALTURA_ROLAVEL) + 'px'
      quadro.classList.toggle('molde__quadro--rola', h > ALTURA_ROLAVEL)
      legenda.textContent = h > ALTURA_ROLAVEL ? 'Role dentro do quadro para ver o e-mail inteiro' : legenda.textContent
    })
  }
  const legenda = el('span', { class: 'molde__pagina-nome' }, total > 1 ? `Página ${i + 1} de ${total}` : '')
  return el('div', { class: 'molde__pagina' }, quadro, legenda)
}

function cardDe(id) {
  const m = MODELOS[id]
  let pgs = []
  try { pgs = m.paginas(semMarcadores(m.exemplo), ctx) } catch (e) { console.error(id, e) }
  const largura = larguraDe(id)
  return el('article', { class: 'molde', 'data-id': id },
    el('div', { class: 'molde__cabeca', style: `max-width:${Math.max(largura, 420)}px` },
      el('span', { class: 'molde__canal' }, m.canal),
      el('h2', {}, m.nome),
      el('p', {}, m.descricao),
      pgs.length > 1 ? el('span', { class: 'molde__paginas-n' }, `${pgs.length} páginas, todas à mostra`) : null),
    el('div', { class: 'molde__paginas' }, pgs.map((pg, i) => quadroDe(pg, largura, i, pgs.length))))
}

function desenhar() {
  $('#trilho').replaceChildren(...ORDEM.map(cardDe))
  atualizarPosicao()
}

/* navegação: um modelo por vez, pelas setas, pelo teclado ou rolando */
const trilho = $('#trilho')
const cards = () => [...trilho.children]
/* posição de rolagem em que o card encosta na margem interna do trilho */
const posicaoDe = (c) => c.offsetLeft - trilho.offsetLeft - parseFloat(getComputedStyle(trilho).paddingLeft)
function indiceAtual() {
  const x = trilho.scrollLeft
  let i = 0, menor = Infinity
  cards().forEach((c, j) => { const d = Math.abs(posicaoDe(c) - x); if (d < menor) { menor = d; i = j } })
  return i
}
function irPara(i) {
  const lista = cards()
  const alvo = lista[Math.max(0, Math.min(lista.length - 1, i))]
  if (alvo) trilho.scrollTo({ left: posicaoDe(alvo), behavior: 'smooth' })
}
function atualizarPosicao() { $('#posicao').textContent = `${indiceAtual() + 1} de ${ORDEM.length}` }
$('#anterior').addEventListener('click', () => irPara(indiceAtual() - 1))
$('#proximo').addEventListener('click', () => irPara(indiceAtual() + 1))
trilho.addEventListener('scroll', () => { clearTimeout(atualizarPosicao.t); atualizarPosicao.t = setTimeout(atualizarPosicao, 80) }, { passive: true })
trilho.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); irPara(indiceAtual() + 1) }
  if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(indiceAtual() - 1) }
})

/* parceiros ativos: lista pública que o agente grava quando a diretoria ativa um parceiro */
fetch('https://akqiejrzzajvqrzvqoay.supabase.co/storage/v1/object/public/pecas-publicas/parceiros.json', { cache: 'no-cache' })
  .then((r) => r.ok ? r.json() : []).then((l) => { if (Array.isArray(l) && l.length) { ctx.parceiros = l; desenhar() } }).catch(() => {})

/* começa; ?modelo=story-instagram abre no molde pedido */
desenhar()
const pedido = new URLSearchParams(location.search).get('modelo')
if (pedido && ORDEM.includes(pedido)) requestAnimationFrame(() => irPara(ORDEM.indexOf(pedido)))
let largura = innerWidth
addEventListener('resize', () => { if (Math.abs(innerWidth - largura) > 40) { largura = innerWidth; const i = indiceAtual(); desenhar(); requestAnimationFrame(() => irPara(i)) } })
