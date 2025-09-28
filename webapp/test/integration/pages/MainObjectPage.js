sap.ui.define(["sap/fe/test/ObjectPage"], function (ObjectPage) {
    "use strict";
  
    // OPTIONAL
    var AdditionalCustomObjectPageDefinition = {
      actions: {},
      assertions: {},
    };
  
    return new ObjectPage(
      {
        appId: "com.pas.pasawardsf",
        componentId: "AwardsObjectPage",
        entitySet: "Awards",
      },
      AdditionalCustomObjectPageDefinition
    );
  });