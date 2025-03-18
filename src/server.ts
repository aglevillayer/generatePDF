import Fastify from 'fastify'
import routes from "./routes/routes"

const port = 3000;
const app = Fastify({
    logger: true
})

// declare routes
app.register(routes);

// run the server
export const start = async () => {
    try {
        await app.listen({ port: port, host: "0.0.0.0" })
        console.log(`server is running on port ${port} 🚀`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
