/* =====================================================================
   O bairro visto do alto.

   Duas engrenagens com a mesma interface:
   - Google Photorealistic 3D (Map3DElement), quando há CHAVE_GOOGLE;
   - MapLibre com satélite inclinado, enquanto a chave não existe ou se o
     Google falhar. Assim a seção nunca fica vazia.

   O resto (pontos, HUD, painel, matérias) não sabe qual das duas está
   rodando: fala só com `motor.voar()`, `motor.ponto()` e `motor.camera()`.
   ===================================================================== */

/* Chave de navegador do Google Maps Platform, restrita por referenciador
   (ajin.org.br/*, www.ajin.org.br/*, localhost/*). APIs: Maps JavaScript e
   Map Tiles. Vazia = MapLibre. */
const CHAVE_GOOGLE = ''

const VISAO_GERAL = {
  lat: -27.4436, lng: -48.4985,
  google: { range: 3600, tilt: 58, heading: 340 },
  libre: { zoom: 14.7, pitch: 56, bearing: -20 },
}
const DECOLAGEM = {
  google: { range: 14000, tilt: 20, heading: 300 },
  libre: { zoom: 12.4, pitch: 20, bearing: -50 },
}

const F = 'fotos/'

/* ---------------------------------------------------------------------
   Conteúdo das áreas adotadas. Só as três: o bosque não é área da AJIN.
   As ações entram como matérias, prova do que foi feito em cada lugar.
   --------------------------------------------------------------------- */
