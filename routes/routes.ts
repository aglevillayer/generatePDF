import { FastifyInstance, FastifyRequest } from "fastify";

async function routes(app: FastifyInstance) {
    app.get('/', async function handler(request, reply) {
        return "Welcome on PDF generator"
    })

    // app.get('/api/pdf', async (request, reply) => {
    //     console.log("Pass your url in the url")
    //     return "Give me your url"
    // })

    type UrlParamsType = { url: String }
    app.get('/api/pdf/:url', async (request: FastifyRequest<{ Params: UrlParamsType }>, reply) => {
        console.log("Get your url")
        // récupérer l'url
        // ?url={url}
        const { url } = request.params;
        console.log(url)

        // if (!url) {
        //     throw new Error('Invalid value')
        // }

        // valider l'url à l'aide d'un regex
        // lancer un navigateur en tâche de fond (puppeteer)
        // charger la page demandée dedans
        // exporter en PDF (regarder la doc de la librairie pour trouver la fonctionnalité)
        // l'export devrait retourner un stream ou un buffer qu'il faut passer en réponse à la requête HTTP
        return "I've got your url, thx "
    })

    app.get('/api/pdf', async (request: FastifyRequest<{ Querystring: UrlParamsType }>, reply) => {
        console.log("on '/api/pdf?url={url}' ")
        // get the url given in query
        const { url } = request.query;
        console.log(url) // retourne ce qui est passé après ?url=

        if (!url) {
            throw new Error('Invalid value')
        }

        // valider l'url à l'aide d'un regex
        // lancer un navigateur en tâche de fond (puppeteer)
        // charger la page demandée dedans
        // exporter en PDF (regarder la doc de la librairie pour trouver la fonctionnalité)
        // l'export devrait retourner un stream ou un buffer qu'il faut passer en réponse à la requête HTTP
        return "on '/api/pdf?url={url}'"
    })
}

export default routes;
