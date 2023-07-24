# Reviewing Backend Stuff

## Overview of Commands Used

```sh
mkdir new_folder
cd new_folder

pnpm init
git init

pnpm add express
pnpm add typescript

touch .gitignore
code .gitignore

touch main.ts
code main.ts

# won't work
node main.ts

tsc main.ts
# or if tsc not on OS path, try `npx tsc`` or `pnpx tsc`  etc...
node main.js

pnpm add nodemon ts-node

node_modules/typescript/bin/tsc --init
npx tsc --init

pnpm install -D @types/express

npx prisma init
```

```js
fetch("http://localhost:5000/data", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		body: JSON.stringify({ creditcard: "not-today-mothafucka" })
	}
})
	.then((res) => {
		console.log("fetch completed: ", res);
	})
	.catch((err) => {
		console.log("fetch encountered an error: ", err);
	});
```

## TypeScript

TypeScript requires a compiler to perform the type-checking and then emit vanilla JavaScript.

## Node.js

A JavaScript interpreter / run-time. Node.js is a project that came out of Google's Chrome browser; it was originally basically a stand-alone version of the Chrome JS engine / interpreter.

Node.js can be used for any sort of programming. It's usually used for backend services like HTTP servers though, due to how JS works. Specifically, JS is designed as a single-threaded program w/ an event loop. Asynchronous vs concurrent

## Express.js

Node natively has HTTP-related code in the "standard library", meaning the it's available without you having to install extra libraries. Express is just a wrapper on top of this native functionality to make it simpler/easier to work with.
