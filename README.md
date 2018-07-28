# contentjet-to-pdf-example

An example of generating a PDF using Puppeteer with content fetched from an install of [Contentjet](https://contentjet.github.io), the open source headless CMS.

This script expects configuration via environment variables. You MUST set the following environment variables either exported directly or by adding a .env file in the root of this project. e.g.

```
API_URL=https://api.yourcontentjetinstall.com/
CLIENT_ID=bb31db8ac1c34d64bcedd201cc43de33f
CLIENT_SECRET=7d997e3a1a8044f2a3f41d96a857da34
PROJECT_ID=6
ENTRY_ID=22
```
