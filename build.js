require('dotenv').config();
const url = require('url');
const puppeteer = require('puppeteer');
const axios = require('axios');
const sass = require('node-sass');
const marked = require('marked');
const nunjucks = require('nunjucks');
nunjucks.configure('./src/templates', { watch: false, noCache: true })

const authenticate = async (apiUrl, projectId, clientId, clientSecret) => {
  const response = await axios.post(
    url.resolve(apiUrl, `/project/${projectId}/client/authenticate`),
    {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }
  );
  return response.data.access_token;
}

const fetchEntry = async (apiUrl, token, projectId, entryId) => {
  const response = await axios.get(
    url.resolve(apiUrl, `/project/${projectId}/entry/${entryId}`),
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )
  return response.data;
}

const main = async () => {
  const { API_URL, PROJECT_ID, ENTRY_ID, CLIENT_ID, CLIENT_SECRET } = process.env;
  try {
    // Authenticate and fetch single entry from Contentjet
    const token = await authenticate(API_URL, PROJECT_ID, CLIENT_ID, CLIENT_SECRET);
    const entry = await fetchEntry(API_URL, token, PROJECT_ID, ENTRY_ID);
    // Convert our markdown and sass and render to our template
    const content = marked(entry.fields.content);
    const { css } = sass.renderSync({ file: './src/styles/main.scss' });
    const document = nunjucks.render('main.njk', { content, css });
    // Generate PDF using headless Chrome
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('data:text/html;charset=UTF-8,' + document, { waitUntil: 'networkidle0' });
    await page.pdf({ path: 'output.pdf', format: 'A4', printBackground: true });
    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

main();
