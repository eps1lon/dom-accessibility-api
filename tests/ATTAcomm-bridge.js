const implementation = "ATK";
const descriptionPropertyName = {
	ATK: "description"
};
const namePropertyName = {
	ATK: "name"
};

class ATTAcomm {
	constructor({ steps, title }) {
		test(() => {
			const element = document.getElementById("test");

			for (const step of steps) {
				const { test } = step;
				const assertions = test[implementation];

				for (const assertion of assertions) {
					const [matcher, name, equality, expected] = assertion;
					console.log(matcher, name, equality, expected);

					if (matcher === "property") {
						if (name === namePropertyName[implementation]) {
							const actual = computeAccessibleName(element);
							if (equality === "is") {
								assert_equals(actual, expected);
								continue;
							}
						}
					}

					throw new Error(`Don't know how to handle this assertion`);
				}
			}

			done();
		}, title);
	}
}

window.ATTAcomm = ATTAcomm;