const AREAS = [
  {
    id: 'pe-de-fruta',
    nome: 'Pé-de-Fruta',
    sub: 'com a Horta Comunitária Manoel Azeredo Saraiva',
    endereco: 'Av. das Lagostas com Rua dos Marimbaus',
    desde: 'Área adotada pela AJIN há 21 anos',
    lat: -27.44218, lng: -48.50717,
    google: { range: 420, tilt: 64, heading: 20 },
    libre: { zoom: 17.4, pitch: 62, bearing: 20 },
    texto: 'Um bosque de árvores frutíferas, pássaros e sombra, cuidado pela AJIN. Dentro dele fica a Horta Comunitária, onde voluntários se encontram toda semana e famílias de todas as idades plantam, colhem e aprendem juntas.',
    fotos: [
      [F + 'pedefruta-bosque-m.jpg', 'O bosque do Pé-de-Fruta, com bancos à sombra'],
      [F + 'horta-inaug-aerea.jpg', 'A horta vista de cima, com os canteiros novos'],
      [F + 'pedefruta-ponte.jpg', 'A ponte nova, com guarda-corpo'],
      [F + 'horta-arte-totens-m.jpg', 'Peças pintadas pelas famílias na horta'],
    ],
    materias: [
      {
        titulo: 'A Horta Comunitária é inaugurada',
        data: '13 de setembro de 2025',
        resumo: 'Inauguração com 118 pessoas, 35 delas crianças, e mais de 100 mudas plantadas.',
        corpo: [
          'A horta foi reconstruída: canteiros novos, cerca, portões, depósito de ferramentas, composteiras e irrigação com temporizador.',
          'Na inauguração houve oficina de compostagem, música e o plantio das primeiras mudas com as crianças.',
        ],
        fotos: [
          [F + 'horta-inaug-aerea.jpg', 'A horta vista de cima, com os canteiros novos'],
          [F + 'horta-inaug-maos.jpg', 'Mãos de criança plantando uma muda'],
          [F + 'horta-inaug-publico.jpg', 'Famílias reunidas na inauguração'],
        ],
      },
      {
        titulo: 'Ponte nova e bancos recuperados',
        data: 'Gestão 2025/2026',
        resumo: 'Travessia com guarda-corpo, mais segura para idosos e crianças.',
        corpo: [
          'A ponte ganhou guarda-corpo, e as mesas de jogos e os bancos do bosque foram revitalizados.',
        ],
        fotos: [
          [F + 'pedefruta-ponte.jpg', 'A ponte nova do Pé-de-Fruta'],
          [F + 'pedefruta-bancos.jpg', 'Mesa de jogos revitalizada'],
        ],
      },
      {
        titulo: 'Trezentas orquídeas nas árvores',
        data: 'Gestão 2025/2026',
        resumo: 'Moradores fixaram mais de 300 mudas nas árvores do bosque.',
        corpo: [
          'Numa manhã com oficina de cultivo, 38 pessoas fixaram mais de 300 mudas de orquídeas nas árvores do Pé-de-Fruta.',
        ],
        fotos: [[F + 'pedefruta-orquidea.jpg', 'Moradores com as mudas de orquídea']],
      },
      {
        titulo: 'Baldinho do Bem: plantar e colher',
        data: '6 de junho de 2026',
        resumo: 'Educação ambiental com as crianças, do balde pintado à colheita.',
        corpo: [
          'As crianças pintam seus baldinhos, juntam orgânicos para as composteiras e plantam as mudas. Semanas depois, voltam para colher.',
        ],
        fotos: [
          [F + 'horta-baldinho-grupo-m.jpg', 'Famílias com a colheita do Baldinho do Bem'],
          [F + 'horta-baldinho-canteiro-m.jpg', 'Canteiro de alfaces da horta'],
        ],
      },
      {
        titulo: 'Toda semana tem horta',
        data: 'Atividade contínua',
        resumo: 'Voluntários cuidam dos canteiros às terças, quintas, sábados e domingos.',
        corpo: [
          'O cuidado com a horta é feito por voluntários, em dias fixos. Qualquer associado pode participar.',
        ],
        fotos: [
          [F + 'horta-colheita-familia-m.jpg', 'Família com verduras colhidas na horta'],
          [F + 'horta-colheita-menino-m.jpg', 'Menino colhendo alface'],
        ],
      },
    ],
  },
  {
    id: 'morrinhos',
    nome: 'Praça dos Morrinhos',
    sub: 'conhecida no bairro como Teletubbies',
    endereco: 'Rua dos Caramurus',
    desde: 'Área adotada pela AJIN desde 2008',
    lat: -27.44560, lng: -48.49064,
    google: { range: 380, tilt: 66, heading: 300 },
    libre: { zoom: 17.6, pitch: 62, bearing: -60 },
    texto: 'Um dos espaços de lazer mais queridos de Jurerê Internacional. A AJIN cuida dos brinquedos, da vegetação e da segurança de quem frequenta a praça.',
    fotos: [
      [F + 'morrinhos-morros-m.jpg', 'Os morrinhos gramados que dão nome à praça'],
      [F + 'morrinhos-praca.jpg', 'Balanços de madeira da praça'],
      [F + 'morrinhos-brinquedo-m.jpg', 'Escorregador e estrutura de madeira'],
      [F + 'morrinhos-tunel-m.jpg', 'O túnel de madeira da praça'],
    ],
    materias: [
      {
        titulo: 'A praça revitalizada',
        data: 'Fevereiro de 2026',
        resumo: 'Brinquedos revisados, reformados e pintados, e poda para abrir a visão.',
        corpo: [
          'Todos os brinquedos passaram por revisão: trincas tratadas, peças inativas retiradas, reforma completa e pintura nova.',
          'A poda criteriosa de arbustos e árvores abriu a visibilidade da área e deixou a praça mais segura.',
        ],
        fotos: [
          [F + 'morrinhos-tunel-m.jpg', 'O túnel de madeira em fevereiro de 2026, durante as obras'],
          [F + 'morrinhos-brinquedo-m.jpg', 'Escorregador e estrutura de madeira, durante as obras'],
          [F + 'morrinhos-morros-m.jpg', 'Os morrinhos isolados para a manutenção'],
        ],
      },
      {
        titulo: 'Luz de volta à noite',
        data: 'Gestão 2025/2026',
        resumo: 'Luminárias trocadas e postes internos religados.',
        corpo: [
          'A pedido da AJIN, a Celesc trocou as luminárias e religou os postes internos. Com a praça iluminada, as famílias voltaram a usá-la no fim da tarde e à noite.',
        ],
        fotos: [[F + 'morrinhos-praca.jpg', 'A praça ao entardecer']],
      },
      {
        titulo: 'Setembro Amarelo na praça',
        data: 'Setembro de 2025',
        resumo: 'O painel de mensagens da caminhada ficou exposto na praça.',
        corpo: [
          'Depois da caminhada pelo Setembro Amarelo, o painel com nomes e mensagens dos participantes foi instalado na praça, para que moradores e visitantes também deixassem a sua.',
        ],
        fotos: [
          [F + 'setembro-painel.jpg', 'Participante escrevendo no painel'],
          [F + 'setembro-crianca.jpg', 'Criança deixando sua mensagem'],
        ],
      },
    ],
  },
  {
    id: 'curumins',
    nome: 'Parquinho dos Curumins',
    sub: 'o encontro das famílias com crianças pequenas',
    endereco: 'Rua das Tabaronas',
    desde: 'Área adotada pela AJIN',
    lat: -27.44400, lng: -48.50136,
    google: { range: 360, tilt: 64, heading: 150 },
    libre: { zoom: 17.7, pitch: 62, bearing: 150 },
    texto: 'O parque mais movimentado do bairro. A AJIN mantém uma escala semanal de poda, corte de grama, limpeza e recolhimento de lixo para que ele esteja sempre pronto para as crianças.',
    fotos: [
      [F + 'curumins-parquinho-m.jpg', 'Brinquedos coloridos do parquinho'],
      [F + 'curumins-brincar-m.jpg', 'Menina brincando no parquinho'],
      [F + 'curumins-familia-m.jpg', 'Mãe e filha no parquinho'],
      [F + 'curumins-geracoes-m.jpg', 'Avós e netos no parquinho'],
    ],
    materias: [
      {
        titulo: 'Brinquedos recuperados e cerca nova',
        data: 'Gestão 2025/2026',
        resumo: 'Recuperação de todos os brinquedos, cerca e portão trocados.',
        corpo: [
          'Todos os brinquedos foram recuperados, e a cerca do perímetro e o portão de entrada foram trocados por inteiro.',
          'A pedido das mães, placas indicam a proibição de animais na área infantil, como prevê a lei municipal.',
        ],
        fotos: [
          [F + 'curumins-parquinho-m.jpg', 'O parquinho recuperado'],
          [F + 'curumins-escola.jpg', 'Famílias no parquinho'],
        ],
      },
      {
        titulo: 'Manhã de família no parque',
        data: '6 de dezembro de 2025',
        resumo: 'Pintura de rosto, brincadeiras e encontro entre gerações.',
        corpo: [
          'Uma manhã de convivência no parque revitalizado, com atividades para as crianças e as famílias do bairro.',
        ],
        fotos: [
          [F + 'curumins-familia-m.jpg', 'Mãe e filha no encontro'],
          [F + 'curumins-geracoes-m.jpg', 'Avós e netos no encontro'],
          [F + 'curumins-brincar-m.jpg', 'Menina no brinquedo'],
          [F + 'curumins-diretoria-m.jpg', 'Diretores e voluntários da AJIN no encontro'],
        ],
      },
      {
        titulo: 'Depois das enchentes',
        data: 'Gestão 2025/2026',
        resumo: 'Pontes avariadas retiradas com recursos próprios.',
        corpo: [
          'Depois dos eventos climáticos, a AJIN retirou com recursos próprios as pontes avariadas e liberou a área para o uso das famílias.',
        ],
        fotos: [],
      },
    ],
  },
]

