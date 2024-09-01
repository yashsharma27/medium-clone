import { Hono } from 'hono';
import { sign , verify } from 'hono/jwt'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();


app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);


app.use('/api/v1/blog/*', async (c, next) => {
  //get the header
  // verify header
  // if the header is correct, we can proceed
  //if not, return 403

  
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1]
  const response = await verify(header, c.env.JWT_SECRET)

  if(response.id){
    next()
  }
  else {
    c.status(403)
    return c.json({error: "unauthorized"})
  }

  await next()
})


export default app
