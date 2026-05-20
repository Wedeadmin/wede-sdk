
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

export type WedeFieldType =
  | 'string' | 'number' | 'boolean' | 'gps' | 'text'
  | 'timestamp' | 'enum' | 'phone' | 'email' | 'address' | 'hardware_id'

export type WedeFieldSection = 'core' | 'location' | 'human' | 'hardware' | 'team' | 'custom'

export interface WedeParserField {
  id: string
  name: string
  sms_code: string
  type: WedeFieldType
  required: boolean
  enabled: boolean
  offline_capable: boolean
  section: WedeFieldSection
  max_bytes: number
  description?: string
  enum_values?: string[]
  legal?: boolean
  custom?: boolean
}

export interface WedeParser {
  id: string
  tenant_id: string
  vertical: string
  version: number
  name: string
  description?: string
  is_active: boolean
  schema: WedeParserField[]
  created_at: string
  updated_at: string
}

export interface WedeWebhook {
  id: string
  url: string
  events: string[]
  is_active: boolean
  secret?: string
  created_at: string
}

export interface WedeCreateWebhook {
  url: string
  events: string[]
  secret?: string
}

export interface WedeTenant {
  tenant_id: string
  name: string
  license_type: string
  status: string
  verticals_active: string[]
  feature_flags: Record<string, boolean>
  sla_target_uptime_pct: number
  created_at: string
}

export interface WedeUsage {
  tenant_id: string
  period: { from: string; to: string }
  totals: {
    events: number
    offline_events: number
    sms_messages: number
    voice_calls: number
  }
  by_vertical: Record<string, number>
  by_channel: Record<string, number>
}
