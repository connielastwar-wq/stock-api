const url = 'https://mis.tpex.org.tw/';
(async () => {
  const res = await fetch(url);
  const text = await res.text();
  const urls = new Set();
  const regex = /https?:\/\/[^\s"'\)\]]+|(?:\/[^\s"'\)\]]+)/gi;
  for (const m of text.matchAll(regex)) {
    const v = m[0];
    if (/api|stock|otc|quote|js|json|php|list/i.test(v)) {
      urls.add(v);
    }
  }
  console.log([...urls].slice(0,200).join('\n'));
})();
