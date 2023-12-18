import { APIResponse, expect, test } from '@testomate/framework'
import { UsersApi } from '../../logic/api/users-api.js'
import { ProductsApi } from '../../logic/api/products-api.js'
import { configProvider } from '../../config/index.js'
import { loginRequest } from '../../logic/api/request/login-request.js'
import { productRequest } from '../../logic/api/request/product-request.js'
import { LoginResponse } from '../../logic/api/response/login-response.js'
import { generateProductGtin } from '../../logic/utils.js'

test.describe('@Api tests', () => {
  let productGtin: string
  let adminApi: UsersApi
  let productsApi: ProductsApi
  let loginApiRes: APIResponse<LoginResponse>
  let loginToken: string

  test.beforeEach(async ({ testContext }) => {
    adminApi = await testContext.getApi(UsersApi)
    productsApi = await testContext.getApi(ProductsApi)
    loginApiRes = await adminApi.login(loginRequest(configProvider.cmsSystem, configProvider.cmsPassword))
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

  test('Users', async () => {
    const fetchUsers = await adminApi.users(loginToken)
    expect(fetchUsers.statusCode).toEqual(200)
  })

  test('Schemas', async () => {
    const fetchSchemas = await adminApi.schemas(loginToken)
    expect(fetchSchemas.statusCode).toEqual(200)
  })

  test('Containers', async () => {
    const fetchContainers = await adminApi.containers(loginToken)
    expect(fetchContainers.statusCode).toEqual(200)
  })

  test('Settings', async () => {
    const fetchSettings = await adminApi.settings(loginToken)
    expect(fetchSettings.statusCode).toEqual(200)
  })

  test('Walmart Glasses', async () => {
    const walmartGlasses = await adminApi.walmartGlasses(loginToken)
    expect(walmartGlasses.statusCode).toEqual(200)
  })

  test('Apparel Sunglasses', async () => {
    const apparelSunglasses = await adminApi.apparelSunglasses(loginToken)
    expect(apparelSunglasses.statusCode).toEqual(200)
  })
})
