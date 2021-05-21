const MDArray = require ( "../src/MDArray.js" );


test("MDArray.map(...) : index", () => {
	const m = new MDArray(2,3,4).fill(7);

	const v=[];
	m.map((x, index)=>{
		v.push( index );
	});
	
	expect(v).toStrictEqual([
		[ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 0, 2 ], [ 0, 0, 3 ],
		[ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 1, 2 ], [ 0, 1, 3 ],
		[ 0, 2, 0 ], [ 0, 2, 1 ], [ 0, 2, 2 ], [ 0, 2, 3 ],

		[ 1, 0, 0 ], [ 1, 0, 1 ], [ 1, 0, 2 ], [ 1, 0, 3 ],
		[ 1, 1, 0 ], [ 1, 1, 1 ], [ 1, 1, 2 ], [ 1, 1, 3 ],
		[ 1, 2, 0 ], [ 1, 2, 1 ], [ 1, 2, 2 ], [ 1, 2, 3 ],
	]);
});

		 
test("MDArray.map(...) : values", () => {
	const m = new MDArray(2,3,4);

	m.map((x, index)=>{
		m[ index ] = index.join( '' );
	});
	
	m.map(( x, index ) => {
		expect( m[ index ]).toBe( index.join('') );
	});
});

test("MDArray.map(...) : raw", () => {
	const m = new MDArray(2,3,4);
	m.map((x, index)=>{
		m[ index ] = index.join( '' );
	});

	m.map(( x, index, mRaw ) => {
		expect( mRaw.get( index )).toBe( index.join('') );
		expect( mRaw[ index ]).toBe( undefined );
	});
});

test("MDArray.map(...) : return", () => {
	const m = new MDArray(2,3,4);
	expect( m.map(( x, index, mRaw ) => {
		return index.join('-')
	}).toString()).toBe([
		"[ [ [ 0-0-0, 0-0-1, 0-0-2, 0-0-3 ],",
    "    [ 0-1-0, 0-1-1, 0-1-2, 0-1-3 ],",
    "    [ 0-2-0, 0-2-1, 0-2-2, 0-2-3 ] ],",
    "  [ [ 1-0-0, 1-0-1, 1-0-2, 1-0-3 ],",
    "    [ 1-1-0, 1-1-1, 1-1-2, 1-1-3 ],",
    "    [ 1-2-0, 1-2-1, 1-2-2, 1-2-3 ] ] ]"
	].join('\n'));
});
