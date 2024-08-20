type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type FetchOptions = {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: unknown
}

type FetchResponse<T> = {
  data: T | null
  error: string | null
  status: number
}

async function fetchWrapper<T>(url: string, options: FetchOptions = {}): Promise<FetchResponse<T>> {
  const { method = 'GET', headers = {}, body } = options

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  }

  try {
    const response = await fetch(url, fetchOptions)
    const data: T = await response.json()

    if (!response.ok) {
      return { data: null, error: data as unknown as string, status: response.status }
    }

    return { data, error: null, status: response.status }
  } catch (error) {
    return { data: null, error: (error as Error).message, status: 500 }
  }
}

export default fetchWrapper
