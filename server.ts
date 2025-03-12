// Import the framework and instantiate it
import Fastify from 'fastify'

const port = 3000;
const app = Fastify({
    logger: true
})


// Declare a route
app.get('/', async function handler(request, reply) {
    return "Welcome on PDF generator"
})

app.get('/api/pdf', async function handler(request, reply) {
    return "Give me your url"
})

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
