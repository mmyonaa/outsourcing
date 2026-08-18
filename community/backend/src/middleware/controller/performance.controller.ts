import { Context } from "koa";
import { ResponseDto } from "../repository/dto/response.dto";
import { PerfoEntity, SearchPerfoDto, UPDATABLE_PERFO_COLUMNS } from "../repository/dto/perfo.dto";
import { setEntityParameters } from "../utils/common.util";
import { RESULT_CODE } from "../../types";
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
    const providedKeys = setEntityParameters(reqParam, ctx.request.body);

    if (!reqParam.perIdx) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        RESULT_CODE.INVALID_PARAMETER.msg
      );
    }

    // 클라이언트가 실제로 보낸 필드만 수정 (미전송 필드가 NULL/기본값으로 덮이는 것 방지)
    const updateColumns = UPDATABLE_PERFO_COLUMNS.filter((c) =>
      providedKeys.includes(c)
    );
    if (updateColumns.length === 0) {
      throw new CustomError(
        RESULT_CODE.INVALID_PARAMETER.code,
        "수정할 필드가 없습니다."
      );
    }

    const resultData = await perfoService.updatePerfo(reqParam, updateColumns);
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

    // 단일 UPDATE 로 소프트 삭제 — 삭제된 행이 없으면 NOT_FOUND
    const resultData = await perfoService.deletePerfo(reqParam.perIdx);

    if (resultData.length === 0) {
      throw new CustomError(
        RESULT_CODE.PERFO_NOT_FOUND.code,
        RESULT_CODE.PERFO_NOT_FOUND.msg
      );
    }

    result.data = resultData;
    result.setResultCode(RESULT_CODE.SUCCESS);
  } catch (e) {
    result.setErrorObject(e);
  }
  ctx.body = result;
};
