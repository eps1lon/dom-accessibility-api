import {
	computeTextAlternative,
	ComputeTextAlternativeOptions,
} from "./accessible-name-and-description";
import { queryIdRefs } from "./util";

/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_description
 * @param root
 * @param [options]
 * @parma [options.getComputedStyle] - mock window.getComputedStyle. Needs `content`, `display` and `visibility`
 */
export function computeAccessibleDescription(
	root: Element,
	options: ComputeTextAlternativeOptions = {}
): string {
	if (!root.hasAttribute("aria-describedBy")) {
		return "";
	}

	return queryIdRefs(root, "aria-describedby")
		.map((element) => {
			return computeTextAlternative(element, {
				...options,
				compute: "description",
			});
		})
		.join(" ");
}
