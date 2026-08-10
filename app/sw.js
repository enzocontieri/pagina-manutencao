/* Este worker existe só para desfazer o anterior. Ver publicar-site.sh. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const nomes = await caches.keys()
      await Promise.all(nomes.map((n) => caches.delete(n)))
      await self.registration.unregister()
      const abas = await self.clients.matchAll({ type: 'window' })
      for (const aba of abas) aba.navigate(aba.url)
    })(),
  )
})
