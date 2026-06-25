import type { AxiosResponse } from 'axios';
import { ResponseDto } from '@/api/dto/response.dto';

/**
 * API 호출 실패를 나타내는 타입화된 에러.
 * - resultCode/resultMsg가 있으면 서버가 비정상 resultCode를 반환한 경우
 * - 둘 다 없으면 네트워크/그 외 오류
 * message는 i18n 키 호환을 위해 기존과 동일하게 `msg.xxx` 형태를 유지한다.
 */
export class ApiError extends Error {
  resultCode?: number;
  resultMsg?: string;
  cause?: unknown;

  constructor(message: string, resultCode?: number, resultMsg?: string, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.resultCode = resultCode;
    this.resultMsg = resultMsg;
    this.cause = cause;
  }
}

/**
 * axios 호출을 감싸 ResponseDto로 풀어 반환한다.
 *
 * 기존 `new Promise(...)` 래퍼를 대체한다:
 * - 네트워크 등 호출 자체가 실패하면 ApiError('msg.RESULT_FAILED')를 던진다.
 * - strict(기본 true)일 때 resultCode !== 0 이면 ApiError를 던진다.
 *   (목록/상세/등록 등 조회 계열의 기존 동작)
 * - strict=false면 resultCode와 무관하게 항상 ResponseDto로 반환한다.
 *   (update/delete 등 기존에 resultCode를 검사하지 않던 동작 보존)
 */
export async function apiRequest<T>(
  call: () => Promise<AxiosResponse<any>>,
  options: { strict?: boolean } = {},
): Promise<ResponseDto<T>> {
  const { strict = true } = options;

  let res: AxiosResponse<any>;
  try {
    res = await call();
  } catch (e) {
    console.error(e);
    throw new ApiError('msg.RESULT_FAILED', undefined, undefined, e);
  }

  if (strict && res.data?.resultCode !== 0) {
    console.error(res);
    throw new ApiError(`msg.${res.data?.resultMsg ?? 'RESULT_FAILED'}`, res.data?.resultCode, res.data?.resultMsg);
  }

  return new ResponseDto<T>(res.data);
}
