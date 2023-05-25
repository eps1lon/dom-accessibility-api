import {
	computeTextAlternative,
	ComputeTextAlternativeOptions,
} from "./accessible-name-and-description";
import { queryIdRefs } from "./util";

/**
 * @param root
 * @param options
 * @returns
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

	// https://w3c.github.io/aria/#aria-description
	// mentions that aria-description should only be calculated if aria-describedby didn't provide
	// a description
	if (description === "") {
		const ariaDescription = root.getAttribute("aria-description");
		description = ariaDescription === null ? "" : ariaDescription;
	}

	// https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
	// says for so many elements to use the `title` that we assume all elements are considered
	if (description === "") {
		const title = root.getAttribute("title");
		description = title === null ? "" : title;
	}

	return description;
}
