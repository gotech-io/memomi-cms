export interface LoginResponse {
  item: {
    name: string
    email: string
    password: string
    role: number
    token: string
    permissions: number[]
  }
}
