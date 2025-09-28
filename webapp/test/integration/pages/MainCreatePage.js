sap.ui.define(["sap/fe/test/ObjectPage",
	'sap/ui/test/Opa5',
	'sap/ui/test/matchers/PropertyStrictEquals',
	'sap/ui/test/actions/Press',
	'sap/ui/test/matchers/Properties',
	"sap/ui/test/OpaBuilder",
	"sap/ui/core/util/ShortcutHelper",
	"sap/fe/test/Utils",
	"sap/fe/test/builder/FEBuilder",
	"sap/fe/test/builder/MdcFieldBuilder",
	"sap/fe/test/builder/MdcTableBuilder",
	"sap/fe/test/builder/DialogBuilder",
	"sap/fe/test/api/TableAssertions",
	"sap/fe/test/api/TableActions",
	"sap/fe/test/api/ChartAssertions",
	"sap/fe/test/api/ChartActions",
	"sap/fe/test/builder/MdcFilterBarBuilder",
	"sap/fe/test/api/FilterBarAssertions",
	"sap/fe/test/api/FilterBarActions",
	"sap/base/util/deepEqual",
	"sap/ushell/resources"

], function (ObjectPage,
	Opa5,
	PropertyStrictEquals,
	Press,
	Properties,
	OpaBuilder,
	ShortcutHelper,
	Utils,
	FEBuilder,
	FieldBuilder,
	TableBuilder,
	DialogBuilder,
	TableAssertions,
	TableActions,
	ChartAssertions,
	ChartActions,
	FilterBarBuilder,
	FilterBarAssertions,
	FilterBarActions,
	deepEqual,
	resources) {
	"use strict";

	// OPTIONAL
	var sViewName = "onCreate";
	var AdditionalCustomObjectPageDefinition = {
		actions: {
			iAddTheDisplayedProductToTheCart: function () {
				return this.waitFor({
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({ name: "icon", value: "sap-icon://cart-3" }),
					actions: new Press(),
					errorMessage: "The press action could not be executed"
				});
			}


		},
		assertions: {
			iSeeThisPage: function () {
				return OpaBuilder.create(this)
					.hasId(sViewName)
					.viewId(null)
					.viewName(null)
					.description(Utils.formatMessage("Seeing the page '{0}'", sViewName))
					.execute();
			}
		}
	};
	return new Opa5.createPageObjects({
		onTheCreatePage: {
			actions: {
				iAddTheDisplayedProductToTheCart: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({ name: "icon", value: "sap-icon://cart-3" }),
						actions: new Press(),
						errorMessage: "The press action could not be executed"
					});
				}
	
	
			},
			assertions: {
				iSeeThisPage: function () {
					return OpaBuilder.create(this)
						.hasId(sViewName)
						.viewId(null)
						.viewName(null)
						.description(Utils.formatMessage("Seeing the page '{0}'", sViewName))
						.execute();
				}
			}
		}
	});
});


//     return new ObjectPage(
//         {
//             appId: "com.pas.pasawardsf",
//             componentId: "AwardsCreatePage",
//             entitySet: "Awards",
//         },
//         AdditionalCustomObjectPageDefinition
//     );
// });