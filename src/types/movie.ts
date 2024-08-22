export interface IMovie {
  id: string
  overview: string
  poster_path: string
  release_date: string
  title: string
}

export interface MovieSlice {
  movies: {
    results: IMovie[]
    total_pages: number
  }
  fetchStatus: FetchStatus
}

export enum FetchType {
  SEARCH = 'search',
  INFINITE = 'infinite'
}

export enum FetchStatus {
  SUCCESS = 'success',
  LOADING = 'loading',
  ERROR = 'error',
  IDLE = ''
}
