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

export const getBoardListCount = async (
  reqParam: SearchBoardDto,
): Promise<number> => {
 try{
  const data = await boardRepo.getBoardListCount(sql, reqParam);
  return data.length > 0 ? Number(data[0].totalCount) : 0;
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
  columns?: (keyof BoardEntity)[],
): Promise<BoardEntity> => {
 try{
  const data = await boardRepo.updateBoard(sql, reqParam, columns);
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
 * 조회수 증가 (원자적 +1)
 * @param {string} boardIdx
 * @return {Promise<BoardEntity[]>} 갱신된 행 (없으면 빈 배열)
 */
export const increaseBoardViews = async (
  boardIdx: string,
): Promise<BoardEntity[]> => {
 try{
  const data = await boardRepo.increaseBoardViews(sql, boardIdx);
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
 * 글 삭제 (소프트 삭제)
 * @param {string} boardIdx
 * @return {Promise<BoardEntity[]>} 삭제된 행 (없으면 빈 배열)
 */
export const deleteBoard = async (
  boardIdx: string,
): Promise<BoardEntity[]> => {
 try{
  const data = await boardRepo.deleteBoard(sql, boardIdx);
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
