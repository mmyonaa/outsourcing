import Router from "@koa/router";
import multer from "@koa/multer";
import * as perfoController from "../controller/performance.controller";

const router = new Router({ prefix: "/api" });

// Multer 설정 (메모리 스토리지 사용)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get("/perfo/getperfoList", perfoController.getPerfoList);
router.post("/perfo/insertperfo", upload.single('image'), perfoController.insertPerfo);
router.post("/perfo/updateperfo", perfoController.updatePerfo);
router.post("/perfo/deleteperfo", perfoController.deletePerfo);

export default router;
