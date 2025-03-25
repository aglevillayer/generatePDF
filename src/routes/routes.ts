import { FastifyInstance, FastifyRequest } from "fastify";
import { chromium } from "playwright"

async function routes(app: FastifyInstance) {
    type UrlParamsType = { url: String }

    // route /
    app.get('/', async function handler() {
        console.log("Route /")
        return "Welcome on PDF generator, feel free to use it"
    });

    // route /api/pdf
    app.get('/api/pdf', async (request: FastifyRequest<{ Querystring: UrlParamsType }>) => {
        console.log("Route /api/pdf")

        // get the url given in query
        const { url } = request.query;
        if (!url) {
            return "Please, indicate the url to pdf"
        }

        // ckeck if URL is valid
        const urlRegex = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})")
        if (!url.match(urlRegex)) {
            throw new Error("Invalid URL");
        }

        // launch the browser and open a new blank page
        const browser = await chromium.launch()
        const page = await browser.newPage();

        // navigate to the given URL
        await page.goto(url.toString(), { waitUntil: "networkidle" });

        // generates PDF with 'print' media type.
        await page.emulateMedia({ media: 'print' });
        const pdf = await page.pdf({
            format: "A4"
        });

        await browser.close();
        return pdf;
    });
}

export default routes;
