// Smoke test for /tdn-flow: every action, every scenario, case release/reject and the GL break fix.
// npm i -D playwright && npx playwright install chromium && node hogan-console/tests/tdn-flow.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(here, '..', 'tdn-flow', 'index.html') + '?nosplash';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(url); await p.waitForTimeout(300);
await p.selectOption('#speed', '0');
const go = async (o) => { await p.evaluate(o => window.__tdn.run(o), o); await p.waitForFunction(() => !window.__tdn.running); return p.evaluate(() => document.querySelector('#result').innerText.replace(/\n/g, ' | ')); };
const cases = [
  { action: 'MINT', cust: 'C-RIVERA', amount: '5,000.00', scenario: 'clear' },
  { action: 'BURN', cust: 'C-RIVERA', amount: '2000', scenario: 'clear' },
  { action: 'XFER', cust: 'C-DANA', dest: 'C-RIVERA', amount: '300', scenario: 'clear' },
  { action: 'XFER', cust: 'C-RIVERA', dest: 'B-LAKE', amount: '1000', scenario: 'clear' },
  { action: 'MINT', cust: 'C-NORTH', amount: '20000', scenario: 'aml' },
  { action: 'MINT', cust: 'C-NORTH', amount: '7000', scenario: 'fraud' },
  { action: 'BURN', cust: 'C-DANA', amount: '50', scenario: 'sanctions' },
  { action: 'XFER', cust: 'C-RIVERA', dest: 'B-SUMMIT', amount: '100', scenario: 'kyc' },
  { action: 'MINT', cust: 'C-DANA', amount: '999999', scenario: 'clear' },
  { action: 'BURN', cust: 'C-DANA', amount: '99999', scenario: 'clear' },
  { action: 'MINT', cust: 'C-DANA', amount: 'abc', scenario: 'clear' },
  { action: 'MINT', cust: 'C-DANA', amount: '1500', scenario: 'gldelay' },
];
for (const c of cases) console.log(JSON.stringify(c).slice(0, 88).padEnd(90), '→', await go(c));
// release the AML case, reject the fraud case, run the GL import
const ids = await p.evaluate(() => window.__tdn.S.cases.map(c => c.id + ':' + c.type));
console.log('cases', ids);
const aml = ids.find(x => x.includes('AML alert')).split(':')[0];
const frd = ids.find(x => x.includes('Fraud')).split(':')[0];
await p.evaluate(id => document.querySelector(`[data-rel="${id}"]`).click(), aml);
await p.waitForTimeout(100); await p.waitForFunction(() => !window.__tdn.running);
console.log('release', aml, '→', await p.evaluate(() => document.querySelector('#result').innerText.replace(/\n/g, ' | ')));
await p.evaluate(id => document.querySelector(`[data-rej="${id}"]`).click(), frd);
const before = await p.evaluate(() => document.querySelectorAll('[data-post]').length);
await p.evaluate(() => document.querySelector('[data-post]').click());
const st = await p.evaluate(() => { const S = window.__tdn.S; const sup = Object.values(S.cust).reduce((t, c) => t + c.tokens, 0); return { sup: Math.round(sup * 100) / 100, bda: S.bda, gl: S.gl, txns: S.txns.map(t => t.id + ' ' + t.status).slice(0, 14), breaksBefore: 0, breaksAfter: document.querySelectorAll('[data-post]').length, kpis: [...document.querySelectorAll('.kpi')].map(k => k.innerText.replace(/\n/g, ' ')) }; });
st.breaksBefore = before;
console.log(JSON.stringify(st, null, 1));
const ok = Math.abs(st.sup - st.bda) < .01 && Math.abs(st.sup - st.gl['210500']) < .01;
console.log('RECONCILED', ok, 'ERRORS', errs);
await b.close();
if (!ok || errs.length) process.exit(1);
