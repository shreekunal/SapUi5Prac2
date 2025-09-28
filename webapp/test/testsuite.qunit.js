/* global window, parent, location */

// eslint-disable-next-line sap-no-global-define
window.suite = function() {
	"use strict";

	// eslint-disable-next-line
	var oSuite = new parent.jsUnitTestSuite(),
		sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

	oSuite.addTestPage(sContextPath + "integration/Opa.qunit.html");

	return oSuite;
};