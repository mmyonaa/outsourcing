import Router from "@koa/router";
import * as perfoController from "../controller/performance.controller";
import { imageUpload } from "../utils/upload.util";

const router = new Router({ prefix: "/api" });

router.get("/perfo/getperfoList", perfoController.getPerfoList);
router.post("/perfo/insertperfo", imageUpload.single('image'), perfoController.insertPerfo);
router.post("/perfo/updateperfo", perfoController.updatePerfo);
router.post("/perfo/deleteperfo", perfoController.deletePerfo);
router.post("/perfo/increaseViews", perfoController.increasePerfoViews);

export default router;
