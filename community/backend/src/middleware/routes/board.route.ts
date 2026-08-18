import Router from "@koa/router";
import * as boardController from "../controller/board.controller";
import { imageUpload, fileUpload } from "../utils/upload.util";

const router = new Router({ prefix: "/api" });

router.get("/board/getBoardList", boardController.getBoardList);
router.post("/board/insertBoard", boardController.insertBoard);
router.post("/board/updateBoard", boardController.updateBoard);
router.post("/board/deleteBoard", boardController.deleteBoard);
router.post("/board/increaseViews", boardController.increaseBoardViews);
router.post("/board/upload-image", imageUpload.single('image'), boardController.uploadImage);
router.post("/board/upload-file", fileUpload.single('file'), boardController.uploadFile);

export default router;
