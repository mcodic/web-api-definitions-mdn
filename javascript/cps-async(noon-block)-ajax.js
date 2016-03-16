
/*
Implementing fetch

It's not hard to implement fetch 
so that it operates in non-blocking mode or blocking mode, 
depending on whether the programmer supplied a callback:
*/

/*
 fetch is an optionally-blocking 
 procedure for client->server requests.
 
 If only a url is given, the procedure 
 blocks and returns the contents of the url.
 
 If an onSuccess callback is provided, 
 the procedure is non-blocking, and the
 callback is invoked with the contents 
 of the file.
 
 If an onFail callback is also provided, 
 the procedure calls onFail in the event of 
 a failure.
 
*/
 
function fetch (url, onSuccess, onFail) {
 
  // Async only if a callback is defined: 
  var async = onSuccess ? true : false ;
  // (Don't complain about the inefficiency
  //  of this line; you're missing the point.)
 
  var req ; // XMLHttpRequest object.
 
  // The XMLHttpRequest callback:
  function processReqChange() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        if (onSuccess) 
          onSuccess(req.responseText, url, req) ; 
      } else {
        if (onFail) 
          onFail(url, req) ;
      }
    }
  }
 
  // Create the XMLHttpRequest object:
  if (window.XMLHttpRequest) 
    req = new XMLHttpRequest();
  else if (window.ActiveXObject) 
    req = new ActiveXObject("Microsoft.XMLHTTP");
 
  // If asynchronous, set the callback:
  if (async) 
    req.onreadystatechange = processReqChange;
 
  // Fire off the request:
  req.open("GET", url, async);
  req.send(null);
 
  // If asynchronous,
  //  return request object; or else
  //  return the response.
  if (async) 
    return req ;
  else
    return req.responseText ;
} 
Example: Fetching data

Consider a program that needs to grab a name for a UID.

Using fetch, both of the following work:
// Blocks until request in finished:
var someName = fetch("./1031/name") ;
 
document.write ("someName: " + someName + "<br>") ;
 
// Does not block:
fetch("./1030/name", function (name) {
 document.getElementById("name").innerHTML = name ;
}) ;
