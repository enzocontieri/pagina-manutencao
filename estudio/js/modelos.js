/* =====================================================================
   Modelos de peça da AJIN.

   Cada modelo declara:
   - campos: o esquema do conteúdo (gera o formulário do estúdio e é o
     formato que o agente devolve);
   - exemplo: conteúdo de partida, real, para a pessoa ver a peça pronta;
   - paginas(peca): o desenho de cada página no tamanho final;
   - extras opcionais: legenda (texto para colar), email (HTML de envio).

   Fonte única: o estúdio do site e o servidor do agente usam este mesmo
   arquivo, então a peça que sai pelo WhatsApp é igual à do site.
   ===================================================================== */

export const BASE = new URL('../../', import.meta.url).href   // raiz do site
const LOGO_NAVY = BASE + 'marca/ajin-navy.png'
const LOGO_BRANCO = BASE + 'marca/ajin-branco.png'

/* ---------------------------------------------------------------------
   Utilidades de texto
   --------------------------------------------------------------------- */
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
/* [CONFIRMAR: ...] fica marcado na prévia: a peça não sai com dado inventado */
export const marca = (s) => esc(s).replace(/\[CONFIRMAR:?([^\]]*)\]/g, '<span class="p-pendente">[CONFIRMAR:$1]</span>')
const paragrafos = (s) => String(s ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
const ps = (s) => paragrafos(s).map((p) => `<p>${marca(p).replace(/\n/g, '<br>')}</p>`).join('')
export const pendencias = (peca) => {
  const achados = new Set()
  JSON.stringify(peca).replace(/\[CONFIRMAR:?([^\]]*)\]/g, (_, m) => achados.add(m.trim() || 'dado sem fonte'))
  return [...achados]
}
const foto = (src, alt = '', cls = 'p-foto', pos = '') => src
  ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" ${pos ? `style="object-position:${esc(pos)}"` : ''} crossorigin="anonymous" />`
  : `<div class="${cls} p-vazio">Foto</div>`
const grao = '<div class="grao"></div>'

/* ---------------------------------------------------------------------
   Desenhos da marca (inline, para a exportação levar junto)
   --------------------------------------------------------------------- */
export const ICONES = {
  data: '<svg viewBox="0 0 24 24"><path d="M7 1.5h2V4h6V1.5h2V4h3.5A1.5 1.5 0 0 1 22 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 20.5v-15A1.5 1.5 0 0 1 3.5 4H7zM4 9v11h16V9zm3 3h3v3H7z"/></svg>',
  hora: '<svg viewBox="0 0 24 24"><path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21zm1 5v5.6l4 2.4-1 1.7-5-3V6.5z"/></svg>',
  local: '<svg viewBox="0 0 24 24"><path d="M12 1.5a8 8 0 0 0-8 8c0 5.8 8 13 8 13s8-7.2 8-13a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>',
  valor: '<svg viewBox="0 0 24 24"><path d="M2 6.5A1.5 1.5 0 0 1 3.5 5h17A1.5 1.5 0 0 1 22 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 8v2a2 2 0 0 0 2-2zm12 0a2 2 0 0 0 2 2V8zM5 14v2h2a2 2 0 0 0-2-2zm14 0a2 2 0 0 0-2 2h2z"/></svg>',
  contato: '<svg viewBox="0 0 24 24"><path d="M6.6 2.5 9.3 7 7.5 9.2a12 12 0 0 0 7.3 7.3L17 14.7l4.5 2.7-.9 3.7a1.5 1.5 0 0 1-1.6 1.1C9.9 21.5 2.5 14.1 1.8 5a1.5 1.5 0 0 1 1.1-1.6z"/></svg>',
  pessoas: '<svg viewBox="0 0 24 24"><circle cx="8" cy="6.5" r="3.5"/><circle cx="17" cy="7.5" r="3"/><path d="M1.5 21c0-4.4 2.9-7.5 6.5-7.5s6.5 3.1 6.5 7.5zM15.5 21c0-2.6-.8-4.8-2.2-6.3a5 5 0 0 1 3.7-1.7c3 0 5.5 2.7 5.5 6.6V21z"/></svg>',
  folha: '<svg viewBox="0 0 24 24"><path d="M21 3C11 3 4.5 7.5 4.5 15c0 1.6.4 3 1.1 4.1L3 21.7 4.3 23l2.6-2.6c1.2.7 2.6 1.1 4.1 1.1C18 21.5 21.5 14 21 3zM9 17.5c1.5-4 4.5-7 8.5-9-3 2.8-5.3 5.8-7 9.6z"/></svg>',
  escudo: '<svg viewBox="0 0 24 24"><path d="M12 1.8 3.5 5v6.4c0 5.3 3.6 9.6 8.5 10.8 4.9-1.2 8.5-5.5 8.5-10.8V5zM10.6 15.6 7 12l1.5-1.5 2.1 2.1 4.9-4.9L17 9.2z"/></svg>',
  coracao: '<svg viewBox="0 0 24 24"><path d="M12 21.3S2.5 15.4 2.5 8.9A5 5 0 0 1 12 6.3a5 5 0 0 1 9.5 2.6c0 6.5-9.5 12.4-9.5 12.4z"/></svg>',
  casa: '<svg viewBox="0 0 24 24"><path d="M12 2.5 1.5 11l1.4 1.6L4 11.7V22h6v-6.5h4V22h6V11.7l1.1.9 1.4-1.6z"/></svg>',
  predio: '<svg viewBox="0 0 24 24"><path d="M12 2 2 7.5v2h20v-2zM4 11h3v8H4zM10.5 11h3v8h-3zM17 11h3v8h-3zM2 20.5h20V23H2z"/></svg>',
  sol: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  alerta: '<svg viewBox="0 0 24 24"><path d="M12 2 1 21.5h22zm-1 7h2v6h-2zm0 8h2v2h-2z"/></svg>',
}
const icone = (nome, cor = 'onda') => `<span class="p-icone p-icone--${cor}">${ICONES[nome] || ICONES.sol}</span>`
const tracos = (estilo, cor = '#1f5bca') => `<svg class="p-tracos" style="${estilo}" viewBox="0 0 44 26"><path d="M3 4h38M3 13h38M3 22h38" fill="none" stroke="${cor}" stroke-width="4" stroke-linecap="round"/></svg>`
const circulo = (estilo, cor = '#1f5bca') => `<span class="p-circulo" style="${estilo};border-color:${cor}"></span>`
/* a placa: curva de areia com arco laranja na base */
const curvaPlaca = (altura, areia = '#e9e2d3') => `<svg class="p-curva" style="height:${altura}px" viewBox="0 0 1200 300" preserveAspectRatio="none"><path fill="#f28c38" d="M0 170 C 300 80, 620 60, 900 140 S 1150 230, 1200 210 V300 H0z"/><path fill="${areia}" d="M0 230 C 300 140, 640 130, 900 200 S 1150 280, 1200 260 V300 H0z"/></svg>`
/* assinatura do WhatsApp: a onda laranja sobre a onda navy */
const ondaWhats = '<svg class="fw__onda" viewBox="0 0 1080 120" preserveAspectRatio="none"><path fill="#f28c38" d="M0 64 C 220 8, 420 8, 600 52 S 900 110, 1080 40 V120 H0z"/><path fill="#1f2a44" d="M0 92 C 220 36, 430 40, 610 80 S 910 132, 1080 70 V120 H0z"/></svg>'
const rasgo = '<svg class="ig__rasgo" viewBox="0 0 1080 140" preserveAspectRatio="none"><path fill="#eadbc6" d="M0 70 L40 52 L78 74 L120 48 L170 70 L214 44 L262 66 L300 40 L352 68 L396 46 L444 72 L492 50 L540 74 L590 46 L636 70 L684 42 L734 66 L780 48 L826 72 L874 46 L922 68 L968 44 L1016 70 L1080 50 V140 H0z"/><path fill="none" stroke="#f28c38" stroke-width="6" stroke-linejoin="round" d="M0 70 L40 52 L78 74 L120 48 L170 70 L214 44 L262 66 L300 40 L352 68 L396 46 L444 72 L492 50 L540 74 L590 46 L636 70 L684 42 L734 66 L780 48 L826 72 L874 46 L922 68 L968 44 L1016 70 L1080 50"/></svg>'

