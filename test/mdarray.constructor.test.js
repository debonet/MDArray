const MDArray = require ( "../src/MDArray.js" );

test("ensure arrays are created", () => {
	const m = new MDArray([[1,2],[3,4]]);
	expect(m.toString()).toBe([
		"[ [ 1, 2 ],",
		"  [ 3, 4 ] ]"
	].join('\n'));
	
	const m2 = new MDArray(...m.size);
	expect(m2.toString()).toBe([
		"[ [ undefined, undefined ],",
		"  [ undefined, undefined ] ]",
		
	].join('\n'));
														
});

