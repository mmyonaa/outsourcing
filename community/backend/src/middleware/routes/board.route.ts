import Router from '@koa/router';
import * as boardController from '../controller/board.controller';

export default () => {
  const router = new Router({
    prefix: '/board',
  });

  router.get('/getBoardList', boardController.getBoardList);
  router.post('/insertBoard', boardController.insertBoard);
  router.post('/deleteBoard', boardController.deleteBoard);
  router.post('/updateBoard', boardController.updateBoard);

  return router;
};