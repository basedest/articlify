# Articlify

_**Blog app based on Next.js web framework**_

---

> ⚠️ **Articlify website is currently not feeling good**    
> The codebase is extremely outdated and some APIs rely on old domain that isn't available anymore    
> I'll actualize codebase and make app work when I'll have some free time (this will **NOT** happen anytime soon)

It uses MongoDB for data storage.    

## Functionality

- article CRUD operations
- rich-text editor
- image upload
- user auth
- administration support
- pagination
- searching
- tags filter
- dashboard

## Getting app running on your machine

In order to run server on your machine you have to define these environment variables:
- `MONGODB_URI` - URI to mongodb database
- `NEXTAUTH_URL` - root path of your app (e.g. http://localhost:3000)
- `NEXTAUTH_SECRET` - a random string used to hash tokens, sign/encrypt cookies and generate cryptographic keys      

First, install dependencies:

```bash
npm install
# or
yarn
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you're ready to push your app to production follow this:
- build project for production:
```bash
npm run build
# or
yarn build
```
- start the production server:
```bash
npm run start
# or
yarn start
```

## What's coming in future updates?

I'm planning on following this roadmap:
- refactor codebase (more on that later)
- imporve overall design and make it more consistent and mobile-friendly
- add feature: view count on article page
- add feature: rating
- add feature: comments
- add feature: bookmarking
- add localisation (en/ru)
- add more auth providers
- add feature: changing password
- add feature: restoring forgotten password
- implement email verification
- add additional security stuff (CSRF, CSP, etc)

Refactoring will consist of:
- update dependencies
- actualize codebase for updated dependencies, new Next.js, etc.
- fix codestyle by adding eslint and prettier
- use state manager
- rewrite all scss modules and files in TailwindCSS
- refactor all components to use only Headless UI
- refactor API routes and add more layers of abstractions to it
