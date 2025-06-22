<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocSelect, { ISelectOption } from '@/components/common/ApocSelect.vue';
import { PropType, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'WriteBottomOption',
  components: { ApocImageSet, ApocSelect },
  props: {
    subTabOption: {
      type: Object as PropType<ISelectOption[]>,
    },
    tagOption: {
      type: Object as PropType<ISelectOption[]>,
    },
    selectSubTab: {
      type: Object as PropType<ISelectOption>,
    },
    selectTag: {
      type: Object as PropType<ISelectOption>,
    },
    isCheckPrivate: {
      type: Boolean as PropType<boolean>,
    },
  },
  setup(props, { emit }) {
    const isCheck = ref<boolean>(false);
    const { t } = useI18n({ useScope: 'global' });

    const onClickSelectSubTab = (e: Event) => {
      emit('update:select-sub-tab', e);
    };
    const onClickSelectTag = (e: Event) => {
      emit('update:select-tag', e);
    };
    const onClickCheckPrivate = () => {
      emit('update:check-private', !props.isCheckPrivate);
    };
    return {
      t,
      isCheck,
      onClickSelectSubTab,
      onClickSelectTag,
      onClickCheckPrivate,
    };
  },
});
</script>
<template>
  <div class="write-bottom-option-wrapper">
    <p>{{ t('writePage.boardDivision') }}</p>
    <apoc-select
      v-if="subTabOption"
      class="board-select-area"
      :selected-value="selectSubTab"
      :except-placeholder-from-list="true"
      :on-change="onClickSelectSubTab"
      :option-list="subTabOption"
		:arrow-down-primary="true"/>
    <p>{{ t('writePage.serviceDivision') }}</p>
    <apoc-select
      v-if="tagOption"
      class="service-select-area"
			:class="{'exist-tag': !tagOption || tagOption.length <= 0}"
      :selected-value="selectTag"
      :except-placeholder-from-list="true"
      :on-change="onClickSelectTag"
			:option-list="tagOption ? tagOption : []"
			:disabled="!tagOption || tagOption.length <= 0"
		/>
    <p>{{ t('writePage.privacySetting') }}</p>
    <div class="private-select-area" @click="onClickCheckPrivate">
      <div class="private-select-checkbox" :class="{ 'is-private': isCheckPrivate }">
        <apoc-image-set src="/assets/images/common/icons/check-icon.webp" :img-sets="3" />
      </div>
      <p class="private-select-text">{{ t('private') }}</p>
    </div>
  </div>
</template>

<style scoped></style>