import express from "express";
import { ZodError, z } from "zod";
import { PrismaClient } from "@prisma/client";
import _ from "lodash";

const PORT = 5000;
const server = express();

const prismaClient = new PrismaClient();

const postArticleModel = z.object({
	body: z.object({
		title: z.string(),
		content: z.string(),
		authorId: z.string(),
		tags: z.array(z.string())
	}),
	path: z.object({}).optional(),
	query: z.object({}).optional()
});

// type PostArticle = z.infer<typeof postArticleModel>;

server.post("/article", async (req, res) => {
	try {
		const body = req.body;
		const path = req.params;
		const query = req.query;

		const data = postArticleModel.parse({
			body: body,
			path: path,
			query: path
		});

		const newArticle = await prismaClient.article.create({
			data: {
				..._.omit(data.body, ["authorId", "tags"]),
				author: {
					connect: { id: data.body.authorId }
				},
				tags: data.body.tags.map((tag) => {
					return {
						connect: {
							label: tag
						}
					};
				})
			}
		});

		res.status(201).json(newArticle);
	} catch (err) {
		if (err instanceof ZodError) {
			console.log("Zod Error: ", err.message);
		}

		console.log(JSON.stringify(err));
		res.status(500).send("Server encountered an error");
	}
});

const postCommentModel = z.object({
	body: z.object({
		content: z.string(),
		articleId: z.string(),
		authorId: z.string()
	}),
	path: z.object({}).optional(),
	query: z.object({}).optional()
});

server.post("/comment", async (req, res) => {
	try {
		const body = req.body;
		const path = req.params;
		const query = req.query;

		const data = postCommentModel.parse({
			body: body,
			path: path,
			query: path
		});

		const newArticle = await prismaClient.comment.create({
			data: {
				..._.omit(data.body, ["articleId", "authorId"]),
				article: {
					connect: {
						id: data.body.articleId
					}
				},
				author: {
					connect: { id: data.body.authorId }
				}
			}
		});

		res.status(201).json(newArticle);
	} catch (err) {
		if (err instanceof ZodError) {
			console.log("Zod Error: ", err.message);
		}

		console.log(JSON.stringify(err));
		res.status(500).send("Server encountered an error");
	}
});

server.get("/user/:userId/articles", async (req, res) => {
	const { userId } = req.params;

	// const user = await prismaClient.user.findUnique({
	// 	where: { id: userId },
	// 	include: {
	// 		articles: {
	// 			include: {
	// 				author: true
	// 			}
	// 		}
	// 	}
	// });

	const articles = await prismaClient.article.findMany({
		where: {
			author: {
				some: {
					id: userId
				}
			}
		},
		include: {
			author: true
		}
	});

	res.status(200).json(articles);
});

server.get("/hello", (req, res) => {
	const body = req.body;
	const pathParams = req.params;
	const queryParams = req.query;

	res.json({
		message: "Hello World!"
	});
});

server.get("/error", (req, res) => {
	const body = req.body;
	const pathParams = req.params;
	const queryParams = req.query;

	res.status(500).end();
});

server.get("/", (req, res) => {
	const body = req.body;
	const pathParams = req.params;
	const queryParams = req.query;

	res.send(`
	    <!DOCTYPE html>
	        <html lang="en">
	        <head>
	            <meta charset="UTF-8">
	            <meta name="viewport" content="width=device-width, initial-scale=1.0">
	            <title>HELLO</title>
	        </head>
	        <body>
	            <p style="color: red;">HELLO WORLD!</p>
	        </body>
	        </html>
	`);
});

try {
	server.listen(PORT, () => {
		console.log(`Server is running on ${PORT}`);
	});
} catch (err) {
	console.log("Server error");
}
