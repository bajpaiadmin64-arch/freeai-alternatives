import { tools } from '../src/data/tools.js'

const fail = []
let ok = 0

for (const t of tools) {
  try {
    const r = await fetch(t.officialUrl, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) })
    const status = r.status
    if (status >= 200 && status < 500) {
      ok++
      console.log(`OK  ${status}  ${t.id}  ${t.officialUrl}`)
    } else {
      fail.push(`${t.id}: HTTP ${status} ${t.officialUrl}`)
    }
  } catch (e) {
    fail.push(`${t.id}: ${e.cause?.code || e.message} ${t.officialUrl}`)
  }
}

console.log(`\n${ok}/${tools.length} URLs reachable`)
if (fail.length) {
  console.log('FAILURES:')
  fail.forEach((f) => console.log('  ' + f))
  process.exit(1)
}
