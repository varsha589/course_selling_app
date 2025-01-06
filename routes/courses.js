const { Router } = require('express')

const coursesRouter = Router();

coursesRouter.get("/courses", () => {});

coursesRouter.post("/courses/purchase", () => {});


module.exports = {
    coursesRouter : coursesRouter
}