const urls = [
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_O?_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_O?response=json&_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_O?output=json&_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_O?format=json&_=1',
  'https://openapi.twse.com.tw/v1/opendata/t187ap03_O?data=1'
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
