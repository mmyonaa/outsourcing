<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
type SelectPropType = string | number | boolean | Date | undefined;
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { loadLocalData } from '@/utils/common-util';
import type { PropType } from 'vue';

export interface ISelectOption {
  value: string;
  label: string;
  labelEn?: string;
  code?: string;
}

export default defineComponent({
  name: 'ApocSelect',
  components: { ApocImageSet },
  props: {
    optionList: {
      type: Array as PropType<ISelectOption[]>,
      required: true,
    },
    selectedValue: {
      type: Object as PropType<ISelectOption>,
      required: false,
    },
    onChange: {
      type: Function,
      required: false,
    },
    placeholder: {
      type: String as PropType<string>,
      required: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      required: false,
    },
    exceptPlaceholderFromList: {
      type: Boolean as PropType<boolean>,
      required: false,
    },
    arrowDownPrimary: {
      type: Boolean as PropType<boolean>,
      required: false,
    },
  },
  setup(props) {
    const optionList = computed(() => props.optionList || []);
    const listOpened = ref<boolean>(false);
    const lang = ref<string>('');

    const handleSelect = (v?: ISelectOption) => {
      if (props.disabled) return;
      if (props.onChange) props.onChange(v || undefined);
      listOpened.value = false;
    };

    const clickSelectBox = () => {
      if (props.disabled) return;
      listOpened.value = !listOpened.value;
    };

    const closeOptionList = () => {
      listOpened.value = false;
    };

    onMounted(() => {
      lang.value = loadLocalData(AppConfig.KEYS.LANG) as string;
    });
    return {
      handleSelect,
      listOpened,
      lang,
      clickSelectBox,
      closeOptionList,
    };
  },
});
</script>

<template>
  <div class="apoc-select" @click.prevent="clickSelectBox" v-click-away="closeOptionList">
    <div class="selected-area" :class="{ placeholder: placeholder && !selectedValue }" v-html="lang === 'ko' ? selectedValue?.label || placeholder || '' : selectedValue?.labelEn || placeholder || ''"></div>
    <apoc-image-set class="arrow-down" :src="arrowDownPrimary ? '/assets/images/common/icons/arrow-down-primary-icon.webp' : '/assets/images/common/icons/arrow-down-icon.webp'" alt="arrow-down" :img-sets="3" />
    <div v-if="listOpened" class="option-list-area-wrapper">
      <ul class="option-list-area">
        <li v-if="!exceptPlaceholderFromList && placeholder" class="placeholder" :value="undefined" @click.stop="() => handleSelect()">
          {{ placeholder }}
        </li>
        <li
          class="option-item"
          v-for="option of optionList"
          :value="option.value"
          :key="option.value"
					:class="{ 'is-selected': option.value === selectedValue?.value }"
          v-html="lang === 'ko' ? option.label : option.labelEn"
          @click.stop="handleSelect(option)"></li>
      </ul>
    </div>
  </div>
</template>

<style></style>
