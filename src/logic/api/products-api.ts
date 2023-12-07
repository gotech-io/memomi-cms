import { ApiBase, APIResponse } from '@testomate/framework'
import { APIRequestContext } from '@playwright/test'
import { ProductResponse } from './response/product-response.js'
import { ProductRequest } from './request/product-request.js'

export class ProductsApi extends ApiBase {
  constructor(apiContext: APIRequestContext) {
    super(apiContext)
  }

  get apiEndpointUrl(): string {
    return 'https://cmsdevserverapi.azurewebsites.net/api/products'
  }

  public async createProduct(productRequest: ProductRequest, token: string): Promise<APIResponse<ProductResponse>> {
    return this.post<ProductResponse>(`${this.apiEndpointUrl}`, {
      data: productRequest,
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  public async getProduct(gtin: string, token: string): Promise<APIResponse<ProductResponse>> {
    return this.get<ProductResponse>(`${this.apiEndpointUrl}/${gtin}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  public async deleteProduct(gtin: string, token: string): Promise<void> {
    await this.delete(`${this.apiEndpointUrl}/${gtin}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}
