import express from "express";
import createHttpError from "http-errors";
import ResumeModel from "./modal.js";

import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const resumeRouter = express.Router();

resumeRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const resumes = await ResumeModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    ).populate("user");
    res.send(resumes);
  } catch (error) {
    next(error);
  }
});

resumeRouter.get("/:resumeId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const resume = await ResumeModel.findById(req.params.resumeId);
    if (resume) {
      res.send(resume);
    } else {
      next(createHttpError(404, `resume with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});

resumeRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newResume = new ResumeModel(req.body);
    await newResume.save();
    res.status(201).send(newResume);
  } catch (error) {
    next(error);
  }
});

resumeRouter.put("/:resumeId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const resumeToChange = await ResumeModel.findById(req.params.resumeId);
    if (resumeToChange) {
      if (req.body.password) {
        const plainPassword = req.body.password;
        req.body.password = await bcrypt.hash(plainPassword, 10);
      }
      const updatedresume = await ResumeModel.findByIdAndUpdate(
        req.params.resumeId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatedresume);
    } else {
      createHttpError(
        404,
        `resume with id ${req.params.resumeId} is not found`
      );
    }
  } catch (error) {
    next(error);
  }
});

resumeRouter.delete("/:resumeId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const resumeToDelete = await ResumeModel.findById(req.params.resumeId);
    if (resumeToDelete) {
      await ResumeModel.findByIdAndDelete(req.params.resumeId);
      res.status(205).send();
    } else {
      createHttpError(
        404,
        `resume with id ${req.params.resumeId} is not found`
      );
    }
  } catch (error) {
    next(error);
  }
});

export default resumeRouter;
