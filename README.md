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
Looping is also vastly simplified. Looping over indicies:

```javascript
	for ( const index of myMDArray.loop()){
		myMDArray[ index ] = index.join('');
	}
```

> Result:  
> ```
> 	MDArray(2) [  
> 		MDArray(3) [  
> 			MDArray(4) [ '000', '001', '002', '003' ],  
> 			MDArray(4) [ '010', '011', '012', '013' ],  
> 			MDArray(4) [ '020', '021', '022', '023' ]  
> 		],  
>  		MDArray(3) [  
> 			MDArray(4) [ '100', '101', '102', '103' ],  
> 			MDArray(4) [ '110', '111', '112', '113' ],  
> 			MDArray(4) [ '120', '121', '122', '123' ]  
> 		]  
> 	]  
> ```

And looping over values:

```javascript
	for ( const val of myMDArray ){
		console.log( val );
	}
```
> Result:  
> ```
>		000
>		001
>		002
>		003
>		010
>		011
>        .
>        .
>        .
>		122
>		123
> ```


## sub-arrays

```javascript
	const myMDArray = new MDArray(2,3,4).fill(0);
	myMDArray[1].fill(1);
```

> yields:   
> ```
> 	[ [ [ 0, 0, 0, 0 ],  
> 	    [ 0, 0, 0, 0 ],  
> 	    [ 0, 0, 0, 0 ] ],   
> 	  [ [ 1, 1, 1, 1 ],   
> 	    [ 1, 1, 1, 1 ],   
> 	    [ 1, 1, 1, 1 ] ] ]   
> ```

## suite

Much of the functionality of the native Array() class has been replicated with sensible multidimensional analogs, e.g.:

```javascript
	const myMDArray = new MDArray(2,3,4,5,6).fill("haystack");
	myMDArray[ [ 1, 1, 1, 1, 1 ] ] = "needle";
	
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

### new MDArray( <number>, [<number>]* )

produces MDArray whose dimensions are set to the specified numbers

### new MDArray( <array> )

converts the array into an MDArray 


## MDArray.prototype.get( index )

_**index**_
> if the index is an array of length equal to the dimensionality of the MDArray, returns the value at the specified index where 
> 
> if the index is less than the dimensionality of the MDArray, returns the sub MDArray 
> 
> if the index is greater than than the dimensionality of the MDArray, undefined is returned.
> 
> if the index is outsize of the size of the MDArray then undefined is returned.

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

## MDArray.prototype[ operation ] ( [ value ]* )

_**operation**_

Operation is one of:
	
| - | - | - | - |
| --- | --- | --- | --- |
| add | sub | mul | div |
| mod | and | or | eq |
| ne | neq | lt | lte |
| gt | gte | bitand | bitor |
| bitxor | abs | acos | acosh |
| asin | asinh | atan | atan2 |
| atanh | cbrt | ceil | clz32 |
| cos | cosh | exp | expm1 |
| floor | fround | hypot | imul |
| log | log10 | log1p | log2 |
| max | min | pow | random |
| round | sign | sin | sinh |
| sqrt | tan | tanh | trunc |

_**value**_
> value is an `MDArray`, `Array`, or value.
>
> if value is an MDArray of same dimensionality of the calling MDArray, then operation is applied to the element
>
> if value is an MDArray of smaller dimensionality, the higher dimensionalities are ignored, resulting in repeated use of each element
> 
> if value is an MDArray of greater dimensionality, the sub-MDArray is passed to the operator
> 
> if value is an Array, it is treated identially to an `MDArray.dimension=1`,  resulting in repeated use of each element along the final dimension.
>
> otherwise value is used in the per-element operation directly.


## MDArray.prototype.applyOperation( f, [ mdarray | array | value ]* ) 



# Element-By-Element Reflexive Operators

## MDArray.prototype[ reflexive-operation ] ( [ value ]* )

_**reflexive-operation**_

reflexive-operation is one of 

| - | - | - | - |
| --- | --- | --- | --- |
| setToAdd | setToSub | setToMul | setToDiv |
| setToMod | setToAnd | setToOr | setToEq |
| setToNe | setToNeq | setToLt | setToLte |
| setToGt | setToGte | setToBitand | setToBitor |
| setToBitxor | setToAbs | setToAcos | setToAcosh |
| setToAsin | setToAsinh | setToAtan | setToAtan2 |
| setToAtanh | setToCbrt | setToCeil | setToClz32 |
| setToCos | setToCosh | setToExp | setToExpm1 |
| setToFloor | setToFround | setToHypot | setToImul |
| setToLog | setToLog10 | setToLog1p | setToLog2 |
| setToMax | setToMin | setToPow | setToRandom |
| setToRound | setToSign | setToSin | setToSinh |
| setToSqrt | setToTan | setToTanh | setToTrunc |

_**value**_
> value is an `MDArray`, `Array`, or value.
>
> if value is an MDArray of same dimensionality of the calling MDArray, then operation is applied to the element
>
> if value is an MDArray of smaller dimensionality, the higher dimensionalities are ignored, resulting in repeated use of each element
> 
> if value is an MDArray of greater dimensionality, the sub-MDArray is passed to the operator
>
> if value is an Array, it is treated identially to an `MDArray.dimension=1`,  resulting in repeated use of each element along the final dimension.
>
> otherwise value is used in the per-element operation directly.


## MDArray.prototype.applyReflexiveOperation( f, [ mdarray | array | value ]* ) 



# Not yet implemented

## MDArray.prototype.splice( ... )


-----------------------------
# Static class methods	
	
## Element-By-Element Operators

### MDArray[ operation ] ( [ value ]* )

_**operation**_

Operation is one of:

| - | - | - | - |
| --- | --- | --- | --- |
| add | sub | mul | div |
| mod | and | or | eq |
| ne | neq | lt | lte |
| gt | gte | bitand | bitor |
| bitxor | abs | acos | acosh |
| asin | asinh | atan | atan2 |
| atanh | cbrt | ceil | clz32 |
| cos | cosh | exp | expm1 |
| floor | fround | hypot | imul |
| log | log10 | log1p | log2 |
| max | min | pow | random |
| round | sign | sin | sinh |
| sqrt | tan | tanh | trunc |


_**value**_
> value is an `MDArray`, `Array`, or value.
>
> if value is an MDArray of same dimensionality of the calling MDArray, then operation is applied to the element
>
> if value is an MDArray of smaller dimensionality, the higher dimensionalities are ignored, resulting in repeated use of each element
>
> if value is an Array, it is treated identially to an `MDArray.dimension=1`,  resulting in repeated use of each element along the final dimension.
> otherwise value is used in the per-element operation directly.

_**returns**_
> Returns an MDArray containing the element-by-element result of the operation. 
> For each of the above operations, the size of the result is determined by the MDArray argument with the highest dimension.

e.g.

```javascript
	const mTwos = new MDArray(1,2,3).fill(2);
	const mSevens = MDArray.sub(9, mTwos);