const apoio = (parceiros, cor) => parceiros && parceiros.length
  ? `<div class="p-apoio"><small>Apoio</small>${parceiros.map((p) => p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.nome)}" crossorigin="anonymous" />` : `<span class="nome">${esc(p.nome)}</span>`).join('')}</div>` : ''

const CONTATOS = { whatsapp: '(48) 99949-7419', escritorio: '(48) 3282-1590', seguranca: '(48) 3266-4300', email: 'ajin@ajin.org.br', site: 'ajin.org.br', instagram: '@ajinjurere' }
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const dataPorExtenso = (iso) => { const d = new Date(iso + 'T12:00:00'); return isNaN(d) ? '' : `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}` }

/* O volume do boletim é contado, nunca digitado: o Boletim 53 saiu em
   13/10/2026 e cada segunda-feira seguinte soma um. */
export function volumeDoBoletim(iso) {
  const ref = new Date('2026-10-13T12:00:00'), d = new Date(iso + 'T12:00:00')
  if (isNaN(d)) return ''
  return 53 + Math.round((d - ref) / (7 * 864e5))
}

/* =====================================================================
   1. FLYER DE WHATSAPP
   ===================================================================== */
const flyerWhatsapp = {
  id: 'flyer-whatsapp',
  nome: 'Flyer de WhatsApp',
  canal: 'WhatsApp',
  descricao: 'Imagem pronta para o grupo de associados. A foto prevalece, a informação aparece em destaque e a assinatura é a onda laranja com a onda navy.',
  campos: [
    { id: 'formato', rotulo: 'Formato', tipo: 'escolha', opcoes: [['feed', 'Quadro 1080 × 1350'], ['story', 'Tela cheia 1080 × 1920']] },
    { id: 'imagem', rotulo: 'Foto principal', tipo: 'imagem', ajuda: 'Foto real, nítida, do lugar ou do evento.' },
    { id: 'rotulo', rotulo: 'Etiqueta', tipo: 'texto', limite: [4, 22], ajuda: 'Ex.: Convite, Atenção, Meio ambiente.' },
    { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [12, 48] },
    { id: 'subtitulo', rotulo: 'Frase de apoio', tipo: 'area', limite: [40, 120] },
    { id: 'info', rotulo: 'Informações', tipo: 'lista', max: 4, itens: [
      { id: 'icone', rotulo: 'Tipo', tipo: 'escolha', opcoes: [['data', 'Data'], ['hora', 'Horário'], ['local', 'Local'], ['valor', 'Valor'], ['contato', 'Contato']] },
      { id: 'texto', rotulo: 'Texto', tipo: 'texto', limite: [4, 48] },
    ] },
    { id: 'cta', rotulo: 'Chamada para ação', tipo: 'texto', limite: [6, 32] },
    { id: 'legenda', rotulo: 'Mensagem para colar no WhatsApp', tipo: 'area', ajuda: 'O texto que acompanha a imagem no grupo.' },
  ],
  exemplo: {
    formato: 'feed', imagem: BASE + 'fotos/horta-baldinho-grupo-m.jpg', rotulo: 'Convite',
    titulo: 'Plantio com as crianças na horta',
    subtitulo: 'Uma manhã de terra nas mãos, baldinhos pintados e famílias reunidas no Pé-de-Fruta.',
    info: [{ icone: 'data', texto: 'Sábado, [CONFIRMAR: data]' }, { icone: 'hora', texto: '9h30' }, { icone: 'local', texto: 'Horta Comunitária, Pé-de-Fruta' }],
    cta: 'Confirme pelo WhatsApp',
    legenda: 'Prezado(a) associado(a),\n\nNo próximo sábado a Horta Comunitária recebe as crianças para mais um plantio do Baldinho do Bem. 🌱\n\n📅 Sábado, [CONFIRMAR: data]\n⏰ 9h30\n📍 Horta Comunitária, Pé-de-Fruta\n\nConfirme sua presença aqui no WhatsApp da AJIN: (48) 99949-7419.\n\nDiretoria AJIN',
  },
  paginas(p, ctx = {}) {
    const story = p.formato === 'story', h = story ? 1920 : 1350
    const info = (p.info || []).filter((i) => i.texto).map((i) => `<div class="fw__linha">${icone(i.icone, 'onda')}<span>${marca(i.texto)}</span></div>`).join('')
    return [{ w: 1080, h, html: `
      <div class="peca fw ${story ? 'fw--story' : ''}" style="width:1080px;height:${h}px">
        <div class="fw__foto">${foto(p.imagem, p.titulo)}<img class="fw__logo" src="${LOGO_BRANCO}" alt="AJIN" />${p.rotulo ? `<span class="fw__rotulo">${esc(p.rotulo)}</span>` : ''}</div>
        <div class="fw__painel">${ondaWhats}
          <h1 class="p-titulo fw__titulo">${marca(p.titulo)}</h1>
          ${p.subtitulo ? `<p class="fw__sub">${marca(p.subtitulo)}</p>` : ''}
          ${info ? `<div class="fw__info">${info}</div>` : ''}
          <div class="fw__rodape">${p.cta ? `<span class="fw__cta">${marca(p.cta)}</span>` : '<span></span>'}<span class="fw__contato">WhatsApp ${CONTATOS.whatsapp}<br>${CONTATOS.instagram}</span></div>
          ${apoio(ctx.parceiros)}
        </div>${grao}
      </div>` }]
  },
  legenda: (p) => p.legenda || '',
}

/* =====================================================================
   2. CARROSSEL DE INSTAGRAM
   Seis tipos de card, com os limites do briefing de escrita.
   ===================================================================== */
const TIPOS_CARD = {
  capa: { nome: 'Capa', campos: [
    { id: 'imagem', rotulo: 'Foto', tipo: 'imagem' },
    { id: 'rotulo', rotulo: 'Tema', tipo: 'texto', limite: [4, 24] },
    { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [25, 45] },
    { id: 'apoio', rotulo: 'Frase de apoio', tipo: 'area', limite: [60, 75] },
  ] },
  coluna: { nome: 'Coluna com foto', campos: [
    { id: 'imagem', rotulo: 'Foto', tipo: 'imagem' },
    { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [10, 22] },
    { id: 'itens', rotulo: 'Blocos', tipo: 'lista', max: 3, itens: [
      { id: 'subtitulo', rotulo: 'Subtítulo', tipo: 'texto', limite: [8, 15] },
      { id: 'texto', rotulo: 'Parágrafo', tipo: 'area', limite: [70, 160] },
    ] },
  ] },
  rasgada: { nome: 'Foto rasgada', campos: [
    { id: 'imagem', rotulo: 'Foto', tipo: 'imagem' },
    { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [10, 22] },
    { id: 'subtitulo', rotulo: 'Subtítulo', tipo: 'texto', limite: [8, 15] },
    { id: 'texto', rotulo: 'Parágrafo', tipo: 'area', limite: [150, 185] },
  ] },
  longo: { nome: 'Texto longo', campos: [
    { id: 'subtitulo', rotulo: 'Subtítulo', tipo: 'texto', limite: [8, 15] },
    { id: 'p1', rotulo: 'Parágrafo 1 (destaque)', tipo: 'area', limite: [130, 160] },
    { id: 'p2', rotulo: 'Parágrafo 2', tipo: 'area', limite: [250, 285] },
    { id: 'p3', rotulo: 'Parágrafo 3', tipo: 'area', limite: [280, 335] },
  ] },
  caixas: { nome: 'Três caixas', campos: [
    { id: 'itens', rotulo: 'Caixas', tipo: 'lista', max: 3, itens: [
      { id: 'icone', rotulo: 'Ícone', tipo: 'escolha', opcoes: [['pessoas', 'Pessoas'], ['folha', 'Folha'], ['escudo', 'Escudo'], ['coracao', 'Coração'], ['casa', 'Casa'], ['predio', 'Prédio'], ['sol', 'Sol'], ['alerta', 'Alerta']] },
      { id: 'subtitulo', rotulo: 'Subtítulo', tipo: 'texto', limite: [8, 15] },
      { id: 'texto', rotulo: 'Parágrafo', tipo: 'area', limite: [180, 225] },
    ] },
  ] },
  fecho: { nome: 'Fechamento', campos: [
    { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [20, 45] },
    { id: 'texto', rotulo: 'Frase de fecho', tipo: 'area', limite: [80, 95] },
    { id: 'cta', rotulo: 'Chamada', tipo: 'texto', limite: [6, 32] },
  ] },
}
export { TIPOS_CARD }

function cardIG(c, i, total, ctx = {}) {
  const ultimo = i === total - 1
  const topo = (escuro) => `<div class="ig__topo"><img src="${escuro ? LOGO_BRANCO : LOGO_NAVY}" alt="AJIN" /><span>${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div>`
  const rodape = `<div class="ig__rodape"><span>${CONTATOS.instagram}</span>${ultimo ? '' : `<span class="ig__gancho">${esc(c.gancho || 'Continue')} <i>→</i></span>`}</div>`
  const caixa = (cls, escuro, miolo) => ({ w: 1080, h: 1350, html: `<div class="peca ig ${cls}" style="width:1080px;height:1350px">${miolo}${topo(escuro)}${rodape}${grao}</div>` })
  switch (c.tipo) {
    case 'capa':
      return caixa(`ig--capa ig--foto ${c.imagem ? '' : 'ig--capa-sem-foto'}`, true, `${c.imagem ? foto(c.imagem, c.titulo) + '<div class="p-veu"></div>' : circulo('width:520px;height:520px;right:-160px;top:-120px', '#f28c38')}<div class="ig__capa">${c.rotulo ? `<span class="p-rotulo">${esc(c.rotulo)}</span>` : ''}<h1 class="p-titulo">${marca(c.titulo)}</h1>${c.apoio ? `<p>${marca(c.apoio)}</p>` : ''}</div>`)
    case 'coluna':
      return caixa('ig--coluna', false, `<div class="ig__foto">${foto(c.imagem, c.titulo)}</div><div><h2 class="p-titulo">${marca(c.titulo)}</h2><div class="ig__itens">${(c.itens || []).map((it) => `<div class="ig__item"><div><b>${marca(it.subtitulo)}</b><span>${marca(it.texto)}</span></div></div>`).join('')}</div></div>`)
    case 'rasgada':
      return caixa('ig--rasgada', false, `<div class="ig__foto">${foto(c.imagem, c.titulo)}</div>${rasgo}<div class="ig__texto"><h2 class="p-titulo">${marca(c.titulo)}</h2>${c.subtitulo ? `<h3>${marca(c.subtitulo)}</h3>` : ''}<p>${marca(c.texto)}</p></div>`)
    case 'longo':
      return caixa('ig--longo', false, `${circulo('width:360px;height:360px;right:-140px;bottom:120px', '#f28c38')}${c.subtitulo ? `<span class="p-rotulo">${esc(c.subtitulo)}</span>` : ''}<p class="ig__p1">${marca(c.p1)}</p><p class="ig__p2">${marca(c.p2)}</p><p class="ig__p3">${marca(c.p3)}</p>`)
    case 'caixas': {
      const cores = ['navy', 'mar', 'onda'], ic = ['onda', 'areia', 'navy']
      return caixa('ig--caixas', false, `${tracos('right:88px;top:120px')}<div class="ig__caixas">${(c.itens || []).map((it, k) => `<div class="ig__caixa ig__caixa--${cores[k % 3]}">${icone(it.icone || 'sol', ic[k % 3])}<b>${marca(it.subtitulo)}</b><span>${marca(it.texto)}</span></div>`).join('')}</div>`)
    }
    case 'fecho':
      return caixa('ig--fecho escuro', true, `${circulo('width:420px;height:420px;right:-150px;top:-140px')}${tracos('right:88px;top:130px')}<div class="ig__fecho"><h2 class="p-titulo">${marca(c.titulo)}</h2><p>${marca(c.texto)}</p>${c.cta ? `<span class="ig__cta">${marca(c.cta)}</span>` : ''}</div>${apoio(ctx.parceiros)}${curvaPlaca(330)}`)
    case 'boletim-capa':
      return caixa('ig--capa ig--foto ig--boletim', true, `${foto(c.imagem, c.titulo)}<div class="p-veu"></div><span class="ig__vol"><small>VOL.</small><b>${esc(c.volume)}</b></span><div class="ig__capa"><span class="p-rotulo">${esc(c.rotulo || 'Boletim semanal')}</span><h1 class="p-titulo">${marca(c.titulo)}</h1>${c.apoio ? `<p>${marca(c.apoio)}</p>` : ''}</div>`)
    case 'boletim-link':
      return caixa('ig--fecho ig--link escuro', true, `${circulo('width:420px;height:420px;right:-150px;top:-140px')}<div class="ig__fecho"><h2 class="p-titulo">${marca(c.titulo)}</h2><p>${marca(c.texto)}</p><div class="ig__link"><b>${esc(c.link || 'ajin.org.br/boletim')}</b><span>Link na bio. O boletim completo, em PDF, para ler e guardar.</span></div></div>${curvaPlaca(330)}`)
    default:
      return caixa('', false, '<div class="p-vazio" style="height:100%">Card</div>')
  }
}

const carrosselInstagram = {
  id: 'carrossel-instagram',
  nome: 'Carrossel de Instagram',
  canal: 'Instagram',
  descricao: 'Leitura editorial em cards: frases curtas em continuidade, ganchos para o próximo card e um convite ao raciocínio no fim.',
  campos: [
    { id: 'tema', rotulo: 'Tema da campanha', tipo: 'escolha', opcoes: [['Cultura & História', 'Cultura & História'], ['Eventos', 'Eventos'], ['Meio Ambiente', 'Meio Ambiente'], ['Segurança', 'Segurança'], ['Manutenção', 'Manutenção'], ['Depoimento Associado', 'Depoimento Associado'], ['Qualidade de vida', 'Qualidade de vida'], ['Notícias e Informações', 'Notícias e Informações']] },
    { id: 'cards', rotulo: 'Cards', tipo: 'cards', max: 10 },
    { id: 'legenda', rotulo: 'Legenda do post', tipo: 'area', ajuda: 'Gancho na primeira linha, parágrafos curtos, convite final, até 5 hashtags.' },
  ],
  exemplo: {
    tema: 'Meio Ambiente',
    cards: [
      { tipo: 'capa', imagem: BASE + 'fotos/horta-inaug-maos.jpg', rotulo: 'Meio ambiente', titulo: 'Quem planta aqui não planta só alface', apoio: 'Toda semana, vizinhos voltam à horta. O que eles colhem não cabe na cesta.', gancho: 'Por quê?' },
      { tipo: 'coluna', imagem: BASE + 'fotos/horta-colheita-familia-m.jpg', titulo: 'Terra e conversa', itens: [
        { subtitulo: 'De manhã cedo', texto: 'Moradores chegam com regador na mão. Ninguém combinou, mas todo mundo sabe que alguém vai estar lá.' },
        { subtitulo: 'Fim de semana', texto: 'As crianças voltam para ver se o que plantaram cresceu. Cresceu. E elas levam para casa.' },
        { subtitulo: 'O que não se vê', texto: 'Compostagem, ferramenta guardada, canteiro limpo. Trabalho miúdo que só aparece quando falta.' },
      ], gancho: 'E você?' },
      { tipo: 'longo', subtitulo: 'Para pensar', p1: 'Um bairro bonito não se mantém sozinho. Ele se mantém porque alguém decide, todos os dias, que aquele pedaço de terra também é dele.', p2: 'A gente costuma achar que cuidar do espaço público é tarefa de quem é pago para isso. É também. Mas o que transforma uma praça em lugar de encontro é outra coisa: a presença constante de quem mora perto, conhece o caminho e repara quando algo está fora do lugar.', p3: 'A horta do Pé-de-Fruta existe porque vizinhos se organizaram, doaram tempo e insistiram quando era mais fácil desistir. Ela não pertence à AJIN. Pertence a quem aparece com regador na mão. E a pergunta que fica é simples, mas incomoda: qual pedaço do bairro você já tratou, de verdade, como seu?', gancho: 'Continue' },
      { tipo: 'fecho', titulo: 'Jurerê é de quem cuida.', texto: 'A horta é de quem aparece. Venha uma vez, traga as crianças e veja se consegue não voltar.', cta: 'Fale com a AJIN' },
    ],
    legenda: 'Quem planta aqui não planta só alface. 🌱\n\nToda semana, vizinhos voltam à Horta Comunitária do Pé-de-Fruta. Uns trazem regador, outros trazem os netos.\n\nO que eles colhem não cabe na cesta: é conversa, é bairro cuidado, é gente que se conhece pelo nome.\n\nVenha uma vez. Traga as crianças.\n\n#JurerêInternacional #AJIN #HortaComunitária #JurerêÉDeQuemCuida',
  },
  paginas(p, ctx = {}) { const cs = p.cards || []; return cs.map((c, i) => cardIG(c, i, cs.length, ctx)) },
  legenda: (p) => p.legenda || '',
}

/* =====================================================================
   3. BOLETIM SEMANAL
   ===================================================================== */
const EDITORIAS = ['Acontece em Jurerê', 'Aos associados', 'Importante para o associado', 'Segurança', 'Alerta de segurança', 'Meio ambiente', 'Área do Pé-de-Fruta', 'Manutenção', 'Eventos', 'Saúde e bem-estar', 'Parceria institucional', 'Protocolo registrado', 'Dados do bairro', 'Nota de pesar', 'Cultura e história']

function paginasBoletim(p, ctx = {}) {
  const data = p.data || new Date().toISOString().slice(0, 10)
  const vol = p.volume || volumeDoBoletim(data)
  const d = new Date(data + 'T12:00:00')
  const materias = (p.materias || []).filter((m) => m.titulo)
  const paginas = []
  const cab = (n) => `<div class="bo__cabeca"><img src="${LOGO_NAVY}" alt="AJIN" /><span>Vol. ${esc(vol)} · ${esc(dataPorExtenso(data))}</span>${n ? `<span class="bo__num">${String(n).padStart(2, '0')}</span>` : '<span></span>'}</div>`
  const MB = BASE + 'estudio/marca/'
  const escura = (cls) => /ocorrencias|info|fecho/.test(cls)
  const pe = (cls) => `<svg class="bo__onda" viewBox="0 0 560 92" preserveAspectRatio="none"><path fill="#f28c38" d="M20 92 C 160 52, 300 6, 410 6 C 480 6, 530 26, 560 46 V92 Z"/><path fill="#1f5bca" d="M340 92 C 420 82, 500 78, 560 81 V92 Z"/></svg><img class="bo__icones" src="${MB}${escura(cls) ? 'icones-claro' : 'icones-escuro'}.png" alt="" />`
  const sublinhado = `<img class="bo__sublinhado" src="${MB}sublinhado.png" alt="" />`
  const COR_EDITORIA = (e) => /segur|alerta|pesar|protocolo/i.test(e) ? 'navy' : /ambiente|pé-de-fruta|manuten|saúde/i.test(e) ? 'mar' : 'onda'
  const ICONE_EDITORIA = (e) => /segur|alerta|protocolo/i.test(e) ? 'icone-sol' : /ambiente|pé-de-fruta|manuten/i.test(e) ? 'icone-folha' : /saúde|pesar|associad/i.test(e) ? 'icone-coracao' : 'icone-barco'
  const pagina = (cls, miolo) => paginas.push({ w: 794, h: 1123, html: (num) => `<div class="peca bo ${cls}" style="width:794px;height:1123px">${miolo}${pe(cls)}<div class="bo__rodape"><span>${CONTATOS.site} · ${CONTATOS.instagram}</span><span>${String(num).padStart(2, '0')} / {{TOTAL}}</span></div>${grao}</div>` })

  /* capa */
  paginas.push({ w: 794, h: 1123, html: () => `<div class="peca bo bo--capa escuro" style="width:794px;height:1123px">${foto(p.capa, 'Foto da semana em Jurerê Internacional', 'p-foto', p.capaPosicao)}<div class="p-veu"></div><img class="bo__logo" src="${LOGO_BRANCO}" alt="AJIN" /><span class="bo__vol">VOL. ${esc(vol)}</span><img class="bo__brilho" src="${MB}brilho.png" alt="" /><div class="bo__capa"><span class="p-rotulo">Boletim semanal · associados AJIN</span><h1 class="p-titulo">Jurerê Internacional esta semana</h1>${sublinhado}${p.chamada ? `<p class="bo__chamada">${marca(p.chamada)}</p>` : ''}</div><div class="bo__data"><span class="bo__dia"><b>${isNaN(d) ? '' : d.getDate()}</b><small>${isNaN(d) ? '' : MESES[d.getMonth()].slice(0, 3).toUpperCase()}</small></span><span>Edição semanal<br>${isNaN(d) ? '' : d.getFullYear()}</span></div><span class="bo__assina">Sua voz em Jurerê Internacional</span><svg class="bo__onda" viewBox="0 0 794 120" preserveAspectRatio="none"><path fill="#f28c38" d="M0 120 C 180 70, 420 10, 600 14 C 690 16, 750 38, 794 60 V120 Z"/><path fill="#1f5bca" d="M380 120 C 520 104, 680 98, 794 104 V120 Z"/></svg>${grao}</div>` })

  /* índice */
  const itensIndice = materias.map((m, i) => `<div><b>${String(i + 1).padStart(2, '0')}</b><span>${marca(m.titulo)}${m.fina ? `<em>${marca(m.fina)}</em>` : ''}</span></div>`)
  if ((p.ocorrencias || []).length) itensIndice.push(`<div><b>${String(materias.length + 1).padStart(2, '0')}</b><span>Ocorrências de segurança da semana</span></div>`)
  pagina('bo--indice', `${cab()}<span class="p-rotulo">Nesta edição</span><h2 class="p-titulo">O que você vai ler hoje</h2>${sublinhado}<div class="bo__lista">${itensIndice.join('')}</div><div class="bo__placa"><b>Jurerê é de quem cuida.</b><p>Este boletim chega toda semana aos associados com o que a AJIN fez, o que vem pela frente e o que pede a sua atenção.</p><img class="bo__selo" src="${MB}selo.png" alt="" /></div>`)

  /* matérias: corpo dividido pelo espaço de cada página */
  materias.forEach((m, i) => {
    const fotos = (m.fotos || []).filter(Boolean).slice(0, 4)
    const altFotos = fotos.length === 0 ? 0 : fotos.length === 1 ? 300 : fotos.length === 2 ? 220 : 300
    const capPrimeira = fotos.length ? 2300 : 4300, capCont = 4800
    const pars = paragrafos(m.corpo)
    const blocos = [[]]; let usado = 0, cap = capPrimeira
    for (const par of pars) {
      if (usado + par.length > cap && blocos[blocos.length - 1].length) { blocos.push([]); usado = 0; cap = capCont }
      blocos[blocos.length - 1].push(par); usado += par.length + 80
    }
    blocos.forEach((bl, k) => {
      const corpo = bl.map((x) => `<p>${marca(x)}</p>`).join('')
      const ultimo = k === blocos.length - 1
      const destaque = ultimo && m.destaque && m.destaque.texto ? `<div class="bo__destaque"><img class="fita" src="${MB}fita-2.png" alt="" /><img class="icone" src="${MB}${ICONE_EDITORIA(m.editoria || '')}.png" alt="" /><div><small>${esc(m.destaque.rotulo || 'Importante')}</small><b>${marca(m.destaque.texto)}</b></div></div>` : ''
      const fotosHtml = k === 0 && fotos.length ? `<div class="bo__fotos" data-n="${fotos.length}" style="height:${altFotos}px">${fotos.map((f, j) => `<figure>${j === 0 ? `<img class="fita" src="${MB}fita-1.png" alt="" />` : ''}${foto(f, m.titulo, '')}</figure>`).join('')}</div>` : ''
      pagina('bo--materia', `${cab(i + 1)}<div class="bo__chapeu"><span class="bo__editoria bo__editoria--${COR_EDITORIA(m.editoria || '')}">${esc(m.editoria || 'Acontece em Jurerê')}</span></div><h2 class="p-titulo">${marca(m.titulo)}</h2>${k === 0 ? sublinhado : ''}${k === 0 ? (m.fina ? `<p class="bo__fina">${marca(m.fina)}</p>` : '') : '<p class="bo__cont">Continuação</p>'}${fotosHtml}<div class="bo__corpo">${corpo}</div>${destaque}`)
    })
  })

  /* ocorrências de segurança */
  const ocs = (p.ocorrencias || []).filter((o) => o.descricao)
  if (ocs.length) {
    for (let k = 0; k < ocs.length; k += 9) {
      pagina('bo--ocorrencias', `${cab(materias.length + 1)}<span class="p-rotulo">Segurança</span><h2 class="p-titulo">Ocorrências de segurança da semana</h2><div class="bo__ocs">${ocs.slice(k, k + 9).map((o) => `<div class="bo__oc"><b>${marca(o.data)}<small>${marca(o.hora || '')}</small></b><span><strong>${marca(o.local || '')}</strong>${marca(o.descricao)}</span></div>`).join('')}</div>`)
    }
  }

  /* informações importantes */
  if (p.incluirInfo !== false) {
    pagina('bo--info', `${cab()}<span class="p-rotulo">Aos associados</span><h2 class="p-titulo">Informações importantes</h2><div class="bo__cards"><div class="bo__card bo__card--navy"><b>Plano de Segurança</b><span>Monitoramento por câmeras, rondas, vistorias e escoltas, 24 horas por dia.</span></div><div class="bo__card bo__card--mar"><b>Plano de Manutenção</b><span>Zeladoria das áreas adotadas, meio ambiente, eventos e representação do bairro.</span></div><div class="bo__card bo__card--onda"><b>Associe-se</b><span>Em ${CONTATOS.site}/cadastro ou pelo WhatsApp ${CONTATOS.whatsapp}.</span></div><div class="bo__card bo__card--clara"><b>Atualize seus dados</b><span>Escritório ${CONTATOS.escritorio}, de segunda a sexta.</span></div></div><div class="bo__contatos"><div><small>Segurança 24h</small><b>${CONTATOS.seguranca}</b></div><div><small>WhatsApp</small><b>${CONTATOS.whatsapp}</b></div><div><small>Escritório</small><b>${CONTATOS.escritorio}</b></div><div><small>E-mail</small><b>${CONTATOS.email}</b></div></div>`)
  }

  /* fecho */
  paginas.push({ w: 794, h: 1123, html: (num) => `<div class="peca bo bo--fecho" style="width:794px;height:1123px"><img class="bo__pessoas" src="${MB}pessoas-2.webp" alt="" /><img class="bo__selo" src="${MB}selo.png" alt="" /><div class="bo__fecho"><img src="${LOGO_BRANCO}" alt="AJIN" style="height:52px" /><h2 class="p-titulo" style="margin-top:40px">Obrigado por ler até aqui.</h2><p>Tem uma sugestão de pauta, uma foto do bairro ou uma dúvida? Responda no grupo ou fale com a gente.</p><div class="bo__contatos" style="margin-top:28px"><div><small>Site</small><b>${CONTATOS.site}</b></div><div><small>Instagram</small><b>${CONTATOS.instagram}</b></div><div><small>WhatsApp</small><b>${CONTATOS.whatsapp}</b></div><div><small>Segurança 24h</small><b>${CONTATOS.seguranca}</b></div></div></div>${apoio(ctx.parceiros)}<div class="bo__rodape" style="color:#dcd6cb"><span>${CONTATOS.site} · ${CONTATOS.instagram}</span><span>${String(num).padStart(2, '0')} / {{TOTAL}}</span></div></div>` })

  const total = paginas.length
  return paginas.map((pg, i) => ({ w: pg.w, h: pg.h, html: pg.html(i + 1).replace('{{TOTAL}}', String(total).padStart(2, '0')) }))
}

const boletim = {
  id: 'boletim',
  nome: 'Boletim semanal',
  canal: 'PDF no site e WhatsApp',
  descricao: 'O boletim dos associados em A4. O volume é contado sozinho pela data. Quando fica pronto, vira um carrossel curto de Instagram com link para o PDF no site.',
  campos: [
    { id: 'data', rotulo: 'Data da edição', tipo: 'data', ajuda: 'O volume é calculado por ela.' },
    { id: 'volume', rotulo: 'Volume', tipo: 'numero', ajuda: 'Calculado pela data. Só mude se a diretoria pedir.' },
    { id: 'capa', rotulo: 'Foto da capa', tipo: 'imagem' },
    { id: 'chamada', rotulo: 'Chamada da capa', tipo: 'texto', limite: [20, 90] },
    { id: 'materias', rotulo: 'Matérias', tipo: 'lista', max: 10, itens: [
      { id: 'editoria', rotulo: 'Editoria', tipo: 'escolha', opcoes: EDITORIAS.map((e) => [e, e]) },
      { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [20, 80] },
      { id: 'fina', rotulo: 'Linha fina', tipo: 'texto', limite: [40, 140] },
      { id: 'corpo', rotulo: 'Texto', tipo: 'area', ajuda: 'Linha em branco separa parágrafos.' },
      { id: 'fotos', rotulo: 'Fotos (até 4)', tipo: 'imagens', max: 4 },
      { id: 'destaque', rotulo: 'Caixa de destaque', tipo: 'grupo', itens: [
        { id: 'rotulo', rotulo: 'Rótulo', tipo: 'texto', limite: [4, 24], ajuda: 'Ex.: Protocolo, Atenção, Como funciona.' },
        { id: 'texto', rotulo: 'Texto', tipo: 'area', limite: [20, 160] },
      ] },
    ] },
    { id: 'ocorrencias', rotulo: 'Ocorrências de segurança', tipo: 'lista', max: 27, itens: [
      { id: 'data', rotulo: 'Dia', tipo: 'texto', limite: [4, 20] },
      { id: 'hora', rotulo: 'Hora', tipo: 'texto', limite: [3, 12] },
      { id: 'local', rotulo: 'Local', tipo: 'texto', limite: [4, 60] },
      { id: 'descricao', rotulo: 'O que aconteceu', tipo: 'area', limite: [30, 320] },
    ] },
  ],
  exemplo: {
    data: '2026-10-20', capa: BASE + 'fotos/curumins-familia-m.jpg', chamada: 'O bairro em movimento: esporte, segurança e cuidado com as áreas adotadas.',
    materias: [
      { editoria: 'Acontece em Jurerê', titulo: 'Jurerê recebe o Ironman 70.3 e a AJIN orienta os moradores', fina: 'Competição internacional muda o trânsito no domingo. Veja como sair e entrar no bairro.', corpo: 'A competição acontece no domingo, com largada na praia de Jurerê Internacional. [CONFIRMAR: horário de largada]\n\nA AJIN acompanhou com a organização o plano de trânsito e repassa aos associados as principais alterações.\n\nPedimos atenção redobrada a quem precisa sair cedo e paciência com as equipes de apoio, que estarão nas esquinas indicando os desvios.', fotos: [BASE + 'fotos/jurere-bairro-mata.jpg'], destaque: { rotulo: 'Atenção', texto: 'Programe a saída antes das [CONFIRMAR: horário] para evitar os bloqueios.' } },
      { editoria: 'Área do Pé-de-Fruta', titulo: 'Horta Comunitária ganha novos canteiros', fina: 'Voluntários reorganizam o espaço para a temporada de verão.', corpo: 'Os voluntários da horta passaram a manhã de sábado preparando novos canteiros e reorganizando as composteiras.\n\nQualquer associado pode participar. Os horários estão com o escritório.', fotos: [BASE + 'fotos/horta-baldinho-grupo-m.jpg', BASE + 'fotos/horta-colheita-menino-m.jpg'], destaque: { rotulo: 'Participe', texto: 'Fale com o escritório para entrar no grupo de voluntários da horta.' } },
    ],
    ocorrencias: [{ data: '[CONFIRMAR: dia]', hora: '22h10', local: 'Rua das Sapopemas', descricao: 'Portão de garagem encontrado aberto. A equipe tática acionou o morador e acompanhou o fechamento.' }],
  },
  paginas: paginasBoletim,
  /* o boletim pronto vira um carrossel curto de Instagram */
  derivar(p) {
    const data = p.data || new Date().toISOString().slice(0, 10)
    const m = (p.materias || [])[0] || {}
    const vol = p.volume || volumeDoBoletim(data)
    return {
      modelo: 'carrossel-instagram',
      peca: {
        tema: 'Notícias e Informações',
        cards: [
          { tipo: 'boletim-capa', imagem: p.capa, volume: vol, rotulo: `Boletim semanal · ${dataPorExtenso(data)}`, titulo: 'Jurerê Internacional esta semana', apoio: p.chamada || '', gancho: 'A principal' },
          { tipo: 'rasgada', imagem: (m.fotos || [])[0] || p.capa, titulo: (m.titulo || '').slice(0, 60), subtitulo: m.editoria || '', texto: (m.fina || paragrafos(m.corpo)[0] || '').slice(0, 185), gancho: 'Leia tudo' },
          { tipo: 'boletim-link', titulo: 'O boletim completo está no site.', texto: `Vol. ${vol}, com todas as matérias da semana e as ocorrências de segurança.`, link: 'ajin.org.br/boletim' },
        ],
        legenda: `Saiu o Boletim Semanal vol. ${vol}. 📰\n\n${m.titulo || ''}\n\nO boletim completo, com todas as matérias da semana, está no site da AJIN. Link na bio.\n\n#JurerêInternacional #AJIN #BoletimAJIN`,
      },
    }
  },
}

