const inWebWorkerContext = () => {
	/* globals WorkerGlobalScope, self */
	return (
		typeof WorkerGlobalScope !== "undefined" &&
		self instanceof WorkerGlobalScope
	);
};

const inBrowserContext = () => {
	/* globals window */
	return (
		(typeof window === "object" && window === window.self) ||
		inWebWorkerContext()
	);
};

module.exports = { inWebWorkerContext, inBrowserContext };
