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
	let description = queryIdRefs(root, "aria-describedby")
		.map((element) => {
			return computeTextAlternative(element, {
				...options,
				compute: "description",
			});
		})
		.join(" ");

	// TODO: Technically we need to make sure that node wasn't used for the accessible name
	//       This causes `description_1.0_combobox-focusable-manual` to fail
	//
	// https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
	// says for so many elements to use the `title` that we assume all elements are considered
	if (description === "") {
		const title = root.getAttribute("title");
		description = title === null ? "" : title;
	}

	return description;
}
