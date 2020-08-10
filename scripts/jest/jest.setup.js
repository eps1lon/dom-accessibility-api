/* eslint-env jest */

let spy;
beforeEach(() => {
	spy = jest.spyOn(console, "error").mockImplementation((message) => {
		console.log(message);
		throw new Error(message);
	});
});

afterEach(() => {
	spy.mockRestore();
});
