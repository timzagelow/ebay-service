# ebay-service

A service to synchronize inventory, fetch orders, and add tracking information on eBay. Uses `rsmq` queue to parse out jobs of adding/removing/updating listings, creating orders, and adding tracking.

Depends on API endpoints that are specifically modeled around vinyl records.
