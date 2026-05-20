const https = require('https');
const url = 'https://mis.tpex.org.tw/Quote.asmx/GETQ70';
https.get(url, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    const matches = [...body.matchAll(/<Q70List>(.*?)<\/Q70List>/gs)];
    console.log('COUNT', matches.length);
    console.log('FIRST', matches.slice(0,5).map(m => m[1].trim()).join('\n---\n'));
    console.log('INCLUDES 3231', body.includes('<SymbolID>3231</SymbolID>'));
    console.log('INCLUDES 2412', body.includes('<SymbolID>2412</SymbolID>'));
  });
}).on('error', console.error);
