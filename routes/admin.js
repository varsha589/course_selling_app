const { Router } = require("express");

const adminRouter = Router();

adminRouter.get("/courses", () => {});

adminRouter.post("/course", () => {});

adminRouter.put("/course", () => {});

module.exports = {
  adminRouter: adminRouter,
};
