const urls = [
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/index.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/otc_quote.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stkquote.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stock_list.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stockinfo.php',
  'https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes/stock_issuers.php'
];

(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log('URL', url, 'STATUS', res.status, res.headers.get('content-type'));
      const text = await res.text();
      const scripts = [...text.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
      const links = [...text.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
      console.log('HEAD START', text.slice(0, 400).replace(/[\n\r]/g, ' '));
      console.log('SCRIPT HITS', scripts.filter(s => /otc|stock|api/i.test(s)).slice(0, 20));
      console.log('LINK HITS', links.filter(l => /otc|stock|api/i.test(l)).slice(0, 20));
    } catch (e) {
      console.error('ERR', url, e.message);
    }
    console.log('---');
  }
})();
