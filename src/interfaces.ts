interface IMovies {
    id:number,
    name:string,
    category:string,
    duration:number,
    price:number
}

type TMovieRequest = Omit<IMovies, 'id'>

export { IMovies, TMovieRequest }