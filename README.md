This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

install nextjs 
```js
npx create-next-app .
cd name
npm run dev
```

```js
git add .
git commit -m "Add all project files"
git push

```
# Database Connection in. NextJs

# Setup MongoDB Connection (with cache)
* Import mongoose
```fs
  import mongoose from "mongoose";
```
* Read MongoDB URL from environment
```fs
 const MONGODB_URI = process.env.MONGODB_URI;
```
* Safety check
```fs
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}
```
* Create a global cache variable
```fs
 let cached = global.mongoose;
```
 This checks if a MongoDB connection is already stored in memory (global object).

* 👉 In Next.js (especially in development), files reload often.
* Without caching, it would create new DB connections again and again (bad ❌).

* If no cache exists, create one
```fs
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
```
You create an object with:
* conn → actual DB connection
  * promise → connection process (while connecting)
Stored globally so it survives hot reloads.

* Main function: dbConnect()

```fs 
async function dbConnect() {} 
```
* This function connects to MongoDB and returns the connection.

* If already connected → reuse it
```fs
if (cached.conn) {
  return cached.conn;
}
```

* If a connection already exists:
✅ don’t reconnect
✅ just return the existing one
⚡ improves performance
⚡ avoids “too many connections” error

* If not connected, create connection promise
```fs
if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
}

```
*  This starts connecting to MongoDB:
mongoose.connect() returns a promise
* stored in cached.promise so multiple requests don’t create multiple connections
* bufferCommands: false
➡ prevents mongoose from storing commands when DB is not connected

* Wait for connection and store it
```fs
cached.conn = await cached.promise;
return cached.conn;

```
* Waits until MongoDB connects, then:
   * saves connection in cached.conn
   * returns it
 So next time:
➡ it will skip connecting and reuse it

* Export function
```fs
export default dbConnect;

```
* So you can use it anywhere:
```fs
await dbConnect();
```
In API routes, server actions, etc.

🧠 In simple words:

* This file:
✅ connects MongoDB
✅ prevents multiple connections
✅ works correctly with Next.js hot reload
✅ improves performance
✅ avoids crashes

# Designing Models in NextJS


