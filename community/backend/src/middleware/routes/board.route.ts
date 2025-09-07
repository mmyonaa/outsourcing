import Router from '@koa/router';
import * as boardController from '../controller/board.controller';

const router = new Router(); // prefix 제거

router.get('/board/getBoardList', boardController.getBoardList);
router.post('/board/insertBoard', boardController.insertBoard);
router.post('/board/updateBoard', boardController.updateBoard);
router.post('/board/deleteBoard', boardController.deleteBoard);

export default router;
