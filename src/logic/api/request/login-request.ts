export interface LoginRequest {
  email: string
  password: string
}

export const loginRequest = (email: string, password: string): LoginRequest => {
  return { email, password }
}
