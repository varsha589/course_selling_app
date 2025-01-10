const { Router } = require("express");
const { userModel, courseModel } = require("../db");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const purchasesModel = require("../db");
const { userMiddleware } = require("../middleware");

userRouter.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  //input validation - zod
  const requiredbody = z.object({
    email: z.string().min(6).max(100).email(),
    password: z
      .string()
      .min(6)
      .max(100)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/),
    firstname: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
  });

  const parseddata = requiredbody.safeParse(req.body);

  if (!parseddata.success) {
    return res.status(403).json({
      errmsg: `Incorrect format`,
      error: parseddata.error,
    });
  }

  try {
    const hashedpassword = await bcrypt.hash(password, 5);

    await userModel.create({
      email: email,
      password: hashedpassword,
      firstname,
      lastname,
    });

    res.status(200).json({
      msg: "You are signed up!",
    });
  } catch (e) {
    return res.status(500).json({
      errmsg: e.message,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  //input validation - zod
  const requiredbody = z.object({
    email: z.string().min(6).email(),
    password: z.string().min(6),
  });

  const parseddata = requiredbody.safeParse(req.body);

  if (!parseddata.success) {
    return res.status(403).json({
      errmsg: `Incorrect format`,
      error: parseddata.error,
    });
  }

  const user = userModel.findOne({
    email,
  });

  if (user) {
    const passwordmatch = await bcrypt.compare(password, user.password);

    if (passwordmatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        JWT_USER_SECRET
      );

      res.status(200).json({
        token: token,
        msg: "You are signed in!",
      });
    } else {
      return res.status(403).json({
        errmsg: `Incorrect Credentials`,
      });
    }
  } else {
    return res.status(403).json({
      errmsg: `Incorrect Credentials`,
    });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const purchasedCourses = await purchasesModel.find({
    user_id: userId,
  });

  if (purchasedCourses.length === 0) {
    return res.status(404).json({
      message: "No purchases found", // Error message for no purchases found
    });
  }

  const purchasedCoursesIds = purchasedCourses.map(
    (purchasedCourse) => purchasedCourse.course_id
  );

  const coursesData = await courseModel.find({
    _id: { $in: purchasedCoursesIds },
  });

  //aggregationPipelines

  // try {
  //   const pipeline = [
  //     {
  //       $match: { user_id: userId },
  //     },
  //     {
  //       $lookup: {
  //         from: "Courses",
  //         localField: "course_id",
  //         foreignField: "_id",
  //         as: "CourseDetails",
  //       },
  //     },
  //     {
  //       $unwind: "$CourseDetails", // Unwind the "courseDetails" array for each purchase
  //     },
  //   ];

  //   const purchasedCourses = await purchasesModel.aggregate(pipeline);
  //} catch (e) {}
  
  res.status(200).json({
    purchasedCourses, // Include purchase data in the response
    coursesData, // Include course details in the response
  });
});

module.exports = {
  userRouter: userRouter,
};
