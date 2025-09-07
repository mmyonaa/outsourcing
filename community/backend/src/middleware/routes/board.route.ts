import Router from '@koa/router';
import * as boardController from '../controller/board.controller';

const router = new Router({ prefix: '/board' });

router.get('/getBoardList', boardController.getBoardList);
router.post('/insertBoard', boardController.insertBoard);
router.post('/updateBoard', boardController.updateBoard);
router.post('/deleteBoard', boardController.deleteBoard);

export default router;
