# MDArray

Multidimensional arrays for JS

# Installation

```javascript
npm install @debonet/mdarray
```

# Usage

MDArray makes working with multidimensional array structures easy and natural. 

## creation

A multidimensional array can be easily created:

```javascript
	const myMDArray = new MDArray(2,3,4);
```

## access
accesing elements can be done in numerous ways:

```javascript
	// arrays can be access in typical way
	myMDArray[1][2][3] = "hello";
	
	// or, equivalently
	myMDArray[ [1,2,3] ] = "hello";
	
	// or, for higher performance
	myMDArray.get( [1,2,3] ) = "hello";
	
	// better error handling
	myMDArray[100][2][3] = undefined; // does not throw!
	
```

## looping
Looping is also vastly simplified: 

```javascript
	for ( const index of myMDArray ){
		myMDArray[ index ] = index.join('');
	}

	console.log( myMDArray );
	
	/* outputs:

				MDArray(2) [
					MDArray(3) [
						MDArray(4) [ '000', '001', '002', '003' ],
						MDArray(4) [ '010', '011', '012', '013' ],
						MDArray(4) [ '020', '021', '022', '023' ]
					],
					MDArray(3) [
						MDArray(4) [ '100', '101', '102', '103' ],
						MDArray(4) [ '110', '111', '112', '113' ],
						MDArray(4) [ '120', '121', '122', '123' ]
					]
				]
	*/
	
	
```

## sub-arrays

```javascript
	const myMDArray = new MDArray(2,3,4).fill(0);
	myMDArray[1].fill(1);
	
	/* yields:
	
		[ [ [ 0, 0, 0, 0 ],
				[ 0, 0, 0, 0 ],
				[ 0, 0, 0, 0 ] ], 
			[ [ 1, 1, 1, 1 ], 
				[ 1, 1, 1, 1 ], 
				[ 1, 1, 1, 1 ] ] ] 
	*/
```
	

## suite

Much of the functionality of the native Array() class has been replicated with sensible multidimensional analogs, e.g.:

```javascript
	const myMDArray = new MDArray(2,3,4,5,6).fill("haystack");
	myMDArray[[ 1, 1, 1, 1, 1 ]] = "needle";

	myMDArray.indexOf("needle") // == [ 1, 1, 1, 1, 1 ]
```

More to be added in future releases.



## functional methods

Including function-oriented programming methods, e.g.:

```javascript
	const mTwos = new MDArray(2,3,4,5,6).fill(2);

	const mFours = myMDArray.map(( x ) => x * 2);
```



# API

## constructor

### new MDArray()

produces an empty MDArray object, with dimension 0

### MDArray( <number>, [<number>]* )

produces MDArray whose dimensions are set to the specified numbers

### MDArray( <array> )

converts the array into an MDArray 

## MDArray.prototype.get( index )

if the index is an array of length equal to the dimensionality of the MDArray, returns the value at the specified index where 

if the index is less than the dimensionality of the MDArray, returns the sub MDArray 

if the index is greater than than the dimensionality of the MDArray, undefined is returned.

if the index is outsize of the size of the MDArray then undefined is returned.

## MDArray.prototype.set( index, x )

sets the value at the specified index
if the index is outsize of the size of the MDArray then undefined is returned.

# Other Methods

These rougly replicate the Array class equivalents


## MDArray.prototype.every( f )

returns true if `f()` applied to every element of the MDArray is true. Otherwise, returns false.

## MDArray.prototype.fill( x )

fills every value of the MDArray with the provided value x


## MDArray.prototype.find( f )

returns the first value of the MDArary for which `f()` applied to that value returns true.

## MDArray.prototype.findIndex( f )

returns the index of the first value of the MDArary for which `f()` applied to that value returns true.

## MDArray.prototype.forEach( ... )
## MDArray.prototype.includes( ... )
## MDArray.prototype.indexOf( ... )
## MDArray.prototype.join( ... )
## MDArray.prototype.makeCopy( ... )
## MDArray.prototype.map( ... )
## MDArray.prototype.size( ... )
## MDArray.prototype.reduce( ... )
## MDArray.prototype.slice( ... )

# Element-By-Element Operators

