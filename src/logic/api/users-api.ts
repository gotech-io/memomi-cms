import { APIRequestContext } from '@playwright/test'
import { APIResponse, ApiBase } from '@testomate/framework'
import { LoginRequest } from './request/login-request.js'
import { LoginResponse } from './response/login-response.js'

export class UsersApi extends ApiBase {
  private _walmartGlassesId: string
  private _apparelSunglassesId: string
  private _functionalHealthReadingGlassesId: string

  constructor(apiContext: APIRequestContext) {
    super(apiContext)
    this._walmartGlassesId = '64c6b54145a76223cc2c600d'
    this._apparelSunglassesId = '650c113d122fd8663d36e2c2'
    this._functionalHealthReadingGlassesId = '6568779467a3d4d7a0c7dad4'
  }

  get apiEndpointUrl(): string {
    return 'https://cmsdevserverapi.azurewebsites.net/api'
  }

  public async login(loginRequest: LoginRequest): Promise<APIResponse<LoginResponse>> {
    return this.post<LoginResponse>(`${this.apiEndpointUrl}/users/login`, { data: loginRequest })
  }

  public async users(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/users`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async schemas(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/schema`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async containers(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/storage-management/containers`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async settings(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/settings`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async walmartGlasses(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/schema/${this._walmartGlassesId}`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async apparelSunglasses(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/schema/${this._apparelSunglassesId}`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async functionalHealthReadingGlasses(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/schema/${this._functionalHealthReadingGlassesId}`, { headers: { Authorization: `Bearer ${token}` } })
  }
}
