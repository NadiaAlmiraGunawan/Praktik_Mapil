import Express from "express";
import authRouter from "./routes/auth/auth.route";
import PostRouter from "./routes/posts/post.route";
import CategoryRouter from "./routes/category/category.route";

const app = Express();
const PORT = 5000;

app.use(Express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/categories", CategoryRouter);

app.get("/", (req, res) => {
  res.send("holla dunia");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});