/* =====================================================================
   Utilidades
   ===================================================================== */
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
const ENTRA = 'cubic-bezier(0.22, 1, 0.36, 1)'
const $ = (s, el = document) => el.querySelector(s)
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e }
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

function carregarScript(src) {
  return new Promise((ok, falha) => {
    const s = document.createElement('script'); s.src = src; s.async = true
    s.onload = ok; s.onerror = () => falha(new Error('não carregou ' + src))
    document.head.append(s)
  })
}
function carregarCss(href) {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.append(l)
}

function dms(v, pos, neg) {
  const a = Math.abs(v), g = Math.floor(a), m = Math.floor((a - g) * 60), s = Math.round(((a - g) * 60 - m) * 60)
  return `${g}°${String(m).padStart(2, '0')}′${String(s).padStart(2, '0')}″ ${v < 0 ? neg : pos}`
}
const RUMOS = ['N', 'NNE', 'NE', 'ENE', 'L', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
const rumo = (h) => RUMOS[Math.round((((h % 360) + 360) % 360) / 22.5) % 16]

/* =====================================================================
   Motor Google 3D
   ===================================================================== */
async function motorGoogle(caixa) {
  /* carregador oficial do Maps JS, versão compacta */
  ;((g) => { let h; const c = 'google', l = 'importLibrary', q = '__ib__', m = document; const b = window[c] || (window[c] = {}); const d = b.maps || (b.maps = {}); const r = new Set(); const e = new URLSearchParams(); const u = () => h || (h = new Promise((f, n) => { const a = m.createElement('script'); e.set('libraries', [...r] + ''); for (const k in g) e.set(k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k]); e.set('callback', c + '.maps.' + q); a.src = 'https://maps.' + c + 'apis.com/maps/api/js?' + e; d[q] = f; a.onerror = () => (h = n(Error('Google Maps não carregou'))); m.head.append(a) })); d[l] || (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))) })({ key: CHAVE_GOOGLE, v: 'beta', language: 'pt-BR', region: 'BR' })

  const { Map3DElement, Marker3DInteractiveElement } = await google.maps.importLibrary('maps3d')
  const { PinElement } = await google.maps.importLibrary('marker')

  const ini = { center: { lat: VISAO_GERAL.lat, lng: VISAO_GERAL.lng, altitude: 0 }, ...DECOLAGEM.google }
  const mapa = new Map3DElement({ ...ini, mode: 'SATELLITE', defaultUIHidden: true })
  mapa.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
  caixa.append(mapa)

  const ouvintes = new Set()
  const avisar = () => {
    const c = mapa.center || ini.center
    const info = { lat: c.lat, lng: c.lng, altitude: mapa.range || 0, rumo: mapa.heading || 0 }
    ouvintes.forEach((f) => f(info))
  }
  ;['gmp-centerchange', 'gmp-rangechange', 'gmp-headingchange', 'gmp-tiltchange'].forEach((ev) => mapa.addEventListener(ev, avisar))

  return {
    nome: 'google',
    camera: (f) => { ouvintes.add(f); avisar() },
    interativo(sim) { caixa.style.pointerEvents = sim ? '' : 'none' },
    voar(alvo, cam, ms, desloc = { x: 0, y: 0 }) {
      return new Promise((ok) => {
        /* Sem opção de deslocamento no Map3DElement: anda com o centro da
           câmera no chão para o alvo aparecer onde o painel deixa espaço. */
        const mpp = (2 * cam.range * Math.tan((35 * Math.PI) / 360)) / Math.max(1, caixa.clientHeight)
        const h = (cam.heading * Math.PI) / 180
        const dx = -desloc.x * mpp, dy = (-desloc.y * mpp) / Math.max(0.35, Math.cos((cam.tilt * Math.PI) / 180))
        const leste = dx * Math.cos(h) + dy * Math.sin(h), norte = -dx * Math.sin(h) + dy * Math.cos(h)
        const lat = alvo.lat + norte / 111320, lng = alvo.lng + leste / (111320 * Math.cos((alvo.lat * Math.PI) / 180))
        const endCamera = { center: { lat, lng, altitude: 0 }, range: cam.range, tilt: cam.tilt, heading: cam.heading }
        if (quieto || !ms) { Object.assign(mapa, endCamera); ok(); return }
        const fim = () => { mapa.removeEventListener('gmp-animationend', fim); ok() }
        mapa.addEventListener('gmp-animationend', fim)
        mapa.flyCameraTo({ endCamera, durationMillis: ms })
      })
    },
    orbitar(alvo, cam) {
      if (quieto) return
      mapa.flyCameraAround({ camera: { center: { lat: alvo.lat, lng: alvo.lng, altitude: 0 }, range: cam.range, tilt: cam.tilt, heading: cam.heading }, durationMillis: 60000, rounds: 1 })
    },
    parar() { mapa.stopCameraAnimation?.() },
    ponto(area, aoClicar) {
      const m = new Marker3DInteractiveElement({ position: { lat: area.lat, lng: area.lng, altitude: 40 }, altitudeMode: 'RELATIVE_TO_GROUND', extruded: true, label: area.nome })
      const pino = new PinElement({ background: '#f28c38', borderColor: '#1f2a44', glyphColor: '#1f2a44', scale: 1.3 })
      m.append(pino)
      m.addEventListener('gmp-click', () => aoClicar(area))
      mapa.append(m)
    },
    creditos: 'Imagens 3D © Google',
  }
}

