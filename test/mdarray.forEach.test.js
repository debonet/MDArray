const MDArray = require ( "../src/MDArray.js" );


test("MDArray.forEach(...) : index", () => {
	const m = new MDArray(2,3,4).fill(7);

	const v=[];
	m.forEach((x, index)=>{
		v.push( index );
	});
	
	expect(v).toEqual([
		[ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 0, 2 ], [ 0, 0, 3 ],
		[ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 1, 2 ], [ 0, 1, 3 ],
		[ 0, 2, 0 ], [ 0, 2, 1 ], [ 0, 2, 2 ], [ 0, 2, 3 ],

		[ 1, 0, 0 ], [ 1, 0, 1 ], [ 1, 0, 2 ], [ 1, 0, 3 ],
		[ 1, 1, 0 ], [ 1, 1, 1 ], [ 1, 1, 2 ], [ 1, 1, 3 ],
		[ 1, 2, 0 ], [ 1, 2, 1 ], [ 1, 2, 2 ], [ 1, 2, 3 ],
	]);
});

		 
test("MDArray.forEach(...) : values", () => {
	const m = new MDArray(2,3,4);

	m.forEach((x, index)=>{
		m[ index ] = index.join( '' );
	});
	
	m.forEach(( x, index ) => {
		expect( m[ index ]).toBe( index.join('') );
	});
});

test("MDArray.forEach(...) : raw", () => {
	const m = new MDArray(2,3,4);
	m.forEach((x, index)=>{
		m[ index ] = index.join( '' );
	});

	m.forEach(( x, index, mRaw ) => {
		expect( mRaw.get( index )).toBe( index.join('') );
		expect( mRaw[ index ]).toBe( undefined );
	});
});

