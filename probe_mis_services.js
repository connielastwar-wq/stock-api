const urls = [
  'https://mis.tpex.org.tw/Quote.asmx?WSDL',
  'https://mis.tpex.org.tw/Stock.asmx?WSDL',
  'https://mis.tpex.org.tw/StockList.asmx?WSDL',
  'https://mis.tpex.org.tw/Company.asmx?WSDL',
  'https://mis.tpex.org.tw/Report.asmx?WSDL',
  'https://mis.tpex.org.tw/QuoteSearch.asmx?WSDL'
];
(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log('URL', url, 'STATUS', res.status, res.headers.get('content-type'));
      const text = await res.text();
      console.log(text.slice(0, 200).replace(/[\n\r]/g, ' '));
    } catch (e) {
      console.error('ERR', url, e.message);
    }
    console.log('---');
  }
})();
