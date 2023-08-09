import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { createAccessToken } from "../../lib/auth/jwtTools.js";
import { checkUserSchema, triggerBadRequest } from "./validator.js";

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).single("avatar");

const usersRouter = express.Router();

usersRouter.post(
  "/",
  checkUserSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newUser = new UsersModel(req.body);
      console.log(newUser);

      const duplicate = await UsersModel.findOne({
        email: newUser.email,
      });
      if (duplicate) {
        next(createHttpError(400, "Username already exist"));
      } else {
        const { _id } = await newUser.save();
        res.status(201).send({ _id });
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const users = await UsersModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    );
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = {
        _id: user._id,
      };
      const accessToken = await createAccessToken(payload);
      res.send({ user, accessToken });
    } else {
      next(createHttpError(401, "Credentials are not OK!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/position", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newPosition = new PositionModel(req.body);
    await newPosition.save();
    res.status(201).send(newPosition);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/position", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const positions = await PositionModel.find();
    res.send(positions);
  } catch (error) {
    next(error);
  }
});

usersRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { avatar: url },
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.status(204).send(updatedUser);
      } else {
        next(createHttpError(404, `User with id ${req.user._id} not found`));
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userToChange = await UsersModel.findById(req.params.userId);
    if (userToChange) {
      if (req.body.password) {
        const plainPassword = req.body.password;
        req.body.password = await bcrypt.hash(plainPassword, 10);
      }
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatedUser);
    } else {
      createHttpError(404, `User with id ${req.params.userId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userToDelete = await UsersModel.findById(req.params.userId);
    if (userToDelete) {
      await UsersModel.findByIdAndDelete(req.params.userId);
      res.status(205).send();
    } else {
      createHttpError(404, `User with id ${req.params.userId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
