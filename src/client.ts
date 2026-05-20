import { WedeClientOptions, WedeEvent, WedeZone, WedeSyncBatch, WedeConnectivityStatus, WedeResponse } from './types.js'
import { WedeError, WedeAuthError, WedeNetworkError } from './errors.js'

const DEFAULT_BASE_URL = 'https://api.wede.pt'
const DEFAULT_TIMEOUT = 10000
const DEFAULT_RETRIES = 3

export class WedeClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly retries: number

  constructor(options: WedeClientOptions) {
    if (!options.apiKey) throw new WedeAuthError('API key is required')
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT
    this.retries = options.retries ?? DEFAULT_RETRIES
  }

  private async request<T>(method: string, path: string, body?: unknown, attempt = 1): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)
    try {
      const res = await fetch(this.baseUrl + path, {
        method,
        headers: {
          'x-wede-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (res.status === 401) throw new WedeAuthError()
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as Record<string, unknown>
        throw new WedeError(
          (err.message as string) ?? 'Request failed',
          (err.error as string) ?? 'api_error',
          res.status
        )
      }
      return res.json() as Promise<T>
    } catch (err) {
      clearTimeout(timer)
      if (err instanceof WedeError) throw err
      if (attempt < this.retries) {
        await new Promise(r => setTimeout(r, 300 * attempt))
        return this.request<T>(method, path, body, attempt + 1)
      }
      throw new WedeNetworkError()
    }
  }

  async sendEvent(event: WedeEvent): Promise<WedeResponse<{ event_id: string }>> {
    return this.request('POST', '/v1/events', event)
  }

  async listEvents(params?: { zone_id?: string; vertical?: string; limit?: number }): Promise<WedeResponse<WedeEvent[]>> {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return this.request('GET', '/v1/events' + qs)
  }

  async listZones(): Promise<WedeResponse<WedeZone[]>> {
    return this.request('GET', '/v1/zones')
  }

  async getZone(zoneId: string): Promise<WedeResponse<WedeZone>> {
    return this.request('GET', '/v1/zones/' + zoneId)
  }

  async syncBatch(batch: WedeSyncBatch): Promise<WedeResponse<{ accepted: number; rejected: number }>> {
    return this.request('POST', '/v1/sync/batch', batch)
  }

  async getConnectivityStatus(zoneId: string): Promise<WedeResponse<WedeConnectivityStatus>> {
    return this.request('GET', '/v1/connectivity/status?zone_id=' + zoneId)
  }

  async reportConnectivity(report: { zone_id: string; state: string; channel_used: string }): Promise<void> {
    return this.request('POST', '/v1/connectivity/report', report)
  }

  async getTenantInfo(): Promise<WedeResponse<Record<string, unknown>>> {
    return this.request('GET', '/v1/tenant/me')
  }

  async getUsage(from: string, to: string): Promise<WedeResponse<Record<string, unknown>>> {
    return this.request('GET', '/v1/tenant/usage?from=' + from + '&to=' + to)
  }

  async listParsers(): Promise<WedeResponse<Record<string, unknown>[]>> {
    return this.request('GET', '/v1/parsers')
  }

  async getParser(parserId: string): Promise<WedeResponse<Record<string, unknown>>> {
    return this.request('GET', '/v1/parsers/' + parserId)
  }

  async createParser(parser: { vertical: string; name: string; description?: string; schema: Record<string, unknown>[] }): Promise<WedeResponse<Record<string, unknown>>> {
    return this.request('POST', '/v1/parsers', parser)
  }

  async updateParser(parserId: string, data: { name?: string; description?: string; schema?: Record<string, unknown>[]; is_active?: boolean }): Promise<WedeResponse<Record<string, unknown>>> {
    return this.request('PATCH', '/v1/parsers/' + parserId, data)
  }

  async getActiveParser(vertical: string): Promise<WedeResponse<Record<string, unknown>>> {
    return this.request('GET', '/v1/parsers/vertical/' + vertical + '/active')
  }
}
