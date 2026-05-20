const url = 'https://mis.twse.com.tw/stock/assets/index-CrluTqtF.js';
(async () => {
  const res = await fetch(url);
  const text = await res.text();
  const urls = new Set();
  const regex = /https?:\/\/[^\s"'\)\]]+/gi;
  for (const m of text.matchAll(regex)) {
    const v = m[0];
    if (/mis\.|tpex\.|twse\.|openapi\.|stock|otc/i.test(v)) {
      urls.add(v);
    }
  }
  console.log([...urls].slice(0,100).join('\n'));
})();
