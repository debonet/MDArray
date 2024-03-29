	
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
function fbIsString( x ){
	return ( typeof x === 'string' || x instanceof String );
}

D=console.log;
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
function fbIsNumber( x ){
	try{
		return ! isNaN( x );
	}
	catch( e ){
		return false;
	}
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
class MDArray extends Array{
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	constructor( ...vx ){

		// new MDArray( <mdarray> )
		if ( MDArray.isMDArray( vx[ 0 ])){
			return vx[ 0 ];
		}

		// new MDArray()
		if ( vx.length === 0 ){
			super();
			Object.defineProperty(this, 'dimensions', { value : 0 });
		}
		// new MDArray( <array> )
		else if ( Array.isArray( vx[ 0 ])){
			let v = vx[ 0 ];
			super( v.length );
			for ( let n = 0; n < v.length; n ++ ){
				if ( Array.isArray( v[ n ])){
					this[ n ] = new MDArray( v[ n ]);
					Object.defineProperty(
						this, 'dimensions',	{ value : this[ 0 ].dimensions + 1 }
					);
				}
				else{
					this[ n ] = v[ n ];
					Object.defineProperty(this, 'dimensions', { value : 1 });
				}					
			}
		}
		// new MDArray ( <number> )
		else if ( vx.length === 1 ){
			super( vx[ 0 ]);
			Object.defineProperty(this, 'dimensions', { value : 1 });
		}
		// new MDArray ( <number>, <number>+ )
		else{
			super( vx[ 0 ]);
			for ( let n = 0; n < vx[ 0 ]; n ++ ){
				this[ n ] = new MDArray( ...vx.slice( 1 ));
			}
			Object.defineProperty(
				this, 'dimensions',	{ value : this[ 0 ].dimensions + 1 }
			);
		}

	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	toString(){
		return this.#fsStringify();
	}
	
	#fsStringify( sPrefix="  " ){
		const c = this.length;
		const cDims = this.dimensions;
		let s = "";

		let sSep = cDims > 1 ? ",\n" : ", ";
	
		if (cDims > 1){
			s += "[ ",
			s += this[0].#fsStringify(sPrefix+"  ") + sSep;
			for ( let n = 1 ; n < c-1 ; n ++ ){
				s += sPrefix + this[n].#fsStringify(sPrefix+ "  ") + sSep;
			}
			s += sPrefix + this[c-1].#fsStringify(sPrefix + "  ");
			s += " ]";
		}
		else{
			s+= "[ ";
			for ( let n = 0 ; n < c-1 ; n ++ ){
				s += this[n] + sSep;
			}
			s += this[c-1];
			s += " ]";
		}
		
		return s;
	}
	
	
	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	* [ Symbol.iterator ](){
		for ( const nm of this.loop()){
			yield this.get( nm );
		}
	}
	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	get size() {
		const c = this.dimensions;
		const size = new MDArray( c );
		let m = this;
		for ( let n = 0; n<c; n++ ){
			size[ n ] = m.length;
			m = m[ 0 ];
		}
		return size;
	}	

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	static isMDArray( x ){
		return (
			x
				&& typeof( x ) === 'object'
				&& (
					x.constructor.name === "MDArray"
						|| x.constructor.name === "MDArrayProxify"
				)
		);
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	forEach( f ){
		const m = this;
		for ( const nm of this.loop() ){
			f( m.get( nm ), nm, m );
		}
		return this;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	fill( x ){
		for ( let nm of this.loop() ){
			this.set( nm, x );
		}
		return this;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	find( fb ){
		for ( let nm of this.loop() ){
			const x = this.get( nm );
			if ( fb( x )){
				return x;
			}
		}
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	every( fb ){
		for ( let nm of this.loop() ){
			const x = this.get( nm );
			if ( ! fb( x )){
				return false;
			}
		}
		return true;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	includes( x ){
		for ( let nm of this.loop() ){
			if ( this.get( nm ) == x ){
				return true;
			}
		}
		return false;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	indexOf( xTest ){
		for ( let nm of this.loop() ){
			const x = this.get( nm );
			if ( x == xTest ){
				return nm;
			}
		}
		return new Array( this.dimensions ).fill( - 1 );
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	findIndex( fb ){
		for ( const nm of this.loop() ){
			const x = this.get( nm );
			if ( fb( x )){
				return nm;
			}
		}
		return new Array( this.dimensions ).fill( - 1 );
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	makeCopy(){
		const m = new MDArray( ...this.size);
		for ( let nm of this.loop() ){
			m.set( nm, this.get( nm ));
		}
		return m;
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	join( vs = [ ', ' ]){
		if ( fbIsString( vs )){
			vs = vs.split( '' );
		}

		let vsJoined = []
		if ( this.dimensions > 1 ){
			for ( let n = 0; n < this.length; n ++ ){
				vsJoined.push( this[ n ].join( vs.slice( 1 )));
			}
		}
		else{
			vsJoined = this;
		}
		return Array.prototype.join.call( vsJoined, vs[ 0 ]);
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	get( nm ){
		if ( nm.length > this.dimensions ){
			return undefined;
		}

		const c = nm.length;

		let x = this;
		for ( let n=0; n<c; n++ ){
			if (!x){
				return undefined;
			}
			x = x[ nm[ n ]];
		}
		return x;
			
	}
	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	set( nm, xVal ){
		if ( nm.length > this.dimensions ){
			return xVal;
		}

		const c = nm.length;

		let x = this;
		for ( let n=0; n<c-1; n++ ){
			if (!x){
				return xVal;
			}
			x = x[ nm[ n ]];
		}
		if (!x){
			return xVal;
		}
		if ( nm[ c - 1] < 0 || nm[ c - 1] >= x.length ){
			return xVal;
		}		
		x[ nm[ c-1 ]] = xVal;
		return xVal;
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	map( f ){
		const mNew = new MDArray( ...this.size);
		
		for ( const nm of this.loop() ){
			mNew.set( nm, f( this.get( nm ), nm, this ));
		}
		return mNew;
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	reduce( f, xOut = 0 ){
		for ( const nm of this.loop() ){
			xOut = f( xOut, this.get( nm ));
		}
		return xOut;
	}

	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	slice( vnStart, vnEnd ){
		let nStart, nEnd, vnStartNext, vnEndNext;
		
		if (Array.isArray( vnStart )){
			nStart = vnStart[ 0 ] ?? 0;
			vnStartNext = vnStart.slice( 1 );
		}
		else{
			nStart = vnStart ?? 0;
			vnStartNext = vnStart;
		}

		if (Array.isArray( vnEnd )){
			nEnd = vnEnd[ 0 ] ?? this.length;
			vnEndNext = vnEnd.slice( 1 );
		}
		else{
			nEnd = vnEnd ?? this.length;
			vnEndNext = vnEnd;
		}
		
		const v = new Array(nEnd - nStart);

		if (this.dimensions > 1){
			for ( let n = nStart; n < nEnd; n ++ ){
				v[ n - nStart ] = this[ n ].slice( vnStartNext, vnEndNext );
			}
		}
		else{
			for ( let n = nStart; n < nEnd; n ++ ){
				v[ n - nStart ] = this[ n ];
			}
		}
		return new MDArray( v );
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	*loop(){
		yield* MDArray.loop( this );
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	keys(){
		const vOut = [];
		for ( const nm of this.loop()){
			vOut.push( nm );
		}
		return vOut;
	}

	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	static easy = class {
		constructor (...vx){
			const m = new MDArray( ...vx );
			if (m.hasOwnProperty('raw')){
				return m;
			}
			Object.defineProperty(m, 'raw', { value : m });
			return new Proxy( m, MDArray.handler );
		}
	}
		
	static handler = {
		// -----------------------------------------------------
		// -----------------------------------------------------
		get: function( xTarget, xIndex ){
			//D("getting", xIndex);

			// handle symbols below
			if (typeof(xIndex) != 'symbol'){
				
				// lists of numbers
				const vx = xIndex[0]=='['
							? xIndex.substr(1,xIndex.length-2).split(',')
							: xIndex.split( ',' );
				if ( vx.length > 1 ){
					const vn = vx.map( ( x ) => parseInt( x ) );
					return xTarget.get( vn );
				}

				// numbers
				const n = parseInt( xIndex );
				if (!isNaN( n )){
					if ( n < 0 || n >= xTarget.length ){
						if ( xTarget.dimensions <= 1 ){
							return undefined;
						}
						return new MDArray();
					}
					
					return xTarget[ n ];
				}
			}
			
			let x = xTarget[ xIndex ];

			// functions
			if (x instanceof Function){
				return function MDArrayProxify (...vx) {
					const xResult = x.bind( xTarget.raw )( ...vx );
					if ( MDArray.isMDArray( xResult )){
						Object.defineProperty( xResult, 'raw', { value : xResult });
						return new Proxy( xResult, MDArray.handler );
					}

					return xResult;
				}
			}
			
			// getters that return an MDArray, except for raw!
			if ( MDArray.isMDArray( x ) && xIndex != 'raw' ){
				Object.defineProperty( x, 'raw', { value : x });
				return new Proxy( x, MDArray.handler );
			}

			// anything else
			return x;
		},
		// -----------------------------------------------------
		// -----------------------------------------------------
		set: function( xTarget, xIndex, xVal ){
			//D("setting", xIndex, xVal);

			// handle symbols below
			if (typeof(xIndex) != 'symbol'){
				// lists of numbers
				const vx = xIndex[0]=='['
							? xIndex.substr(1,xIndex.length-2).split(',')
							: xIndex.split( ',' );
				if ( vx.length > 1 ){
					const vn = vx.map( ( x ) => parseInt( x ) );
					xTarget.set( vn, xVal );
					return true;
				}

				// numbers
				const n = parseInt( xIndex );
				if (!isNaN( n )){
					if ( n < 0 || n >= xTarget.length ){
						// fail silently
						return true;
					}
					xTarget[ n ] = xVal;
					return true;
				}
			}
			

			xTarget[ xIndex ] = xVal;
			return true;
		}
	}




	// -----------------------------------------------------------
	// -----------------------------------------------------------
	static #applyOperation_internal( fOp, size, ...vx ){
		const c = size[ 0 ];
		const m = new MDArray( ...size );
		
		if ( size.length > 1 ){
			for ( let n = 0; n < c; n ++ ){
				const vxNext = vx.map(( x ) => (
					( MDArray.isMDArray( x ) && c == x.length )
						? x[ n ]
						: x
				));
				m[ n ] = MDArray.#applyOperation_internal(
					fOp, size.slice( 1 ), ...vxNext
				);
			}
		}
		else{
			for ( let n = 0; n < c; n ++ ){
				const vxNext = vx.map(( x ) => (
					( Array.isArray( x ) || MDArray.isMDArray( x ))
						? x[ n ]
						: x
				));
				m[ n ] = fOp( ...vxNext );
			}
		}

		return m; 
	}
														 
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	static applyOperation( fOp, ...vx ){
		let m = undefined;
		let cDimMax = -1;
		const c = vx.length;
		
		for ( let n = 0 ; n < c; n++ ){
			if (
				MDArray.isMDArray( vx[ n ])
					&& cDimMax < vx[ n ].dimensions
			){
				cDimMax = vx[ n ].dimensions;
				m = vx[ n ];
			}
		}
		
		if (!m){
			throw( "at least one argument must be a MDArray" );
		}
		
		return MDArray.#applyOperation_internal(
			fOp, m.size, ...vx
		);
	}


	// -----------------------------------------------------------
	// -----------------------------------------------------------
	applyReflexiveOperation( fOp, ...vx ){
		const c = this.length;

		if ( this.dimensions > 1 ){
			for ( let n = 0; n < c; n ++ ){
				const vxNext = vx.map(( x ) => (
					( MDArray.isMDArray( x ) && c == x.length )
						? x[ n ]
						: x
				));
				this[ n ].applyOperation( fOp, ...vxNext );
			}
		}
		else{
			for ( let n = 0; n < c; n ++ ){
				const vxNext = vx.map(( x ) => (
					( Array.isArray( x ) || MDArray.isMDArray( x ))
						? x[ n ]
						: x
				));
				this[ n ] = fOp( this[ n ], ...vxNext );
			}
		}
		
		return this;
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	applyOperation( fOp, ...vx ){
		return MDArray.#applyOperation_internal(
			fOp, this.size, this, ...vx
		);
	}

};
	
// -----------------------------------------------------------
// Operations
// -----------------------------------------------------------
const afOperations = {
	"add" : ( ...vx ) => vx.reduce((x1, x2)=>x1 + x2),
	"sub" : ( ...vx ) => vx.reduce((x1, x2)=>x1 - x2),
	"mul" : ( ...vx ) => vx.reduce((x1, x2)=>x1 * x2),
	"div" : ( ...vx ) => vx.reduce((x1, x2)=>x1 / x2),
	"mod" : ( ...vx ) => vx.reduce((x1, x2)=>x1 % x2),
	"and" : ( ...vx ) => vx.reduce((x1, x2)=>x1 && x2),
	"or" : ( ...vx ) => vx.reduce((x1, x2)=>x1 || x2),
	"eq" : ( ...vx ) => vx.reduce((x1, x2)=>x1 == x2),
	"ne" : ( ...vx ) => vx.reduce((x1, x2)=>x1 != x2),
	"neq" : ( ...vx ) => vx.reduce((x1, x2)=>x1 != x2),
	"lt" : ( ...vx ) => vx.reduce((x1, x2)=>x1 < x2),
	"lte" : ( ...vx ) => vx.reduce((x1, x2)=>x1 <= x2),
	"gt" : ( ...vx ) => vx.reduce((x1, x2)=>x1 > x2),
	"gte" : ( ...vx ) => vx.reduce((x1, x2)=>x1 >= x2),
	"bitand" : ( ...vx ) => vx.reduce((x1, x2)=>x1 & x2),
	"bitor" : ( ...vx ) => vx.reduce((x1, x2)=>x1 | x2),
	"bitxor" : ( ...vx ) => vx.reduce((x1, x2)=>x1 ^ x2),
	"abs" : Math.abs,
	"acos" : Math.acos,
	"acosh" : Math.acosh,
	"asin" : Math.asin,
	"asinh" : Math.asinh,
	"atan" : Math.atan,
	"atan2" : Math.atan2,
	"atanh" : Math.atanh,
	"cbrt" : Math.cbrt,
	"ceil" : Math.ceil,
	"clz32" : Math.clz32,
	"cos" : Math.cos,
	"cosh" : Math.cosh,
	"exp" : Math.exp,
	"expm1" : Math.expm1,
	"floor" : Math.floor,
	"fround" : Math.fround,
	"hypot" : Math.hypot,
	"imul" : Math.imul,
	"log" : Math.log,
	"log10" : Math.log10,
	"log1p" : Math.log1p,
	"log2" : Math.log2,
	"max" : Math.max,
	"min" : Math.min,
	"pow" : Math.pow,
	"random" : Math.random,
	"round" : Math.round,
	"sign" : Math.sign,
	"sin" : Math.sin,
	"sinh" : Math.sinh,
	"sqrt" : Math.sqrt,
	"tan" : Math.tan,
	"tanh" : Math.tanh,
	"trunc" : Math.trunc,
};

const afReductions = {
	"maxElt" : ( ...vx ) => MDArray.max(...vx).reduce(Math.max),
	"minElt" : ( ...vx ) => MDArray.min(...vx).reduce(Math.min),
	"sumUp" : ( m ) => m.reduce((x1, x2)=>x1+x2),
	"dot" : ( m1, m2 ) => MDArray.sumUp(MDArray.mul(m1, m2)),
	"dist" : ( m1, m2 ) => Math.sqrt(
		MDArray.sumUp(MDArray.pow(MDArray.sub(m1, m2), 2))
	),
	"norm" : ( m ) => Math.sqrt( MDArray.sumUp( MDArray.pow( m, 2 )) ),
	"cityDist" : ( m1, m2 ) => MDArray.sumUp(MDArray.abs(MDArray.sub(m1, m2))),
}

// attach operations to the objects
for ( const sOp in afOperations ){
	const fOp = afOperations[ sOp ];

	// static class method
	MDArray[ sOp ] = MDArray.applyOperation.bind(	null, fOp	);

	// static class method on proxy object
	MDArray.easy[ sOp ] = MDArray.applyOperation.bind( null, fOp );

	// operator on prototype
	MDArray.prototype[ sOp ] = function ( ...vx ) {
		return this.applyOperation( fOp, ...vx	);
	};

	// reflexive operator on prototype
	const sReflexive = 'setTo' + sOp[0].toUpperCase() + sOp.substr(1);
	MDArray.prototype[ sReflexive ] = function ( ...vx ) {
		return this.applyReflexiveOperation( fOp, ...vx );
	};
}

// attach reductions to the objects
for ( const sf in afReductions ){
	const f = afReductions[ sf ];
	
	// static class method
	MDArray[ sf ] = f;

	// static class method on proxy
	MDArray.easy[ sf ] = f;

	// method on prototype
	MDArray.prototype[ sf ] = function ( ...vx ) {
		return f.call( null, this, ...vx );
	}
}
	
	
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
MDArray.loop = MDArray.easy.loop = function* loop( ...vx ){
	
	let vtRange = [];
	if ( MDArray.isMDArray( vx[ 0 ])){
		const size = vx[ 0 ].size;
		const c = size.length;
		for ( let n = 0; n < c; n ++ ){
			vtRange.push( [ 0, 1, size[ n ]]);
		}
	}
	else{
		const c = vx.length;
		for ( let n = 0 ; n < c; n++ ){
			if ( ! Array.isArray( vx[ n ])){
				vtRange[ n ] = [ 0, 1, vx[ n ]];
			}
			else if (vx[ n ].length == 2){
				vtRange[ n ] = [ vx[ n ][0], 1, vx[ n ][1]];
			}
			else if (vx[ n ].length == 3){
				vtRange[ n ] = vx[ n ];
			}
			else{
				throw("unknown range specification. Must be <number>|<pair>|<triplet>");
			}
		}
	}
	
	yield* loopInner( vtRange );
	
	function* loopInner( vtRange ){
		const tRange = vtRange[ 0 ];
		
		// these put the if's on the outside for efficiency
		if ( vtRange.length > 1 ){
			if (tRange[ 0 ] < tRange[ 2 ]){
				for ( let n = tRange[ 0 ]; n < tRange[ 2 ]; n += tRange[ 1 ] ){
					for ( const xSub of loopInner( vtRange.slice( 1 ))){
						yield new MDArray([ n, ...xSub ]);
					}
				}
			}
			else{
				for ( let n = tRange[ 0 ]; n > tRange[ 2 ]; n += tRange[ 1 ] ){
					for ( const xSub of loopInner( vtRange.slice( 1 ))){
						yield new MDArray([ n, ...xSub ]);
					}
				}
			}
		}
		else{
			if (tRange[ 0 ] < tRange[ 2 ]){
				for ( let n = tRange[ 0 ]; n < tRange[ 2 ]; n += tRange[ 1 ] ){
					yield new MDArray([ n ]);
				}
			}
			else{
				for ( let n = tRange[ 0 ]; n > tRange[ 2 ]; n += tRange[ 1 ] ){
					yield new MDArray([ n ]);
				}
			}
		}
	}
	
}


// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// loop around a point nm
//
// e.g. in 2D, with radius 2
//
// #####
// #####
// ##.##
// #####
// #####
//
MDArray.loopAround = 
MDArray.easy.loopAround = function* loopAround( nm, d = 1 ){
	let vnc = new Array( nm.length ).fill([ - d, d + 1 ]);

	for ( dnm of MDArray.loop( ...vnc )){
		if ( ! dnm.every(( n ) => n == 0 )){

			yield nm.map(( x, nmPos ) => x + dnm[ nmPos[ 0 ]]);
		}
	}
}
	
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// loop up and down on each axis around a point
//
// e.g. in 2D, with radius 2
//
// ..#..
// ..#..
// ##.##
// ..#..
// ..#..
//
MDArray.loopUpDown =
MDArray.easy.loopUpDown = function *loopUpDown( nm, dIn = 1 ){
	const c = nm.length;
	for ( let n = 0; n < c; n ++ ){
		for ( let d =- dIn; d <= dIn; d ++ ){
			if ( d != 0 ){
				yield new MDArray([ ...nm.slice( 0, n ), nm[ n ] + d, ...nm.slice( n + 1 )]);
			}
		}
	}
}
	


module.exports = MDArray.easy;

