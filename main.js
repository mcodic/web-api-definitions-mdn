

window.addEventListener('load', () => {

let getMDN = createDocumentFragment() ;
let MDNDocURL = 'https://developer.mozilla.org/en-US/docs/Web/API' ;

let headers = new Headers() ;
let options = {method: 'GET', headers, mode: 'no-cors'} ;

fetch(MDNDocURL, options).then( response => getMDN.innerHTML )
console.log(getMDN)










}, false)
