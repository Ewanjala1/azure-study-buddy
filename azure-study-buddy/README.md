# Azure Study Buddy

Explains Azure concepts with an analogy first, then the exam-ready definition, an exam tip and a check question. Includes a compare mode and three explanation levels.

## Structure
- `public/index.html`: single-file frontend (no build step)
- `server.js`: Express API; builds prompts, optionally retrieves sources from Azure AI Search, calls Azure OpenAI
- `.env.example`: configuration template

## Run locally
1. Install Node 20.6 or newer.
2. `npm install`
3. `cp .env.example .env` and fill in your Azure OpenAI endpoint, key and deployment name.
4. `npm start`, then open http://localhost:3000

## Grounding (optional)
Index a curated set of Microsoft Learn exam-skills pages in Azure AI Search with `title` and `content` fields, then set the three `AZURE_SEARCH_*` variables. Rename the fields in `ground()` if your index differs. Without them the app still works but answers come from the model alone.

## Deploy
Azure App Service (Node): set the `.env` values as application settings and use `npm start` as the startup command.

## Notes
- API versions and service names change; confirm them in the Azure docs.
- Keep keys in the server environment only, never in `public/`.
- Generated answers can be wrong. The UI links each answer to a Microsoft Learn search so learners can verify.
