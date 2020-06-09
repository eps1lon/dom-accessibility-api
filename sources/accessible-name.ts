import {
	computeTextAlternative,
	ComputeTextAlternativeOptions,
} from "./accessible-name-and-description";

/**
 * implements https://w3c.github.io/accname/#mapping_additional_nd_name
 * @param root
 * @param [options]
 * @parma [options.getComputedStyle] - mock window.getComputedStyle. Needs `content`, `display` and `visibility`
 */
export function computeAccessibleName(
	root: Element,
	options: ComputeTextAlternativeOptions = {}
): string {
	return computeTextAlternative(root, options);
}
