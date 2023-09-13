import express from "express";
import createHttpError from "http-errors";
import NewsModel from "./model.js";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import bannerModel from "./bannerModel.js";
import docsModel from "./docsModel.js";

const newsRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).single("newsImage");

const cloudinaryUploader2 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).single("bannerImage");

const cloudinaryUploader3 = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).single("docsImage");

const cloudinaryUploaderArray = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "ART",
    },
  }),
}).array("newsArray");

newsRouter.post(
  "/:newsId/arrPics",
  cloudinaryUploaderArray,
  async (req, res, next) => {
    try {
      console.log(req.files);
      const urlArr = req.files;
      const arr = [];
      urlArr.map((u) => arr.push(u.path));
      const updatedNews = await NewsModel.findByIdAndUpdate(
        req.params.newsId,
        { images: arr },
        { new: true, runValidators: true }
      );
      if (updatedNews) {
        res.status(204).send(updatedNews);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.newsId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

newsRouter.post(
  "/:newsId/picture",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedNews = await NewsModel.findByIdAndUpdate(
        req.params.newsId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedNews) {
        res.status(204).send(updatedNews);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.newsId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

newsRouter.get("/banners", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const banners = await bannerModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    );
    res.send(banners);
  } catch (error) {
    next(error);
  }
});

newsRouter.get("/banners/:bannerId", async (req, res, next) => {
  try {
    const banners = await bannerModel.findById(req.params.bannerId);
    if (banners) {
      res.send(banners);
    } else {
      next(createHttpError(404, `banner with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});
newsRouter.post("/banners", async (req, res, next) => {
  try {
    const newBanner = new bannerModel(req.body);
    await newBanner.save();
    res.status(201).send(newBanner);
  } catch (error) {
    next(error);
  }
});

newsRouter.put("/banners/:bannerId", async (req, res, next) => {
  try {
    const bannerToChange = await bannerModel.findById(req.params.bannerId);
    if (bannerToChange) {
      const updatedBanner = await bannerModel.findByIdAndUpdate(
        req.params.bannerId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatedBanner);
    } else {
      createHttpError(
        404,
        `banner with id ${req.params.bannerId} is not found`
      );
    }
  } catch (error) {
    next(error);
  }
});

newsRouter.delete(
  "/banners/:bannerId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const bannerToDelete = await bannerModel.findById(req.params.bannerId);
      if (bannerToDelete) {
        await bannerModel.findByIdAndDelete(req.params.bannerId);
        res.status(205).send();
      } else {
        createHttpError(
          404,
          `banner with id ${req.params.bannerId} is not found`
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

newsRouter.post(
  "/banners/:bannerId/image",
  cloudinaryUploader2,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedBanner = await bannerModel.findByIdAndUpdate(
        req.params.bannerId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedBanner) {
        res.status(204).send(updatedBanner);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.bannerId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

newsRouter.get("/docs", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const docs = await docsModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    );
    res.send(docs);
  } catch (error) {
    next(error);
  }
});

newsRouter.get("/docs/:docsId", async (req, res, next) => {
  try {
    const docs = await docsModel.findById(req.params.docsId);
    if (docs) {
      res.send(docs);
    } else {
      next(createHttpError(404, `docs with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});
newsRouter.post("/docs", async (req, res, next) => {
  try {
    const newDocs = new docsModel(req.body);
    await newDocs.save();
    res.status(201).send(newDocs);
  } catch (error) {
    next(error);
  }
});

newsRouter.put("/docs/:docsId", async (req, res, next) => {
  try {
    const docsToChange = await docsModel.findById(req.params.docsId);
    if (docsToChange) {
      const updatedDocs = await docsModel.findByIdAndUpdate(
        req.params.docsId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatedDocs);
    } else {
      createHttpError(404, `docs with id ${req.params.newsId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

newsRouter.delete(
  "/docs/:docsId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const docsToDelete = await docsModel.findById(req.params.docsId);
      if (docsToDelete) {
        await docsModel.findByIdAndDelete(req.params.docsId);
        res.status(205).send();
      } else {
        createHttpError(404, `docs with id ${req.params.docsId} is not found`);
      }
    } catch (error) {
      next(error);
    }
  }
);

newsRouter.post(
  "/docs/:docsId/image",
  cloudinaryUploader3,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedDocs = await docsModel.findByIdAndUpdate(
        req.params.docsId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedDocs) {
        res.status(204).send(updatedDocs);
      } else {
        next(
          createHttpError(404, `Docs with id ${req.params.bannerId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

newsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const news = await NewsModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    );
    res.send(news);
  } catch (error) {
    next(error);
  }
});

newsRouter.get("/:newsId", async (req, res, next) => {
  try {
    const news = await NewsModel.findById(req.params.newsId);
    if (news) {
      res.send(news);
    } else {
      next(createHttpError(404, `news with provided id not found`));
    }
  } catch (error) {
    next(error);
  }
});
newsRouter.post("/", async (req, res, next) => {
  try {
    const newNews = new NewsModel(req.body);
    await newNews.save();
    res.status(201).send(newNews);
  } catch (error) {
    next(error);
  }
});

newsRouter.put("/:newsId", async (req, res, next) => {
  try {
    const newsToChange = await NewsModel.findById(req.params.newsId);
    if (newsToChange) {
      const updatednews = await NewsModel.findByIdAndUpdate(
        req.params.newsId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(204).send(updatednews);
    } else {
      createHttpError(404, `news with id ${req.params.newsId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

newsRouter.delete("/:newsId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newsToDelete = await NewsModel.findById(req.params.newsId);
    if (newsToDelete) {
      await NewsModel.findByIdAndDelete(req.params.newsId);
      res.status(205).send();
    } else {
      createHttpError(404, `news with id ${req.params.newsId} is not found`);
    }
  } catch (error) {
    next(error);
  }
});

export default newsRouter;
