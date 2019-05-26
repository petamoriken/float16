"use strict";

const SauceLabs = require("saucelabs");

// environment
const { SAUCE_USERNAME: user, SAUCE_ACCESS_KEY: key } = process.env;

exports.command = async function() {
    const { sessionId, currentTest: { name } } = this;

    const saucelabs = new SauceLabs({ user, key });
    await saucelabs.updateJob(user, sessionId, {
        name,
        passed: this.currentTest.results.failed === 0,
    });

    this.end();
};