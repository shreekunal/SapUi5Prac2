/* global QUnit */
/*eslint no-unused-vars: 0*/
sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        start: function () {
            QUnit.module("Awards App Journey");
            opaTest("#000: Start", function (Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp("", { "sap-language": "EN" });
            });
            return Journey;
        },

        test: function () {
            opaTest(
                "#1: ListReport: Check List Report Page loads",
                function (Given, When, Then) {
                    Then.onTheMainPage.iSeeThisPage();
                }
            );

            opaTest(
                "#2: Object Page: Check Object Page loads",
                function (Given, When, Then) {
                    When.onTheMainPage.onFilterBar().iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows();
                    When.onTheMainPage.onTable().iPressRow(0);
                    Then.onTheDetailPage.iSeeThisPage();
                    When.iNavigateBack();
                    Then.onTheMainPage.iSeeThisPage();
                }
            );

            opaTest("#3: List report: Create Awards", function (Given, When, Then) {
                Then.onTheMainPage.iSeeThisPage();
                Then.onTheMainPage.onTable().iCheckAction("Create", { enabled: true });

                // Click on Create button
                When.onTheMainPage.onTable().iExecuteAction("Create");
                Then.onTheCreatePage.iSeeThisPage();
                //When.onTheCreatePage.iGoToSection("Awards");

                // FMNO
                
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "fmno" }, "999999");

                // Award Type
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "code_code" }, "SA");

                // Company Code
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "companyCode" }, "1010");

                // Evaluation Year
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "evaluationYear" }, "2023");

                // Currency
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "currency_code" }, "INR");

                // Country
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "country" }, "India");

                // Start Date
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "startDate" }, "2022-07-01");

                // End Date
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "endDate" }, "2023-06-30");

                // Active
                When.onTheDetailPage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "active" }, true);

                // Amount
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "amount" }, 10);

                // Description
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "description" }, "OPA5 test case");

                // Nature
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "nature" }, "Normal");

                // Annualized SA
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "annualizedSA" }, 1);

                // Distribution Per
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "distributionPer" }, 1);

                // Proration Per
                When.onTheCreatePage
                    .onForm({ section: "Awards" })
                    .iChangeField({ property: "prorationper" }, 1);


                // Save all
                When.onTheCreatePage.onFooter().iExecuteSave();
                Then.onTheDetailPage.iSeeThisPage().and.iSeeObjectPageInDisplayMode();
                When.iNavigateBack();
            });

            return Journey;
        },
        end: function () {
            opaTest("#999: Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
            return Journey;
        },
    };
    Journey.run = function () {
        Journey.start().test().end();
    };

    return Journey;
});