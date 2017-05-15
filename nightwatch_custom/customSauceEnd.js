const SauceLabs = require("saucelabs");

function noop() {}

exports.command = function() {
    const saucelabs = new SauceLabs({
        username: process.env.SAUCE_USERNAME,
        password: process.env.SAUCE_ACCESS_KEY
    });

    const sessionId = this.capabilities["webdriver.remote.sessionid"];
    const jobName = this.currentTest.name;

    saucelabs.updateJob(sessionId, {
        passed: this.currentTest.results.failed === 0,
        name: jobName
    }, noop);

    console.log("SauceOnDemandSessionID: ", sessionId);
    console.log("jobName: ", jobName);
    
    this.end();
};