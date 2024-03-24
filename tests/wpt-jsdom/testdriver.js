window.test_driver = {
	get_computed_label: async function (element) {
		return computeAccessibleName(element) ?? "";
	},
	get_computed_role: async function (element) {
		return getRole(element) ?? "";
	},
};
