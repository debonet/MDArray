const MDArray = require ( "../src/MDArray.js" );

const m = new MDArray(2,2,2).map((x,nm)=>1000+nm[0]*100+nm[1]*10+nm[2])

test("MDArray.protype.add( number ) ", ()=>{
	const mTest = m.add( 5 );
	expect(mTest.toString()).toBe([
		'[ [ [ 1005, 1006 ],',
		'    [ 1015, 1016 ] ],',
		'  [ [ 1105, 1106 ],',
		'    [ 1115, 1116 ] ] ]'
	].join('\n'));
});

test("MDArray.protype.add( MDarray ) ", ()=>{
	const mTest = m.add( m );
	
	expect(mTest.toString()).toBe([
		'[ [ [ 2000, 2002 ],',
		'    [ 2020, 2022 ] ],',
		'  [ [ 2200, 2202 ],',
		'    [ 2220, 2222 ] ] ]'
	].join('\n'));
});


test("MDArray.add( MDArray, number )", ()=>{
	const mTest = MDArray.add( m, 5 );
	
	expect(mTest.toString()).toBe([
		'[ [ [ 1005, 1006 ],',
		'    [ 1015, 1016 ] ],',
		'  [ [ 1105, 1106 ],',
		'    [ 1115, 1116 ] ] ]'
	].join('\n'));
});


test("MDArray.add( MDArray, MDArray )", ()=>{
	const mTest = MDArray.add( m, m );
	
	expect(mTest.toString()).toBe([
		'[ [ [ 2000, 2002 ],',
		'    [ 2020, 2022 ] ],',
		'  [ [ 2200, 2202 ],',
		'    [ 2220, 2222 ] ] ]'
	].join('\n'));
});


test("MDArray.sub( number, MDArray )", ()=>{
	const mTest = MDArray.sub( 0, m, m );
	
	expect(mTest.toString()).toBe([
		'[ [ [ -2000, -2002 ],',
		'    [ -2020, -2022 ] ],',
		'  [ [ -2200, -2202 ],',
		'    [ -2220, -2222 ] ] ]'
	].join('\n'));
});



test("MDArray.max( number, MDArray )", ()=>{
	const mTest = MDArray.max( 1020, m );
	
	expect(mTest.toString()).toBe([
		'[ [ [ 1020, 1020 ],',
		'    [ 1020, 1020 ] ],',
		'  [ [ 1100, 1101 ],',
		'    [ 1110, 1111 ] ] ]'
	].join('\n'));

	expect(m.reduce((z1,z2)=>z1>z2?z1:z2)).toBe(1111);
});



