import { Context } from "koa";
import { ResponseDto } from "../repository/dto/response.dto";
import { PerfoEntity, SearchPerfoDto } from "../repository/dto/perfo.dto";
import { setEntityParameters } from "../utils/common.util";
import { RESULT_CODE, STATE_YN } from "../../types";
import * as perfoService from "../service/performance.service";
import { CustomError } from "../utils/custom.error";
import { uploadToS3 } from "../utils/s3.util";

/**
 * 글 조회
 * @param {Context} ctx Koa context
 * */
export const getPerfoList = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new SearchPerfoDto();
    setEntityParameters(reqParam, ctx.request.query);

    const resultData = await perfoService.getPerfoList(reqParam);

    result.data = resultData;
    result.totalCount = await perfoService.getPerfoListCount(reqParam);
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
};

/**
 * 글 작성
 * @param {Context} ctx Koa context
 * */
export const insertPerfo = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new PerfoEntity();
    setEntityParameters(reqParam, ctx.request.body);

    // 이미지가 업로드된 경우 S3에 업로드
    if ((ctx.request as any).file) {
      const imageUrl = await uploadToS3(
        (ctx.request as any).file,
        "performance"
      );
      reqParam.imgUrl = imageUrl;
    }

    const resultData = await perfoService.insertPerfo(reqParam);

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
};

/**
 * 글 수정
 * @param {Context} ctx Koa context
 * */
export const updatePerfo = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new PerfoEntity();
    setEntityParameters(reqParam, ctx.request.body);

    if (!reqParam.perIdx) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        RESULT_CODE.INVALID_PARAMETER.msg
      );
    }

    const resultData = await perfoService.updatePerfo(reqParam);
    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
};

/**
 * 글 수정
 * @param {Context} ctx Koa context
 * */
export const deletePerfo = async (ctx: Context) => {
  const result = new ResponseDto();
  try {
    const reqParam = new PerfoEntity();
    setEntityParameters(reqParam, ctx.request.body);

    if (!reqParam.perIdx) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        RESULT_CODE.INVALID_PARAMETER.msg
      );
    }

    const searchParam = new SearchPerfoDto();
    searchParam.perIdx = reqParam.perIdx;
    const [PerfoItem] = await perfoService.getPerfoList(searchParam);

    if (!PerfoItem) {
      throw new CustomError(
        RESULT_CODE.PERFO_NOT_FOUND.code,
        RESULT_CODE.PERFO_NOT_FOUND.msg
      );
    }

    PerfoItem.delYn = STATE_YN.Y;
    const resultData = await perfoService.updatePerfo(PerfoItem);
    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
};
