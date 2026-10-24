/**
 * Internal dependencies
 */
import {
	geocodeAddress,
	MIN_REQUEST_INTERVAL_MS,
	resetGeocoderSpacing,
} from "../geocoder";

describe("geocodeAddress request spacing", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		resetGeocoderSpacing();
		window.sessionStorage.clear();
		global.fetch = jest.fn(() =>
			Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
		);
	});

	afterEach(() => {
		jest.useRealTimers();
		delete global.fetch;
	});

	it("waits at least two seconds between network requests", async () => {
		expect(MIN_REQUEST_INTERVAL_MS).toBeGreaterThanOrEqual(2000);

		await geocodeAddress({ query: "Austin TX" });
		expect(global.fetch).toHaveBeenCalledTimes(1);

		const second = geocodeAddress({ query: "Dallas TX" });
		await jest.advanceTimersByTimeAsync(MIN_REQUEST_INTERVAL_MS - 1);
		expect(global.fetch).toHaveBeenCalledTimes(1);

		await jest.advanceTimersByTimeAsync(1);
		await second;
		expect(global.fetch).toHaveBeenCalledTimes(2);
	});

	it("serves a repeated search from the cache without waiting or fetching", async () => {
		await geocodeAddress({ query: "Austin TX" });
		await geocodeAddress({ query: "Austin TX" });

		expect(global.fetch).toHaveBeenCalledTimes(1);
	});

	it("sends nothing when the search is cancelled while it waits", async () => {
		await geocodeAddress({ query: "Austin TX" });

		const controller = new AbortController();
		const pending = geocodeAddress({ query: "Dallas TX", signal: controller.signal });
		controller.abort();
		await jest.advanceTimersByTimeAsync(MIN_REQUEST_INTERVAL_MS);

		await expect(pending).resolves.toEqual([]);
		expect(global.fetch).toHaveBeenCalledTimes(1);
	});
});
