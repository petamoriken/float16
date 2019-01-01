"use strict";

const SauceLabs = require("saucelabs");

// environment
const { SAUCE_USERNAME, SAUCE_ACCESS_KEY } = process.env;

exports.command = function() {
    const { sessionId, currentTest: { name: jobName } } = this;

    console.log("SauceOnDemandSessionID: ", sessionId);

    const saucelabs = new SauceLabs({
        username: SAUCE_USERNAME,
        password: SAUCE_ACCESS_KEY
    });

    saucelabs.updateJob(sessionId, {
        passed: this.currentTest.results.failed === 0,
        name: jobName
    }, () => {
        this.end();
    });
};