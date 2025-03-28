import { FastifyInstance, FastifyRequest } from "fastify";
import { chromium } from "playwright";
import crypto from "crypto";

async function routes(app: FastifyInstance) {
    type UrlParamsType = { token: string }

    // A VIRER : à faire dans le client utilisant l'API
    // crypte url
    const algorithm = 'aes-256-cbc';
    const secretKey = process.env.ENCRYPT_KEY || 'mypassword';
    console.log("secretKey")
    console.log(secretKey)
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = Buffer.alloc(16, 0);

    const strToEncrypt = 'https://www.wikipedia.fr';
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let mystrEncrypted = cipher.update(strToEncrypt, 'utf8', 'hex')
    mystrEncrypted += cipher.final('hex');

    // encoded cryptedURL in base64
    const encryptedUrlBase64 = btoa(encodeURIComponent(mystrEncrypted))
    console.log("encryptedUrlBase64")
    console.log(encryptedUrlBase64)

    // route /
    app.get('/', async function handler() {
        return "Welcome on PDF generator"
    });

    // route /api/pdf
    app.get('/api/pdf', async (request: FastifyRequest<{ Querystring: UrlParamsType }>) => {
        // get the token given in query
        const { token } = request.query;
        if (!token) {
            return "Please, indicate the url to pdf"
        }

        // decode base64
        const urlEncrypted = decodeURIComponent(atob(token));

        // decrypte token to get url
        const algorithm = 'aes-256-cbc';
        const secretKey = process.env.ENCRYPT_KEY || 'mypassword';
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        const iv = Buffer.alloc(16, 0);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let url = decipher.update(urlEncrypted, 'hex', 'utf8');
        url += decipher.final('utf8');

        // ckeck if URL is valid
        const urlRegex = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})")
        if (!url.match(urlRegex)) {
            throw new Error("Invalid URL");
        }
        console.log("valid url")

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