/* =====================================================================
   4. E-MAIL MARKETING
   ===================================================================== */
const email = {
  id: 'email',
  nome: 'E-mail marketing',
  canal: 'Zoho Campaigns',
  descricao: 'Conteúdo de valor: o que importa, destrinchado, com peso nas palavras. Passa pela aprovação da diretoria e é enviado pelo Zoho.',
  campos: [
    { id: 'assunto', rotulo: 'Assunto', tipo: 'texto', limite: [25, 60] },
    { id: 'pre', rotulo: 'Pré-cabeçalho', tipo: 'texto', limite: [40, 110], ajuda: 'A frase que aparece ao lado do assunto na caixa de entrada.' },
    { id: 'imagem', rotulo: 'Imagem de abertura', tipo: 'imagem' },
    { id: 'rotulo', rotulo: 'Etiqueta', tipo: 'texto', limite: [4, 28] },
    { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [25, 80] },
    { id: 'abertura', rotulo: 'Abertura', tipo: 'area', limite: [150, 420], ajuda: 'Comece por uma cena, não por um aviso.' },
    { id: 'blocos', rotulo: 'Blocos', tipo: 'lista', max: 4, itens: [
      { id: 'intertitulo', rotulo: 'Intertítulo', tipo: 'texto', limite: [10, 60] },
      { id: 'texto', rotulo: 'Texto', tipo: 'area', limite: [150, 700] },
    ] },
    { id: 'destaque', rotulo: 'Destaque', tipo: 'area', limite: [40, 220] },
    { id: 'cta', rotulo: 'Botão', tipo: 'grupo', itens: [
      { id: 'texto', rotulo: 'Texto do botão', tipo: 'texto', limite: [6, 30] },
      { id: 'link', rotulo: 'Link', tipo: 'texto' },
    ] },
    { id: 'assinatura', rotulo: 'Assinatura', tipo: 'texto' },
  ],
  exemplo: {
    assunto: 'O que muda em Jurerê com a temporada de verão',
    pre: 'Segurança reforçada, áreas adotadas em dia e o que pedimos a cada morador.',
    imagem: BASE + 'fotos/capa-bairro-m.jpg', rotulo: 'Aos associados',
    titulo: 'A temporada começa antes do primeiro turista chegar',
    abertura: 'Em dezembro o bairro muda de ritmo. A rua que de manhã tinha um corredor e dois cachorros passa a ter fila na esquina. É nesse momento que o cuidado de todo o ano mais aparece, e também quando ele mais precisa de você.',
    blocos: [
      { intertitulo: 'Segurança: mais olhos, mesma atenção', texto: 'A central de monitoramento segue 24 horas por dia, com as rondas e as vistorias de sempre. Nesta época, o bairro recebe mais gente de fora. Um minuto conferindo portões e janelas antes de sair ajuda a equipe a proteger a sua casa.' },
      { intertitulo: 'Áreas adotadas prontas para receber', texto: 'Pé-de-Fruta, Praça dos Morrinhos e Parquinho dos Curumins passam por manutenção antes do pico de visitantes. Se notar algo fora do lugar, avise o escritório.' },
    ],
    destaque: 'Segurança 24h: (48) 3266-4300. Salve o número antes de precisar.',
    cta: { texto: 'Fale com a AJIN', link: 'https://wa.me/5548999497419' },
    assinatura: 'Diretoria Executiva da AJIN',
  },
  paginas(p) { const html = emailHtml(p); return [{ w: 680, h: 0, html: `<div class="peca em" style="width:680px"><div class="em__caixa">${html.corpo}</div></div>`, auto: true }] },
  email: (p, ctx) => emailHtml(p, ctx).documento,
}

