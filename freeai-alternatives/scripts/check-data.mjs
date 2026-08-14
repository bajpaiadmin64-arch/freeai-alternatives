import { tools, featured, studentToolIds, alternativeFinder, categories, siteConfig } from '../src/data/tools.js'

let errors = 0
const err = (m) => { console.error('FAIL: ' + m); errors++ }

const ids = new Set()
for (const t of tools) {
  if (ids.has(t.id)) err(`duplicate id ${t.id}`)
  ids.add(t.id)
  if (!/^https:\/\//.test(t.officialUrl)) err(`${t.id}: url not https`)
  if (!t.name || !t.company || !t.description) err(`${t.id}: missing basic fields`)
  if (!t.bestFor || !t.limitations || !t.freeStatus) err(`${t.id}: missing status fields`)
  if (!['chat','coding','research','writing','image','video','productivity'].includes(t.category)) err(`${t.id}: bad category ${t.category}`)
  if (!['Completely Free','Free Tier','Free with Limits','Limited Free','Free Account Required','Open Source'].includes(t.freeStatus)) err(`${t.id}: bad freeStatus ${t.freeStatus}`)
  if (typeof t.lastChecked !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(t.lastChecked)) err(`${t.id}: bad lastChecked`)
  for (const k of ['webSearch','coding','reasoning','imageGen','fileUpload','longContext','apiAvailable','openSource','accountRequired']) {
    if (typeof t[k] !== 'boolean') err(`${t.id}: ${k} not boolean`)
  }
}
for (const f of featured) if (!ids.has(f.toolId)) err(`featured missing tool ${f.toolId}`)
for (const s of studentToolIds) if (!ids.has(s)) err(`student missing tool ${s}`)
for (const o of alternativeFinder.paidOptions) for (const tid of o.toolIds) if (!ids.has(tid)) err(`finder (${o.id}) missing tool ${tid}`)
for (const c of categories) if (!['all'].includes(c.id) && !tools.some((t) => t.category === c.id)) err(`category ${c.id} has no tools`)
if (!siteConfig.dataUpdatedOn) err('siteConfig.dataUpdatedOn missing')

const domains = new Set(tools.map((t) => new URL(t.officialUrl).hostname))
const suspicious = [...domains].filter((d) => /(pirate|crack|free-gpt|gpt4free|gptfree|bypass|unlock)/i.test(d))
if (suspicious.length) err(`suspicious domains: ${suspicious.join(', ')}`)

console.log(`tools: ${tools.length} | featured: ${featured.length} | student: ${studentToolIds.length} | finder options: ${alternativeFinder.paidOptions.length} | categories: ${categories.length}`)
console.log(errors === 0 ? 'ALL CHECKS PASSED' : `${errors} ERRORS`)
process.exit(errors === 0 ? 0 : 1)
