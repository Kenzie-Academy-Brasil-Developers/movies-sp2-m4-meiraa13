import { Request, Response } from "express";
import { IMovies, TMovieRequest } from "./interfaces";
import { client } from "./database";
import { QueryResult, QueryConfig } from "pg";
import format from "pg-format";

const createMovies = async(req:Request, res:Response):Promise<Response> =>{
    const movieData:TMovieRequest = req.body
     
    const queryString:string = `
        INSERT INTO
            movies
            (name, category, duration, price)
        VALUES
            ($1, $2, $3, $4)
        RETURNING *;
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:Object.values(movieData),
    } 

    const queryResult:QueryResult<IMovies> = await client.query(queryConfig)
    
    return res.status(201).json(queryResult.rows[0])
}

const listMovies = async (req:Request, res:Response):Promise<Response> =>{
    const queryString:string = `
        SELECT
            *
        FROM
            movies;
    `

    const queryResult:QueryResult<IMovies> = await client.query(queryString)

    return res.json(queryResult.rows)

}

const listMoviesById = async (req:Request, res:Response):Promise<Response> =>{

    const movie = res.locals.movie

    return res.json(movie)
}

const updateMovie = async (req:Request, res:Response):Promise<Response> =>{
    const { body, params } = req

    const updateColumns: string[] = Object.keys(body)
    const updateValues: string[] = Object.values(body)

    const queryString: string = format( `
        UPDATE
           movies
        SET (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *; 
    `,
        updateColumns,
        updateValues
    )

    const queryConfig: QueryConfig = {
        text:queryString,
        values:[params.id]
    }

    const queryResult: QueryResult<IMovies> = await client.query(queryConfig)

    return res.json(queryResult.rows[0])
    
}

const deleteMovie = async (req:Request, res:Response):Promise<Response> => {
    const { params } = req

    const queryString: string =  `
        DELETE FROM
           movies
        WHERE
            id = $1; 
    `
    

    const queryConfig: QueryConfig = {
        text:queryString,
        values:[params.id]
    }

    const queryResult: QueryResult<IMovies> = await client.query(queryConfig)

    return res.status(204).send()

}


export { createMovies, listMovies, listMoviesById, updateMovie, deleteMovie }