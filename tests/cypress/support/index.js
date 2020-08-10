import {
	computeAccessibleName,
	computeAccessibleDescription,
} from "../../../dist";

chai.use((_chai, _utils) => {
	function assertAccessibleName(expected) {
		const element = _utils.flag(this, "object");
		const actual = computeAccessibleName(element, {
			computedStyleSupportsPseudoElements: true,
		});

		this.assert(
			expected === actual,
			`expected to have accessible name '${expected}' but got '${actual}'`,
			`expected to not have accessible name ${expected}`
		);
	}

	_chai.Assertion.addMethod("accessibleName", assertAccessibleName);

	function assertAccessibleDescription(expected) {
		const element = _utils.flag(this, "object");
		const actual = computeAccessibleDescription(element, {
			computedStyleSupportsPseudoElements: true,
		});

		this.assert(
			expected === actual,
			`expected to have accessible description '${expected}' but got '${actual}'`,
			`expected to not have accessible description ${expected}`
		);
	}

	_chai.Assertion.addMethod(
		"accessibleDescription",
		assertAccessibleDescription
	);
});
