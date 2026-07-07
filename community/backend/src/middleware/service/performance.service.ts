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
): Promise<PerfoEntity> => {
 try{
  const data = await perfoRepo.updatePerfo(sql, reqParam);
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
