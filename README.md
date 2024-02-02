# Approach Documentation

Documentation for the Approach Project.
Written using [starlight](starlight.astro.build).

## Getting it running locally

1. Clone the repo
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## To Edit the Docs

1. Edit the Sidebar: `astro.config.mjs`
2. Edit the Docs: `src/content/docs/`
(The Docs are written in Markdown, but you can use Astro Components in them.)
3. Edit the Homepage: `src/content/index.astro`

## To Deploy

### Locally

If you want to deploy on your own server, just run `bash dist.sh`

### Github Pages

However, if you want to deploy it on GitHub Pages, paste the following code

> https://paste.rs/NQMa5.yml

into `.github/workflows/deploy.yml`

Then commit the code, also don't forget to edit the astro.config.mjs's `base` url attribute so that Astro correctly 
recognizes the github page
