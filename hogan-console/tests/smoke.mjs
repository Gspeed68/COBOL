// Smoke test: runs every scenario (happy path + each rejection) at Instant speed.
// npm i -D playwright && npx playwright install chromium && node hogan-console/tests/smoke.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(here, '..', 'index.html') + '?nosplash';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(url); await p.waitForTimeout(300);
await p.selectOption('#speed', '0');
const cases = [
 ['maint', {acct:'1000200011', mtype:'STAT', newval:'D'}],
 ['maint', {acct:'1000200045', mtype:'ODLM', newval:'100'}],
 ['maint', {acct:'1000200029', mtype:'STAT', newval:'C'}],
 ['maint', {acct:'1000200029', mtype:'HOLD', newval:'99999'}],
 ['maint', {acct:'1000200029', mtype:'ADDR', newval:'5 New Rd, Columbus OH'}],
 ['maint', {acct:'1000200011', mtype:'STAT', newval:'A'}],
 ['xfer', {from:'1000200011', to:'1000200029', amt:'250.00'}],
 ['xfer', {from:'1000200029', to:'1000200011', amt:'3500'}],
 ['xfer', {from:'1000200029', to:'1000200011', amt:'999999'}],
 ['xfer', {from:'1000200045', to:'1000200011', amt:'10'}],
 ['xfer', {from:'1000200011', to:'1000200011', amt:'10'}],
 ['tdn', {action:'MINT', acct:'1000200011', amt:'500'}],
 ['tdn', {action:'MINT', acct:'1000200029', amt:'100'}],
 ['tdn', {action:'BURN', acct:'7000200037', amt:'2000'}],
 ['tdn', {action:'XFER', acct:'7000200011', cdaTo:'7000200037', amt:'300'}],
 ['tdn', {action:'XFER', acct:'7000200011', cdaTo:'7000200037', amt:'99999'}],
 ['tdn', {action:'MINT', acct:'1000200045', amt:'5'}],
 ['apim', {partner:'bluefin', op:'PAY', rail:'RTP', dda:'1000200037', amt:'1250', cpty:'Columbus Supply Co', badtoken:false}],
 ['apim', {op:'PAY', rail:'ACH', dda:'1000200037', amt:'800', cpty:'Columbus Supply Co', badtoken:false}],
 ['apim', {op:'PAY', rail:'FEDNOW', dda:'1000200037', amt:'30000', cpty:'Columbus Supply Co', badtoken:false}],
 ['apim', {op:'PAY', rail:'WIRE', dda:'1000200037', amt:'500', cpty:'Acme Shell Co', badtoken:false}],
 ['apim', {op:'PAY', rail:'RTP', dda:'1000200037', amt:'500', cpty:'Columbus Supply Co', badtoken:true}],
 ['apim', {op:'PAY', rail:'WIRE', dda:'1000200029', amt:'90000', cpty:'Columbus Supply Co', badtoken:false}],
 ['apim', {op:'BAL', dda:'1000200011', badtoken:false}],
];
let cur='';
for (const [sc, v] of cases) {
  if (sc !== cur) { await p.evaluate(s => window.__hogan.select(s), sc); cur = sc; await p.selectOption('#speed','0'); }
  await p.evaluate(v => window.__hogan.setVals(v), v);
  if (v.acct && sc==='tdn') await p.evaluate(v => window.__hogan.setVals({acct:v.acct}), v);
  await p.click('#runBtn'); await p.waitForTimeout(80);
  const r = await p.evaluate(() => ({ res: document.querySelector('#result').innerText.replace(/\n/g,' | '), lines: document.querySelectorAll('.ln.done').length, last: [...document.querySelectorAll('#console div')].slice(-1)[0]?.innerText }));
  console.log(sc.padEnd(6), JSON.stringify(v).slice(0,70).padEnd(72), '→', r.res, `(${r.lines} lines)`);
}
const st = await p.evaluate(() => { const S = window.__hogan.S; return { dda: Object.fromEntries(Object.entries(S.dda).map(([k,a])=>[k,[a.ledger,a.holds,a.status]])), cda: Object.fromEntries(Object.entries(S.cda).map(([k,c])=>[k,c.tokens])) }; });
console.log(JSON.stringify(st));
console.log('ERRORS', errs);
await b.close();
