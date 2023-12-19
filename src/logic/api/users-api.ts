import { APIRequestContext } from '@playwright/test'
import { APIResponse, ApiBase } from '@testomate/framework'
import { LoginRequest } from './request/login-request.js'
import { LoginResponse } from './response/login-response.js'
import { ProductId } from '../enum/product-id.js'

export class UsersApi extends ApiBase {
  constructor(apiContext: APIRequestContext) {
    super(apiContext)
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
    return this.get(`${this.apiEndpointUrl}/schema/${ProductId.WalmartGlasses}`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async apparelSunglasses(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/schema/${ProductId.ApparelSunglasses}`, { headers: { Authorization: `Bearer ${token}` } })
  }

  public async functionalHealthReadingGlasses(token: string): Promise<APIResponse<void>> {
    return this.get(`${this.apiEndpointUrl}/schema/${ProductId.FunctionalHealthReadingGlasses}`, { headers: { Authorization: `Bearer ${token}` } })
  }
}
