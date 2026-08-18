import * as perfoRepo from '../repository/performance.repository'
import { PerfoEntity, SearchPerfoDto } from '../repository/dto/perfo.dto';
import {sql} from '../provider/database.provider'
import { RESULT_CODE } from '../../types';
import { CustomError } from '../utils/custom.error';

/**
 * 글 조회
 * @param {SearchPerfoDto} reqParam
 * @return {Promise<PerfoEntity[]>}
 */
export const getPerfoList = async (
  reqParam: SearchPerfoDto,
): Promise<PerfoEntity[]> => {
 try{
  const data = await perfoRepo.getPerfoList(sql, reqParam);
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

export const getPerfoListCount = async (
  reqParam: SearchPerfoDto,
): Promise<number> => {
 try{
  const data = await perfoRepo.getPerfoListCount(sql, reqParam);
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
 * @param {PerfoEntity} reqParam
 * @return {Promise<PerfoEntity[]>}
 */
export const insertPerfo = async (
  reqParam: PerfoEntity,
): Promise<PerfoEntity[]> => {
 try{
  const data = await perfoRepo.insertPerfo(sql, reqParam);
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
 * @param {PerfoEntity} reqParam
 * @return {Promise<PerfoEntity>}
 */
export const updatePerfo = async (
  reqParam: PerfoEntity,
  columns?: (keyof PerfoEntity)[],
): Promise<PerfoEntity> => {
 try{
  const data = await perfoRepo.updatePerfo(sql, reqParam, columns);
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
 * @param {string} perIdx
 * @return {Promise<PerfoEntity[]>} 갱신된 행 (없으면 빈 배열)
 */
export const increasePerfoViews = async (
  perIdx: string,
): Promise<PerfoEntity[]> => {
 try{
  const data = await perfoRepo.increasePerfoViews(sql, perIdx);
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
 * @param {string} perIdx
 * @return {Promise<PerfoEntity[]>} 삭제된 행 (없으면 빈 배열)
 */
export const deletePerfo = async (
  perIdx: string,
): Promise<PerfoEntity[]> => {
 try{
  const data = await perfoRepo.deletePerfo(sql, perIdx);
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
