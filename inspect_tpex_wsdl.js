const url='https://mis.tpex.org.tw/Quote.asmx?WSDL';
(async()=>{
  const res=await fetch(url);
  const text=await res.text();
  const names=[...text.matchAll(/<s:element name="([^"]+)"/g)].map(m=>m[1]);
  console.log('ELEMENTS', names.slice(0,200).join('\n'));
})();
