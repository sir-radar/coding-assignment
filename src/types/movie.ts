export interface IMovie {
	id: string;
	overview: string;
	poster_path: string;
	release_date: string;
	title: string;
}

export interface MovieResponse {
	movies: {
			results: IMovie[]
	},
	fetchStatus: string;
}
