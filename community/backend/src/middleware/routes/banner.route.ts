import Router from "@koa/router";
import * as bannerController from "../controller/banner.controller";
import { imageUpload } from "../utils/upload.util";

const router = new Router({ prefix: "/api" });

router.get("/banner/getBannerList", bannerController.getBannerList);
router.post("/banner/insertBanner", bannerController.insertBanner);
router.post("/banner/updateBanner", bannerController.updateBanner);
router.post("/banner/deleteBanner", bannerController.deleteBanner);
router.post("/banner/upload-image", imageUpload.single('image'), bannerController.uploadBannerImage);

export default router;
