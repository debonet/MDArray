const MDArray = require ( "../src/MDArray.js" );

test("ensure arrays are created", () => {
	const m = new MDArray(2);
	expect(m.toString()).toBe([
		"[ undefined, undefined ]"
	].join('\n'));
														
});

test("ensure empty arrays are created", () => {
	const m = new MDArray(2,2);
	expect(m.toString()).toBe([
		"[ [ undefined, undefined ],",
		"  [ undefined, undefined ] ]"
	].join('\n'));
});

test("2D arrays fill properly", () => {
	const m = new MDArray(2,2).fill(0);
	expect(m.toString()).toBe([
		"[ [ 0, 0 ],",
		"  [ 0, 0 ] ]"
	].join('\n'));
});


test("3D arrays fill properly", () => {
	const m = new MDArray(2,3,4).fill(3);
	expect(m.toString()).toBe([
    "[ [ [ 3, 3, 3, 3 ],",
    "    [ 3, 3, 3, 3 ],",
    "    [ 3, 3, 3, 3 ] ],", 
    "  [ [ 3, 3, 3, 3 ],", 
    "    [ 3, 3, 3, 3 ],", 
    "    [ 3, 3, 3, 3 ] ] ]" 
	].join('\n'));
});

test("MDArray.get(<array>)", () => {
	const m = new MDArray(2,3,4).fill(5);
	expect(m.get([ 1, 2, 3 ])).toBe(5);
});

test("MDArray[<array>]", () => {
	const m = new MDArray(2,3,4).fill(5);
	expect(m[[ 1, 2, 3 ]]).toBe(5);
});


test("MDArray[<number>]", () => {
	const m = new MDArray( 2, 3, 4 );
	
	expect( m[[ 1 ]].size ).toStrictEqual([3,4]);
});

test("MDArray subspacing", () => {
	const m = new MDArray(2,3,4).fill( 0 );
	m[[ 1 ]].fill( 1 )
	
	expect(m.toString()).toBe([
    "[ [ [ 0, 0, 0, 0 ],",
    "    [ 0, 0, 0, 0 ],",
    "    [ 0, 0, 0, 0 ] ],", 
    "  [ [ 1, 1, 1, 1 ],", 
    "    [ 1, 1, 1, 1 ],", 
    "    [ 1, 1, 1, 1 ] ] ]" 
	].join('\n'));
});


test("MDArray looping", () => {
	const m = new MDArray(2,3,4);

	const v=[];
	for (const index of m ){
		v.push(index);
	}
	
	expect(v).toStrictEqual([
		[ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 0, 2 ], [ 0, 0, 3 ],
		[ 0, 1, 0 ], [ 0, 1, 1 ], [ 0, 1, 2 ], [ 0, 1, 3 ],
		[ 0, 2, 0 ], [ 0, 2, 1 ], [ 0, 2, 2 ], [ 0, 2, 3 ],

		[ 1, 0, 0 ], [ 1, 0, 1 ], [ 1, 0, 2 ], [ 1, 0, 3 ],
		[ 1, 1, 0 ], [ 1, 1, 1 ], [ 1, 1, 2 ], [ 1, 1, 3 ],
		[ 1, 2, 0 ], [ 1, 2, 1 ], [ 1, 2, 2 ], [ 1, 2, 3 ],
	]);
		 
});

