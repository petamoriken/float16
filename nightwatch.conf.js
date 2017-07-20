const settings = require("./nightwatch.json");

const { TRAVIS_JOB_NUMBER, TRAVIS_BRANCH, TRAVIS_PULL_REQUEST } = process.env;
if(TRAVIS_JOB_NUMBER) {
    const desiredCapabilities = settings.test_settings.default.desiredCapabilities;
    if(TRAVIS_BRANCH === "master" && TRAVIS_PULL_REQUEST === "false") {
        desiredCapabilities.build = `build-${ TRAVIS_JOB_NUMBER }`;
    }
    desiredCapabilities["tunnel-identifier"] = TRAVIS_JOB_NUMBER;
}

module.exports = settings;