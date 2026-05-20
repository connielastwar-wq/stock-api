const assetPath = '/stock/assets/index-CrluTqtF.js';
const url = `https://mis.twse.com.tw${assetPath}`;
(async () => {
  const res = await fetch(url);
  const text = await res.text();
  const keywords = ['otc', 'stock', 'api', 'openapi', 'tpex', 'twse', 'list', 'quote'];
  const found = keywords.reduce((acc, key) => {
    const regex = new RegExp(key, 'gi');
    acc[key] = [...text.matchAll(regex)].length;
    return acc;
  }, {});
  console.log('URL', url);
  console.log('FOUND COUNTS', found);
  for (const key of keywords) {
    const regex = new RegExp(`([^\"'\\s]{0,100}${key}[^\"'\\s]{0,100})`, 'gi');
    const matches = [...text.matchAll(regex)].slice(0, 20).map(m => m[0]);
    if (matches.length) {
      console.log('===', key, matches.slice(0, 20).join(' | '));
    }
  }
})();