/* HTML de e-mail em tabelas e estilo em linha: é o que os leitores de
   e-mail respeitam. Mesmas cores e mesma hierarquia das outras peças. */
function emailHtml(p, ctx = {}) {
  const F = "font-family:Inter,Arial,Helvetica,sans-serif"
  const bloco = (b) => `<tr><td style="padding:0 44px 26px"><h2 style="${F};margin:0 0 10px;font-size:22px;line-height:1.25;font-weight:800;color:#1f2a44;letter-spacing:-0.3px">${marca(b.intertitulo)}</h2>${paragrafos(b.texto).map((x) => `<p style="${F};margin:0 0 12px;font-size:16px;line-height:1.65;color:#3a4052">${marca(x)}</p>`).join('')}</td></tr>`
  const parceiros = (ctx.parceiros || []).length ? `<tr><td style="padding:20px 44px;border-top:1px solid #e3ddd1"><span style="${F};font-size:11px;font-weight:800;letter-spacing:2px;color:#6b7180;text-transform:uppercase">Apoio</span><br>${ctx.parceiros.map((x) => x.logo ? `<img src="${esc(x.logo)}" alt="${esc(x.nome)}" height="34" style="margin:10px 16px 0 0;vertical-align:middle">` : `<b style="${F};font-size:14px;color:#1f2a44;margin-right:16px">${esc(x.nome)}</b>`).join('')}</td></tr>` : ''
  const corpo = `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#fbf8f2;border-radius:18px;overflow:hidden">
    <tr><td style="background:#1f2a44;padding:26px 44px"><img src="${LOGO_BRANCO}" alt="AJIN" height="34" style="display:block;height:34px"></td></tr>
    ${p.imagem ? `<tr><td><img src="${esc(p.imagem)}" alt="" width="600" style="display:block;width:600px;height:auto"></td></tr>` : ''}
    <tr><td style="padding:34px 44px 8px">${p.rotulo ? `<span style="${F};font-size:12px;font-weight:800;letter-spacing:2px;color:#1f5bca;text-transform:uppercase">${esc(p.rotulo)}</span>` : ''}<h1 style="${F};margin:12px 0 0;font-size:32px;line-height:1.08;font-weight:900;color:#1f2a44;letter-spacing:-1px">${marca(p.titulo)}</h1><div style="height:4px;width:56px;background:#f28c38;border-radius:4px;margin:18px 0 0"></div></td></tr>
    <tr><td style="padding:18px 44px 22px">${paragrafos(p.abertura).map((x) => `<p style="${F};margin:0 0 12px;font-size:18px;line-height:1.6;color:#2f3546;font-weight:500">${marca(x)}</p>`).join('')}</td></tr>
    ${(p.blocos || []).filter((b) => b.texto).map(bloco).join('')}
    ${p.destaque ? `<tr><td style="padding:0 44px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#1f2a44;border-radius:14px;padding:22px 24px;border-left:6px solid #f28c38"><p style="${F};margin:0;font-size:17px;line-height:1.5;color:#f3efe7;font-weight:700">${marca(p.destaque)}</p></td></tr></table></td></tr>` : ''}
    ${p.cta && p.cta.texto ? `<tr><td style="padding:0 44px 34px"><a href="${esc(p.cta.link || 'https://ajin.org.br')}" style="${F};display:inline-block;background:#f28c38;color:#1f2a44;font-size:16px;font-weight:800;text-decoration:none;padding:16px 30px;border-radius:100px">${esc(p.cta.texto)}</a></td></tr>` : ''}
    <tr><td style="padding:0 44px 34px"><p style="${F};margin:0;font-size:15px;color:#3a4052">Com cordiais saudações,<br><b style="color:#1f2a44">${esc(p.assinatura || 'Diretoria Executiva da AJIN')}</b></p></td></tr>
    ${parceiros}
    <tr><td style="background:#1f2a44;padding:24px 44px"><p style="${F};margin:0;font-size:13px;line-height:1.7;color:#cfcbc4">AJIN · Associação Jurerê Internacional<br>Escritório ${CONTATOS.escritorio} · Segurança 24h ${CONTATOS.seguranca} · WhatsApp ${CONTATOS.whatsapp}<br><a href="https://ajin.org.br" style="color:#f28c38;text-decoration:none">ajin.org.br</a> · ${CONTATOS.instagram}</p><p style="${F};margin:12px 0 0;font-size:12px;color:#9a9890">Você recebe este e-mail por ser associado ou ter pedido as comunicações da AJIN. <a href="$[LI:UNSUBSCRIBE]$" style="color:#cfcbc4">Descadastrar</a></p></td></tr>
  </table>`
  const documento = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.assunto)}</title></head><body style="margin:0;padding:0;background:#eadbc6"><span style="display:none;max-height:0;overflow:hidden">${esc(p.pre)}</span><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eadbc6"><tr><td align="center" style="padding:30px 12px">${corpo}</td></tr></table></body></html>`
  return { corpo, documento }
}

