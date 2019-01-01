const settings = {
    src_folders: "test/browser",
    output_folder: "test_report",
    custom_commands_path: "test/nightwatch_custom",

    selenium: {
        start_process: true,
        host: "127.0.0.1",
        port: 4444,
    },

    test_workers: {
        enabled: true,
        workers: "auto",
    },

    test_settings: {
        default: {
            launch_url: "http://localhost",
            selenium_host: "ondemand.saucelabs.com",
            selenium_port: 80,

            webdriver: {
                username: "${SAUCE_USERNAME}",
                access_key: "${SAUCE_ACCESS_KEY}",
                default_path_prefix: "/wd/hub",
            },

            desiredCapabilities: {
                javascriptEnabled: true,
                acceptSslCerts: true,
            },
        },

        chrome: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "chrome",
                version: "latest",
            },
        },

        chrome_old: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "chrome",
                version: "latest-1",
            },
        },

        firefox: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "firefox",
                version: "latest",
            },
        },

        firefox_old: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "firefox",
                version: "latest-1",
            },
        },

        firefox_esr: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "firefox",
                version: "52.0",
            },
        },

        edge: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "MicrosoftEdge",
                version: "latest",
            },
        },

        edge_old: {
            desiredCapabilities: {
                platform: "Windows 10",
                browserName: "MicrosoftEdge",
                version: "latest-1",
            },
        },

        safari: {
            desiredCapabilities: {
                platform: "macOS 10.13",
                browserName: "safari",
                version: "latest",
            },
        },

        safari_old: {
            desiredCapabilities: {
                platform: "macOS 10.12",
                browserName: "safari",
                version: "latest-1",
            },
        },
    },
};

const { TRAVIS_JOB_NUMBER, TRAVIS_BRANCH, TRAVIS_PULL_REQUEST } = process.env;

if (TRAVIS_JOB_NUMBER) {
    const desiredCapabilities = settings.test_settings.default.desiredCapabilities;
    if (TRAVIS_BRANCH === "master" && TRAVIS_PULL_REQUEST === "false") {
        desiredCapabilities.build = `build-${ TRAVIS_JOB_NUMBER }`;
    }
    desiredCapabilities["tunnel-identifier"] = TRAVIS_JOB_NUMBER;
}

module.exports = settings;