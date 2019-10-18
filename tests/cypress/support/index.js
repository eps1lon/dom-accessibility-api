import { computeAccessibleName } from "../../../dist";

chai.use((_chai, _utils) => {
	function assertAccessibleName(expected) {
		const element = _utils.flag(this, "object");
		console.log(element);
		const actual = computeAccessibleName(element);

		this.assert(
			expected === actual,
			`expected to have accessible name '${expected}' but got '${actual}'`,
			`expected to not have accessible name ${expected}`
		);
	}

	_chai.Assertion.addMethod("accessibleName", assertAccessibleName);
});
