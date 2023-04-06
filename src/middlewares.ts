import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { IMovies } from "./interfaces";

const ensureMovieExistsMiddleware = async (req:Request, res:Response, next:NextFunction): Promise<Response | void> =>{
    const id:number = Number(req.params.id)

    const queryString:string = `
        SELECT
            *
        FROM
            movies
        WHERE
            id  = $1;
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values: [id]
    }

    const queryResult:QueryResult<IMovies> = await client.query(queryConfig) 
  
    if (queryResult.rowCount === 0){
        return res.status(404).json({
            "error": 'Movie not found!'
        })
    }

    res.locals.movie = queryResult.rows[0]

    return next()
}

const verifyNameExists = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const name = req.body.name

    const queryString = `
        SELECT
            *
        FROM
            movies
        WHERE 
            name = $1
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[name]
    }

    const queryResult:QueryResult = await client.query(queryConfig)

    if (queryResult.rowCount > 0){
        return res.status(409).json({
            "error": 'Movie name already exists!'
        })
    }

    return next()
}

const filterMovieByCategory = async (req:Request, res:Response, next:NextFunction):Promise<Response | void> =>{
    const category = req.query.category

    const queryString = `
        SELECT
            *
        FROM
            movies
        WHERE 
            category = $1
    `

    const queryConfig:QueryConfig = {
        text:queryString,
        values:[category]
    }

    const queryResult:QueryResult<IMovies> = await client.query(queryConfig)

    if (queryResult.rowCount > 0){
        return res.json(queryResult.rows)
    }

    return next()
}

export { ensureMovieExistsMiddleware, verifyNameExists, filterMovieByCategory }