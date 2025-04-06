import { STATE_YN } from '@/types';

export class DefectEntity {
  defectSeq: string | undefined = undefined;

  defectTargetIdx: string | undefined = undefined;

  defectTitle: string | undefined = undefined;

  defectBody: string | undefined = undefined;

  defectTypeCode: string | undefined = undefined;

  targetType: string | undefined = undefined;

  defectProcessStateCode: string | undefined = undefined;

  defectProcessorUserIdx: string | undefined = undefined;

  defectProcessDt: Date | undefined = undefined;

  // defectTargetTypeCode: DEFECT_TARGET_TYPE_CODE = undefined;

  regrUserIdx: string | undefined = undefined;

  regDt: Date | undefined = undefined;

  modrUserIdx: string | undefined = undefined;

  modDt: Date | undefined = undefined;

  delYn = STATE_YN.N;
}