/* =====================================================================
   5. APRESENTAÇÃO / PDF 16:9
   No padrão do deck "Programa de Parcerias" (out/2026).
   ===================================================================== */
const M = BASE + 'estudio/marca/'
const ICONE_NOTA = { sol: 'icone-sol.png', coracao: 'icone-coracao.png', folha: 'icone-folha.png', barco: 'icone-barco.png' }
const ondaSlide = '<svg class="ap__onda" viewBox="0 0 1340 200" preserveAspectRatio="none"><path fill="#f28c38" d="M70 200 C 400 130, 700 14, 980 14 C 1150 14, 1270 64, 1340 112 V200 Z"/><path fill="#1f5bca" d="M840 200 C 1010 182, 1200 172, 1340 180 V200 Z"/></svg>'
const fita = (n, estilo) => `<img class="fita" src="${M}fita-${n}.png" alt="" style="${estilo}" />`

function moldura(fundo, miolo, extra = '') {
  const escuro = fundo === 'azul' || fundo === 'navy'
  return `<div class="peca ap ${fundo === 'azul' ? 'ap--azul' : fundo === 'navy' ? 'ap--navy' : ''} ${extra}" style="width:1920px;height:1080px">
    <img class="ap__logo" src="${escuro ? LOGO_BRANCO : LOGO_NAVY}" alt="AJIN" />
    <span class="ap__bairro" style="color:${escuro ? '#ece4d6' : '#1f2a44'}">Jurerê<br>Internacional<img src="${M}ondas.png" alt="" /></span>
    ${miolo}
    <img class="ap__icones" src="${M}${escuro ? 'icones-claro' : 'icones-escuro'}.png" alt="" />
    ${ondaSlide}
  </div>`
}
const cabecalho = (s) => `${s.eyebrow ? `<span class="ap__eyebrow">${esc(s.eyebrow)}</span>` : ''}${s.titulo ? `<h2 class="ap__titulo">${marca(s.titulo)}</h2>` : ''}`
const impresso = (src, alt, estilo, rot, n = 1) => `<div class="ap__impresso" style="${estilo};rotate:${rot}deg">${fita(n, 'left:50%;top:-34px;translate:-50% 0;rotate:-3deg')}<div>${foto(src, alt)}</div></div>`

