import { APIRequestContext } from '@playwright/test'
import { APIResponse, ApiBase } from '@testomate/framework'
import { LoginRequest } from './request/login-request.js'
import { LoginResponse } from './response/login-response.js'

export class UsersApi extends ApiBase {
  constructor(apiContext: APIRequestContext) {
    super(apiContext)
  }

  get apiEndpointUrl(): string {
    return 'https://cmsdevserverapi.azurewebsites.net/api/users'
  }

  public async login(loginRequest: LoginRequest): Promise<APIResponse<LoginResponse>> {
    return this.post<LoginResponse>(`${this.apiEndpointUrl}/login`, { data: loginRequest })
  }
}
