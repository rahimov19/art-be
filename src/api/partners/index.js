import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import membersModel from "./membersModel.js";
import partnersModel from "./partnersModel.js";

const partnersRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).single("partnersImage");

const cloudinaryUploader2 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).single("membersImage");

partnersRouter.post(
  "/partners/:partnerId/picture",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedNews = await partnerModel.findByIdAndUpdate(
        req.params.partnerId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedNews) {
        res.status(204).send(updatedNews);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.partnerId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

partnersRouter.post(
  "/members/:memberId/picture",
  cloudinaryUploader2,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedNews = await membersModel.findByIdAndUpdate(
        req.params.memberId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedNews) {
        res.status(204).send(updatedNews);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.memberId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

partnersRouter.get("/members", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const members = await membersModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    );
    res.send(members);
  } catch (error) {
    next(error);
  }
});

partnersRouter.get("/members/:memberId", async (req, res, next) => {
  try {
    const member = await bannerModel.findById(req.params.memberId);
    if (member) {
      res.send(member);
    } else {
      next(createHttpError(404, `member with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});

partnersRouter.post("/members", async (req, res, next) => {
  try {
    const newMember = new membersModel(req.body);
    await newMember.save();
    res.status(201).send(newMember);
  } catch (error) {
    next(error);
  }
});

partnersRouter.put("/members/:memberId", async (req, res, next) => {
  try {
    const bannerToChange = await membersModel.findById(req.params.memberId);
    if (bannerToChange) {
      const updatedMember = await membersModel.findByIdAndUpdate(
        req.params.memberId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatedMember);
    } else {
      createHttpError(
        404,
        `banner with id ${req.params.memberId} is not found`
      );
    }
  } catch (error) {
    next(error);
  }
});

partnersRouter.delete(
  "/members/:memberId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const memberToDelete = await membersModel.findById(req.params.memberId);
      if (memberToDelete) {
        await membersModel.findByIdAndDelete(req.params.memberId);
        res.status(205).send();
      } else {
        createHttpError(
          404,
          `banner with id ${req.params.memberId} is not found`
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

partnersRouter.get("/partners", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const partners = await partnersModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    );
    res.send(partners);
  } catch (error) {
    next(error);
  }
});

partnersRouter.get("/partners/:partnerId", async (req, res, next) => {
  try {
    const partner = await partnersModel.findById(req.params.partnerId);
    if (partner) {
      res.send(partner);
    } else {
      next(createHttpError(404, `partner with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});
partnersRouter.post("/partners", async (req, res, next) => {
  try {
    const newPartner = new partnersModel(req.body);
    await newPartner.save();
    res.status(201).send(newPartner);
  } catch (error) {
    next(error);
  }
});

partnersRouter.put("/partners/:partnerId", async (req, res, next) => {
  try {
    const partnerToChange = await partnersModel.findById(req.params.partnerId);
    if (partnerToChange) {
      const updatedPartner = await partnersModel.findByIdAndUpdate(
        req.params.partnerId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatedPartner);
    } else {
      createHttpError(404, `partner with id ${req.params.newsId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

partnersRouter.delete(
  "/partners/:partnerId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const partnerToDelete = await partnersModel.findById(
        req.params.partnerId
      );
      if (partnerToDelete) {
        await partnersModel.findByIdAndDelete(req.params.partnerId);
        res.status(205).send();
      } else {
        createHttpError(
          404,
          `partner with id ${req.params.partnerId} is not found`
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default partnersRouter;
