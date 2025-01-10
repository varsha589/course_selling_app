const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { adminMiddleware } = require("../middleware");

//bcrypt , jsonwebtoken ,zod

adminRouter.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname || !lastname) {
    return res.status(403).json({
      errmsg: "Please fill out all the required fields",
    });
  }

  const requiredbody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z
      .string()
      .min(8)
      .max(50)
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

    await adminModel.create({
      email: email,
      password: hashedpassword,
      firstname: firstname,
      lastname: lastname,
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

adminRouter.post("/signin", async (req, res) => {
  const requiredbody = z.object({
    email: z.string().email,
    password: z.min(8),
  });

  const parseddata = requiredbody.safeParse(req.body);

  if (!parseddata.success) {
    return res.status(403).json({
      errmsg: `Incorrect format`,
      error: parseddata.error,
    });
  }

  const { email, password } = req.body;
  const admin = await adminModel.findOne({
    email,
  });

  if (!admin) {
    return res.status(403).json({
      errmsg: `Incorrect Credentials`,
    });
  } else {
    const passwordmatch = await bcrypt.compare(password, admin.password);

    if (passwordmatch) {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        JWT_ADMIN_SECRET
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
  }
});

adminRouter.get("/courses/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creator_id: adminId,
  });

  res.status(200).json({
    courses,
  });
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const { title, description, price, imageUrl } = req.body;
  const adminId = req.userId;

  await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creator_id: adminId,
  });
  res.status(200).json({
    msg: "Course is created!",
  });
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const { title, description, price, imageUrl, courseId } = req.body;
  const adminId = req.userId;

  const course = await courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if (!course) {
    return res.status(404).json({
      message: "Course not found!", // Inform the client that the specified course does not exist
    });
  }
  await courseModel.updateOne(
    {
      _id: courseId,
      creator_id: adminId,
    },
    {
      title,
      description,
      price,
      imageUrl,
      creator_id: adminId,
    }
  );

  res.status(200).json({
    msg: "Course is updated!",
  });
});

module.exports = {
  adminRouter: adminRouter,
};
