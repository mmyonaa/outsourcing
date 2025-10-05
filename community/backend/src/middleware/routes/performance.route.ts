import Router from "@koa/router";
import * as perfoController from "../controller/performance.controller";

const router = new Router({ prefix: "/api" });

router.get("/perfo/getperfoList", perfoController.getPerfoList);
router.post("/perfo/insertperfo", perfoController.insertPerfo);
router.post("/perfo/updateperfo", perfoController.updatePerfo);
router.post("/perfo/deleteperfo", perfoController.deletePerfo);

export default router;
