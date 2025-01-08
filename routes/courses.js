const { Router } = require("express");

const coursesRouter = Router();

coursesRouter.get("/preview", () => {});

coursesRouter.post("/courses/purchase", () => {});

module.exports = {
  coursesRouter: coursesRouter,
};
