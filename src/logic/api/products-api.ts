import { ApiBase, APIResponse } from '@testomate/framework'
import { APIRequestContext } from '@playwright/test'
import { ProductResponse } from './response/product-response.js'
import { ProductRequest } from './request/product-request.js'

export class ProductsApi extends ApiBase {
  constructor(apiContext: APIRequestContext) {
    super(apiContext)
  }

  get apiEndpointUrl(): string {
    return 'https://cmsdevserverapi.azurewebsites.net/api'
  }

  public async createProduct(productRequest: ProductRequest, token: string): Promise<APIResponse<ProductResponse>> {
    return this.post<ProductResponse>(`${this.apiEndpointUrl}/products`, {
      data: productRequest,
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}
