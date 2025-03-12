// Import the framework and instantiate it
import Fastify from 'fastify'
import routes from "./routes/routes"

const port = 3000;
const app = Fastify({
    logger: true
})


// Declare a route
app.register(routes);


// Run the server!
const start = async () => {
    try {
        await app.listen({ port: port })
        console.log(`server is running on port ${port} 🚀`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()
