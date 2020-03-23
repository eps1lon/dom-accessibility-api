/// <reference types="Cypress" />

const usedApiIndex = 0; // ATK

context("wpt", () => {
	[
		["name_1.0_combobox-focusable-alternative-manual", "pass"],
		["name_1.0_combobox-focusable-manual", "pass"],
		["name_checkbox-label-embedded-combobox-manual", "pass"],
		["name_checkbox-label-embedded-listbox-manual", "pass"],
		["name_checkbox-label-embedded-menu-manual", "pass"],
		["name_checkbox-label-embedded-select-manual", "pass"],
		["name_checkbox-label-embedded-slider-manual", "pass"],
		["name_checkbox-label-embedded-spinbutton-manual", "pass"],
		["name_checkbox-label-embedded-textbox-manual", "pass"],
		["name_checkbox-label-multiple-label-alternative-manual", "pass"],
		["name_checkbox-label-multiple-label-manual", "pass"],
		["name_checkbox-title-manual", "pass"],
		["name_file-label-embedded-combobox-manual", "pass"],
		["name_file-label-embedded-menu-manual", "pass"],
		["name_file-label-embedded-select-manual", "pass"],
		["name_file-label-embedded-slider-manual", "pass"],
		["name_file-label-embedded-spinbutton-manual", "pass"],
		["name_file-label-inline-block-elements-manual", "fail"], // whitespace issue, likely due to `display`
		["name_file-label-inline-block-styles-manual", "fail"], // missing word, unknown
		["name_file-label-inline-hidden-elements-manual", "pass"],
		["name_file-label-owned-combobox-manual", "pass"],
		["name_file-label-owned-combobox-owned-listbox-manual", "pass"],
		["name_file-title-manual", "pass"],
		["name_from_content-manual", "pass"],
		["name_from_content_of_label-manual", "pass"],
		["name_from_content_of_labelledby_element-manual", "pass"],
		[
			"name_from_content_of_labelledby_elements_one_of_which_is_hidden-manual",
			"pass",
		],
		["name_heading-combobox-focusable-alternative-manual", "pass"],
		["name_image-title-manual", "pass"],
		["name_link-mixed-content-manual", "pass"],
		["name_link-with-label-manual", "pass"],
		["name_password-label-embedded-combobox-manual", "pass"],
		["name_password-label-embedded-menu-manual", "pass"],
		["name_password-label-embedded-select-manual", "pass"],
		["name_password-label-embedded-slider-manual", "pass"],
		["name_password-label-embedded-spinbutton-manual", "pass"],
		["name_password-title-manual", "pass"],
		["name_radio-label-embedded-combobox-manual", "pass"],
		["name_radio-label-embedded-menu-manual", "pass"],
		["name_radio-label-embedded-select-manual", "pass"],
		["name_radio-label-embedded-slider-manual", "pass"],
		["name_radio-label-embedded-spinbutton-manual", "pass"],
		["name_radio-title-manual", "pass"],
		["name_test_case_539-manual", "pass"],
		["name_test_case_540-manual", "pass"],
		["name_test_case_541-manual", "pass"],
		["name_test_case_543-manual", "pass"],
		["name_test_case_544-manual", "pass"],
		["name_test_case_545-manual", "pass"],
		["name_test_case_546-manual", "pass"],
		["name_test_case_547-manual", "pass"],
		["name_test_case_548-manual", "pass"],
		["name_test_case_549-manual", "pass"],
		["name_test_case_550-manual", "pass"],
		["name_test_case_551-manual", "pass"],
		["name_test_case_552-manual", "pass"],
		["name_test_case_553-manual", "pass"],
		["name_test_case_556-manual", "pass"],
		["name_test_case_557-manual", "pass"],
		["name_test_case_558-manual", "pass"],
		["name_test_case_559-manual", "pass"],
		["name_test_case_560-manual", "pass"],
		["name_test_case_561-manual", "pass"],
		["name_test_case_562-manual", "pass"],
		["name_test_case_563-manual", "pass"],
		["name_test_case_564-manual", "pass"],
		["name_test_case_565-manual", "pass"],
		["name_test_case_566-manual", "pass"],
		["name_test_case_596-manual", "pass"],
		["name_test_case_597-manual", "pass"],
		["name_test_case_598-manual", "pass"],
		["name_test_case_599-manual", "pass"],
		["name_test_case_600-manual", "pass"],
		["name_test_case_601-manual", "pass"],
		["name_test_case_602-manual", "pass"],
		["name_test_case_603-manual", "pass"],
		["name_test_case_604-manual", "pass"],
		["name_test_case_605-manual", "pass"],
		["name_test_case_606-manual", "pass"],
		["name_test_case_607-manual", "pass"],
		["name_test_case_608-manual", "pass"],
		["name_test_case_609-manual", "pass"],
		["name_test_case_610-manual", "pass"],
		["name_test_case_611-manual", "pass"],
		["name_test_case_612-manual", "pass"],
		["name_test_case_613-manual", "pass"],
		["name_test_case_614-manual", "pass"],
		["name_test_case_615-manual", "pass"],
		["name_test_case_616-manual", "pass"],
		["name_test_case_617-manual", "fail"], // whitespace, check if label children should be concetaned with a space
		["name_test_case_618-manual", "fail"], // whitespace, see name_test_case_617-manual
		["name_test_case_619-manual", "fail"], // whitespace, see name_test_case_617-manual
		["name_test_case_620-manual", "fail"], // whitespace, see name_test_case_617-manual
		["name_test_case_621-manual", "pass"],
		["name_test_case_659-manual", "fail"], // wrong, ::before + [title] + ::after
		["name_test_case_660-manual", "fail"], // wrong, ::before + [title] + ::after
		["name_test_case_661-manual", "pass"],
		["name_test_case_662-manual", "pass"],
		["name_test_case_663a-manual", "pass"],
		["name_test_case_721-manual", "pass"],
		["name_test_case_723-manual", "pass"],
		["name_test_case_724-manual", "pass"],
		["name_test_case_725-manual", "pass"],
		["name_test_case_726-manual", "pass"],
		["name_test_case_727-manual", "pass"],
		["name_test_case_728-manual", "pass"],
		["name_test_case_729-manual", "pass"],
		["name_test_case_730-manual", "pass"],
		["name_test_case_731-manual", "pass"],
		["name_test_case_733-manual", "pass"],
		["name_test_case_734-manual", "pass"],
		["name_test_case_735-manual", "pass"],
		["name_test_case_736-manual", "pass"],
		["name_test_case_737-manual", "pass"],
		["name_test_case_738-manual", "pass"],
		["name_test_case_739-manual", "pass"],
		["name_test_case_740-manual", "pass"],
		["name_test_case_741-manual", "pass"],
		["name_test_case_742-manual", "pass"],
		["name_test_case_743-manual", "pass"],
		["name_test_case_744-manual", "pass"],
		["name_test_case_745-manual", "pass"],
		["name_test_case_746-manual", "pass"],
		["name_test_case_747-manual", "pass"],
		["name_test_case_748-manual", "pass"],
		["name_test_case_749-manual", "pass"],
		["name_test_case_750-manual", "pass"],
		["name_test_case_751-manual", "pass"],
		["name_test_case_752-manual", "pass"],
		["name_test_case_753-manual", "pass"],
		["name_test_case_754-manual", "pass"],
		["name_test_case_755-manual", "pass"],
		["name_test_case_756-manual", "pass"],
		["name_test_case_757-manual", "pass"],
		["name_test_case_758-manual", "pass"],
		["name_test_case_759-manual", "pass"],
		["name_test_case_760-manual", "pass"],
		["name_test_case_761-manual", "pass"],
		["name_test_case_762-manual", "pass"],
		["name_text-label-embedded-combobox-manual", "pass"],
		["name_text-label-embedded-menu-manual", "pass"],
		["name_text-label-embedded-select-manual", "pass"],
		["name_text-label-embedded-slider-manual", "pass"],
		["name_text-label-embedded-spinbutton-manual", "pass"],
		["name_text-title-manual", "pass"],
	].forEach(([testBasename, result]) => {
		it(`${result} ${testBasename}`, () => {
			cy.visit(`http://localhost:5000/accname/${testBasename}`);

			cy.get(
				`#steps tr:nth-of-type(2) .api tr:nth-of-type(${2 + usedApiIndex})`
			)
				.then(($row) => {
					const [$apiName, $access, $name, $equality, $expected] = $row.find(
						"td"
					);

					// these cases are handled
					expect($apiName.textContent).to.equal("ATK");
					expect($access.textContent).to.equal("property");
					expect($equality.textContent).to.equal("is");

					return $expected.textContent;
				})
				.then((expected) => {
					cy.get("#test").then(($element) => {
						if (result === "pass") {
							expect($element[0]).to.have.accessibleName(expected);
						} else if (result === "fail") {
							expect($element[0]).not.to.have.accessibleName(expected);
						}
					});
				});
		});
	});
});
