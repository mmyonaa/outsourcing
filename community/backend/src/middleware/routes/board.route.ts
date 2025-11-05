import Router from "@koa/router";
import multer from "@koa/multer";
import * as boardController from "../controller/board.controller";

const router = new Router({ prefix: "/api" });

// Multer 설정 - 이미지 업로드
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB 제한
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Multer 설정 - 일반 파일 업로드
const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB 제한
  },
});

router.get("/board/getBoardList", boardController.getBoardList);
router.post("/board/insertBoard", boardController.insertBoard);
router.post("/board/updateBoard", boardController.updateBoard);
router.post("/board/deleteBoard", boardController.deleteBoard);
router.post("/board/upload-image", imageUpload.single('image'), boardController.uploadImage);
router.post("/board/upload-file", fileUpload.single('file'), boardController.uploadFile);

export default router;
