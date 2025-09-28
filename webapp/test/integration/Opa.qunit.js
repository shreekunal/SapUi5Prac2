/* global QUnit */

sap.ui.define(
    [
        "sap/fe/test/JourneyRunner",
        "com/pas/pasawardsf/test/integration/pages/MainListReport",
        "com/pas/pasawardsf/test/integration/pages/MainObjectPage",
        "com/pas/pasawardsf/test/integration/pages/MainCreatePage",
        "com/pas/pasawardsf/test/integration/OpaJourney",
    ],
    function (JourneyRunner, MainListReport, MainObjectPage, MainCreatePage, Journey) {
        "use strict";

        var journeyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("com/pas/pasawardsf") + "/index.html",
            opaConfig: { timeout: 20 },
        });

        journeyRunner.run(
            {
                pages: {
                    onTheMainPage: MainListReport,
                 //   onTheCreatePage: MainCreatePage,
                    onTheDetailPage: MainObjectPage
                },
            },
            Journey.run
        );
    }
);