const url = 'https://mis.twse.com.tw/stock/market/otc-market?lang=zhHant';
(async () => {
  const res = await fetch(url);
  const html = await res.text();
  const m = html.match(/src=['"]([^'\"]+index-[^'\"]+)['"]/);
  console.log('SCRIPT', m && m[1]);
  console.log('HTML LENGTH', html.length);
})();
