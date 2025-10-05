import Router from '@koa/router';
import * as boardController from '../controller/board.controller';

const router = new Router({ prefix: '/api' });

router.get('/board/getPerfoList', boardController.getBoardList);
router.post('/board/insertPerfo', boardController.insertBoard);
router.post('/board/updatePerfo', boardController.updateBoard);
router.post('/board/deletePerfo', boardController.deleteBoard);

export default router;
