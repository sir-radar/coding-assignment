import fetchWrapper from './fetchWrapper'

global.fetch = jest.fn()

describe('fetchWrapper', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make a GET request and return data on success', async () => {
    const mockResponse = { message: 'Success' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse)
    })

    const result = await fetchWrapper<{ message: string }>('https://api.example.com/data')

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined
    })
    expect(result).toEqual({
      data: mockResponse,
      error: null,
      status: 200
    })
  })

  it('should make a POST request with a JSON body and return data on success', async () => {
    const mockResponse = { id: 1, message: 'Created' }
    const postData = { name: 'John' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: jest.fn().mockResolvedValue(mockResponse)
    })

    const result = await fetchWrapper<{ id: number; message: string }>('https://api.example.com/data', {
      method: 'POST',
      body: postData
    })

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
    expect(result).toEqual({
      data: mockResponse,
      error: null,
      status: 201
    })
  })

  it('should handle a failed request and return an error', async () => {
    const mockError = { message: 'Not Found' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue(mockError)
    })

    const result = await fetchWrapper<{ message: string }>('https://api.example.com/data', {
      method: 'GET'
    })

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined
    })
    expect(result).toEqual({
      data: null,
      error: mockError,
      status: 404
    })
  })

  it('should handle network errors gracefully', async () => {
    ;(fetch as jest.Mock).mockRejectedValue(new Error('Network Error'))

    const result = await fetchWrapper<{ message: string }>('https://api.example.com/data', {
      method: 'GET'
    })

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined
    })
    expect(result).toEqual({
      data: null,
      error: 'Network Error',
      status: 500
    })
  })

  it('should include custom headers in the request', async () => {
    const mockResponse = { message: 'Success' }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse)
    })

    const result = await fetchWrapper<{ message: string }>('https://api.example.com/data', {
      method: 'GET',
      headers: { Authorization: 'Bearer token' }
    })

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      },
      body: undefined
    })
    expect(result).toEqual({
      data: mockResponse,
      error: null,
      status: 200
    })
  })
})
