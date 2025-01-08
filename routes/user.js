const { Router } = require("express");
const { userModel } = require("../db");
const userRouter = Router();

userRouter.post("/signup", () => {});

userRouter.post("/signin", () => {});

userRouter.get("/purchases", () => {});

module.exports = {
  userRouter: userRouter,
};
