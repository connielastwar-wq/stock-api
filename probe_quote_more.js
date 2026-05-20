const urls = [
  'https://mis.tpex.org.tw/Quote.asmx/GETQ20',
  'https://mis.tpex.org.tw/Quote.asmx/GETQ30',
  'https://mis.tpex.org.tw/Quote.asmx/GETQ31',
  'https://mis.tpex.org.tw/Quote.asmx/GETQ40',
  'https://mis.tpex.org.tw/Quote.asmx/GETQ70'
];
(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log('URL', url, 'STATUS', res.status, res.headers.get('content-type'));
      const text = await res.text();
      console.log(text.slice(0, 600).replace(/[\n\r]/g, ' '));
    } catch (e) {
      console.error('ERR', url, e.message);
    }
    console.log('---');
  }
})();
