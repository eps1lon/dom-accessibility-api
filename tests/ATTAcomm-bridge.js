const implementation = "ATK";
const descriptionPropertyName = {
	ATK: "description"
};
const namePropertyName = {
	ATK: "name"
};

class ATTAcomm {
	constructor({ steps, title }) {
		const element = document.getElementById("test");

		test(() => {
			for (const step of steps) {
				const { test } = step;
				const assertions = test[implementation];

				for (const assertion of assertions) {
					const [matcher, name, equality, expected] = assertion;
					console.log(matcher, name, equality, expected);

					if (matcher === "property") {
						if (name === namePropertyName[implementation]) {
							const actual = "";
							if (equality === "is") {
								assert_equals(actual, expected);
							}
						}
					}
				}
			}

			done();
		}, title);
	}
}

window.ATTAcomm = ATTAcomm;
