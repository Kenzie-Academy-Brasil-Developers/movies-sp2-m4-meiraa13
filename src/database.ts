import { Client } from "pg";

const client: Client = new Client({
    user:'Marcelo',
    host:'localhost',
    port:5432,
    password:'marme455',
    database:'movies_sp2'
})

const startDatabase = async (): Promise<void> => {
    await client.connect()
    console.log('Database connected')

}

export { client, startDatabase }