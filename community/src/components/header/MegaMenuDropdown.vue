<script lang="ts">
import ApocImageSet from '@/components/common/ApocImageSet.vue';
import AppConfig from '@/constants';
import { loadLocalData, saveLocalData } from '@/utils/common-util';
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface langSelectOption {
  value: string;
  label: string;
  subLabel?: string; //부가설명
  func?: () => void;
}

//콘텐츠 SelectBox
export default defineComponent({
  name: 'MegaMenuDropdown',
  components: { ApocImageSet },
  setup() {
    const listOpened = ref<boolean>(false);
    const { t } = useI18n({ useScope: 'global' });
    const selectedValue = computed(() => (loadLocalData(AppConfig.KEYS.LANG) === 'ko' ? 'KR' : 'EN'));

    // 언어 옵션
    const langOptions = [
      {
        value: 'KR',
        label: t('lang.ko'),
        subLabel: t('KR'),
        func: () => {
          changeLang('ko');
        },
      },
      {
        value: 'EN',
        label: t('lang.en'),
        subLabel: t('EN'),
        func: () => {
          changeLang('en');
        },
      },
    ];

    // 언어 변경
    const changeLang = (v: string) => {
      saveLocalData(AppConfig.KEYS.LANG, v);
      window.location.reload();
    };

    const handleSelect = (v?: langSelectOption) => {
      if (v && v.func) v.func();
      listOpened.value = false;
    };

    return {
      listOpened,
      langOptions,
      selectedValue,
      handleSelect,
    };
  },
});
</script>
<template>
	<div v-click-away="() => (listOpened = false)" class="mega-dropdown" @click="() => (listOpened = !listOpened)">
		<div class="selected-area" :class="listOpened ? 'active' : ''">
			<apoc-image-set class="placeholder-img" :img-sets="3" src="/assets/images/common/icons/icon-language.webp" />
			<p class="placeholder">{{ selectedValue }}</p>
		</div>
		<transition name="dropdown">
			<div v-show="listOpened" class="option-list-area-wrapper">
				<ul class="option-list-area">
					<li v-for="option of langOptions" :key="option.value" :value="option.value" @click="handleSelect(option)">
						<div class="option-list-desc">
							<!-- 타이틀 -->
							<span>{{ option.label }}</span>
							<!-- 부가 설명 -->
							<span v-show="option.subLabel">{{ option.subLabel }}</span>
						</div>
						<!-- 선택된 항목 체크 표시 -->
						<img v-if="selectedValue === option.value" class="option-list-check" src="/assets/images/common/icons/icon_check-purple.svg" />
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>
