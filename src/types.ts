
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

export type MissionStatus = 'CREATED' | 'SENT' | 'ACK' | 'ON_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'FAILED'

export interface WedeTeamMember {
  id: string
  team_id: string
  name: string
  role: string
  status: 'available' | 'on_mission' | 'offline'
  lat?: number
  lng?: number
  last_seen?: string
}

export interface WedeTeam {
  id: string
  tenant_id: string
  name: string
  type: string
  vertical: string
  status: 'available' | 'on_mission' | 'offline'
  zone_id?: string
  members?: WedeTeamMember[]
  created_at: string
  updated_at: string
}

export interface WedeScoredTeam {
  team_id: string
  team_name: string
  distance_km: number
  eta_min: number
  score: number
  recommended: boolean
  channel: 'internet' | 'sms' | 'voice'
}

export interface WedeMission {
  id: string
  event_id: string
  team_id: string
  status: MissionStatus
  channel_used: string
  vertical?: string
  priority?: string
  payload?: Record<string, unknown>
  feedback?: Record<string, unknown>
  notes?: string
  event_lat?: number
  event_lng?: number
  dispatched_at: string
  sent_at?: string
  ack_at?: string
  on_route_at?: string
  on_site_at?: string
  completed_at?: string
  failed_at?: string
}

export interface WedeBilling {
  tenant_id: string
  country: string
  current_plan: {
    id: string
    name: string
    display_name: string
    max_events_per_year: number
    pricing: { price_yearly: number; currency: string } | null
  } | null
  usage: {
    events_this_year: number
    sms_used: number
    voice_used: number
    dispatches_total: number
    missions_total: number
  }
}
