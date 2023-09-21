import {
	computeTextAlternative,
	ComputeTextAlternativeOptions,
} from "./accessible-name-and-description";
import { hasAnyConcreteRoles } from "./util";

/**
 * https://rawgit.com/w3c/aria/stable/#namefromprohibited
 */
function prohibitsNaming(node: Node): boolean {
	return hasAnyConcreteRoles(node, [
		"caption",
		"code",
		"deletion",
		"emphasis",
		"generic",
		"insertion",
		"none",
		"paragraph",
		"presentation",
		"strong",
		"subscript",
		"superscript",
		"time",
	]);
}

/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_name
 * @param root
 * @param options
 * @returns
 */
export function computeAccessibleName(
	root: Element,
	options: ComputeTextAlternativeOptions = {},
): string {
	if (prohibitsNaming(root)) {
		return "";
	}

	return computeTextAlternative(root, options);
}