const TIPOS_SLIDE = [['itens', 'Texto com itens numerados'], ['numeros', 'Números'], ['foto', 'Texto com foto'], ['notas', 'Notas de papel'], ['pessoas', 'Destaque com as pessoas'], ['citacao', 'Citação'], ['fecho', 'Fechamento']]

function slide(s, p) {
  const fundo = s.fundo || ({ numeros: 'navy', pessoas: 'azul', citacao: 'navy', fecho: 'navy' }[s.tipo] || 'papel')
  const itens = (s.itens || []).filter((i) => i.titulo || i.texto)
  switch (s.tipo) {
    case 'itens':
      return moldura(fundo, `<div class="ap__miolo"><div>${cabecalho(s)}${s.texto ? `<div class="ap__texto">${ps(s.texto)}</div>` : ''}</div><div class="ap__itens">${itens.slice(0, 4).map((it, k) => `<div class="ap__item"><small>${String(k + 1).padStart(2, '0')}</small><b>${marca(it.titulo)}</b><span>${marca(it.texto)}</span></div>`).join('')}</div></div>`, 'ap--itens')
    case 'numeros': {
      const nums = (s.numeros || []).filter((n) => n.valor).slice(0, 4)
      const d = s.destaque && s.destaque.valor ? `<div class="ap__destaque"><div class="ap__grande"><img src="${M}elipse.webp" alt="" />${marca(s.destaque.valor)}</div><p>${marca(s.destaque.texto)}</p></div>` : ''
      return moldura(fundo, `<div class="ap__miolo">${cabecalho(s)}${d}<div class="ap__nums" style="grid-template-columns:repeat(${Math.max(nums.length, 2)},1fr)">${nums.map((n) => `<div class="ap__num"><b>${marca(n.valor)}</b><span>${marca(n.legenda)}</span></div>`).join('')}</div></div>`, 'ap--numeros')
    }
    case 'foto':
      return moldura(fundo, `<div class="ap__miolo">${cabecalho(s)}${s.texto ? `<div class="ap__texto">${ps(s.texto)}</div>` : ''}</div>
        ${impresso(s.imagem, s.titulo, 'left:820px;top:210px;width:980px;height:640px', 1.2, 1)}
        ${s.etiqueta ? `<span class="ap__etiqueta" style="left:860px;top:250px;position:absolute">${esc(s.etiqueta)}</span>` : ''}
        ${s.imagem2 ? impresso(s.imagem2, '', 'left:560px;top:640px;width:400px;height:300px', -3, 2) : ''}`, 'ap--foto')
    case 'notas':
      return moldura(fundo, `<div class="ap__miolo">${cabecalho(s)}<div class="ap__notas" style="grid-template-columns:repeat(${Math.max(itens.length, 3)},1fr)">${itens.slice(0, 4).map((it, k) => `<div class="ap__nota">${fita(k % 3 + 1, '')}<img class="icone" src="${M}${ICONE_NOTA[it.icone] || ICONE_NOTA[['sol', 'coracao', 'folha', 'barco'][k % 4]]}" alt="" />${it.rotulo ? `<small>${esc(it.rotulo)}</small>` : ''}<b>${marca(it.titulo)}</b><span>${marca(it.texto)}</span></div>`).join('')}</div></div>`, 'ap--notas')
    case 'pessoas':
      return moldura('azul', `<div class="ap__miolo">${cabecalho(s)}${s.texto ? `<div class="ap__texto">${ps(s.texto)}</div>` : ''}</div><img class="ap__pessoas" src="${M}pessoas.webp" alt="" />`, 'ap--pessoas')
    case 'citacao':
      return moldura(fundo, `<div class="ap__miolo">${s.eyebrow ? `<span class="ap__eyebrow">${esc(s.eyebrow)}</span>` : ''}<blockquote>${marca(s.titulo).replace(/\*(.+?)\*/g, '<em>$1</em>')}</blockquote>${s.texto ? `<div class="ap__texto">${ps(s.texto)}</div>` : ''}</div><img class="ap__brilho" src="${M}brilho.png" alt="" style="right:300px;top:260px" />`, 'ap--citacao')
    case 'fecho':
      return moldura('navy', `<div class="ap__miolo">${cabecalho({ eyebrow: s.eyebrow || 'Próximos passos', titulo: s.titulo || 'Vamos conversar' })}<div class="ap__passos">${itens.slice(0, 4).map((it, k) => `<div class="ap__item"><small>${String(k + 1).padStart(2, '0')}</small><b>${marca(it.titulo)}</b><span>${marca(it.texto)}</span></div>`).join('')}</div></div>
        <div class="ap__contato"><small>Contato</small><b>AJIN · Associação Jurerê Internacional</b><br>${CONTATOS.email} · +55 48 99949-7419<br>${CONTATOS.site} · ${CONTATOS.instagram}</div>
        ${s.texto ? `<p class="ap__frase">${marca(s.texto)}</p>` : ''}<img class="ap__selo" src="${M}selo.png" alt="" />`, 'ap--fecho')
  }
  return moldura(fundo, `<div class="ap__miolo">${cabecalho(s)}</div>`)
}

const apresentacao = {
  id: 'apresentacao',
  nome: 'PDF e apresentação',
  canal: 'PDF',
  descricao: 'Slides 16:9 no padrão do deck do Programa de Parcerias: capa azul com o AJ, itens numerados, números com destaque à mão, fotos como impressos com fita, notas de papel, destaque com as pessoas, citação e fechamento.',
  campos: [
    { id: 'eyebrow', rotulo: 'Sobretítulo da capa', tipo: 'texto', limite: [6, 40] },
    { id: 'titulo', rotulo: 'Título da capa', tipo: 'texto', limite: [8, 40] },
    { id: 'subtitulo', rotulo: 'Frase da capa', tipo: 'area', limite: [30, 110] },
    { id: 'capaFundo', rotulo: 'Fundo da capa', tipo: 'escolha', opcoes: [['azul', 'Azul-mar'], ['navy', 'Navy']] },
    { id: 'slides', rotulo: 'Slides', tipo: 'lista', max: 30, itens: [
      { id: 'tipo', rotulo: 'Tipo', tipo: 'escolha', opcoes: TIPOS_SLIDE },
      { id: 'fundo', rotulo: 'Fundo', tipo: 'escolha', opcoes: [['', 'Do tipo'], ['papel', 'Papel claro'], ['azul', 'Azul-mar'], ['navy', 'Navy']] },
      { id: 'eyebrow', rotulo: 'Sobretítulo', tipo: 'texto', limite: [4, 40] },
      { id: 'titulo', rotulo: 'Título', tipo: 'texto', limite: [8, 70], ajuda: 'Na citação, *entre asteriscos* fica laranja.' },
      { id: 'texto', rotulo: 'Texto', tipo: 'area' },
      { id: 'imagem', rotulo: 'Foto principal', tipo: 'imagem' },
      { id: 'imagem2', rotulo: 'Foto menor (opcional)', tipo: 'imagem' },
      { id: 'etiqueta', rotulo: 'Etiqueta sobre a foto', tipo: 'texto' },
      { id: 'itens', rotulo: 'Itens, notas ou passos', tipo: 'lista', max: 4, itens: [
        { id: 'icone', rotulo: 'Ícone (notas)', tipo: 'escolha', opcoes: [['sol', 'Sol'], ['coracao', 'Coração'], ['folha', 'Folha'], ['barco', 'Barco']] },
        { id: 'rotulo', rotulo: 'Rótulo (notas)', tipo: 'texto' },
        { id: 'titulo', rotulo: 'Título', tipo: 'texto' },
        { id: 'texto', rotulo: 'Texto', tipo: 'area' },
      ] },
      { id: 'destaque', rotulo: 'Número em destaque (circulado)', tipo: 'grupo', itens: [
        { id: 'valor', rotulo: 'Valor', tipo: 'texto' },
        { id: 'texto', rotulo: 'Frase', tipo: 'texto' },
      ] },
      { id: 'numeros', rotulo: 'Números', tipo: 'lista', max: 4, itens: [
        { id: 'valor', rotulo: 'Valor', tipo: 'texto' },
        { id: 'legenda', rotulo: 'Legenda', tipo: 'texto' },
      ] },
    ] },
  ],
  exemplo: {
    eyebrow: 'Associação Jurerê Internacional', titulo: 'AJIN 40 anos', subtitulo: 'A voz organizada de quem vive Jurerê Internacional desde 1986.', capaFundo: 'azul',
    slides: [
      { tipo: 'itens', eyebrow: 'Quem somos', titulo: 'A voz de quem mora em Jurerê Internacional', texto: 'A AJIN é uma entidade civil sem fins econômicos, que representa os moradores diante do poder público e cuida do bairro todos os dias.', itens: [
        { titulo: 'Segurança', texto: 'Monitoramento 24 horas, rondas e vistorias em todo o bairro.' },
        { titulo: 'Áreas adotadas', texto: 'Pé-de-Fruta com a Horta Comunitária, Praça dos Morrinhos e Parquinho dos Curumins.' },
        { titulo: 'Cultura e comunidade', texto: 'Encontros ao longo do ano que reúnem famílias de todas as gerações.' },
        { titulo: 'Representação', texto: 'A voz dos associados nos conselhos e diante do poder público.' },
      ] },
      { tipo: 'numeros', eyebrow: 'Segurança', titulo: 'Proteção que não dorme', numeros: [{ valor: '100', legenda: 'câmeras em operação' }, { valor: '+30 mil', legenda: 'vistorias patrimoniais no ano' }, { valor: '+600', legenda: 'escoltas de associados' }] },
      { tipo: 'foto', eyebrow: 'Áreas adotadas · 01', titulo: 'Horta Comunitária do Pé-de-Fruta', texto: 'Um canteiro cuidado por vizinhos, aberto às famílias e às crianças do bairro.', imagem: BASE + 'fotos/horta-colheita-familia-m.jpg', imagem2: BASE + 'fotos/horta-baldinho-canteiro-m.jpg', etiqueta: 'Horta Comunitária' },
      { tipo: 'notas', eyebrow: 'Encontros no bairro', titulo: 'O que fizemos juntos', itens: [
        { icone: 'folha', rotulo: 'Pé-de-Fruta', titulo: 'Baldinho do Bem', texto: 'Crianças plantando e levando para casa o que cultivaram.' },
        { icone: 'coracao', rotulo: 'Comunidade', titulo: 'Roda de conversa', texto: 'Vizinhos reunidos para falar de bem-estar e saúde.' },
        { icone: 'sol', rotulo: 'Curumins', titulo: 'Parquinho renovado', texto: 'Um dos espaços mais movimentados do bairro, cuidado pela AJIN.' },
      ] },
      { tipo: 'pessoas', eyebrow: 'A comunidade', titulo: 'Feita pelos associados', texto: 'Quem decide é eleito entre os associados, presta contas a eles e trabalha sem remuneração.' },
      { tipo: 'citacao', titulo: 'Cuidar do território é cuidar de *quem vive nele.*', texto: 'Princípio que orienta o trabalho da AJIN' },
      { tipo: 'fecho', titulo: 'Vamos conversar', texto: 'Jurerê Internacional é de quem cuida.', itens: [
        { titulo: 'Conversa inicial', texto: 'Entendemos a demanda e o que ela significa para o bairro.' },
        { titulo: 'Proposta', texto: 'Definimos juntos o formato e o calendário.' },
        { titulo: 'Aprovação', texto: 'Toda decisão passa pela Diretoria Executiva da AJIN.' },
        { titulo: 'Acompanhamento', texto: 'A equipe de Comunicação registra e presta contas.' },
      ] },
    ],
  },
  paginas(p) {
    const capaFundo = p.capaFundo || 'azul'
    const capa = moldura(capaFundo, `
      <img class="ap__brilho" src="${M}brilho.png" alt="" style="left:1000px;top:240px" />
      <img class="ap__aj" src="${M}aj.webp" alt="" />
      <div class="ap__miolo">${p.eyebrow ? `<span class="ap__eyebrow">${esc(p.eyebrow)}</span>` : ''}<h1 class="ap__titulo">${marca(p.titulo)}</h1><img class="ap__sublinhado" src="${M}sublinhado.png" alt="" />${p.subtitulo ? `<div class="ap__texto">${marca(p.subtitulo)}</div>` : ''}</div>
      <span class="ap__assina"><b>A guardiã do bairro</b> · Há 40 anos em Jurerê Internacional</span>`, 'ap--capa')
    return [capa, ...(p.slides || []).map((s) => slide(s, p))].map((html) => ({ w: 1920, h: 1080, html }))
  },
}

