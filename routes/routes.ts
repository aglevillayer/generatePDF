import { FastifyInstance, FastifyRequest } from "fastify";
import puppeteer from 'puppeteer';

async function routes(app: FastifyInstance) {
    app.get('/', async function handler(request, reply) {
        return "Welcome on PDF generator"
    })

    type UrlParamsType = { url: String }
    app.get('/api/pdf/:url', async (request: FastifyRequest<{ Params: UrlParamsType }>, reply) => {
        console.log("Get your url")
        // get the url given in params
        const { url } = request.params;

        if (!url) {
            throw new Error('Invalid value')
        }

        return "I've got your url params, thx "
    })

    app.get('/api/pdf', async (request: FastifyRequest<{ Querystring: UrlParamsType }>, reply) => {
        console.log("Route /api/pdf ")
        // get the url given in query
        const { url } = request.query;

        // if (!url) {
        //     throw new Error('Invalid value')
        // }

        // ckeck if URL is valid
        const urlRegex = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})")
        if (!url.match(urlRegex)) {
            throw new Error("Invalid URL");
        }

        // launch the browser and open a new blank page
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // navigate to the given URL
        await page.goto(url.toString(), {
            waitUntil: 'networkidle2'
        });

        // generate pdf
        const pdf = await page.pdf({
            path: 'google.pdf',
            format: 'A4'
        });

        //await browser.close();
        return pdf;
    })
}

export default routes;
