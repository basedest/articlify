# Articlify

_**Blog app based on Next.js web framework**_

---

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

I'm currently planning to add these features in future:
- view count on article page
- rating
- comments
- bookmarking
- localisation (en/ru)
- more auth providers
- changing password
- restoring forgotten password
