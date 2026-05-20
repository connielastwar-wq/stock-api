const urls = [
  'https://mis.tpex.org.tw/Quote.asmx/GETQ10',
  'https://mis.tpex.org.tw/Quote.asmx/GETQ12',
  'https://mis.tpex.org.tw/Quote.asmx/GETQ13'
];

(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log('URL', url, 'STATUS', res.status, res.headers.get('content-type'));
      const text = await res.text();
      console.log(text.slice(0, 400).replace(/[\n\r]/g, ' '));
    } catch (e) {
      console.error('ERR', url, e.message);
    }
    console.log('---');
  }
})();
