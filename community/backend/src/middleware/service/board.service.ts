import * as boardRepo from '../repository/board.repository'
import { BoardEntity, SearchBoardDto } from '../repository/dto/board.dto';
import {sql} from '../provider/database.provider'
import { RESULT_CODE } from '../../types';
import { CustomError } from '../utils/custom.error';

/**
 * 글 조회
 * @param {SearchBoardDto} reqParam
 * @return {Promise<BoardEntity[]>}
 */
export const getBoardList = async (
  reqParam: SearchBoardDto,
): Promise<BoardEntity[]> => {
 try{
  const data = await boardRepo.getBoardList(sql, reqParam);
  return data
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};

/**
 * 글 등록
 * @param {BoardEntity} reqParam
 * @return {Promise<BoardEntity[]>}
 */
export const insertBoard = async (
  reqParam: BoardEntity,
): Promise<BoardEntity[]> => {
 try{
  const data = await boardRepo.insertBoard(sql, reqParam);
  return data
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};

/**
 * 글 수정
 * @param {BoardEntity} reqParam
 * @return {Promise<BoardEntity>}
 */
export const updateBoard = async (
  reqParam: BoardEntity,
): Promise<BoardEntity> => {
 try{
  const data = await boardRepo.updateBoard(sql, reqParam);
  return data
 } catch (e: any) {
  console.log(e)
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};

/**
 * 글 삭제
 * @param {BoardEntity} reqParam
 * @return {Promise<BoardEntity>}
 */
export const deleteBoard = async (
  reqParam: BoardEntity,
): Promise<BoardEntity> => {
 try{
  const data = await boardRepo.updateBoard(sql, reqParam);
  return data
 } catch (e: any) {
      throw new CustomError(
        RESULT_CODE.DB_ERROR.code,
        RESULT_CODE.DB_ERROR.msg,
        e,
      );
    }
};