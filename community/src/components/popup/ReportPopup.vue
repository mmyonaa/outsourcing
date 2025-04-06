<script lang="ts">
import { insertDefect } from '@/api/defect.api';
import { DefectEntity } from '@/api/dto/defect.dto';
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { POPUP_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { type PropType, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ReportPopup',
  components: { ApocButton, ApocImageSet },
  props: {
    targetIdx: {
      type: String as PropType<string>,
    },
    targetType: {
      type: String as PropType<string>,
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const reportReasonList = [
      { title: '주제와 맞지 않음', typeCode: 'RP001' },
      { title: '도배 및 중복 게시물', typeCode: 'RP002' },
      { title: '지나친 광고성 게시물', typeCode: 'RP003' },
      { title: '욕설 / 비방이 심함', typeCode: 'RP004' },
      { title: '외설적인 게시물', typeCode: 'RP005' },
      { title: '기타', typeCode: 'RP006' },
    ];

    const selectedReason = ref<{ title: string; typeCode: string }>(reportReasonList[0]);
    const defectBody = ref<string>('');
    const isValidParam = ref<boolean>(false);

    const onClickSubmit = async () => {
      paramCheck();
      if (!isValidParam.value) {
        return;
      }
      const param = new DefectEntity();
      param.defectTargetIdx = props.targetIdx;
      param.defectTitle = selectedReason.value.title;
      param.defectBody = defectBody.value;
      param.defectTypeCode = selectedReason.value.typeCode;
      param.targetType = props.targetType;
      await insertDefect(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          console.error(res.resultMsg);
        } else {
          if (res.data) {
            window.alert(t('msg.RESULT_REPORT_COMPLETED'));
            closePopup();
          }
        }
      });
    };

    const paramCheck = () => {
      if (!props.targetIdx) {
        window.alert(t('msg.RESULT_REPORT_NO_TARGET'));
      } else if (!selectedReason.value) {
        window.alert(t('msg.RESULT_SELECT_REPORT_REASON'));
      } else if (selectedReason.value.typeCode === 'RP006' && !defectBody.value) {
        window.alert(t('msg.RESULT_WRITE_REPORT_CONTENT'));
      } else {
        isValidParam.value = true;
      }
    };

    const closePopup = () => {
      storeManager.stateStore.setPopupMode({ type: POPUP_TYPE.NONE });
    };

    return {
      reportReasonList,
      selectedReason,
      defectBody,
      closePopup,
      onClickSubmit,
    };
  },
});
</script>

<template>
  <div class="popup-bg" @click.self="closePopup">
    <section class="report-popup-section">
      <apoc-button class="close-btn" @click="closePopup">
        <apoc-image-set src="/assets/images/common/icons/close-btn.webp" alt="close-btn" :img-sets="3" />
      </apoc-button>
      <div class="report-popup-title">신고사유를 선택해주세요.</div>
      <div class="report-reason-list">
        <label v-for="(reportReason, index) in reportReasonList" :key="index" class="report-reason-item">
          <div class="radio-section">
            <input type="radio" name="option" v-model="selectedReason" :value="reportReason" />
            <span class="reason-title">{{ reportReason.title }}</span>
          </div>
          <textarea
            class="etc-input"
            v-if="reportReason.typeCode === 'RP006' && selectedReason.typeCode === 'RP006'"
            placeholder="내용을 입력해 주세요."
            v-model="defectBody"></textarea>
        </label>
      </div>
      <apoc-button class="submit-btn" @click="onClickSubmit">신고하기</apoc-button>
    </section>
  </div>
</template>
