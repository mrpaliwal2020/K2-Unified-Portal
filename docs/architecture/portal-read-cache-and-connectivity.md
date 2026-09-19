# Portal Read Cache and Connectivity

`src/core/cache/sessionReadCache.js` provides short-lived, browser-session
read caching. It returns the cache immediately when fresh, refreshes stale
entries from the network, and can return stale cached data with an explicit
`ApiFailure` when refresh fails.

Use it only for approved read models with a deliberate cache key and TTL:

```js
const result = await fetchWithSessionReadCache({
  key: `unit-list:${profileId}`,
  maxAgeMs: 5 * 60 * 1000,
  fetcher: () => getMyUnits(profileId, mobileNumber),
});
```

When `result.isStale` is true, render the cached-data/offline state rather than
claiming the data is current. Never use browser cache as an authorization
source; every server mutation and protected read remains backend-authorized.

`src/core/network/connectivity.js` exposes browser online/offline events.
`navigator.onLine` only indicates an available browser network route; a
request still decides whether the K2 backend is reachable.

## Offline-write boundary

Portal does **not** queue writes offline. Do not persist a mutation for later
replay until the backend contract provides idempotency keys, durable mutation
status, retry policy, conflict rules, and server acknowledgement. Without
those, browser replay can duplicate payments, member changes, uploads, or
other operational data.
