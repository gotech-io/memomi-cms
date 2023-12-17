import { APIResponse, expect, test } from '@testomate/framework'
import { UsersApi } from '../../logic/api/users-api.js'
import { ProductsApi } from '../../logic/api/products-api.js'
import { configProvider } from '../../config/index.js'
import { loginRequest } from '../../logic/api/request/login-request.js'
import { productRequest } from '../../logic/api/request/product-request.js'
import { LoginResponse } from '../../logic/api/response/login-response.js'
import { generateProductGtin } from '../../logic/utils.js'

test.describe('Api tests', () => {
  let productGtin: string
  let loginApi: UsersApi
  let productsApi: ProductsApi
  let loginApiRes: APIResponse<LoginResponse>
  let loginToken: string

  test.beforeEach(async ({ testContext }) => {
    loginApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)
    loginApiRes = await loginApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))
    loginToken = (await loginApiRes.getJsonData()).item.token
    productGtin = generateProductGtin()
  })

  test('Login', async () => {
    expect(loginApiRes.statusCode).toEqual(200)
  })

  test('Create product', async ({ testContext }) => {
    testContext.addTearDownAction(() => productsApi.deleteProduct(productGtin, loginToken))

    const createProductRes = await productsApi.createProduct(productRequest(productGtin), loginToken)
    expect(createProductRes.statusCode).toEqual(201)
  })

  test('Delete product', async () => {
    await productsApi.createProduct(productRequest(productGtin), loginToken)
    const deleteProductRes = await productsApi.deleteProduct(productGtin, loginToken)
    expect(deleteProductRes.statusCode).toEqual(200)
  })
})
