<script lang="ts">
import ApocButton from '@/components/common/ApocButton.vue';
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import ApocLink from '@/components/common/ApocLink.vue';
import ApocSelect, { ISelectOption } from '@/components/common/ApocSelect.vue';
import { STATE_YN } from '@/types';
import { PropType, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'WriteHeader',
  components: { ApocSelect, ApocButton, ApocImageSet, ApocLink },
  props: {
    isWritePage: {
      type: String as PropType<STATE_YN>,
    },
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
    const router = useRouter();
    const isCheck = ref<boolean>(false);
    const { t } = useI18n({ useScope: 'global' });

    const onClickExternal = (site?: string) => {
      window.open(`https://${site}.apoc.day/`);
    };
    const onClickSelectSubTab = (e: Event) => {
      emit('update:select-sub-tab', e);
    };
    const onClickSelectTag = (e: Event) => {
      emit('update:select-tag', e);
    };
    const onClickCheckPrivate = () => {
      emit('update:check-private', !props.isCheckPrivate);
    };
    const onClickSubmit = () => {
      if (props.isWritePage) {
        if (props.isWritePage === STATE_YN.Y) {
          emit('update:submit');
        } else {
          emit('update:edit');
        }
      }
    };

    const onClickCloseBtn = () => {
      router.back();
    };

    return {
      t,
      STATE_YN,
      isCheck,
      onClickExternal,
      onClickSelectSubTab,
      onClickSelectTag,
      onClickCheckPrivate,
      onClickSubmit,
      onClickCloseBtn,
    };
  },
});
</script>
<template>
  <div class="write-pc-header">
    <div class="header-wrapper" ref="headerRef">
      <div class="left-area">
        <div class="logo-area">
          <apoc-link href="/">
            <apoc-image-set src="/assets/images/logo/comm-logo.webp" alt="logo" :img-sets="3" />
          </apoc-link>
        </div>
      </div>
      <div class="right-area" ref="rightRef">
        <div class="private-select-area" @click="onClickCheckPrivate">
          <div class="private-select-checkbox" :class="{ 'is-private': isCheckPrivate }">
            <apoc-image-set src="/assets/images/common/icons/check-icon.webp" :img-sets="3" />
          </div>
          <p class="private-select-text">{{ t('private') }}</p>
        </div>
        <apoc-select
          v-if="subTabOption"
          class="board-select-area"
          :selected-value="selectSubTab"
          :except-placeholder-from-list="true"
          :on-change="onClickSelectSubTab"
          :option-list="subTabOption"
					:arrow-down-primary="true"/>
        <apoc-select
          class="service-select-area"
					:class="{'exist-tag': !tagOption || tagOption.length <= 0}"
          :selected-value="selectTag"
          :except-placeholder-from-list="true"
          :on-change="onClickSelectTag"
          :option-list="tagOption ? tagOption : []"
					:disabled="!tagOption || tagOption.length <= 0"
				/>
        <apoc-button v-if="isWritePage" class="save-btn" @click="onClickSubmit">{{ isWritePage === STATE_YN.Y ? t('writePage.save') : t('writePage.edit') }}</apoc-button>
      </div>
    </div>
  </div>
  <div class="write-mobile-header">
    <apoc-image-set class="close-btn" src="/assets/images/common/icons/close-btn.webp" alt="close-btn" :img-sets="3" @click="onClickCloseBtn" />
    <apoc-button v-if="isWritePage" class="save-btn" @click="onClickSubmit">{{ isWritePage === STATE_YN.Y ? t('writePage.save') : t('writePage.edit') }}</apoc-button>
  </div>
</template>