## add( <MDArray>|<value> )
## sub( <MDArray>|<value> )
## mul( <MDArray>|<value> )
## div( <MDArray>|<value> )
## mod( <MDArray>|<value> )
## and( <MDArray>|<value> )
## or( <MDArray>|<value> ) 
## eq( <MDArray>|<value> ) 
## ne( <MDArray>|<value> ) 
## neq( <MDArray>|<value> ) 
## lt( <MDArray>|<value> ) 
## lte( <MDArray>|<value> ) 
## gt( <MDArray>|<value> ) 
## gte( <MDArray>|<value> ) 
## bitand( <MDArray>|<value> )
## bitor( <MDArray>|<value> ) 
## bitxor( <MDArray>|<value> ) 


# Element-By-Element Reflexive Operators

## setToAdd( <MDArray>|<value> )
## setToSub( <MDArray>|<value> )
## setToMul( <MDArray>|<value> )
## setToDiv( <MDArray>|<value> )
## setToMod( <MDArray>|<value> )
## setToAnd( <MDArray>|<value> )
## setToOr( <MDArray>|<value> ) 
## setToEq( <MDArray>|<value> ) 
## setToNe( <MDArray>|<value> ) 
## setToNeq( <MDArray>|<value> ) 
## setToLt( <MDArray>|<value> ) 
## setToLte( <MDArray>|<value> ) 
## setToGt( <MDArray>|<value> ) 
## setToGte( <MDArray>|<value> ) 
## setToBitand( <MDArray>|<value> )
## setToBitor( <MDArray>|<value> ) 
## setToBitxor( <MDArray>|<value> ) 



# Not yet implemented

## MDArray.prototype.splice( ... )



# Static class methods	
	
## MDArray.loop( <number|pair|triplet>[, <pair|number>*] )

each argument is treated as a range over which a multidimensional iteration is done.
In the case of a <number> the range is assumed to be 0 to <number> with step of 1.
In the case of a <pair> the range is assumed to be <pair>[0] to <pair>[1] with step of 1.
In the case of a <triplet> the range is assumed to be <pair>[0] to <pair>[2] with step of <pair>[1];



(in the case of a pair step 1 is assumed) or a count (i.e. range from 0 to count) 

```javascript
	for ( const index of MDArray.loop( 3, [ 1, 4 ], [-1, -2, -5 ], )){
		console.log("\t\t\t",index);
	}

	/* output
			 [ 0, 1, -1 ]
			 [ 0, 1, -3 ]
			 [ 0, 2, -1 ]
			 [ 0, 2, -3 ]
			 [ 0, 3, -1 ]
			 [ 0, 3, -3 ]
			 [ 1, 1, -1 ]
			 [ 1, 1, -3 ]
			 [ 1, 2, -1 ]
			 [ 1, 2, -3 ]
			 [ 1, 3, -1 ]
			 [ 1, 3, -3 ]
			 [ 2, 1, -1 ]
			 [ 2, 1, -3 ]
			 [ 2, 2, -1 ]
			 [ 2, 2, -3 ]
			 [ 2, 3, -1 ]
			 [ 2, 3, -3 ]
	*/
```

## MDArray.loop( <mdarray> )

loops over over point in the given MDArray.



## MDArray.loopAround( <index>[, <radius = 1>] )

iterates over the neighborhood of size radius surrounding, but not including, the indexed point. e.g.:

```javascript

	for ( const index of MDArray.loopAround( [3,4], 1 )){
		console.log("\t\t\t",index);
	}

	/* output
			 [ 2, 3 ]
			 [ 2, 4 ]
			 [ 2, 5 ]
			 [ 3, 3 ]
			 [ 3, 5 ]  <--- notice [3, 4] does not appear
			 [ 4, 3 ]
			 [ 4, 4 ]
			 [ 4, 5 ]
	*/
```

## MDArray.loopUpDown( <index>[, <radius = 1>] )

loops along each dimension separately, within the provided radius, e.g.:


```javascript

	for ( const index of MDArray.loopUpDown( [3,4], 2 )){
		console.log("\t\t\t",index);
	}

	/* output
			 [ 1, 4 ] // loop 2 before in dimension 0
			 [ 2, 4 ]
			 [ 4, 4 ] // loop 2 after in dimension 0
			 [ 5, 4 ]
			 [ 3, 2 ] // loop 2 before in dimension 1
			 [ 3, 3 ]
			 [ 3, 5 ] // loop 2 after in dimension 1
			 [ 3, 6 ]
	*/
```

