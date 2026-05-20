# @wede/sdk

Official JavaScript/TypeScript SDK for the Wede Technology platform.

Wede is an offline-first infrastructure layer that keeps critical digital services operational when connectivity, cloud, or infrastructure fails.

## Installation

npm install @wede/sdk

## Quick Start

import { WedeClient } from '@wede/sdk'

const client = new WedeClient({ apiKey: 'wede_live_YOUR_KEY' })

// Send an event
await client.sendEvent({
  type: 'EMERGENCY',
  priority: 'critical',
  vertical: 'healthcare',
  idempotency_key: 'evt-001',
  payload: { patient_id: 'PT123', location: '-38.71,9.13' }
})

// List zones
const zones = await client.listZones()

// Sync offline batch
await client.syncBatch({
  events: [...],
  device_id: 'device-001',
  captured_at: new Date().toISOString()
})

## Methods

- sendEvent(event) — submit a new event
- listEvents(params?) — list events
- listZones() — list all zones
- getZone(zoneId) — get a specific zone
- syncBatch(batch) — sync offline events
- getConnectivityStatus(zoneId) — get zone connectivity
- reportConnectivity(report) — report connectivity state
- getTenantInfo() — get tenant details
- getUsage(from, to) — get usage stats

## Documentation

https://docs.wede.pt

## License

MIT
