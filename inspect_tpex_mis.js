const url = 'https://mis.tpex.org.tw/js/tpex_mis.js?t=20260321';
(async () => {
  const res = await fetch(url);
  const text = await res.text();
  const regex = /https?:\/\/[^\s"'\)\]]+/gi;
  const hits = [...new Set([...text.matchAll(regex)].map(m => m[0]).filter(v => /Quote|api|json|stock|otc|aspx|asmx|tpex|mis/i.test(v)))];
  console.log('FOUND', hits.slice(0, 100).join('\n'));
})();
