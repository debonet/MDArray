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
		if ( this.dimensions <= 1 ){
			const c = this.length;
			for ( let n = 0; n < c; n ++ ){
				yield [ n ];
			}
		}
		else{
			const c = this.length;
			for ( let n = 0; n < c; n ++ ){
				for ( let m of this[ n ]){
					m.unshift( n );
					yield m;
				}
			}
		}
	}	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	get size() {
		if ( this.dimensions <= 1 ){
			return [ this.length ];
		}
		else{
			return [ this.length, ...this[ 0 ].size ];
		}
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
		for ( const nm of this ){
			f( m.get( nm ), nm, m );
		}
		return this;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	fill( x ){
		for ( let nm of this ){
			this.set( nm, x );
		}
		return this;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	find( fb ){
		for ( let nm of this ){
			const x = this.get( nm );
			if ( fb( x )){
				return x;
			}
		}
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	every( fb ){
		for ( let nm of this ){
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
		for ( let nm of this ){
			if ( this.get( nm ) == x ){
				return true;
			}
		}
		return false;
	}
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	indexOf( xTest ){
		for ( let nm of this ){
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
		for ( const nm of this ){
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
		for ( let nm of this ){
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
		x[ nm[ c-1 ]] = xVal;
		return xVal;
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	map( f ){
		const mNew = new MDArray( ...this.size);
		for ( const nm of this ){
			mNew.set( nm, f( this.get( nm ), nm, this ));
		}
		return mNew;
	}

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	reduce( f, xOut = 0 ){
		for ( const nm of this ){
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
	* loop (){
		yield* MDArray.loop(this);
	}

	
	// -----------------------------------------------------------
	// -----------------------------------------------------------
	static easy = class {
		constructor (...vx){
			const m = new MDArray( ...vx );
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
				const vx = xIndex.split( ',' );
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

			// attached operators on the fly
			if ( !x && typeof( xIndex ) == 'string' ){
				// operators
				if ( xIndex in MDArray.#afOperations ){
					x = xTarget.applyOperation.bind(
						xTarget, MDArray.#afOperations[ xIndex ]
					);
				}
				// reflexive operators
				else if ( xIndex.substr( 0, 5 ) == 'setTo' ){
					const sOp = xIndex[ 5 ].toLowerCase() + xIndex.substr( 6 );
					if ( sOp in MDArray.#afOperations ){
						x = xTarget.applyReflexiveOperation.bind(
							xTarget, MDArray.#afOperations[ sOp ]
						);
					}
				}
			}
			
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
				const vx = xIndex.split( ',' );
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
	// Operations
	// -----------------------------------------------------------
	static #afOperations = {
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
		
		for ( const n in vx ){
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

	// -----------------------------------------------------------
	// -----------------------------------------------------------
	static #_initialize = (()=>{
		for ( const sOp in MDArray.#afOperations ){
			MDArray[ sOp ] = MDArray.applyOperation.bind(
				null, MDArray.#afOperations[ sOp ]
			);
			MDArray.easy[ sOp ] = MDArray.applyOperation.bind(
				null, MDArray.#afOperations[ sOp ]
			);
		}
	})();

	
};
	

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
MDArray.Range = MDArray.easy.Range = class extends Array {
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
MDArray.loop = MDArray.easy.loop = function* loop( ...vx ){
	let vtRange;
		
	if (! (vx[0] instanceof MDArray.Range)){
		if ( MDArray.isMDArray( vx[ 0 ])){
			vx = vx[ 0 ].size;
		}

		vtRange = new MDArray.Range();
		for (const n in vx){
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
	else{
		vtRange = vx[ 0 ];
	}

	// these put the if's on the outside for efficiency
	if ( vtRange.length > 1 ){
		if (vtRange[ 0 ][ 0 ] < vtRange[ 0 ][ 2 ]){
			for ( let n = vtRange[ 0 ][ 0 ]; n < vtRange[ 0 ][ 2 ]; n += vtRange[ 0 ][ 1 ] ){
				for ( const xSub of MDArray.loop( vtRange.slice( 1 ))){
					yield [ n, ...xSub ];
				}
			}
		}
		else{
			for ( let n = vtRange[ 0 ][ 0 ]; n > vtRange[ 0 ][ 2 ]; n += vtRange[ 0 ][ 1 ] ){
				for ( const xSub of MDArray.loop( vtRange.slice( 1 ))){
					yield [ n, ...xSub ];
				}
			}
		}
	}
	else{
		if (vtRange[ 0 ][ 0 ] < vtRange[ 0 ][ 2 ]){
			for ( let n = vtRange[ 0 ][ 0 ]; n < vtRange[ 0 ][ 2 ]; n += vtRange[ 0 ][ 1 ] ){
				yield [ n ];
			}
		}
		else{
			for ( let n = vtRange[ 0 ][ 0 ]; n > vtRange[ 0 ][ 2 ]; n += vtRange[ 0 ][ 1 ] ){
				yield [ n ];
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

			yield nm.map(( x, n ) => x + dnm[ n ]);
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
				yield [ ...nm.slice( 0, n ), nm[ n ] + d, ...nm.slice( n + 1 )];
			}
		}
	}
}
	


module.exports = MDArray.easy;

