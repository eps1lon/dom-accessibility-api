const JestEnvironmentJsdom = require("jest-environment-jsdom");

class JestEnvironmentJsdomMockIE11 extends JestEnvironmentJsdom {
	setup() {
		const unsupportedGetters = [
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/labels
			["HTMLButtonElement", "labels"],
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/labels
			["HTMLInputElement", "labels"],
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMeterElement/labels
			["HTMLMeterElement", "labels"],
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLOutputElement/labels
			["HTMLOutputElement", "labels"],
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/labels
			["HTMLSelectElement", "labels"],
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/labels
			["HTMLTextAreaElement", "labels"],
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/localName
			["Element", "localName"],
		];

		unsupportedGetters.forEach(([interfaceName, propertyName]) => {
			Object.defineProperty(
				this.dom.window[interfaceName].prototype,
				propertyName,
				{
					// technically the property doesn't exist which is a bit different than returning undefined
					// works for our implementation though
					get() {
						return undefined;
					},
				}
			);
		});
	}
}

module.exports = JestEnvironmentJsdomMockIE11;