```

### MDArray.applyOperation( f, [ mdarray | array | value ]* ) 


# Looping

## MDArray.loop( range[, range]* )

each argument is treated as a range over which a multidimensional iteration is done.

_**range**_	
> the range can be a number, pair, or triplet.
> In the case of a number the range is assumed to be 0 to number with step of 1.
> In the case of a pair the range is assumed to be pair[0] to pair[1] with step of 1.
> In the case of a triplet the range is assumed to be pair[0] to pair[2] with step of pair[1];

Example:

```javascript
	for ( const index of MDArray.loop( 3, [ 1, 4 ], [-1, -2, -5 ], )){
		console.log("\t\t\t",index);
	}
```

> output  
> ```
>			 [ 0, 1, -1 ]  
>			 [ 0, 1, -3 ]  
>			 [ 0, 2, -1 ]  
>			 [ 0, 2, -3 ]  
>			 [ 0, 3, -1 ]  
>			 [ 0, 3, -3 ]  
>			 [ 1, 1, -1 ]  
>			 [ 1, 1, -3 ]  
>			 [ 1, 2, -1 ]  
>			 [ 1, 2, -3 ]  
>			 [ 1, 3, -1 ]  
>			 [ 1, 3, -3 ]  
>			 [ 2, 1, -1 ]  
>			 [ 2, 1, -3 ]  
>			 [ 2, 2, -1 ]  
>			 [ 2, 2, -3 ]  
>			 [ 2, 3, -1 ]  
>			 [ 2, 3, -3 ]  
> ```

## MDArray.loop( mdarray )
_**mdarray**_

if an `MDArray` is provided, the loop is over every element




## MDArray.loopAround( <index>[, <radius = 1>] )

iterates over the neighborhood of size radius surrounding, but not including, the indexed point. e.g.:

```javascript
	for ( const index of MDArray.loopAround( [3,4], 1 )){
		console.log("\t\t\t",index);
	}
```

> output  
> ```
>			 [ 2, 3 ]  
>			 [ 2, 4 ]  
>			 [ 2, 5 ]  
>			 [ 3, 3 ]  
>			 [ 3, 5 ]  <--- notice [3, 4] does not appear  
>			 [ 4, 3 ]  
>			 [ 4, 4 ]  
>			 [ 4, 5 ]  
> ```
	
## MDArray.loopUpDown( <index>[, <radius = 1>] )

loops along each dimension separately, within the provided radius, e.g.:

```javascript
	for ( const index of MDArray.loopUpDown( [3,4], 2 )){
		console.log("\t\t\t",index);
	}
```
	
> output
> ```
>			 [ 1, 4 ] // loop 2 before in dimension 0  
>			 [ 2, 4 ]  
>			 [ 4, 4 ] // loop 2 after in dimension 0  
>			 [ 5, 4 ]  
>			 [ 3, 2 ] // loop 2 before in dimension 1  
>			 [ 3, 3 ]  
>			 [ 3, 5 ] // loop 2 after in dimension 1  
>			 [ 3, 6 ]  
> ```

