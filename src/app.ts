import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovies, deleteMovie, listMovies, listMoviesById, updateMovie } from "./logic";
import { ensureMovieExistsMiddleware, filterMovieByCategory, verifyNameExists } from "./middlewares";

const app:Application = express()
app.use(express.json())

app.listen(3000, async () =>{
    await startDatabase()
    console.log('Server is running!')
})

app.post('/movies',verifyNameExists, createMovies)
app.get('/movies',filterMovieByCategory, listMovies)
app.get('/movies/:id', ensureMovieExistsMiddleware, listMoviesById)
app.patch('/movies/:id',ensureMovieExistsMiddleware, verifyNameExists, updateMovie)
app.delete('/movies/:id',ensureMovieExistsMiddleware ,deleteMovie)