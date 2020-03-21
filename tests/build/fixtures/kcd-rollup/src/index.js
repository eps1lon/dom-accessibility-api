import { computeAccessibleName } from "dom-accessibility-api";

if (typeof computeAccessibleName !== "function") {
	throw new TypeError();
}
