"use strict";
/* eslint-disable no-console, global-require */
const path = require("path");
const dns = require("dns");
const childProcess = require("child_process");
const q = require("q");
const { inBrowserContext } = require("./util");
const requestHead = require("request-promise-native").head;
const dnsLookup = q.denodeify(dns.lookup);

const wptDir = path.resolve(__dirname, "../wpt");

const configPaths = {
	default: path.resolve(__dirname, "wpt-config.json"),
};

const configs = {
	default: require(configPaths.default),
};

module.exports = () => {
	if (inBrowserContext()) {
		return Promise.resolve();
	}

	const configType = "default";
	const configPath = configPaths[configType];
	const config = configs[configType];

	return dnsLookup("web-platform.test")
		.then(
			() => {
				const configArg = path.relative(path.resolve(wptDir), configPath);
				const args = ["./wpt.py", "serve", "--config", configArg];
				const python = childProcess.spawn("python", args, {
					cwd: wptDir,
					stdio: "inherit",
				});

				return new Promise((resolve, reject) => {
					python.on("error", (e) => {
						reject(
							new Error("Error starting python server process:", e.message),
						);
					});

					resolve(
						Promise.all([
							Promise.resolve(python),
							pollForServer(
								`http://${config.browser_host}:${config.ports.http[0]}/`,
							),
							pollForServer(
								`https://${config.browser_host}:${config.ports.https[0]}/`,
							),
							pollForServer(
								`http://${config.browser_host}:${config.ports.ws[0]}/`,
							),
							pollForServer(
								`https://${config.browser_host}:${config.ports.wss[0]}/`,
							),
						]),
					);

					process.on("exit", () => {
						// Python doesn't register a default handler for SIGTERM and it doesn't run __exit__() methods of context
						// managers when it gets that signal. Using SIGINT avoids this problem.
						python.kill("SIGINT");
					});
				});
			},
			() => {
				throw new Error(
					"Host entries not present for web platform tests. See " +
						"https://github.com/w3c/web-platform-tests#running-the-tests",
				);
			},
		)
		.then(([server, firstURL]) => {
			return { server, url: firstURL };
		});
};

function pollForServer(url) {
	return requestHead(url, { strictSSL: false })
		.then(() => {
			console.log(`WPT server at ${url} is up!`);
			return url;
		})
		.catch((err) => {
			console.log(
				`WPT server at ${url} is not up yet (${err.message}); trying again`,
			);
			return q.delay(500).then(() => pollForServer(url));
		});
}