/* =====================================================================
   Motor MapLibre (satélite inclinado)
   ===================================================================== */
async function motorLibre(caixa) {
  carregarCss('https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css')
  await carregarScript('https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js')
  const mapa = new maplibregl.Map({
    container: caixa,
    style: {
      version: 8,
      sources: {
        sat: {
          type: 'raster', tileSize: 256, maxzoom: 19,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          attribution: 'Imagens © Esri, Maxar, Earthstar Geographics',
        },
      },
      layers: [
        { id: 'fundo', type: 'background', paint: { 'background-color': '#1f2a44' } },
        { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-saturation': -0.08, 'raster-contrast': 0.06, 'raster-fade-duration': 280 } },
      ],
      sky: { 'sky-color': '#1f2a44', 'horizon-color': '#e9e2d3', 'sky-horizon-blend': 0.5, 'fog-color': '#e9e2d3', 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.85 },
    },
    center: [VISAO_GERAL.lng, VISAO_GERAL.lat], ...DECOLAGEM.libre,
    maxPitch: 75, minZoom: 12, maxZoom: 18.6,
    maxBounds: [[-48.545, -27.475], [-48.455, -27.41]],
    attributionControl: { compact: true }, dragRotate: true, cooperativeGestures: false,
  })
  await new Promise((ok) => mapa.once('load', ok))

  const ouvintes = new Set()
  const avisar = () => {
    const c = mapa.getCenter(), z = mapa.getZoom()
    /* altura aproximada da câmera: metros por pixel vezes metade da tela, pela tangente de meio campo de visão */
    const mpp = (156543.03 * Math.cos((c.lat * Math.PI) / 180)) / 2 ** z
    const alt = (mpp * caixa.clientHeight) / 2 / Math.tan((36.87 * Math.PI) / 360)
    ouvintes.forEach((f) => f({ lat: c.lat, lng: c.lng, altitude: alt, rumo: mapa.getBearing() }))
  }
  mapa.on('move', avisar)

  return {
    nome: 'libre',
    camera: (f) => { ouvintes.add(f); avisar() },
    interativo(sim) {
      ;['dragPan', 'scrollZoom', 'dragRotate', 'touchZoomRotate', 'doubleClickZoom', 'keyboard'].forEach((h) => mapa[h][sim ? 'enable' : 'disable']())
    },
    voar(alvo, cam, ms, desloc = { x: 0, y: 0 }) {
      return new Promise((ok) => {
        const fim = { center: [alvo.lng, alvo.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing, offset: [desloc.x, desloc.y] }
        if (quieto || !ms) { mapa.jumpTo(fim); ok(); return }
        mapa.once('moveend', ok)
        mapa.flyTo({ ...fim, duration: ms, curve: 1.6, essential: true, easing: (t) => 1 - Math.pow(1 - t, 3) })
      })
    },
    orbitar(alvo, cam) {
      if (quieto) return
      const giro = () => { mapa.rotateTo(mapa.getBearing() + 40, { duration: 16000, easing: (t) => t }) }
      mapa.once('moveend', function seguir() { if (motorLibre.orbitando) { giro(); mapa.once('moveend', seguir) } })
      motorLibre.orbitando = true; giro()
    },
    parar() { motorLibre.orbitando = false; mapa.stop() },
    ponto(area, aoClicar) {
      const no = el('button', 'pino', `<span class="pino__onda"></span><span class="pino__nucleo"></span><span class="pino__nome">${esc(area.nome)}</span>`)
      no.type = 'button'; no.setAttribute('aria-label', 'Abrir ' + area.nome)
      no.addEventListener('click', (e) => { e.stopPropagation(); aoClicar(area) })
      new maplibregl.Marker({ element: no, anchor: 'bottom' }).setLngLat([area.lng, area.lat]).addTo(mapa)
    },
    creditos: 'Imagens © Esri, Maxar, Earthstar Geographics',
  }
}

/* =====================================================================
   Montagem da seção
   ===================================================================== */
export function montarMapa(raiz) {
  const palco = $('.mapa__palco', raiz)
  const caixa = $('.mapa__tela', raiz)
  const abertura = $('.mapa__abertura', raiz)
  const botaoAbrir = $('.mapa__comecar', raiz)
  const painel = $('.painel', raiz)
  const lista = $('.mapa__lista', raiz)
  const hud = {
    alt: $('[data-hud=alt]', raiz), rumo: $('[data-hud=rumo]', raiz), coord: $('[data-hud=coord]', raiz),
    bussola: $('.hud__bussola-agulha', raiz), motor: $('[data-hud=motor]', raiz),
  }
  let motor = null, pronto = null, aberta = null, ativo = false

  /* HUD: altura, rumo, coordenadas, bússola. Atualiza no ritmo do quadro. */
  let ultimo = null, pedido = false
  const desenharHud = () => {
    pedido = false
    const i = ultimo; if (!i) return
    hud.alt.textContent = Math.round(i.altitude).toLocaleString('pt-BR') + ' m'
    hud.rumo.textContent = `${Math.round(((i.rumo % 360) + 360) % 360)}° ${rumo(i.rumo)}`
    hud.coord.textContent = `${dms(i.lat, 'N', 'S')}  ${dms(i.lng, 'L', 'O')}`
    hud.bussola.style.transform = `rotate(${-i.rumo}deg)`
  }
  const aoMover = (i) => { ultimo = i; if (!pedido) { pedido = true; requestAnimationFrame(desenharHud) } }

  /* Lista de áreas: o mesmo acesso dos pinos, para teclado e para quem não acha o ponto. */
  AREAS.forEach((a, i) => {
    const b = el('button', 'mapa__item', `<span class="mapa__item-n">0${i + 1}</span><span>${esc(a.nome)}</span>`)
    b.type = 'button'; b.dataset.area = a.id
    b.addEventListener('click', () => { if (!ativo) comecar().then(() => abrir(a)); else abrir(a) })
    lista.append(b)
  })

  async function preparar() {
    if (pronto) return pronto
    pronto = (async () => {
      try {
        motor = CHAVE_GOOGLE ? await motorGoogle(caixa) : await motorLibre(caixa)
      } catch (e) {
        console.warn('[mapa] Google indisponível, usando satélite', e)
        caixa.innerHTML = ''
        motor = await motorLibre(caixa)
      }
      hud.motor.textContent = motor.creditos
      motor.camera(aoMover)
      motor.interativo(false)
      AREAS.forEach((a) => motor.ponto(a, (area) => abrir(area)))
      raiz.setAttribute('data-carregado', '')
    })()
    return pronto
  }

  /* Começar: a decolagem. A câmera desce do alto até a visão geral do bairro. */
  async function comecar() {
    await preparar()
    if (ativo) return
    ativo = true
    raiz.setAttribute('data-ativo', '')
    abertura.setAttribute('aria-hidden', 'true')
    motor.interativo(true)
    cinema(true)
    await motor.voar(VISAO_GERAL, VISAO_GERAL[motor.nome], 4200)
    cinema(false)
    varredura()
  }
  botaoAbrir.addEventListener('click', comecar)

  /* Onde o alvo deve parar: no meio da parte do mapa que o painel deixa livre. */
  function deslocamento() {
    const W = raiz.clientWidth, H = raiz.clientHeight
    if (matchMedia('(min-width: 900px)').matches) return { x: -(Math.min(500, W * 0.42) + 16) / 2, y: 0 }
    return { x: 0, y: -(H * 0.74) / 2 + 20 }
  }

  /* Faixas de cinema e vinheta durante os voos. */
  function cinema(liga) { raiz.toggleAttribute('data-voando', liga) }

  /* Anel de varredura que se expande do centro, quando a câmera chega. */
  function varredura(d = { x: 0, y: 0 }) {
    if (quieto) return
    const anel = el('span', 'varredura')
    anel.style.left = `calc(50% + ${d.x}px)`; anel.style.top = `calc(50% + ${d.y}px)`
    palco.append(anel)
    anel.animate([{ transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0.9 }, { transform: 'translate(-50%,-50%) scale(3.2)', opacity: 0 }], { duration: 1600, easing: ENTRA }).finished.then(() => anel.remove())
  }

  /* Mira: os quatro cantos que se fecham sobre o alvo. */
  function mira(d = { x: 0, y: 0 }) {
    if (quieto) return
    const m = el('span', 'mira', '<i></i><i></i><i></i><i></i>')
    m.style.left = `calc(50% + ${d.x}px)`; m.style.top = `calc(50% + ${d.y}px)`
    palco.append(m)
    m.animate([{ transform: 'translate(-50%,-50%) scale(2.4)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: 0.55 }, { transform: 'translate(-50%,-50%) scale(0.9)', opacity: 0 }], { duration: 1400, easing: ENTRA }).finished.then(() => m.remove())
  }

  /* ---------------- Painel da área ---------------- */
  async function abrir(area) {
    if (aberta?.id === area.id) return
    motor.parar()
    const vinhaDeOutra = !!aberta
    aberta = area
    lista.querySelectorAll('.mapa__item').forEach((b) => b.toggleAttribute('data-aqui', b.dataset.area === area.id))
    if (vinhaDeOutra) await fecharPainel(true)
    cinema(true)
    const d = deslocamento()
    await motor.voar(area, area[motor.nome], 2800, d)
    cinema(false)
    mira(d); varredura(d)
    mostrarPainel(area)
    motor.orbitar(area, area[motor.nome])
  }

  function mostrarPainel(area) {
    const i = AREAS.indexOf(area)
    painel.innerHTML = `
      <div class="painel__folha" data-folha="area">
        <header class="painel__topo">
          <span class="painel__n">0${i + 1}<small>/0${AREAS.length}</small></span>
          <button class="painel__fechar" type="button" aria-label="Fechar e voltar à visão do bairro"><svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg></button>
        </header>
        <p class="painel__selo">${esc(area.desde)}</p>
        <h3 class="painel__titulo" id="painelTitulo">${area.nome.split(' ').map((p) => `<span class="pal"><span>${esc(p)}</span></span>`).join(' ')}</h3>
        <p class="painel__sub">${esc(area.sub)}</p>
        <svg class="painel__onda" viewBox="0 0 320 24" aria-hidden="true"><path d="M2 14 C 40 2, 70 2, 104 12 S 170 24, 208 12 S 280 2, 318 10"/></svg>
        <figure class="painel__foto"><img src="${area.fotos[0][0]}" alt="${esc(area.fotos[0][1])}" /><figcaption>${esc(area.fotos[0][1])}</figcaption></figure>
        <div class="painel__miniaturas">${area.fotos.map((f, j) => `<button type="button" ${j === 0 ? 'data-aqui' : ''} data-foto="${j}" aria-label="Ver foto: ${esc(f[1])}"><img src="${f[0]}" alt="" loading="lazy" /></button>`).join('')}</div>
        <dl class="painel__ficha">
          <div><dt>Onde</dt><dd>${esc(area.endereco)}</dd></div>
          <div><dt>Coordenadas</dt><dd class="painel__coord" data-alvo="${dms(area.lat, 'N', 'S')} · ${dms(area.lng, 'L', 'O')}">${dms(area.lat, 'N', 'S')} · ${dms(area.lng, 'L', 'O')}</dd></div>
        </dl>
        <p class="painel__texto">${esc(area.texto)}</p>
        <h4 class="painel__secao">O que a AJIN fez aqui <span>${area.materias.length} matérias</span></h4>
        <ol class="painel__materias">${area.materias.map((m, j) => `
          <li><button type="button" class="materia-cartao" data-materia="${j}">
            ${m.fotos[0] ? `<span class="materia-cartao__foto"><img src="${m.fotos[0][0]}" alt="" loading="lazy" /></span>` : '<span class="materia-cartao__foto materia-cartao__foto--vazia" aria-hidden="true"><svg viewBox="0 0 40 16"><path d="M1 9 C 7 2, 12 2, 18 8 S 30 15, 39 6"/></svg></span>'}
            <span class="materia-cartao__texto"><small>${esc(m.data)}</small><b>${esc(m.titulo)}</b><span>${esc(m.resumo)}</span></span>
            <svg class="materia-cartao__seta" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4l6 6-6 6"/></svg>
          </button></li>`).join('')}
        </ol>
      </div>`
    painel.setAttribute('aria-labelledby', 'painelTitulo')
    painel.hidden = false
    raiz.setAttribute('data-painel', '')

    $('.painel__fechar', painel).addEventListener('click', () => voltar())
    painel.querySelectorAll('[data-foto]').forEach((b) => b.addEventListener('click', () => trocarFoto(area, Number(b.dataset.foto))))
    painel.querySelectorAll('[data-materia]').forEach((b) => b.addEventListener('click', () => abrirMateria(area, Number(b.dataset.materia))))
    compor(painel)
    setTimeout(() => $('.painel__fechar', painel)?.focus({ preventScroll: true }), 650)
  }

  /* A composição do painel: cada camada entra na sua hora. */
  function compor(p) {
    if (quieto) return
    const a = (alvo, quadros, op) => alvo && alvo.animate(quadros, { fill: 'both', easing: ENTRA, ...op })
    const largo = matchMedia('(min-width: 900px)').matches
    a(p, [{ clipPath: largo ? 'inset(0 0 0 100% round 22px)' : 'inset(100% 0 0 0 round 22px)' }, { clipPath: 'inset(0 0 0 0 round 22px)' }], { duration: 760 })
    a($('.painel__n', p), [{ transform: 'translateY(40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 180 })
    a($('.painel__selo', p), [{ opacity: 0, letterSpacing: '0.4em' }, { opacity: 1, letterSpacing: '0.14em' }], { duration: 900, delay: 240 })
    p.querySelectorAll('.pal > span').forEach((s, i) => a(s, [{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 800, delay: 300 + i * 70 }))
    a($('.painel__sub', p), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 520 })
    const onda = $('.painel__onda path', p)
    if (onda) { const L = onda.getTotalLength(); onda.style.strokeDasharray = L; a(onda, [{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1100, delay: 480 }) }
    a($('.painel__foto', p), [{ clipPath: 'inset(100% 0 0 0 round 16px)' }, { clipPath: 'inset(0 0 0 0 round 16px)' }], { duration: 950, delay: 420 })
    a($('.painel__foto img', p), [{ transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 1400, delay: 420 })
    p.querySelectorAll('.painel__miniaturas button').forEach((b, i) => a(b, [{ opacity: 0, transform: 'translateY(16px) scale(0.9)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 760 + i * 60 }))
    p.querySelectorAll('.painel__ficha > div').forEach((d, i) => a(d, [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 820 + i * 90 }))
    a($('.painel__texto', p), [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 920 })
    a($('.painel__secao', p), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 980 })
    p.querySelectorAll('.painel__materias li').forEach((li, i) => a(li, [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 1040 + i * 80 }))
    embaralhar($('.painel__coord', p), 900)
  }

  /* Coordenadas que "sintonizam": dígitos sorteados até assentarem no valor. */
  function embaralhar(alvo, ms) {
    if (!alvo || quieto) return
    const final = alvo.dataset.alvo, t0 = performance.now()
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / ms)
      alvo.textContent = final.replace(/\d/g, (d, i) => (i / final.length < p ? d : Math.floor(Math.random() * 10)))
      if (p < 1) requestAnimationFrame(passo)
    }
    requestAnimationFrame(passo)
  }

  function trocarFoto(area, j) {
    const fig = $('.painel__foto', painel), img = $('img', fig), leg = $('figcaption', fig)
    const [src, alt] = area.fotos[j]
    painel.querySelectorAll('[data-foto]').forEach((b) => b.toggleAttribute('data-aqui', Number(b.dataset.foto) === j))
    const nova = new Image(); nova.src = src
    nova.decode().catch(() => {}).then(() => {
      if (quieto) { img.src = src; img.alt = alt; leg.textContent = alt; return }
      img.animate([{ clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }, { clipPath: 'inset(0 0 0 100%)', transform: 'scale(1.05)' }], { duration: 380, easing: 'cubic-bezier(0.64, 0, 0.78, 0)' }).finished.then(() => {
        img.src = src; img.alt = alt; leg.textContent = alt
        img.animate([{ clipPath: 'inset(0 100% 0 0)', transform: 'scale(1.08)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }], { duration: 620, easing: ENTRA })
      })
    })
  }

  /* ---------------- Matéria ---------------- */
  function abrirMateria(area, j) {
    const m = area.materias[j]
    const folhaArea = $('[data-folha=area]', painel)
    const folha = el('article', 'painel__folha painel__folha--materia')
    folha.innerHTML = `
      <header class="painel__topo">
        <button class="painel__voltar" type="button"><svg viewBox="0 0 20 20"><path d="M13 4l-6 6 6 6"/></svg>${esc(area.nome)}</button>
        <button class="painel__fechar" type="button" aria-label="Fechar e voltar à visão do bairro"><svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg></button>
      </header>
      <p class="painel__selo">${esc(m.data)}</p>
      <h3 class="painel__titulo painel__titulo--materia" id="materiaTitulo">${m.titulo.split(' ').map((p) => `<span class="pal"><span>${esc(p)}</span></span>`).join(' ')}</h3>
      <p class="materia__resumo">${esc(m.resumo)}</p>
      ${m.corpo.map((c) => `<p class="materia__corpo">${esc(c)}</p>`).join('')}
      ${m.fotos.length ? `<div class="materia__fotos" data-n="${m.fotos.length}">${m.fotos.map((f) => `<figure><span><img src="${f[0]}" alt="${esc(f[1])}" loading="lazy" /></span><figcaption>${esc(f[1])}</figcaption></figure>`).join('')}</div>` : ''}
      <nav class="materia__nav">
        ${j > 0 ? `<button type="button" data-ir="${j - 1}">← Anterior</button>` : '<span></span>'}
        ${j < area.materias.length - 1 ? `<button type="button" data-ir="${j + 1}">Próxima matéria →</button>` : ''}
      </nav>`
    painel.append(folha)
    painel.setAttribute('aria-labelledby', 'materiaTitulo')
    painel.scrollTop = 0

    const sair = () => {
      const fim = () => { folha.remove(); folhaArea.hidden = false; painel.setAttribute('aria-labelledby', 'painelTitulo') }
      if (quieto) return fim()
      folhaArea.hidden = false
      folhaArea.animate([{ transform: 'translateX(-30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 560, easing: ENTRA })
      folha.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(100%)', opacity: 0 }], { duration: 460, easing: ENTRA }).finished.then(fim)
    }
    $('.painel__voltar', folha).addEventListener('click', sair)
    $('.painel__fechar', folha).addEventListener('click', () => voltar())
    folha.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => { folha.remove(); abrirMateria(area, Number(b.dataset.ir)) }))

    if (quieto) { folhaArea.hidden = true; return }
    folhaArea.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(-30%)', opacity: 0 }], { duration: 480, easing: ENTRA }).finished.then(() => { folhaArea.hidden = true })
    folha.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 640, easing: ENTRA })
    folha.querySelectorAll('.pal > span').forEach((s, i) => s.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 760, delay: 220 + i * 55, easing: ENTRA, fill: 'both' }))
    folha.querySelectorAll('.materia__resumo, .materia__corpo').forEach((p, i) => p.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: 420 + i * 90, easing: ENTRA, fill: 'both' }))
    folha.querySelectorAll('.materia__fotos figure').forEach((f, i) => f.animate([{ clipPath: 'inset(100% 0 0 0 round 14px)' }, { clipPath: 'inset(0 0 0 0 round 14px)' }], { duration: 820, delay: 520 + i * 110, easing: ENTRA, fill: 'both' }))
    setTimeout(() => $('.painel__voltar', folha)?.focus({ preventScroll: true }), 500)
  }

  async function fecharPainel(rapido) {
    if (painel.hidden) return
    if (!quieto) {
      const largo = matchMedia('(min-width: 900px)').matches
      await painel.animate([{ clipPath: 'inset(0 0 0 0 round 22px)', opacity: 1 }, { clipPath: largo ? 'inset(0 0 0 100% round 22px)' : 'inset(100% 0 0 0 round 22px)', opacity: rapido ? 0.4 : 1 }], { duration: rapido ? 360 : 520, easing: ENTRA }).finished
    }
    painel.hidden = true
    painel.innerHTML = ''
    raiz.removeAttribute('data-painel')
  }

  async function voltar() {
    const tinha = aberta
    aberta = null
    lista.querySelectorAll('.mapa__item').forEach((b) => b.removeAttribute('data-aqui'))
    motor.parar()
    await fecharPainel()
    cinema(true)
    await motor.voar(VISAO_GERAL, VISAO_GERAL[motor.nome], 2400)
    cinema(false)
    if (tinha) lista.querySelector(`[data-area="${tinha.id}"]`)?.focus({ preventScroll: true })
  }

  raiz.addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberta) voltar() })

  /* Carrega o mapa um pouco antes de a seção aparecer; a decolagem só com o clique. */
  const obs = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { obs.disconnect(); preparar() } }, { rootMargin: '600px 0px' })
  obs.observe(raiz)
}
