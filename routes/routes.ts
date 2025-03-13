import { FastifyInstance, FastifyRequest } from "fastify";
import puppeteer from 'puppeteer';

async function routes(app: FastifyInstance) {
    app.get('/', async function handler(request, reply) {
        return "Welcome on PDF generator"
    })

    type UrlParamsType = { url: String }
    app.get('/api/pdf/:url', async (request: FastifyRequest<{ Params: UrlParamsType }>, reply) => {
        console.log("Get your url")
        // récupérer l'url
        const { url } = request.params;
        console.log(url)

        if (url) {
            throw new Error('Invalid value')
        }

        return "I've got your url params, thx "
    })

    app.get('/api/pdf', async (request: FastifyRequest<{ Querystring: UrlParamsType }>, reply) => {
        console.log("on '/api/pdf?url=url' ")
        // get the url given in query
        const { url } = request.query;
        console.log(url) // retourne ce qui est passé après ?url=

        if (!url) {
            throw new Error('Invalid value')
        }

        // valider l'url à l'aide d'un regex (à récupérer un bon regex)
        const urlRegex = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})")
        if (url.match(urlRegex)) {
            console.log("Valid URL");
        } else {
            throw new Error("Invalid URL");
        }

        // lancer un navigateur en tâche de fond (puppeteer)
        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({ headless: false });
        console.log("launch browser")
        const page = await browser.newPage();

        // charger la page demandée dedans
        // Navigate the page to a URL.
        await page.goto(url.toString(), {
            waitUntil: 'networkidle2' // waitUntil: ‘networkidle0’ option means that Puppeteer considers navigation to be finished when there are no network connections for at least 500 ms
        });
        console.log("On a bien chargé la page !");

        // exporter en PDF (regarder la doc de la librairie pour trouver la fonctionnalité)
        const result = await page.pdf({
            path: 'google.pdf', // créer mon fichier pdf dans mon projet, si cette option "path" n'est pas spécifiée, cela retourne un buffer
            format: 'A4'
        });
        // console.log("pdf:" + result);
        console.log(typeof (result))

        // l'export devrait retourner un stream ou un buffer qu'il faut passer en réponse à la requête HTTP
        await browser.close();
        return "on '/api/pdf?url=url'"
    })
}

export default routes;
