import Router from "@koa/router";
import multer from "@koa/multer";
import * as bannerController from "../controller/banner.controller";

const router = new Router({ prefix: "/api" });

// Multer 설정 - 배너 이미지 업로드
const bannerImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get("/banner/getBannerList", bannerController.getBannerList);
router.post("/banner/insertBanner", bannerController.insertBanner);
router.post("/banner/updateBanner", bannerController.updateBanner);
router.post("/banner/deleteBanner", bannerController.deleteBanner);
router.post("/banner/upload-image", bannerImageUpload.single('image'), bannerController.uploadBannerImage);

export default router;
