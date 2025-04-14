import { FastifyInstance, FastifyRequest } from "fastify";
import { chromium } from "playwright";
import crypto from "crypto";

async function routes(app: FastifyInstance) {
    type TokenParamsType = {
        token: string
    }
    // type ParamsType = { token: string }


    // route /
    app.get('/', async function handler() {
        const givenToken = {
            url: "https://lagirodiere.com",
            pagination: true,
            header: "<span style=\"font-size: 10px;color:#000000;padding:10px;\">ASUL ULTIMATE & DISC GOLF</span>",
            footer: "<span style=\"font-size: 10px;color:#000000;padding:10px;\">FOOTER</span>"

        }
        const stringifiedToken = JSON.stringify(givenToken);

        // encrypte token
        const algorithm = 'aes-256-cbc';
        if (!process.env.ENCRYPT_KEY) {
            throw new Error("Error in decrypting token");
        }
        const secretKey = process.env.ENCRYPT_KEY;
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        const iv = Buffer.alloc(16, 0);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encryptedToken = cipher.update(stringifiedToken, 'utf8', 'hex');
        encryptedToken += cipher.final('hex');
        console.log("encryptedToken")
        console.log(encryptedToken)

        // code encrypted token
        const codedToken = Buffer.from(encryptedToken, "hex").toString("base64url");

        console.log("codedToken")
        console.log(codedToken)


        return "Welcome on PDF generator"
    });

    // route /api/pdf
    app.get('/api/pdf', async (request: FastifyRequest<{ Querystring: TokenParamsType }>) => {
        // get the token given in query
        const { token } = request.query;
        if (!token) {
            throw new Error("No token given");
        }

        // decode base64url
        const decodedToken = Buffer.from(token, "base64url").toString("hex")

        // decrypte token to get url
        const algorithm = 'aes-256-cbc';
        if (!process.env.ENCRYPT_KEY) {
            throw new Error("Error in decrypting token");
        }
        const secretKey = process.env.ENCRYPT_KEY;
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        const iv = Buffer.alloc(16, 0);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let decryptedToken = decipher.update(decodedToken, 'hex', 'utf8');
        decryptedToken += decipher.final('utf8');

        console.log("decryptedToken")
        console.log(decryptedToken)

        const params = JSON.parse(decryptedToken)
        console.log("obj")
        console.log(params)

        // ckeck if URL is valid
        const urlRegex = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})")
        if (!params.url.match(urlRegex)) {
            throw new Error("Invalid URL");
        }

        // launch the browser and open a new blank page
        const browser = await chromium.launch()
        const page = await browser.newPage();

        // navigate to the given URL
        await page.goto(params.url.toString(), { waitUntil: "networkidle" });

        // generates PDF with 'print' media type.
        await page.emulateMedia({ media: 'print' });
        const paginationFooter = `<div style=\"font-size: 5px;color:#AAA2A0;\">
                                        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                                </div>`
        const footer = (params.footer && params.pagination) ?
            `<div style=\"font-size: 10px;color:#000000;\"> ${params.footer} ${paginationFooter}</div>`
            : params.footer ?
                params.footer
                : params.pagination ?
                    paginationFooter
                    : ""

        //  params.footer ? params.footer : 
        const pdfOptions = {
            format: "A4",
            displayHeaderFooter: true,
            footerTemplate: footer,
            headerTemplate: params.header ? params.header : "",
            margin: { top: params.header ? "100px" : "0px", bottom: (params.footer | params.pagination) ? "100px" : "0px" },
        }

        const pdf = await page.pdf(pdfOptions);

        await browser.close();
        return pdf;
    });
}

export default routes;