/* =====================================================================
   6. PADRÃO DE DOCUMENTO DA AJIN (papel timbrado do brandbook)
   ===================================================================== */
const ICONES_DOC = ['folha', 'coracao', 'sol', 'casa', 'escudo'].map((n) => ICONES[n]).join('')
const ondaDoc = '<svg class="doc__onda" viewBox="0 0 794 300" preserveAspectRatio="none"><path fill="#f2f2f3" d="M34 250 C 150 70, 420 20, 794 110 V190 C 470 110, 230 130, 34 250z"/></svg>'
const ENDERECO = 'Rod. Maurício Sirotski Sobrinho, 5451, sala 04 · Jurerê Internacional · Florianópolis, SC'

/* folha timbrada: título em caixa alta com o ano empilhado ao lado */
export function folhaTimbrada({ titulo, sub = '', ano, miolo = '', pe = '', cor = 'onda', extra = '' }) {
  const a = String(ano || new Date().getFullYear())
  return `<div class="peca doc" style="width:794px;height:1123px">
    <div class="doc__topo"><span class="doc__bairro"><b>Jurerê</b>Internacional</span><span class="doc__icones">${ICONES_DOC}</span></div>
    ${ondaDoc}
    <div class="doc__cabeca"><span class="doc__ano">${a.slice(0, 2)}<br>${a.slice(2)}</span><h1 class="doc__titulo">${marca(titulo)}</h1>${sub ? `<p class="doc__sub">${sub}</p>` : ''}</div>
    <div class="doc__miolo">${miolo}</div>
    ${extra}${pe}
    <span class="doc__canto ${cor === 'mar' ? 'doc__canto--mar' : ''}"></span>
    <img class="doc__logo" src="${LOGO_NAVY}" alt="AJIN" />
    <div class="doc__rodape"><span>AJIN · Associação Jurerê Internacional · CEP 88053-410<br>${ENDERECO}</span><span style="text-align:right;white-space:nowrap">${CONTATOS.escritorio}<br>${CONTATOS.email} · ${CONTATOS.site}</span></div>
  </div>`
}
const linhaAssinatura = (rotulo = 'Assinatura') => `<div class="doc__assinatura">${rotulo}:<i></i></div>`

/* ---------------------------------------------------------------------
   6a. Ofício, comunicado, edital, convocação, declaração
   --------------------------------------------------------------------- */
const oficio = {
  id: 'oficio',
  nome: 'Documento oficial',
  canal: 'PDF',
  descricao: 'Ofícios à Prefeitura e a órgãos públicos, editais, convocações e comunicados no papel timbrado do brandbook. Linguagem formal; número e protocolo sempre vindos da AJIN.',
  campos: [
    { id: 'especie', rotulo: 'Tipo de documento', tipo: 'escolha', opcoes: [['Ofício', 'Ofício'], ['Comunicado', 'Comunicado'], ['Edital', 'Edital'], ['Convocação', 'Convocação'], ['Declaração', 'Declaração']] },
    { id: 'numero', rotulo: 'Número', tipo: 'texto', ajuda: 'Ex.: 012/2026. Nunca inventar.' },
    { id: 'local', rotulo: 'Local e data', tipo: 'texto' },
    { id: 'destinatario', rotulo: 'Destinatário', tipo: 'area', ajuda: 'Tratamento, nome, cargo e órgão, um por linha. Em comunicado, pode ficar vazio.' },
    { id: 'assunto', rotulo: 'Assunto', tipo: 'texto' },
    { id: 'corpo', rotulo: 'Texto', tipo: 'area' },
    { id: 'fecho', rotulo: 'Fecho', tipo: 'texto' },
    { id: 'cor', rotulo: 'Cor do canto', tipo: 'escolha', opcoes: [['onda', 'Laranja'], ['mar', 'Azul']] },
    { id: 'assinante', rotulo: 'Assinante', tipo: 'grupo', itens: [
      { id: 'nome', rotulo: 'Nome', tipo: 'texto' },
      { id: 'cargo', rotulo: 'Cargo', tipo: 'texto' },
    ] },
  ],
  exemplo: {
    especie: 'Ofício', numero: '[CONFIRMAR: número]/2026', local: 'Florianópolis, [CONFIRMAR: data]', cor: 'onda',
    destinatario: 'Ao Senhor\n[CONFIRMAR: nome]\n[CONFIRMAR: cargo]\nIntendência de Canasvieiras',
    assunto: 'Solicitação de poda de árvore na Avenida dos Búzios',
    corpo: 'A AJIN, Associação Jurerê Internacional, entidade civil sem fins econômicos que representa os associados, proprietários e moradores de Jurerê Internacional, vem respeitosamente solicitar a avaliação e a poda de árvore localizada na calçada da Avenida dos Búzios, em frente ao número [CONFIRMAR: número].\n\nA copa da árvore avança sobre a rede elétrica e sobre a passagem de pedestres, o que oferece risco a quem circula pelo local, em especial idosos e crianças.\n\nColocamo-nos à disposição para acompanhar a vistoria e fornecer as informações necessárias.',
    fecho: 'Atenciosamente,',
    assinante: { nome: '[CONFIRMAR: nome do presidente]', cargo: 'Presidente da AJIN' },
  },
  paginas(p) {
    const ano = (String(p.numero || '').match(/(20\d\d)/) || [])[1]
    const miolo = `<div class="of__meta"><span><b>${esc(p.especie || 'Ofício')} nº ${marca(p.numero)}</b></span><span>${marca(p.local)}</span></div>
      ${p.destinatario ? `<div class="of__dest">${marca(p.destinatario).replace(/\n/g, '<br>')}</div>` : ''}
      ${p.assunto ? `<div class="of__assunto"><b>Assunto:</b> ${marca(p.assunto)}</div>` : ''}
      <div class="of__corpo">${ps(p.corpo)}</div>
      <div class="of__fecho">${marca(p.fecho || 'Atenciosamente,')}</div>`
    const pe = `${linhaAssinatura()}<div class="of__assina"><b>${marca(p.assinante && p.assinante.nome)}</b> · ${marca(p.assinante && p.assinante.cargo)}</div>`
    return [{ w: 794, h: 1123, html: folhaTimbrada({ titulo: p.especie || 'Ofício', ano, miolo, pe, cor: p.cor }) }]
  },
}

/* ---------------------------------------------------------------------
   6b. Ficha de adesão
   Todo cadastro feito em ajin.org.br/cadastro vira esta ficha, que vai
   para o grupo de comunicação e para o novo associado assinar. O que o
   site não pergunta fica em branco para completar no WhatsApp.
   --------------------------------------------------------------------- */
