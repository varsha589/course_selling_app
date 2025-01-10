const express = require("express");
const { userRouter } = require("./routes/user");
const { coursesRouter } = require("./routes/courses");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(express.json());
app.listen(3000);

app.use("/user", userRouter);
app.use("/courses", coursesRouter);
app.use("/admin", adminRouter);


