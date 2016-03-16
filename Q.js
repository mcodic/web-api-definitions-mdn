
                 /******** Lambda library **********/
              
                 /* version: 0.0.4 */
              
/*

Documentation








*/











;(function() {



window.Q = function() { }

qproto = Q.constructor.prototype


/*
 * unfortunately some function
 * need to go in the intristic objects
*/

//Function.prototype.


/*
 * precisely determine the type of object
 * from David Flanegan
 * usedBy = [
             "functional/cmps.js",
             "adapting_functions/apply.js"
            ]
 * no dependencies
 * pure function
 * 
 */

Q.classof = o => {
    if (o === null) return "enm reports the object is null"
    if (o === undefined) return "enm reports the object is undefined"
    return Object.prototype.toString.call(o).slice(8,-1);
};


/*
 * puts all the arguments into a list
 * array return values policy
 *
 *
 */

Q.list = (...x) => x
/*
 * to determine the type of primitive values
 *
 *
 *
 *
 */

// source mantyla

Q.typeOf = 
	type =>
		  x => {
		    if (typeof x === type) return x
		    else { throw new TypeError(
		    	     `enm Error: ${type} expected, somehow ${typeof x} is given.
	>>>   Try using ${type} as input argument.   <<<`)
		  }
	  }




/*
 *
 * usedBy = [Q.arr, Q.obj, Q.date, Q.div]
 * used for complex data structures type safety functions
 * Q.objectTypeOf('Function')(Q.add) // Q.add
 * Q.objectTypeOf('String')('Donald Duck lives in Duckburg') // 'Donald Duc...'
 *
 */


Q.objectTypeOf = function(name) {
  return function(o) {
    if (Object.prototype.toString.call(o) === `[object ${name}]`) {
      return o
    }
    else {
      throw new TypeError(`enm Error: ${name} expected, something else given.
          >>>>>   Try using ${name} as input argument.   <<<<`); 
    }
  };
};

/*

// source mantyla

var objectTypeOf = function(name) {
  return function(o) {
    if (Object.prototype.toString.call(o) === "[object  
    "+name+"]") {
      return o;
    }
    else {
      throw new TypeError("Error: '+name+' expected,  
      something else given."); 
    }
  };
};
*/









// source mantyla

Q.str = Q.typeOf('string')
Q.num = Q.typeOf('number')
Q.func = Q.typeOf('function')
Q.bool = Q.typeOf('boolean')

/*
 source mantyla

var str = typeOf('string'),
    num = typeOf('number'),
    func = typeOf('function'),
    bool = typeOf('boolean');

*/








/*
 *
 * using = [Q.objectTypeOf]
 * type safety functions
 * partialy applied functions
 * source mantyla
 *
 */

// obj:: {a} -> {a}
Q.obj = Q.objectTypeOf('Object');

// obj:: [a] -> [a]
Q.arr = Q.objectTypeOf('Array');

// obj:: Date -> Date
Q.date = Q.objectTypeOf('Date');

// obj:: O -> O
Q.div = Q.objectTypeOf('HTMLDivElement');

/*
var obj = objectTypeOf('Object');
var arr = objectTypeOf('Array');
var date = objectTypeOf('Date');
var div = objectTypeOf('HTMLDivElement');

*/











/*
 * there is a time to use it
 * and times when it shouldn't be used
 *
 *
 */


Q.nonEmpty = 

  function(sequence) {
       "use strict"
	   if (sequence.length !== 0) return sequence
       else throw new Error('Your Sequence is totally empty')

  };

// strings :: [a] -> [String]

Q.strings = array => array.map(Q.str)
Q.numbers = array => array.map(Q.num)
Q.booleans = array => array.map(Q.bool)
Q.funcs = array => array.map(Q.func)
Q.arrays = array => array.map(Q.arr)
Q.objects = array => array.map(Q.obj)
Q.dates = array => array.map(Q.date)




/*
There are a few things the thunk() function must do:
   - thunk() function must emulate the _fact.bind(null, n*x, n-1) method 
that returns a non-evaluated function
   - The thunk() function should enclose two more functions:
         For processing the give function, and
         For processing the function arguments that will be used when the 
given function is invoked
With that, we're ready to write the function. We only need a few lines of code to 
write it.
*/


Q.thunk = function (fn) {
  return function() {
    var args = Array.prototype.slice.apply(arguments);
    return function() { return fn.apply(this, args); };
  };
};







Q.trampoline = function(f) {
  while (f && f instanceof Function) {
    f = f.apply(f.context, f.args);
  }
  return f;
}

Q.Y = function(F) {
  return (function (f) {
    return f(f);
  } (function (f) {
    return F(function (x) {
      return f(f)(x);
    });
  }));
}

Q.Ymem = function(F, cache) {
  if (!cache) {
    cache = {} ; // Create a new cache.
  }
  return function(arg) {
    if (cache[arg]) {
      // Answer in cache
      return cache[arg] ; 
    }
    // else compute the answer
    var answer = (F(function(n){
      return (Q.Ymem(F,cache))(n);
    }))(arg); // Compute the answer.
    cache[arg] = answer; // Cache the answer.
    return answer;
  };
}











/**
 * 
 * from Oliver Steel I think
 * 
 * 
 *Returns a function that applies the underlying function to `args`, and
 * ignores its own arguments.
 * :: (a... -> b) a... -> (... -> b)
 * == f.saturate(args...)(args2...) == f(args...)
 * >> Math.max.curry(1, 2)(3, 4) -> 4
 * >> Math.max.saturate(1, 2)(3, 4) -> 2
 * >> Math.max.curry(1, 2).saturate()(3, 4) -> 2
 */
Function.prototype.saturate = function(/*args*/) {
    var fn = this;
    var args = Array.slice(arguments, 0);
    return function() {
        return fn.apply(this, args);
    }
}






function memoize(fn) {  
    return function () {  
        var args = Array.prototype.slice.call(arguments),  
            hash = "",  
            i = args.length;  
        currentArg = null;  
        while (i--) {  
            currentArg = args[i];  
            hash += (currentArg === Object(currentArg)) ?  
            JSON.stringify(currentArg) : currentArg;  
            fn.memoize || (fn.memoize = {});  
        }  
        return (hash in fn.memoize) ? fn.memoize[hash] :  
        fn.memoize[hash] = fn.apply(this, args);  
    }  
  }

/*
 * changes array-like objects to true arrays
 * usedBy = [
             "../adapting_functions/autoCurry.js"
             "../adapting_functions/curry.js"
            ]
 * !!! deprecated use es2015 Array.from()
 *
 */

Q.toArray = x => Array.prototype.slice.call(x)


/*
 * usedBy = ["./autoCurry.js"]
 *
 *
 */


//export default (fn, ...args) => (...what) => fn.apply(this, args.concat(what))


Q.curry = 

  function(fn /* variadic number of args */) {
   //`use strict` 
    var args = Array.prototype.slice.call(arguments, 1);
    var f = function () {
        return fn.apply(this, args.concat(Q.toArray(arguments)));
        };

  return f
  } ;


/*

var curry = 
  function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    var f = function () {
        return fn.apply(this, args.concat(toArray(arguments)));
        };

  return f
  } ;
  


export default function (fn /* variadic number of args *//*) {
    let args = Array.prototype.slice.call(arguments, 1);
    let f = () => fn.apply(this, args.concat(toArray(arguments)))

  return f

  } 


*/
/*
 * autoCurry_prototype.js
 * recursive function
 * add to the Function.prototype in the main.js
 * usedBy = [newline, call, apply, pluck] see it in the main.js main/L
 */

// exported with identifier because of function's recursive nature

autoCurry = 
    function (fn, numArgs) {
        numArgs = numArgs || fn.length;
        var f = 
            function () {
                if (arguments.length < numArgs) {
                return numArgs - arguments.length > 0 ?
                       autoCurry(Q.curry.apply(this, 
                                             [fn].concat(Q.toArray(arguments))),
                                 numArgs - arguments.length) :
                       curry.apply(this, [fn].concat(Q.toArray(arguments)));
               }
               else {
                   return fn.apply(this, Q.toArray(arguments));
               }
           };
         f.toString = function(){ return fn.toString(); };
         f.curried = true;
         f.fn = fn;
         f.arity = fn.length;
         
         return f
    } ;

       
       Function.prototype.autoCurry = function(n) {
         return autoCurry(this, n)
       }





/*






var autoCurry = 
    (fn, numArgs) => {
        numArgs = numArgs || fn.length
        var f = 
            (...fuck) => {
                if (fuck.length < numArgs) {
                return numArgs - fuck.length > 0 ?
                       autoCurry(curry.apply(this, 
                                             [fn].concat(fuck)),
                                 numArgs - fuck.length) :
                       curry.apply(this, [fn].concat(fuck))
               }
               else {
                   return fn.apply(this, fuck)
               }
           }
         f.toString = () => fn.toString()
         f.curried = true
         f.fn = fn
         f.arity = fn.length
         
         return f
    } 
       
       Function.prototype.autoCurry = function(n) {
         return autoCurry(this, n)
       }
























export var autoCurry = (fn, numArgs) => {
  
        numArgs = numArgs || fn.length

        var f = (...args) => {
                if (args.length < numArgs) {
                return numArgs - args.length > 0 ?
                       autoCurry(curry.apply(this, 
                                             [fn].concat(args)),
                                 numArgs - args.length) :
                       curry.apply(this, [fn].concat(args))
               }
               else { return fn.apply(this, args) }
           }

         f.toString = () => fn.toString()
         f.curried = true
         f.fn = fn
         f.arity = fn.length
         
         return f
    }

Function.prototype.autoCurry = n => autoCurry(this, n)


*/





// backup if rest args doesn't work

/*

let autoCurry = (fn, numArgs) => {
        numArgs = numArgs || fn.length;
        let f = function () {
                if (arguments.length < numArgs) {
                return numArgs - arguments.length > 0 ?
                       autoCurry(curry.apply(this, 
                                             [fn].concat(toArray(arguments))),
                                 numArgs - arguments.length) :
                       curry.apply(this, [fn].concat(toArray(arguments)));
               }
               else {
                   return fn.apply(this, arguments);
               }
           };
         f.toString = () => fn.toString()
         f.curried = true
         f.fn = fn
         f.arity = fn.length
         
         return f
    }

*/




/**
 * Returns a function that applies the underlying function to its
 * first argument, and the result of that application to the remaining
 * arguments.
 * == f.uncurry(a, b...) == f(a)(b...)
 * :: (a -> b -> c) -> (a, b) -> c
 * >> 'a -> b -> a/b'.lambda().uncurry()(1,2) -> 0.5
 *
 * Note that `uncurry` is *not* the inverse of `curry`.
 */
Function.prototype.uncurry = function() {
    var fn = this;
    return function() {
        var f1 = fn.apply(this, Array.slice(arguments, 0, 1));
        return f1.apply(this, Array.slice(arguments, 1));
    }
};

// maybe for dom

Q.apply =

	function(fn, obj, argsarray) {
			//`use strict`
	
			if (Q.classof(argsarray) !== 'Array') {
			    var argsarray = 
			             Array.prototype.slice.call(null, argsarray)
			}
			
			return fn.call(obj, argsarray)
	
		}.autoCurry();


//Q.apply(Q.add,null,[2,3])


/*
backup
export default autoCurry((fn, obj, argsarray) => {
  if (classof(argsarray) !== 'Array') {
      let argsarray = Array.prototype.slice.call(null, argsarray)}
      return fn.call(obj, argsarray)
})

*/
/*
 * for calling functions
 * ----added autoCurry in the main.js
 */

//import autoCurry from "./autoCurry.js"
//import "../adapting_functions/autoCurry_prototype.js"



Q.call = 

	function(fn, args, obj=this) { 
       //`use strict`
		return fn.call(obj, args)
		
	}.autoCurry();


/*
use with import "somefile.js"

*/

Function.prototype.flip = () => {
		    var fn = this
		    return (...args) => {

		        args = args.slice(1,2).
		                     concat(args.slice(0,1)).
		                     concat(args.slice(2))
		        return fn.apply(this, args)
		    }
		}


Q.flip = fn => fn.flip()






qproto.method = (name, fn) => { qproto[name] = (fn).autoCurry() }



Q.length = x => x.length


/*
 * Q.concat([3,4])([1,2])    // [1,2,3,4]
 * Q.concat(' holmes', 'sherlock')   // 'sherlock holmes'
 * works on sequences both lists and strings
 */

Q.method("concat", (ys, xs) => xs.concat(ys))



/*
 *
 * type safe function
 * source mantyla
 * use only for arrays
 * for Functors use fmap
 *
 * map :: (a -> b) -> [a] -> [b]
 *
 */

Q.map = function(fn, array) {
  var array = Q.nonEmpty(Q.arr(array))
  var fn = Q.func(fn)
  return array.map(fn);
}.autoCurry()












// Arrays
// =========================




// ima vec negde drugde
/*//+ map :: (a -> b) -> [a] -> [b]
Q.method('map', function(fn, xs) {
  return xs.map(fn);
});*/




/*
//+ reverse :: [a] -> [a]
Q.method('reverse', function( a ){
  return a.slice(0).reverse();
});
*/


/*
//+ unshift :: a -> [a] -> [a]
Q.method('unshift', function( value, a ){
  var b = Q.arr(a).slice(0)
  b.unshift( value ); 
  return b;
});
*/



//+ every :: (a -> Boolean) -> [a] -> Boolean

Q.method('every', 
	     ( fn, xs ) => {
	     //`use strict`
             var xs = Q.nonEmpty(Q.arr(xs)),
                 fn = Q.func(fn)
             
             return xs.every(fn)
         });









//+ filter :: (a -> Boolean) -> [a] -> [a]
Q.method('filter', 
	      (fn, xs) => {
             var xs = Q.nonEmpty(Q.arr(xs)),
                 fn = Q.func(fn)
             
             return xs.filter(fn)
          })


// add some custom filters








  
//+ forEach :: (a -> undefined) -> [a] -> undefined
//+ forEach :: (a -> undefined) -> [a] -> undefined -> [a]
// definately not pure

Q.method('forEach', 
	      ( fn, xs ) => {
             var xs = Q.nonEmpty(Q.arr(xs)),
                 fn = Q.func(fn)

             xs.forEach(fn)

             return xs
          })





//+ indexOf :: a -> [a] -> Int
Q.method('indexOf', function( value, a ) {
  return a.indexOf( value );
});




//+ indexOf_ :: a -> Int -> [a] -> Int
Q.method('indexOf_', function( value, len, a ) {
  return a.indexOf( value, len );
});




//+ join :: String -> [a] -> String
Q.method('join', function( separator, array ) {
  var array = Q.nonEmpty(Q.arr(array))
  var separator = Q.str(separator)
  return array.join( separator );
});



Q.method("dotJoin", Q.join("."))
Q.method("slashJoin", Q.join("/"))
//Q.method("bslashJoin", Q.join(""))






//+ lastIndexOf :: a -> [a] -> Int
Q.method('lastIndexOf', function( value, a ) {
  return a.lastIndexOf( value );
});





//+ pop :: [a] -> [a]
Q.method('pop', function( array ) {
  var array = Q.nonEmpty(Q.arr(array))
  return array.slice(0,-1);
});







// argument order is cool
//+ push :: a -> [a] -> [a]
Q.method('push', function( value, array ) {
  var array = Q.arr(array)
  // cloning the array
  var b = array.slice(0);
  b.push( value );
  return b;
});










//+ reduce :: (b -> a -> b) -> b -> [a] -> b
Q.method('reduce', function(fn, xs) {
  var fn = Q.func(fn),
      xs = Q.nonEmpty(Q.arr(xs))
  return xs.reduce(fn)
});





//+ reduce_ :: (b -> a -> b) -> b -> [a] -> b
Q.method('reduce_', function(fn, acc, xs) {
  var fn = Q.func(fn)
  var acc = Q.num(acc)
  var xs = Q.nonEmpty(Q.arr(xs))
  return xs.reduce(fn, acc);
});




//+ reduceRight :: (b -> a -> b) -> b -> [a] -> b
Q.method('reduceRight', function(fn, acc, xs) {
  var fn = Q.func(fn)
  var acc = Q.num(acc)
  var xs = Q.nonEmpty(Q.arr(xs))
  return xs.reduceRight(fn, acc);
});






//+ shift :: [a] -> [a]
Q.method('shift', function( array ){
  var array = Q.nonEmpty(Q.arr(array))
  return array.slice(1);
});










//+ some :: (a -> Boolean) -> [a] -> Boolean
Q.method('some', function( fn, xs ) {
  var fn = Q.func(fn)
  var xs = Q.nonEmpty(Q.arr(xs))
  return xs.some(fn);
});
















//+ sort :: [a] -> [a]
Q.method('sort', function( a ) {
  var a = Q.nonEmpty(Q.arr(a))
  return a.slice(0).sort();
});







//+ splice :: Int -> Int -> [a] -> [a]
Q.method('splice', function( index, count, a ){
  var b = Q.nonEmpty(Q.arr(a)).slice(0)
  b.splice( index, count );
  return b;
});




/*
 * source mantyla
 * type safe map
 * using = [Q.func,Q.arr]
 *
 * arrayOf :: (a -> b) -> ([a] -> [b])
 *
 */ 

Q.arrayOf = 

  function(f) {
      //"use strict"

      var f = Q.func(f)
      
      return a => {

                 var a = Q.arr(a)

                 return Q.map(f,a)
             }
  };


/*
var arrayOf = function(f) {
  return function(a) {
    return map(func(f), arr(a));
  }
};
*/




// operator library
Q.eq = function(right, left) { return left == right }.autoCurry()
Q.eqq = function(right, left) { return left === right }.autoCurry()
Q.eqqzero = function (a) a === 0

Q.neq = function(right, left) { return left != right }.autoCurry()
Q.neqq = function(right, left) { return left !== right }.autoCurry()

Q.lt = function (right, left) { return left < right }.autoCurry()
Q.gt = function (right, left) { return left > right }.autoCurry()

//Q.leq  = function (right. left) { return left =< right }.autoCurry()
//Q.geq  = function (right, left) { return left >= right }.autoCurry()

// typeof
//Q.tof = function (x) typeof x
/* immutable data, sorry...
// delete property
function del$po(o)p=>delete o.p
function del$op(p)o=>delete o.p
function del(o,p)delete o.p
*/

// in operator predicate functions
function ino$ip(i)o=>i in c

function ino$cp(c)i=>i in c

function ino(i,c)i in c

// instanceof
function iof_ip(i)o=>i instanceof o

function iof_op(o)i=>i instanceof o

function iof(i,o)i instanceof o






//Q.add$     = function (a) b=>a+b
Q.add = 
    function (a,b) {
        var a = Q.num(a) 
        var b = Q.num(b) 
	    return a + b } .autoCurry()

// return Number(a) + Number(b);
//Q.succ = Q.addone = Q.add$(1)
Q.succ = Q.addone = Q.add(1)

Q.subfrom$ = function (a)b=>a-b
Q.subwhat$ = function (b)a=>a-b
Q.sub      = function (a,b)a-b

Q.prev = Q.subone = Q.subwhat$(1)
//Q.mlt$     = function (a)b=>a*b

Q.mlt      = function (a,b) { return a * b } .autoCurry() ;
Q.double   = Q.mlt(2)
Q.divfrom$ = function (a)b=>a/b
Q.divby$   = function (b)a=>a/b
Q.div      = function (a,b) a/b
Q.half = Q.divby$(2)

Q.sqrt = Math.sqrt
Q.sq = function(a) a*a
Q.addsq = function(x, y) x*x + y*y

// where is modulus
Q.modfrom$ = function(a) b => a % b 
Q.modby$   = function(b) a => a % b 
Q.modby2   = Q.modby$(2) 
Q.mod      = function(a,b) a % b 


Q.method("cond", (x,y,c) => c ? x : y)
/*
var cond = (x,y) => c => c ? x : y

var cond = (x, y) => c => {
                            if(c) return x
                            else return y
           } */
/*
 * && what it evaluetes and returns?
 *
 */

Q.method("and", function(a, b) {
    if (a) {
        if (b) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
});





Q.method("not", function(x) {
    if (x) {
        return false;
    } else {
        return true;
    }
});





/*
 * && what it evaluetes and returns?
 *
 */

Q.method("or", function(a, b) {
    if (a) {
        return true;
    } else {
        if (b) {
            return true;
        } else {
            return false;
        }
    }
});
// STRINGS core methods rewritten
// =========================





/* charAt :: Int -> String -> String
 */

Q.method('charAt', function( index, thestring ) {
  var index = Q.num(index)
  var thestring = Q.str(thestring)
  return thestring.charAt(index);
});








/* charCodeAt :: Int -> String -> Int */

Q.method('charCodeAt', function( index, thestring ) {
  var index = Q.num(index)
  var thestring = Q.str(thestring)
  return thestring.charCodeAt( index );
});










/* indexOf :: a -> String -> Int */
Q.method('indexOf', function( value, a ){
  return a.indexOf( value );
});










/*  indexOf_ :: a -> Int -> String -> Int */

Q.method('indexOf_', function( value, len, a ){
  return a.indexOf( value, len );
});















/* lastIndexOf :: a -> [a] -> Int */

Q.method('lastIndexOf', function( value, a ){
  return a.lastIndexOf( value );
});












/* match :: Regexp|String -> String -> [String]*/

Q.method('match', function( regexp, thestring ){
  var thestring = Q.str(thestring)
  return thestring.match( regexp );
});








/* substitute :: Regexp|String -> String -> String -> String*/

Q.method('substitute', function( a, b, s ) {
  var a = Q.num(a)
  var b = Q.str(b)
  return s.replace( a, b );
});









/* search :: Regexp|String -> String -> Int */

Q.method('search', function( regexp, thestring ) {
  var thestring = Q.str(thestring)
  return thestring.search( regexp );
});










/* chop :: String -> String -> [String] */

Q.method('chop', function( separator, thestring ) {
  var separator = Q.str(separator)
  var thestring = Q.str(thestring)
  return thestring.split( separator );
});











/* chop_ :: String -> Int -> String -> [String]*/

Q.method('chop_', function( separator, len, thestring ) {
  var separator = Q.str(separator)
  var len = Q.num(len)
  var thestring = Q.str(thestring)
  return thestring.split( separator, len );
});













/* substring :: Int -> String -> String*/

Q.method('substring', function( start, thestring ) {
  var start = Q.num(start)
  var thestring = Q.str(thestring)
  return thestring.substring( start );
});












/* substring_ :: Int -> Int -> String -> String*/

Q.method('substring_', function( start, end, thestring ) {
  var start = Q.num(start)
  var end = Q.num(end)
  var thestring = Q.str(thestring)
  return thestring.substring( start, end );
});










// toLocaleLowerCase :: String -> String 

Q.method('toLocaleLowerCase', function( thestring ) {
  var thestring = Q.str(thestring)
  return thestring.toLocaleLowerCase();
});

















// toLocaleUpperCase :: String -> String 

Q.method('toLocaleUpperCase', function( thestring ) {
  var thestring = Q.str(thestring)
  return thestring.toLocaleUpperCase()
});











// toLocaleString :: String -> String 

Q.method('toLocaleString', function( thestring ) {
  var thestring = Q.str(thestring)
  return thestring.toLocaleString()
});











// lower :: String -> String

Q.method('lower', function( thestring ) {
  var thestring = Q.str(thestring)
  return thestring.toLowerCase();
});








// upper :: String -> String

Q.method('upper', function( thestring ) {
  var thestring = Q.str(thestring)
  return thestring.toUpperCase();
});










// trim :: String -> String

Q.method('trim', function( thestring ) {
  var thestring = Q.str(thestring)
  return thestring.trim();
});




// source mantyla

Q.flatten = function(...arrays) {
	"use strict"
  var arrays =  Q.nonEmpty(arrays).map(Q.arr)
  return arrays.reduce( function(p,n){
                            return p.concat(n);
                        }
                      );
};


// source mantyla

Q.invert = function(array) {
  var array = Q.nonEmpty(Q.arr(array))
  return array.map(function(x, i, a) {
                      return a[a.length - (i+1)];
                 }
                );
};




Q.method('length', function (x) { return x.length } );









// clone returns a copy of  an array
Q.method('clone', function(array) { 
                       var array = Q.nonEmpty(Q.arr(array))
  	                   return array.slice() } 
  	    );






//repeated code???
//Array.prototype.take = function(amount) {
Q.method('take', function(amount, seq) {
	    var amount = Q.num(amount)
	    var seq = Q.nonEmpty(seq)
        if (seq == []) return []
        if (amount === seq.length) return seq   
        if (amount === 0)           return seq 
        if (arguments.length === 0) return seq 
        if (amount > seq.length) throw "too much to take, can only find this much"
        if (amount > 0) return seq.slice(0, amount)
        if (amount < 0) return seq.slice(amount)
        });





/*
 *
 *
 *
 *
 */

Q.method('drop', 
		  (amount, xs) => {
		  	`use strict`
		     var amount = Q.num(amount), 
		            seq = Q.nonEmpty(xs);

             return seq.slice(amount)
       });





Q.method('last', function (seq) {
    var seq = Q.nonEmpty(seq)
    return seq[seq.length-1] }) ;











Q.method('head', function (seq) { 
    var seq = Q.nonEmpty(seq)
	return seq[0] });






Q.method('tail', function (seq) { 
    var seq = Q.nonEmpty(seq)
	return seq.slice(1) });








/*
 * for composing functions with only one argument
 * algorithm from fjs functional library
 * enm library version, unpure
 * dependencies: L.classof
 */
// check for es 2015 version of classof, or technique

// do you know how es2015's lambda's this behaves?
// this works

Q.cmps =

 (...funcs) => {
    "use strict"

    funcs.reverse() // if it doesn't work add var with same name
    if (funcs.some(a => Q.classof(a) !== "Function")) {
        throw "enm Error: Invalid function to compose"}

    return (...args) => {
        (lf => lf.forEach(f => args = [f.apply(null,args)]))(funcs)

        return args[0]
    }
} ;


/*


// for composing functions with only one argument
// algorithm from fjs functional library
// enm library version, unpure
Q.cmps = function (funcs) {
    var funcs = Q.array_ol(arguments).reverse()
    if (funcs.some(a=>Q.classof(a) !== "Function")) {
        throw "enm Error: Invalid function to compose"}
    return function() {
        var args = Q.array_ol(arguments);
        (lf => lf.forEach(f => args = [f.apply(null,args)]))(funcs)
        return args[0]
    }
};


// for composing functions
// algorithm from fjs functional library
// purer version
Q.cmps = function (funcs) {
    var funcs = Array.prototype.slice.apply(arguments).reverse()
    if (funcs.some(a=>(o => {
                             if (o === null) return "Null";
                             if (o === undefined) return "Undefined";
                             return Object.prototype.toString.
                                           call(o).slice(8,-1);
                       })(a) !== "Function")) {
        throw "enm Error: Invalid function to compose"}
    return () => {
        var args = Array.prototype.slice.apply(arguments);
        (lf => lf.forEach(f => args = [f.apply(null,args)]))(funcs)
        return args[0]
    }
};


*/

/*
 * L.line samo sa desna na levo
*/

Q.pipe = function (funcs) {
  var funcs = Q.toArray(arguments).reverse() //dodadoh
  return Q.line.apply(null, funcs)
};
/*
 * for composing functions with only one argument
 * algorithm from fjs functional library modified
 * pure function
 * unlike cmps it doesn't return a function
 * :: fn* -> a
 * but where is the input for composing?
 */

// do you know how es2015's lambda's this behaves?

Q.line = 
  (...funcs) => {
    funcs.reverse()
    var args = [funcs[0]];
    (lf => lf.forEach(f => args = [f.apply(null,args)]))(funcs.slice(1))
    return args[0]
  };


/*
// this one works  too \\\\\\\\\\\\\\\\\\\
Q.line = 
  function (funcs) {
    var funcs = Q.toArray(arguments).reverse()
    var args = [funcs[0]];
    (lf => lf.forEach(f => args = [f.apply(null,args)]))(funcs.slice(1))
    return args[0]
  };
*/


// corrupted:
/*L.line = 
(...funcs) => {
    var funcs = funcs
    funcs.reverse()
    var args = [funcs[0]]
    (lf => lf.forEach(f => args = [f.apply(null, args)]))(funcs.slice(1))
    
    return args[0]
  } ;

/*
L.line = 
(...fn) => {
    var funcs = fn
    funcs.reverse()
    var args = [funcs[0]]
    (lf => lf.forEach(f => args = [f.apply(null, args)]))(funcs.slice(1))
    
    return args[0]
  } ;
*/



Q.fullNumArray = Q.cmps(Q.numbers,Q.nonEmpty,Q.arr)

Q.method('sortnum',function (seq) { 
    //var seq = Q.nonEmpty(Q.arr(seq))
    var seq = Q.fullNumArray(seq)
	return seq.slice().sort((a,b) => a - b) });









Q.method('rvrsort', function (seq) {
    var seq = Q.fullNumArray(seq)
	return seq.slice().sort((a,b)=>b-a) });





// Q.min :: Array -> Int
Q.method('min', function (seq) {
    var seq = Q.fullNumArray(seq)
	return seq.slice().sort((a,b)=>a-b)[0] });







// Q.max :: Array -> Int
Q.method('max', function (seq) {
    var seq = Q.fullNumArray(seq)
    return seq.slice().sort((a,b) => a - b)[seq.length-1] });







// recursive version
Q.method('maximal', function (list) {
  	    var seq = Q.fullNumArray(seq)
        if (list.length === 1) return list[0]
        else return max(list[0], 
        	                Q.maximal(Q.tail(list)))
    });

/////////////////////////////
/////// number methods //////




Q.method("even", a => Q.cond(true, 
	                         false, 
	                         Q.eqq(Q.modby2(Q.num(a)), 0)));

Q.method("odd", a => Q.cond(true, 
	                         false, 
	                         Q.eqq(Q.modby2(Q.num(a)), 1)));

// gt args it is reversed
Q.method("maxNum", (a,b) => {
        if (Q.gt(a,b)) return b
        else return a
    });

Q.method("range", a => {
      var numlist = []
      for (var i = 0; i < a; i++) {
          numlist.push(i)
      }
      return numlist
  });


Q.method("evens", Q.filter(Q.even));
Q.method("odds", Q.filter(Q.odd));
Q.method("sumEvens", Q.cmps(Q.reduce(Q.add), Q.evens));
Q.method("sumOdds", Q.cmps(Q.reduce(Q.add), Q.odds));





// nextChar :: String -> [Char]

Q.method('spellMe', Q.chop(""));

// nextChar :: String -> [Char]

Q.method('words', Q.chop(" "));


// nextChar :: String -> [Char]
 
Q.method('depSent', Q.cmps(Q.map(Q.trim),Q.chop(",")));

// nextChar :: String -> [Char]

Q.method('sentences', Q.chop("."));

// nextChar :: String -> [Char]

Q.method('address', Q.chop("//"));


/*

// nextChar :: Char -> Char
function nextChar(c) { 
  return String.fromCharCode(c.charCodeAt(0) + 1); }
// previousChar :: Char -> Char
//function previousChar(c) {

*/


	

Q.MONAD = 

  function () {
  
      var prototype = Object.create(null)
  
      function unit(value) {

          var monad = Object.create(prototype)

          monad.bind = 
            function (func, args) {
                return func(value, ...args) 
}

          return monad 
      }
  
      unit.method = 
        function (name, func) {
            prototype[name] = func
            return unit

        }

  /* for heavy side-effects */  

  //this doesen't take only a function that knows about monads but any function
  //and guaratees that the result is a monad
  
  unit.lift = function (name, func) {
    prototype[name] = function (...args) {
      return unit(this.bind(func, args));
    }
    return unit;
  };
  return unit;
};

/*
var ajax = MONAD()
  .lift('alert', alert);
  
var monad = ajax("Hello world.");
monad.alert();

     // ja dodao ispravno
    // return unit };

//L.MONAD()(10).bind(L.sumarg, [11,10,119])
//150
/*b = MONAD()
function unit()
b.method('aks', function(x) x+1)
function unit()
B(9)
ReferenceError: B is not defined
b(9)
Object { bind: unit/monad.bind() }
b(9).aks
function ()
b(9).aks(333)
334




L.MONADS = function () {
  var prototype = Object.create(null);
  function unit(value) {
    var monad = Object.create(prototype);
    monad.bind = function (func, args) {
      return func(value, ...args);
    };
    return monad;
  };
  */



/*
 * modifier can be used to create Maybe Monad
 *
 *
 *
 *
 */



Q.MONAD2 = function (modifier) {
  var prototype = Object.create(null);
  function unit(value) {
    var monad = Object.create(prototype);
    monad.bind = function (func, args) {
      return func(value, ...args);
    };
    if (typeof modifier === 'function') {
      modifier(monad, value);
    }
    return monad;
  }
  return unit
}

/*
function MONAD2(modifier) {
  var prototype = Object.create(null);
  function unit(value) {
    var monad = Object.create(prototype);
    monad.bind = function (func, args) {
      return func(value, ...args);
    };
    if (typeof modifier === 'function') {
      modifier(monad, value);
    }
    return monad;
  }
  return unit
}*/




/*
 *
 * the MAYBE MONAD
 * similar to NaN
 * is this from Doug or FrontendMasters ?
 * this is already started Monad
 */

/* 
 * modifier parameter 
 * values are in unit function 
 *
 */

Q.Maybe = Q.MONAD2(function (monad, value) {
  if (value === null || value === undefined) {
    monad.is_null = true;
    monad.bind = function () {
      return monad;
    };
  }
});







/*
 *
 *
 *
 * usage: 
 * Q.Either(100, 2)(100)
 * hmDuck = Q.Either(100, 2)
 * hmDuck(100).bind(L.add, [50]) 
 * // 150
 *
 *
 *
 *
 *
*/

Q.Either = 
	(x, y) => {

	return Q.MONAD2(function (monad, value) {
	      if (value === x) {
	         monad.left = true;
	         monad.bind = function (func, args) {
                              return func(x, ...args);
                          };
	      }

	      else {           //if (value === y)
	         monad.right = true;
	         monad.bind = function (func, args) {
                              return func(y, ...args);
                          };
	      }
	      
	    })
    }



/*
 *
 * done(L.add, [23], L.Maybe(8))
 * done(L.add, [23], L.Maybe)(8)
 * L.cmps(done(L.add, [23]), L.Maybe)(8) WRONG
 * L.cmps(done(value), fn, L.Maybe)(input) !!!
 *
 * //values first, then funcs - be composable
 *
 * What is the best param order for composition
 * autoCurry in cmps doesn't work so combinator
 *
 *
 *
 *
 *
 */

// L.line or L.cmps pick
Q.tie = 
    
    (fn, value, mon) => {
            
            return x => mon(x).bind(fn, value)
        
        }  //).autoCurry()









/*
 *
 * method combinator for monad
 *
 *
 *
 *
 *
 *
 *
 *
 */

// check
// pair at the end
Q.meth = 
    
    ((mon, string, fn) => { 
    	    
    	    return mon.method(string, fn)
        
        }).autoCurry()


/*
 *
 * unit.lifting combinator for monad
 *
 *
 *
 */

Q.elev = 
    
    ((mon, string, fn) => {
            
            return mon.lift(string, fn)
        
        }).autoCurry()   


// for use with monet js

Q.method("fmap", (f, ftr) => Q.obj(ftr).map(Q.func(f)))



/*
 *
 * 
 * source mantyla
 * not for arrays
 * for Functors use fmap
 *
 * map :: (a -> b) -> [a] -> [b]
 *


Q.fmap = function(f, a) {
  return Functor(a.map(f));
}.autoCurry()

 */






// check the shortcuts for type signatures

// general functions for all monads

	Q.method("fmap", (fn, mon) => mon.map(fn))
	Q.method("bind", (fn, mon) => mon.bind(fn))
	Q.method("unit", (monConst, a) => monConst.unit(a))
	// <*>
	Q.method("ap", (monfn, mon) => mon.ap(monfn))
	Q.method("join", (mon) => mon.join())
	Q.method("pass", (monNot, monIn) => monIn.takeLeft(monNot))
	Q.method("rather", (monNew, monIn) => monIn.takeRight(monNew))

// monet.js immutable lists

/* cons :: a -> [a] -> [a]
 * prepend the element to the front of the imm list
 * Q.cons(400, [1,2,3].list()).toArray()  // [400,1,2,3]
 */

 Q.method("cons", 
	      (x, ixs) => 
	         Q.obj(ixs).cons(x))

/* append :: [a] -> [a] -> [a]
 * concatenates two immutable lists
 * Q.append([4,5].list(), 
 *          [1,2,3].list()
 *         ).toArray()  // [1,2,3,4,5]
 */

 Q.method("append", 
	      (iys, ixs) => 
	         Q.obj(ixs).append(Q.obj(iys)))

/* head :: [a] -> a
 * 
 * get #0 item in the immutable list
 * for arrays consult Q.first
 * 
 */

 Q.method("head", ixs => Q.obj(ixs).head())

/* headMaybe :: [a] -> M a
 * 
 * creates a Maybe with head of immutable list
 * Q.headMaybe([22,91].list())  // Just(22)
 * 
 */

 Q.method("headMaybe", 
	       ixs => 
	         Q.obj(ixs).headMaybe())

// what about tail function
// thare is no documentation

/* immutable general recursion
 * recursion is more powerful than immutable map
 * but still has too much recursion problem
 * array map still is fastest 
 *
 */ 

 Q.method("listRec",
		  (fn, x) => {
		    if (x.isNil) return Nil
			return suite([fn(x.head())]).
		              append(lamp(fn, x.tail()))})



/* foldLeft :: (initialValue: B)(fn: (acc:B, element:A) -> B): B
 * 
 * [1,2,3,4].list().foldLeft(100)(add)   // 110
 * immutable reduce
 * 
 */

 Q.method("foldLeft", 
		 (fn, initVal, ixs) => {
			   var initVal = Q.num(initVal),
			           ixs = Q.obj(ixs), 
			            fn = Q.func(fn)
			          
			   return ixs.foldLeft(initVal)(fn)
		 })


/* foldRight :: (initialValue: B)(fn: (acc:B, element:A) -> B): B
 * 
 * [1,2,3,4].list().foldRight(0)(add)
 * immutable reduce
 *
 */

 Q.method("foldRight", 
		  (fn, initVal, ixs) => {
			// initVal can be a 
			       var ixs = Q.obj(ixs), 
			            fn = Q.func(fn)
			          
			   return ixs.foldRight(initVal)(fn)
		 })

/* mseq :: [M a] -> M -> M [a]
 * 
 * Q.mseq(Either, 
 *        suite([Just(3), Just(8), Just(2)])).
 *             right().toArray()
 *  // Array [ 3, 8, 2 ]
 * 
 */

 Q.method("mseq", 
	     (monConst, iMs) => {
	        var iMs = Q.obj(iMs),
	            monConst = Q.obj(monConst)
	     
	        return iMs.sequence(monConst)
	    })


/* mlazySeq :: [M a] -> M -> M [a]
 * 
 * for immutable lists with IO and Reader 
 * 
 */

 Q.method("mlazySeq", 
	     (monConst, iMs) => {
	        var iMs = Q.obj(iMs),
	            monConst = Q.obj(monConst)
	     
	        return iMs.lazySequence(monConst)
	    })


/* mseqEither :: [Either E a] -> Either[E, a]
 * 
 * for immutable lists with Eithers 
 * if only Rights -> Right[a]
 * if there is Left -> first Left a
 *
 */

  Q.method("mseqEither", iEs => Q.obj(iEs).seqEither())


/* mseqMaybe :: Maybe M => [M a] -> M[a]
 * 
 * same as [Some(1), Some(2)].list().sequence(Maybe)
 * same as mseq(Maybe, [Some(1), Some(2)].list())
 * 
 * [Some(1), Some(2)].list().
 *       sequence(Maybe).some().toArray()
 * // Array [ 1, 2 ]
 *
 */
 

  Q.method("mseqMaybe", iMs => Q.obj(iMs).seqMaybe())


/*
mseqValid
mseqIO
mseqReader
reverse*/


Q.method("rather", (monNew, monIn) => monIn.takeRight(monNew))










/*  Lists for testin */

Q.lucky = [33, 45, 17, 34, 4]
Q.digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
Q.states = 
     [
      "alabama",
      "georgia",
      "nevada",
      "nebraska",
      "state of new york",
      "california"
     ]

/* Objects */

Q.donald = 
     {
      fullName: "Donald Duck",
      creator: "Walt Disney",
      firstKin: "Scrooge McDuck",
      artists: ["Carl Barks", "Don Rosa"]
     }

/* Functions */



window.bill = 24




}) ()
// GLOBAL SHORTCUTS 


/*
 * dot :: [f] -> a -> b  
 * 
 * akka (.)
 *
 */

dot = Q.cmps


/*
 * map :: [a] -> (a -> b) -> [b]
 * mapping arrays only, not other functors
 */
// although I should be using the immutable lists

map = Q.map


add     = Q.add
addone  = Q.addone

// ct shortcuts

fmap = Q.fmap

/*
 * bind :: (a -> M b) -> M a -> M b   
 * fn first for cmps
 * akka >>=
 *
 */

bind = Q.bind



/*
 * (Maybe, Either) => pure :: M -> a -> M a
 * 
 * alias unit, of, return
 * Maybe, Either (but not Just, Right)
 */

pure = Q.unit    



/*
 * fapply :: M (a -> b) -> M a -> M b
 * alias ap
 * akka <*> in LYAH
 * for applicative functors
 *
 */

fapply = Q.ap  


/*
 * mjoin :: M M a -> M a 
 * is it mjoin
 * 
 *
 */

mjoin    = Q.join


/*
 * mpass :: M b -> M a -> M a
 * 
 * monad offer refused
 *
 */

mpass = Q.pass


/*
 * mrather :: M b -> M a -> M b
 * 
 * preferred monad
 *
 */

mpref = Q.rather


// for constructing an immutable list
// french word for following (what comes next)

suite =  xs => Q.arr(xs).list()


                 /* Live Long and Prosper. */
              