const PLANOS = [['seguranca', 'AJIN Segurança'], ['manutencao', 'AJIN Manutenção'], ['total', 'AJIN Total', 'Segurança + Manutenção']]
/* o site grava os planos como lista ("Segurança", "Manutenção"); os dois juntos são o AJIN Total */
export function planoDaLista(lista = []) {
  const t = lista.map((x) => String(x).toLowerCase())
  const seg = t.some((x) => x.includes('segur')), man = t.some((x) => x.includes('manuten'))
  return seg && man ? 'total' : seg ? 'seguranca' : man ? 'manutencao' : ''
}
/* converte uma linha da tabela cadastros na ficha */
export function fichaDoCadastro(c = {}) {
  const tipo = Array.isArray(c.tipo) ? c.tipo.join(' e ') : (c.tipo || '')
  return {
    pedido: c.id ? String(c.id).slice(0, 8).toUpperCase() : '',
    recebido: (c.created_at || '').slice(0, 10), origem: 'Site ajin.org.br/cadastro',
    nome: c.nome, nascimento: '', conjuge: '', conjugeNascimento: '', profissao: '', documento: c.cpf, rg: c.rg, estadoCivil: c.estado_civil, email: c.email,
    endereco: [c.endereco, c.numero].filter(Boolean).join(', '), complemento: c.complemento, cep: c.cep, imovel: tipo,
    altEndereco: '', altBairro: '', altCidade: '', altUf: '', altCep: '',
    telefone: c.celular, telefoneFixo: c.telefone_fixo, emergencia: '',
    correspondencia: '', plano: planoDaLista(c.planos || []), observacao: c.mensagem,
  }
}
const dataBr = (iso) => { const m = String(iso || '').match(/^(\d{4})-(\d\d)-(\d\d)/); return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso || '') }
const campoFicha = (rotulo, valor, larg = 3) => `<div class="fa__campo fa__campo--${larg}"><small>${rotulo}</small><span>${marca(valor || '')}</span></div>`
const opcao = (marcada, texto, nota = '') => `<span class="fa__opcao ${marcada ? 'fa__opcao--marcada' : ''}"><i></i>${esc(texto)}${nota ? ` <em>(${esc(nota)})</em>` : ''}</span>`
/* campos que o site não pergunta e o WhatsApp completa */
export const FALTAM_NO_SITE = [['nascimento', 'Data de nascimento'], ['conjuge', 'Nome do cônjuge (se houver)'], ['conjugeNascimento', 'Data de nascimento do cônjuge'], ['profissao', 'Profissão'], ['emergencia', 'Contato de emergência'], ['correspondencia', 'Correspondência: Jurerê ou endereço alternativo'], ['altEndereco', 'Endereço alternativo (opcional)']]

const fichaAdesao = {
  id: 'ficha-adesao',
  nome: 'Ficha de adesão',
  canal: 'PDF no WhatsApp',
  descricao: 'A ficha de cada novo associado, no papel timbrado. Sai sozinha a cada cadastro do site, vai para o grupo de comunicação e segue ao associado para assinar pelo WhatsApp ou pelo Gov.br.',
  campos: [
    { id: 'pedido', rotulo: 'Nº do pedido', tipo: 'texto' },
    { id: 'recebido', rotulo: 'Recebido em', tipo: 'data' },
    { id: 'origem', rotulo: 'Origem', tipo: 'escolha', opcoes: [['Site ajin.org.br/cadastro', 'Site'], ['WhatsApp da AJIN', 'WhatsApp'], ['Escritório', 'Escritório']] },
    { id: 'nome', rotulo: 'Nome completo', tipo: 'texto' },
    { id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'texto' },
    { id: 'documento', rotulo: 'CPF ou CNPJ', tipo: 'texto' },
    { id: 'rg', rotulo: 'RG', tipo: 'texto' },
    { id: 'estadoCivil', rotulo: 'Estado civil', tipo: 'texto' },
    { id: 'profissao', rotulo: 'Profissão', tipo: 'texto' },
    { id: 'conjuge', rotulo: 'Nome do cônjuge', tipo: 'texto' },
    { id: 'conjugeNascimento', rotulo: 'Nascimento do cônjuge', tipo: 'texto' },
    { id: 'email', rotulo: 'E-mail', tipo: 'texto' },
    { id: 'endereco', rotulo: 'Endereço em Jurerê (rua e nº)', tipo: 'texto' },
    { id: 'complemento', rotulo: 'Complemento', tipo: 'texto' },
    { id: 'cep', rotulo: 'CEP', tipo: 'texto' },
    { id: 'imovel', rotulo: 'Imóvel', tipo: 'escolha', opcoes: [['Residência', 'Residência'], ['Condomínio', 'Condomínio'], ['Residência e Condomínio', 'Os dois']] },
    { id: 'altEndereco', rotulo: 'Endereço alternativo (rua e nº)', tipo: 'texto' },
    { id: 'altBairro', rotulo: 'Bairro', tipo: 'texto' },
    { id: 'altCidade', rotulo: 'Cidade', tipo: 'texto' },
    { id: 'altUf', rotulo: 'UF', tipo: 'texto' },
    { id: 'altCep', rotulo: 'CEP alternativo', tipo: 'texto' },
    { id: 'telefone', rotulo: 'Telefone principal', tipo: 'texto' },
    { id: 'telefoneFixo', rotulo: 'Telefone fixo', tipo: 'texto' },
    { id: 'emergencia', rotulo: 'Contato de emergência', tipo: 'texto' },
    { id: 'correspondencia', rotulo: 'Correspondência', tipo: 'escolha', opcoes: [['', 'A definir'], ['jurere', 'Jurerê'], ['alternativo', 'Endereço alternativo']] },
    { id: 'plano', rotulo: 'Plano de contribuição', tipo: 'escolha', opcoes: [['', 'A definir'], ['seguranca', 'AJIN Segurança'], ['manutencao', 'AJIN Manutenção'], ['total', 'AJIN Total']] },
    { id: 'observacao', rotulo: 'Observação do associado', tipo: 'area' },
  ],
  exemplo: {
    pedido: 'A1B2C3D4', recebido: '2026-10-14', origem: 'Site ajin.org.br/cadastro',
    nome: 'Maria Exemplo da Silva', nascimento: '', documento: '000.000.000-00', rg: '', estadoCivil: 'Casada', profissao: '', conjuge: '', conjugeNascimento: '', email: 'maria@exemplo.com.br',
    endereco: 'Rua das Algas, 100', complemento: '', cep: '88053-000', imovel: 'Residência',
    altEndereco: '', altBairro: '', altCidade: '', altUf: '', altCep: '',
    telefone: '(48) 90000-0000', telefoneFixo: '', emergencia: '', correspondencia: '', plano: 'total', observacao: '',
  },
  paginas(p) {
    const ano = (p.recebido || '').slice(0, 4) || undefined
    const via = { 'Site ajin.org.br/cadastro': 'pelo site', 'WhatsApp da AJIN': 'pelo WhatsApp', 'Escritório': 'no escritório' }[p.origem] || ''
    const sub = `Pedido ${esc(p.pedido || 's/n')} · recebido em ${esc(dataBr(p.recebido))} ${via}`
    const grupo = (n, titulo, miolo, nota = '') => `<div class="fa__grupo"><h3><small>${n}</small>${titulo}${nota ? ` <em>${nota}</em>` : ''}</h3>${miolo}</div>`
    const miolo = [
      grupo('01', 'Dados pessoais', `<div class="fa__linhas">${campoFicha('Nome completo', p.nome, 4)}${campoFicha('Data de nascimento', p.nascimento, 2)}${campoFicha('CPF ou CNPJ', p.documento, 2)}${campoFicha('RG', p.rg, 2)}${campoFicha('Estado civil', p.estadoCivil, 2)}${campoFicha('Nome do cônjuge (se houver)', p.conjuge, 4)}${campoFicha('Nascimento do cônjuge', p.conjugeNascimento, 2)}${campoFicha('Profissão', p.profissao, 3)}${campoFicha('E-mail de contato', p.email, 3)}</div>`),
      grupo('02', 'Endereço em Jurerê Internacional', `<div class="fa__linhas">${campoFicha('Rua e nº', p.endereco, 3)}${campoFicha('Complemento', p.complemento, 1)}${campoFicha('CEP', p.cep, 1)}${campoFicha('Imóvel', p.imovel, 1)}</div>`),
      grupo('03', 'Endereço alternativo', `<div class="fa__linhas">${campoFicha('Rua e nº', p.altEndereco, 3)}${campoFicha('Bairro', p.altBairro, 3)}${campoFicha('Cidade', p.altCidade, 3)}${campoFicha('UF', p.altUf, 1)}${campoFicha('CEP', p.altCep, 2)}</div>`, 'opcional'),
      grupo('04', 'Contato', `<div class="fa__linhas">${campoFicha('Telefone principal', p.telefone, 2)}${campoFicha('Telefone fixo', p.telefoneFixo, 2)}${campoFicha('Contato de emergência', p.emergencia, 2)}</div>`),
      grupo('05', 'Correspondência e plano', `<div class="fa__opcoes">${opcao(p.correspondencia === 'jurere', 'Correspondência em Jurerê')}${opcao(p.correspondencia === 'alternativo', 'No endereço alternativo')}</div><div class="fa__opcoes">${PLANOS.map(([id, nome, nota]) => opcao(p.plano === id, nome, nota)).join('')}</div>`),
      p.observacao ? `<div class="fa__declara"><b>Observação do associado:</b> ${marca(p.observacao)}</div>` : '',
      `<p class="fa__declara">Declaro que as informações acima são verdadeiras e peço minha adesão à AJIN, no plano marcado. Os dados são mantidos em sigilo e usados somente na relação com a associação.</p>`,
    ].join('')
    const pe = `<div class="fa__local">Local e data:<i></i></div>${linhaAssinatura()}`
    return [{ w: 794, h: 1123, html: folhaTimbrada({ titulo: 'Ficha de adesão', sub, ano, miolo, pe, cor: 'mar' }) }]
  },
}

export const MODELOS = { 'flyer-whatsapp': flyerWhatsapp, 'carrossel-instagram': carrosselInstagram, boletim, email, apresentacao, oficio, 'ficha-adesao': fichaAdesao }
export const ORDEM = ['flyer-whatsapp', 'carrossel-instagram', 'email', 'boletim', 'apresentacao', 'oficio', 'ficha-adesao']
