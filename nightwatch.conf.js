const settings = require("./nightwatch.json");

const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;
if(TRAVIS_JOB_NUMBER) {
    const desiredCapabilities = settings.test_settings.default.desiredCapabilities;
    desiredCapabilities.build = `build-${ TRAVIS_JOB_NUMBER }`;
    desiredCapabilities["tunnel-identifier"] = TRAVIS_JOB_NUMBER;
}

module.exports = settings;