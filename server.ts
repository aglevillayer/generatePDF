// Import the framework and instantiate it
import Fastify from 'fastify'

const port = 3000;
const app = Fastify({
    logger: true
})


// Declare a route
app.get('/', async function handler(request, reply) {
    return "Hello World"
})

// Run the server!
try {
    app.listen({ port: port })
    console.log(`server is running on port ${port} 🚀`)
} catch (err) {
    app.log.error(err)
    process.exit(1)
}
