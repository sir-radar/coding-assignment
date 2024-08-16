export interface IMovie {
  id: string
  overview: string
  poster_path: string
  release_date: string
  title: string
}

export interface MovieResponse {
  movies: {
    results: IMovie[]
    total_pages: number
  }
  fetchStatus: string
}

export enum FetchType {
  SEARCH = 'search',
  INFINITE = 'infinite'
}
