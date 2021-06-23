# ebay-service

A service to synchronize inventory, fetch orders, and add tracking information on eBay. Uses `rsmq` queue to parse out jobs of adding/removing/updating listings, creating orders, and adding tracking.

`redis` is used to keep track of the job run times. `mongo` is used to store eBay-specific data related to inventory and processed orders.

Depends on API endpoints that are specifically modeled around vinyl records.
