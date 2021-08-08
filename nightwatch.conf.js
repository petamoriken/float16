const { SAUCE_USERNAME, SAUCE_ACCESS_KEY, GITHUB_RUN_NUMBER, GITHUB_EVENT_NAME } = process.env;

module.exports = {
    src_folders: "test/browser",
    output_folder: "test_report",
    custom_commands_path: "./node_modules/nightwatch-saucelabs-endsauce/commands",

    test_settings: {
        default: {
            username: SAUCE_USERNAME,
            access_key: SAUCE_ACCESS_KEY,
            sauce_region: "us-west-1",
            use_ssl: true,
            silent: true,

            selenium: {
                host: "ondemand.saucelabs.com",
                port: 443,
                start_process: false,
            },

            request_timeout_options: {
                timeout: 60000,
                retry_attempts: 5,
            },

            desiredCapabilities: {
                javascriptEnabled: true,
                acceptSslCerts: true,
                "tunnel-identifier": "github-action-tunnel",
                build: GITHUB_EVENT_NAME === "push" ? `build-${ GITHUB_RUN_NUMBER }` : undefined,
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
                version: "78.0",
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
                platform: "macOS 11",
                browserName: "safari",
                version: "latest",
            },
        },

        safari_old: {
            desiredCapabilities: {
                platform: "macOS 10.15",
                browserName: "safari",
                version: "latest",
            },
        },
    },
};
