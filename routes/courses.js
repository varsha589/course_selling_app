const { Router } = require("express");
const { userMiddleware } = require("../middleware");
const { courseModel } = require("../db");
const purchasesModel = require("../db");
const coursesRouter = Router();

coursesRouter.get("/preview", (req, res) => {
  const courses = courseModel.find({});

  res.status(200).json({
    courses: courses,
  });
});

coursesRouter.post("/courses/purchase", userMiddleware, async (req, res) => {
  const { courseid } = req.body;
  const userId = req.userId;

  const existingpurchase = purchasesModel.find({
    course_id: courseid,
    user_id: userId,
  });

  if (existingpurchase) {
    return res.status(400).json({
      message: "You have already bought this course",
    });
  }

  //payment hua h ya nahi check karna hoga
  try {
    await purchasesModel.create({
      course_id: courseid,
      user_id: userId,
    });

    res.status(201).json({
      message: "You have successfully bought the course", // Success message after purchase
    });
  } catch (e) {
    res.status(500).json({
      errmsg: "Something went wrong",
    });
  }
});

module.exports = {
  coursesRouter: coursesRouter,
};
