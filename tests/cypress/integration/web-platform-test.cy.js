/// <reference types="Cypress" />

const usedApiIndex = 0; // ATK

context("wpt", () => {
	[
		["manual/description_1.0_combobox-focusable-manual.html", "fail"],
		[
			"manual/description_from_content_of_describedby_element-manual.html",
			"fail",
		],
		["manual/description_link-with-label-manual.html", "pass"],
		["manual/description_test_case_557-manual.html", "pass"],
		["manual/description_test_case_664-manual.html", "pass"],
		["manual/description_test_case_665-manual.html", "pass"],
		["manual/description_test_case_666-manual.html", "pass"],
		["manual/description_test_case_772-manual.html", "pass"],
		["manual/description_test_case_773-manual.html", "pass"],
		["manual/description_test_case_774-manual.html", "pass"],
		["manual/description_test_case_838-manual.html", "pass"],
		["manual/description_test_case_broken_reference-manual.html", "pass"],
		["manual/description_test_case_one_valid_reference-manual.html", "pass"],
		["manual/description_title-same-element-manual.html", "pass"],
		["manual/name_1.0_combobox-focusable-alternative-manual", "pass"],
		["manual/name_1.0_combobox-focusable-manual", "pass"],
		["manual/name_checkbox-label-embedded-combobox-manual", "pass"],
		["manual/name_checkbox-label-embedded-listbox-manual", "pass"],
		["manual/name_checkbox-label-embedded-menu-manual", "pass"],
		["manual/name_checkbox-label-embedded-select-manual", "pass"],
		["manual/name_checkbox-label-embedded-slider-manual", "pass"],
		["manual/name_checkbox-label-embedded-spinbutton-manual", "pass"],
		["manual/name_checkbox-label-embedded-textbox-manual", "pass"],
		["manual/name_checkbox-label-multiple-label-alternative-manual", "pass"],
		["manual/name_checkbox-label-multiple-label-manual", "pass"],
		["manual/name_checkbox-title-manual", "pass"],
		["manual/name_file-label-embedded-combobox-manual", "pass"],
		["manual/name_file-label-embedded-menu-manual", "pass"],
		["manual/name_file-label-embedded-select-manual", "pass"],
		["manual/name_file-label-embedded-slider-manual", "pass"],
		["manual/name_file-label-embedded-spinbutton-manual", "pass"],
		["manual/name_file-label-inline-block-elements-manual", "fail"], // whitespace issue, likely due to `display`
		["manual/name_file-label-inline-block-styles-manual", "fail"], // missing word, unknown
		["manual/name_file-label-inline-hidden-elements-manual", "pass"],
		["manual/name_file-label-owned-combobox-manual", "pass"],
		["manual/name_file-label-owned-combobox-owned-listbox-manual", "pass"],
		["manual/name_file-title-manual", "pass"],
		["manual/name_from_content_of_label-manual", "pass"],
		["manual/name_from_content_of_labelledby_element-manual", "pass"],
		[
			"manual/name_from_content_of_labelledby_elements_one_of_which_is_hidden-manual",
			"pass",
		],
		["manual/name_from_content-manual", "pass"],
		["manual/name_heading-combobox-focusable-alternative-manual", "pass"],
		["manual/name_image-title-manual", "pass"],
		["manual/name_link-mixed-content-manual", "pass"],
		["manual/name_link-with-label-manual", "pass"],
		["manual/name_password-label-embedded-combobox-manual", "pass"],
		["manual/name_password-label-embedded-menu-manual", "pass"],
		["manual/name_password-label-embedded-select-manual", "pass"],
		["manual/name_password-label-embedded-slider-manual", "pass"],
		["manual/name_password-label-embedded-spinbutton-manual", "pass"],
		["manual/name_password-title-manual", "pass"],
		["manual/name_radio-label-embedded-combobox-manual", "pass"],
		["manual/name_radio-label-embedded-menu-manual", "pass"],
		["manual/name_radio-label-embedded-select-manual", "pass"],
		["manual/name_radio-label-embedded-slider-manual", "pass"],
		["manual/name_radio-label-embedded-spinbutton-manual", "pass"],
		["manual/name_radio-title-manual", "pass"],
		["manual/name_test_case_539-manual", "pass"],
		["manual/name_test_case_540-manual", "pass"],
		["manual/name_test_case_541-manual", "pass"],
		["manual/name_test_case_543-manual", "pass"],
		["manual/name_test_case_544-manual", "pass"],
		["manual/name_test_case_545-manual", "pass"],
		["manual/name_test_case_546-manual", "pass"],
		["manual/name_test_case_547-manual", "pass"],
		["manual/name_test_case_548-manual", "pass"],
		["manual/name_test_case_549-manual", "pass"],
		["manual/name_test_case_550-manual", "pass"],
		["manual/name_test_case_551-manual", "pass"],
		["manual/name_test_case_552-manual", "pass"],
		["manual/name_test_case_553-manual", "pass"],
		["manual/name_test_case_556-manual", "pass"],
		["manual/name_test_case_557-manual", "pass"],
		["manual/name_test_case_558-manual", "pass"],
		["manual/name_test_case_559-manual", "pass"],
		["manual/name_test_case_560-manual", "pass"],
		["manual/name_test_case_561-manual", "pass"],
		["manual/name_test_case_562-manual", "pass"],
		["manual/name_test_case_563-manual", "pass"],
		["manual/name_test_case_564-manual", "pass"],
		["manual/name_test_case_565-manual", "pass"],
		["manual/name_test_case_566-manual", "pass"],
		["manual/name_test_case_596-manual", "pass"],
		["manual/name_test_case_597-manual", "pass"],
		["manual/name_test_case_598-manual", "pass"],
		["manual/name_test_case_599-manual", "pass"],
		["manual/name_test_case_600-manual", "pass"],
		["manual/name_test_case_601-manual", "pass"],
		["manual/name_test_case_602-manual", "pass"],
		["manual/name_test_case_603-manual", "pass"],
		["manual/name_test_case_604-manual", "pass"],
		["manual/name_test_case_605-manual", "pass"],
		["manual/name_test_case_606-manual", "pass"],
		["manual/name_test_case_607-manual", "pass"],
		["manual/name_test_case_608-manual", "pass"],
		["manual/name_test_case_609-manual", "pass"],
		["manual/name_test_case_610-manual", "pass"],
		["manual/name_test_case_611-manual", "pass"],
		["manual/name_test_case_612-manual", "pass"],
		["manual/name_test_case_613-manual", "pass"],
		["manual/name_test_case_614-manual", "pass"],
		["manual/name_test_case_615-manual", "pass"],
		["manual/name_test_case_616-manual", "pass"],
		["manual/name_test_case_617-manual", "pass"],
		["manual/name_test_case_618-manual", "pass"],
		["manual/name_test_case_619-manual", "pass"],
		["manual/name_test_case_620-manual", "pass"],
		["manual/name_test_case_621-manual", "pass"],
		["manual/name_test_case_659-manual", "fail"], // wrong, ::before + [title] + ::after
		["manual/name_test_case_660-manual", "fail"], // wrong, ::before + [title] + ::after
		["manual/name_test_case_661-manual", "pass"],
		["manual/name_test_case_662-manual", "pass"],
		["manual/name_test_case_663a-manual", "pass"],
		["manual/name_test_case_721-manual", "pass"],
		["manual/name_test_case_723-manual", "pass"],
		["manual/name_test_case_724-manual", "pass"],
		["manual/name_test_case_725-manual", "pass"],
		["manual/name_test_case_726-manual", "pass"],
		["manual/name_test_case_727-manual", "pass"],
		["manual/name_test_case_728-manual", "pass"],
		["manual/name_test_case_729-manual", "pass"],
		["manual/name_test_case_730-manual", "pass"],
		["manual/name_test_case_731-manual", "pass"],
		["manual/name_test_case_733-manual", "pass"],
		["manual/name_test_case_734-manual", "pass"],
		["manual/name_test_case_735-manual", "pass"],
		["manual/name_test_case_736-manual", "pass"],
		["manual/name_test_case_737-manual", "pass"],
		["manual/name_test_case_738-manual", "pass"],
		["manual/name_test_case_739-manual", "pass"],
		["manual/name_test_case_740-manual", "pass"],
		["manual/name_test_case_741-manual", "pass"],
		["manual/name_test_case_742-manual", "pass"],
		["manual/name_test_case_743-manual", "pass"],
		["manual/name_test_case_744-manual", "pass"],
		["manual/name_test_case_745-manual", "pass"],
		["manual/name_test_case_746-manual", "pass"],
		["manual/name_test_case_747-manual", "pass"],
		["manual/name_test_case_748-manual", "pass"],
		["manual/name_test_case_749-manual", "pass"],
		["manual/name_test_case_750-manual", "pass"],
		["manual/name_test_case_751-manual", "pass"],
		["manual/name_test_case_752-manual", "pass"],
		["manual/name_test_case_753-manual", "pass"],
		["manual/name_test_case_754-manual", "pass"],
		["manual/name_test_case_755-manual", "pass"],
		["manual/name_test_case_756-manual", "pass"],
		["manual/name_test_case_757-manual", "pass"],
		["manual/name_test_case_758-manual", "pass"],
		["manual/name_test_case_759-manual", "pass"],
		["manual/name_test_case_760-manual", "pass"],
		["manual/name_test_case_761-manual", "pass"],
		["manual/name_test_case_762-manual", "pass"],
		["manual/name_text-label-embedded-combobox-manual", "pass"],
		["manual/name_text-label-embedded-menu-manual", "pass"],
		["manual/name_text-label-embedded-select-manual", "pass"],
		["manual/name_text-label-embedded-slider-manual", "pass"],
		["manual/name_text-label-embedded-spinbutton-manual", "pass"],
		["manual/name_text-title-manual", "pass"],
	].forEach(([testBasename, result]) => {
		it(`${result} ${testBasename}`, () => {
			cy.visit(`http://localhost:3000/accname/${testBasename}`);

			cy.get(
				`#steps tr:nth-of-type(2) .api tr:nth-of-type(${2 + usedApiIndex})`,
			)
				.then(($row) => {
					const [$apiName, $access, $property, $equality, $expected] =
						$row.find("td");

					// these cases are handled
					expect($apiName.textContent).to.equal("ATK");
					expect($access.textContent).to.equal("property");
					expect($property.textContent).to.be.oneOf(["name", "description"]);
					expect($equality.textContent).to.equal("is");

					return [$property.textContent, $expected.textContent];
				})
				.then(([property, expected]) => {
					cy.get("#test").then(($element) => {
						if (property === "name") {
							if (result === "pass") {
								expect($element[0]).to.have.accessibleName(expected);
							} else if (result === "fail") {
								expect($element[0]).not.to.have.accessibleName(expected);
							}
						} else if (property === "description") {
							if (result === "pass") {
								expect($element[0]).to.have.accessibleDescription(expected);
							} else if (result === "fail") {
								expect($element[0]).not.to.have.accessibleDescription(expected);
							}
						}
					});
				});
		});
	});
});
