export interface WedeClientOptions {
  apiKey: string
  baseUrl?: string
  timeout?: number
  retries?: number
}

export interface WedeEvent {
  type: string
  priority?: 'low' | 'normal' | 'high' | 'critical'
  vertical?: string
  idempotency_key: string
  payload: Record<string, unknown>
  zone_id?: string
  channel_preference?: 'rest_full' | 'rest_compressed' | 'sms' | 'queued_offline'
}

export interface WedeZone {
  zone_id: string
  name: string
  country: string
  region?: string
  connectivity_state: 'online' | 'degraded' | 'offline'
  verticals_active: string[]
}

export interface WedeSyncBatch {
  events: WedeEvent[]
  device_id?: string
  captured_at: string
}

export interface WedeConnectivityStatus {
  zone_id: string
  state: 'online' | 'degraded' | 'offline'
  latency_ms?: number
  channel_available: string[]
  reported_at: string
}

export interface WedeResponse<T> {
  data: T
  request_id: string
  timestamp: string
}
