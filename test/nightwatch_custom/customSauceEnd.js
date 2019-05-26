"use strict";

const SauceLabs = require("saucelabs").default;

// environment
const { SAUCE_USERNAME: user, SAUCE_ACCESS_KEY: key } = process.env;

exports.command = async function() {
    const { sessionId, currentTest: { name, results: { failed } } } = this;
    const passed = failed === 0;

    const saucelabs = new SauceLabs({ user, key });
    await saucelabs.updateJob(user, sessionId, { name, passed });

    this.end();
};
