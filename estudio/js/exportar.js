/* =====================================================================
   Exportação das peças: PNG (WhatsApp e Instagram), ZIP do carrossel,
   PDF pela impressão do navegador (texto continua texto) e HTML do e-mail.
   Cada página é montada fora da tela no tamanho final e só então
   fotografada, para a prévia em escala não interferir no arquivo.
   ===================================================================== */
const area = () => document.getElementById('impressao')
let fontesEmbutidas = null

async function montar(pg) {
  const caixa = document.createElement('div')
  caixa.innerHTML = pg.html
  const el = caixa.firstElementChild
  area().appendChild(el)
  /* espera cada foto carregar, com prazo: decode() pode não resolver fora da tela */
  await Promise.all([...el.querySelectorAll('img')].map((img) => img.complete ? null : Promise.race([
    new Promise((ok) => { img.onload = img.onerror = ok }),
    new Promise((ok) => setTimeout(ok, 8000)),
  ])))
  await document.fonts.ready
  return el
}

export async function pngDaPagina(pg) {
  const el = await montar(pg)
  try {
    if (!fontesEmbutidas) fontesEmbutidas = await window.htmlToImage.getFontEmbedCSS(el)
    const h = pg.h || el.offsetHeight
    return await window.htmlToImage.toBlob(el, { width: pg.w, height: h, pixelRatio: pg.escala || 1, fontEmbedCSS: fontesEmbutidas, backgroundColor: '#ffffff' })
  } finally { el.remove() }
}

export function baixar(blob, nome) {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: nome })
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export async function zipDasPaginas(pgs, base) {
  const zip = new window.JSZip()
  for (let i = 0; i < pgs.length; i++) zip.file(`${base}-${String(i + 1).padStart(2, '0')}.png`, await pngDaPagina(pgs[i]))
  return zip.generateAsync({ type: 'blob' })
}

/* PDF: o navegador imprime as páginas no tamanho delas (A4, 16:9 ou 1080). */
export async function imprimir(pgs) {
  const alvo = area()
  alvo.replaceChildren()
  const estilo = document.createElement('style')
  const { w, h } = pgs[0]
  estilo.textContent = `@page { size: ${w}px ${h || 1123}px; margin: 0 }`
  document.head.appendChild(estilo)
  for (const pg of pgs) await montar(pg)
  const limpar = () => { alvo.replaceChildren(); estilo.remove(); window.removeEventListener('afterprint', limpar) }
  window.addEventListener('afterprint', limpar)
  window.print()
}

export async function copiar(texto) {
  try { await navigator.clipboard.writeText(texto); return true } catch { return false }
}

/* fotos que a pessoa sobe: reduzidas para no máximo 2400 px, sem perder a proporção */
export function lerImagem(arquivo, max = 2400) {
  return new Promise((ok, falha) => {
    const leitor = new FileReader()
    leitor.onerror = falha
    leitor.onload = () => {
      const img = new Image()
      img.onerror = falha
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height))
        const c = Object.assign(document.createElement('canvas'), { width: Math.round(img.width * k), height: Math.round(img.height * k) })
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        ok(c.toDataURL('image/jpeg', 0.88))
      }
      img.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })
}
