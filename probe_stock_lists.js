const urls = [
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_L?_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_O?_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap03?_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap04_L?_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap04_O?_=1',
  'https://www.tpex.org.tw/openapi/v1/',
  'https://www.tpex.org.tw/openapi/v1.0/',
  'https://www.tpex.org.tw/openapi/v1.0/StockInfo',
  'https://www.tpex.org.tw/openapi/v1.0/StockIssuerInfo',
  'https://www.tpex.org.tw/openapi/v1/StockInfo',
  'https://www.tpex.org.tw/openapi/v1/StockIssuerInfo',
  'https://www.tpex.org.tw/openapi/v1/StockList',
  'https://www.tpex.org.tw/openapi/v1.0/StockList',
  'https://www.tpex.org.tw/openapi/StockList',
  'https://www.tpex.org.tw/openapi/v1/stock/stock-info',
  'https://www.tpex.org.tw/openapi/v1/stock/quotation',
  'https://www.tpex.org.tw/openapi/v1/stock/quotes',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stock_list.php?l=zh-tw',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stock_list.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stockinfo.php?l=zh-tw',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stockinfo.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stkquote.php?l=zh-tw',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stkquote.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/otc_quote.php?l=zh-tw',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/otc_quote.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stock_issuers.php?l=zh-tw',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stock_issuers.php'
];

(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log('URL', url, 'STATUS', res.status, res.headers.get('content-type'));
      const text = await res.text();
      console.log('BODY START', text.slice(0, 400).replace(/[\n\r]/g, ' '));
    } catch (e) {
      console.error('ERR', url, e.message);
    }
    console.log('---');
  }
})();
