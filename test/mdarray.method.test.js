const MDArray = require ( "../src/MDArray.js" );


[
	'toString',
  'constructor',
  'every',
  'fill',
  'find',
  'findIndex',
  'forEach',
  'get',
  'includes',
  'indexOf',
  'join',
  'loop',
  'makeCopy',
  'map',
  'set',
  'size',
]

test("MDArray.size", () => {
	const m = new MDArray( 2, 3, 4, 5, 6 );
	expect(m.size).toStrictEqual([ 2, 3, 4, 5, 6 ]);
});

test("MDArray.length()", () => {
	const m = new MDArray(2,3,4,5,6);
	expect(m.length).toBe(2);
});

test("MDArray.every()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	m[[1,1,3,4,5]] = "needle";
	
	expect( m.every((s) => s=="haystack") ).toBe(false);
	expect( m.every((s) => s=="needle") ).toBe(false);
	expect( m.every((s) => s!="cobras") ).toBe(true);
});


test("MDArray.find()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	
	m[[1,1,3,4,5]] = "needle";
	m[[1,1,1,1,1]] = "dweedle";
	
	expect( m.find((s) => s=="haystack") ).toBe("haystack");
	expect( m.find((s) => s=="needle") ).toBe("needle");
	expect( m.find((s) => s=="dweedle") ).toBe("dweedle");
	expect( m.find((s) => s=="cobras") ).toBe(undefined);
});

test("MDArray.findIndex()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	
	m[[1,1,1,1,1]] = "dweedle";
	m[[1,1,3,4,5]] = "needle";

	const index = m.findIndex((s)=>s==="needle");
	expect( index ).toStrictEqual([ 1, 1, 3, 4, 5 ]);
});

test("MDArray.get()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	m[[1,2,3,4,5]] = "needle";
	
	expect( m.get([1,2,3,4,5]) ).toBe("needle");
	expect( m.get([1,1,1,1,1]) ).toBe("haystack");
	expect( m.get([3,1,1,1,1]) ).toBe(undefined);
	expect( m.get([-1,1,1,1,1]) ).toBe(undefined);
	expect( m.get([1,1,1,1,1,8]) ).toBe(undefined);
});

test("MDArray.set()", () => {
	const m = new MDArray(2,2).fill(0);
	
	expect( m.set([1,1], 1) ).toBe(1);
	expect( m.set([2,2], 1) ).toBe(1);

	expect( m.toString() ).toBe([
		"[ [ 0, 0 ],",
		"  [ 0, 1 ] ]",
	].join('\n'));
});

test("MDArray.includes()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	m[[1,2,3,4,5]] = "needle";
	
	expect( m.includes("needle")).toBe(true);
	expect( m.includes("haystack" )).toBe(true);
	expect( m.includes("cobra" )).toBe(false);
});

test("MDArray.indexOf()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	m[[1,2,3,4,5]] = "needle";
	
	expect( m.indexOf("needle")).toStrictEqual([1,2,3,4,5]);
	expect( m.indexOf("haystack" )).toStrictEqual([0,0,0,0,0]);
	expect( m.indexOf("cobra" )).toStrictEqual(new Array(5).fill(-1));
});

test("MDArray.makeCopy()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	const mCopy = m.makeCopy();

	expect(mCopy).toEqual(m);

	expect(mCopy.raw).toStrictEqual(m.raw);
	
	expect(mCopy === m).toBe(false);
});

test("MDArray.makeCopy()", () => {
	const m = new MDArray(2,3,4,5,6).fill("haystack");
	m[[1,2,3,4,5]] = "needle";

	const mCopy = m.makeCopy();

	expect(mCopy).toEqual(m);

	expect(mCopy.raw).toStrictEqual(m.raw);
	
	expect(mCopy === m).toBe(false);
});

