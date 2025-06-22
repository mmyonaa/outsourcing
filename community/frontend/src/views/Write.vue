<script lang="ts">
import { getBoardDetail, insertBoard, updateBoard } from '@/api/board.api';
import { BoardEntityDto, InsertBoardDto } from '@/api/dto/board.dto';
import { CategoryEntityV2, ICategory } from '@/api/dto/category.dto';
import { UserInfoEntityDto } from '@/api/dto/user.dto';
import ApocInput from '@/components/common/ApocInput.vue';
import { ISelectOption } from '@/components/common/ApocSelect.vue';
import TextEditor from '@/components/write/TextEditor.vue';
import WriteBottomOption from '@/components/write/WriteBottomOption.vue';
import WriteHeader from '@/components/write/WriteHeader.vue';
import AppConfig from '@/constants';
import { useCommonStore } from '@/stores/common-store';
import { initStore } from '@/stores/store-manager';
import { MAIN_TAB_TYPE, SAVE_STATE, STATE_YN, SUB_TAB_TYPE } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { loadLocalData, ssoLogin } from '@/utils/common-util';
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'Write',
  components: { WriteBottomOption, ApocInput, WriteHeader, TextEditor },
  setup() {
    // 공통 변수
    const { t } = useI18n({ useScope: 'global' });
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();
    const route = useRoute();

    const loginUser = ref<UserInfoEntityDto>();

    // page 타입
    const isWritePage = ref<STATE_YN>(STATE_YN.N);
    const boardIdx = computed(() => (route.params.boardIdx ? route.params.boardIdx : ''));

    // 카테고리 관련 변수
    const categoryList = ref<CategoryEntityV2[]>([]);
    const mainTabInfo = ref<CategoryEntityV2>();
    const subTabInfoList = ref<ICategory[]>([]);
    const tagInfoList = ref<ICategory[]>([]);

    // 리스트 관련 변수
    const subTabOptionList = ref<ISelectOption[]>([]);
    const tagOptionList = ref<ISelectOption[]>([]);

    // 선택 된 탭
    const selectSubTab = ref<ISelectOption>();
    const selectTag = ref<ISelectOption>();
    const isCheckPrivate = ref<boolean>(false);

    // 게시글 관련
    const title = ref<string>('');
    const defaultText = ref<string>('');
    const imgList = ref<string[]>([]);

    // 페이지 이동 허가
    const allowRouter = ref<boolean>(false);

    // 태그 REF
    const writeTitleAreaRef = ref<HTMLTextAreaElement | null>(null);
    const writeTitleRef = ref<HTMLTextAreaElement | null>(null);

    // 에디터오픈 여부 ( write페이지인 경우, 게시글 데이터가 정상적으로 들어오는 경우 )
    const isOpenEdit = ref(false);
    const isExistTag = ref<boolean>(true);

    const beforeCategoryInfo = computed(() => storeManager.dataStore.beforePageCategory);

    /**
     * fetch
     */
    // 카테고리 정보 가져오기
    const getCategoryInfo = () => {
      const category = loadLocalData(AppConfig.KEYS.CATEGORY);
      if (category) {
        categoryList.value = JSON.parse(category);
        const filterCategoryList = categoryList.value.filter(item => item.categoryCode === MAIN_TAB_TYPE.BOARD);
        if (filterCategoryList.length > 0 && filterCategoryList[0].subTab && filterCategoryList[0].subTab[0].tag) {
          mainTabInfo.value = filterCategoryList[0];
          subTabInfoList.value = filterCategoryList[0].subTab;
          tagInfoList.value = filterCategoryList[0].subTab[0].tag as ICategory[];
        }
      }
    };

    // 선택 드롭다운 옵션 생성
    const fetchCategoryOptions = () => {
      if (subTabInfoList.value) {
        subTabOptionList.value = subTabInfoList.value.map((item: ICategory) => ({
          value: item.categoryIdx,
          label: item.categoryKrName,
          labelEn: item.categoryEnName,
          code: item.categoryCode,
        })) as ISelectOption[];
        // 글 작성 페이지인 경우 첫번쨰가 초기값
        if (route.name === 'Write') selectSubTab.value = subTabOptionList.value[0];
      }
      if (tagInfoList.value) {
        tagOptionList.value = tagInfoList.value.map((item: ICategory) => ({
          value: item.categoryIdx,
          label: item.categoryKrName,
          labelEn: item.categoryEnName,
          code: item.categoryCode,
        })) as ISelectOption[];
        // 글 작성 페이지인 경우 첫번쨰가 초기값
        if (route.name === 'Write') selectTag.value = tagOptionList.value[0];
      }
    };

    // 글 저장 버튼 클릭시 todo 중복등록 막기
    const onClickSubmit = async () => {
      if (storeManager.commonStore.isLoading) return;
      storeManager.commonStore.setLoading(true);
      // 글 작성시 해당 해당 위치 동작 !!
      const categoryListParam = paramCategoryList();
      if (!title.value) {
        return alert(t('msg.RESULT_ENTER_TITLE'));
      }
      if (!(document.querySelector('.ql-editor') instanceof HTMLElement)) {
        return alert(t('msg.RESULT_ERROR_OCCURRED_AGAIN'));
      }
      const param = new InsertBoardDto();
      param.title = title.value;
      param.body = (document.querySelector('.ql-editor') as HTMLElement).innerHTML;
      param.saveState = SAVE_STATE.SAVE;
      param.openYn = isCheckPrivate.value ? STATE_YN.N : STATE_YN.Y;
      param.categoryList = categoryListParam;
      param.imgList = imgList.value;
      await insertBoard(apiClient, param)
        .then(res => {
          if (res.resultCode === 0) {
            const board = res.data;
            if (board && board.boardIdx) {
              alert(t('msg.RESULT_POST_CREATION_SUCCESS'));
              // 게시글 이동 허락
              allowRouter.value = true;
              router.push({
                name: 'BoardDetail',
                params: { mainTab: MAIN_TAB_TYPE.BOARD.toLowerCase(), boardIdx: board.boardIdx },
                query: {
                  type: selectSubTab.value?.code,
                },
              });
            }
          }
          storeManager.commonStore.setLoading(false);
        })
        .catch(e => {
          storeManager.commonStore.setLoading(false);
        });
    };

    // 글 수정버튼 클릭시
    const onClickEdit = async () => {
      if (storeManager.commonStore.isLoading) return;
      storeManager.commonStore.setLoading(true);
      // 글 작성시 해당 해당 위치 동작 !!
      const categoryListParam = paramCategoryList();
      if (!title.value) {
        return alert(t('msg.RESULT_ENTER_TITLE'));
      }
      if (!(document.querySelector('.ql-editor') instanceof HTMLElement)) {
        return alert(t('msg.RESULT_ERROR_OCCURRED_AGAIN'));
      }
      const param = new InsertBoardDto();
      param.boardIdx = boardIdx.value as string;
      param.title = title.value;
      param.body = (document.querySelector('.ql-editor') as HTMLElement).innerHTML;
      param.imgList = imgList.value;
      param.saveState = SAVE_STATE.SAVE;
      param.openYn = isCheckPrivate.value ? STATE_YN.N : STATE_YN.Y;
      param.categoryList = categoryListParam;
      await updateBoard(apiClient, param)
        .then(res => {
          if (res.resultCode == 91) {
            alert(t('msg.RESULT_INVALID_ACCESS'));
            // 잘못된 접근 나가게 하게
            allowRouter.value = true;
            router.replace('/');
          }
          if (res.resultCode === 0) {
            const board = res.data;
            if (board && board.boardIdx) {
              alert(t('msg.RESULT_POST_MODIFY_SUCCESS'));
              // 수정시 라우터 이동 허가
              allowRouter.value = true;
              router.push({
                name: 'BoardDetail',
                params: { mainTab: MAIN_TAB_TYPE.BOARD.toLowerCase(), boardIdx: board.boardIdx },
                query: {
                  type: selectSubTab.value?.code,
                },
              });
            }
          }
          storeManager.commonStore.setLoading(false);
        })
        .catch(e => {
          storeManager.commonStore.setLoading(false);
        });
    };

    // 카테고리 idx를 리스트 형식을 만들어 저장합니다
    const paramCategoryList = () => {
      const categoryList = [];
      if (mainTabInfo.value && mainTabInfo.value.categoryIdx) {
        categoryList.push(mainTabInfo.value.categoryIdx);
      }
      if (selectSubTab.value && selectSubTab.value.value) {
        categoryList.push(selectSubTab.value.value);
      }
      if (isExistTag.value && selectTag.value && selectTag.value.value) {
        categoryList.push(selectTag.value.value);
      }
      return categoryList;
    };
    // 수정 페이지 인지 확인
    const checkIsSavePage = () => {
      if (route.name) {
        isOpenEdit.value = route.name === 'Write'; // 글 작성 페이지의 경우 바로 에디터를 열어도 됩니다
        isWritePage.value = route.name === 'Write' ? STATE_YN.Y : STATE_YN.N;
      }
    };
    // 수정페이지인 경우 게시글 불러오기
    const getBoardDetailFunc = async () => {
      const param = new BoardEntityDto();
      param.boardIdx = boardIdx.value as string;
      await getBoardDetail(apiClient, param).then(res => {
        if (res.resultCode !== 0) {
          window.alert(res.resultMsg);
        } else {
          console.log('res', res.data);
          if (res.data) {
            if (loginUser.value && loginUser.value.userIdx !== res.data.regrUserIdx) {
              alert(t('msg.RESULT_LOGIN_REQUIRED'));
              // 잘못된 유저의 경우 나가게
              allowRouter.value = true;
              ssoLogin();
            }
            imgList.value = [...(res.data.body as string).matchAll(/<img[^>]+src="([^">]+)"/g)].map(match =>
              match[1].replace(AppConfig.FILE_SERVER, ''),
            );
            title.value = res.data.title as string;
            defaultText.value = res.data.body as string;
            console.log('defaultText', defaultText.value);
            isCheckPrivate.value = res.data.openYn !== STATE_YN.Y;
            // 수정 페이지인 경우 입력 했던 값으로 지정
            res.data.category?.forEach(item => {
              if (item.categoryTypeCode === 'SUB_TAB') {
                selectSubTab.value = {
                  value: item.categoryIdx,
                  label: item.categoryKrName,
                  labelEn: item.categoryEnName,
                  code: item.categoryCode,
                };
              }
              if (item.categoryTypeCode === 'TAG') {
                selectTag.value = {
                  value: item.categoryIdx,
                  label: item.categoryKrName,
                  labelEn: item.categoryEnName,
                  code: item.categoryCode,
                };
              }
            });
            onClickSubTab(selectSubTab.value as ISelectOption);
            isOpenEdit.value = true; // 데이터를 다 받았고, 에디터를 열 준비가 완료 되었습니다!
          }
        }
      });
      setTextareaHeight();
    };

    // 유저 유효성 확인
    const getUserInfo = () => {
      // const user = loadLocalData(AppConfig.KEYS.LOGIN_USER);
      // if (!user) {
      //   alert('로그인을 해주세요!');
      //   allowRouter.value = true;
      //   router.replace('/user');
      //   return;
      // }
      // loginUser.value = JSON.parse(user);
    };

    const setTextareaHeight = () => {
      if (writeTitleRef.value) {
        writeTitleRef.value.style.height = 'auto';
        writeTitleRef.value.style.height = `${writeTitleRef.value.scrollHeight}px`;
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        e.preventDefault();
      }
    };

    /**
     * Life Cycle
     */

    onBeforeRouteLeave((to, from, next) => {
      if (!allowRouter.value) {
        const deleteOk = window.confirm(t('msg.RESULT_UNSAVED_CHANGES'));
        if (!deleteOk) {
          return;
        }
        next();
      } else {
        next();
      }
    });
    const onClickTitle = () => {
      if (window.document.body.offsetWidth > 768) return;
      const timer = setTimeout(() => {
        if (writeTitleAreaRef.value) {
          writeTitleAreaRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        clearTimeout(timer);
      }, 100);
    };

    const onClickSubTab = (e: ISelectOption) => {
      selectSubTab.value = e;
      const mainTab = categoryList.value.find(item => item.categoryCode === MAIN_TAB_TYPE.BOARD);
      const subTabList = mainTab?.subTab;
      const subTab = subTabList?.find(item => item.categoryIdx === e.value);
      if (subTab && subTab?.tag && subTab?.tag.length > 0) {
        tagOptionList.value = subTab?.tag.map((item: ICategory) => ({
          value: item.categoryIdx,
          label: item.categoryKrName,
          labelEn: item.categoryEnName,
          code: item.categoryCode,
        })) as ISelectOption[];
        selectTag.value = tagOptionList.value[0];
        isExistTag.value = true;
      } else {
        tagOptionList.value = [];
        isExistTag.value = false;
      }
    };

    onMounted(() => {
      getUserInfo();
      checkIsSavePage();
      getCategoryInfo();
      fetchCategoryOptions();
      if (beforeCategoryInfo.value) {
        selectSubTab.value = {
          code: beforeCategoryInfo.value?.categoryCode,
          label: beforeCategoryInfo.value?.categoryKrName as string,
          labelEn: beforeCategoryInfo.value?.categoryEnName as string,
          value: beforeCategoryInfo.value?.categoryIdx as string,
        };
      }

      if (boardIdx.value) getBoardDetailFunc();
    });

    return {
      t,
      isWritePage,
      subTabOptionList,
      tagOptionList,
      selectSubTab,
      selectTag,
      isCheckPrivate,
      title,
      defaultText,
      writeTitleAreaRef,
      writeTitleRef,
      isOpenEdit,
      imgList,
      onClickSubmit,
      onClickEdit,
      setTextareaHeight,
      handleKeydown,
      onClickTitle,
      onClickSubTab,
    };
  },
});
</script>

<template>
  <client-only>
    <div class="write-page">
      <section class="write-header-section">
        <write-header
          :is-write-page="isWritePage"
          :sub-tab-option="subTabOptionList"
          :tag-option="tagOptionList"
          :select-sub-tab="selectSubTab"
          :select-tag="selectTag"
          :is-check-private="isCheckPrivate"
          @update:select-sub-tab="onClickSubTab($event)"
          @update:select-tag="selectTag = $event"
          @update:check-private="isCheckPrivate = $event"
          @update:submit="onClickSubmit"
          @update:edit="onClickEdit" />
      </section>
      <section class="write-editor-section">
        <text-editor v-if="isOpenEdit" :default-text="defaultText" @focus="onClickTitle" @update:imageList="imgList.push($event)">
          <div class="write-title-area" ref="writeTitleAreaRef">
            <div class="write-title">
              <textarea
                ref="writeTitleRef"
                @input="setTextareaHeight"
                v-model="title"
                :placeholder="t('writePage.enterTitle')"
                @keydown="handleKeydown"
                @focus="onClickTitle"
                rows="1"
                maxlength="200"></textarea>
            </div>
            <div class="write-title-divider" />
          </div>
        </text-editor>
      </section>
      <section class="write-bottom-option-section">
        <write-bottom-option
          :sub-tab-option="subTabOptionList"
          :tag-option="tagOptionList"
          :select-sub-tab="selectSubTab"
          :select-tag="selectTag"
          :is-check-private="isCheckPrivate"
          @update:select-sub-tab="onClickSubTab($event)"
          @update:select-tag="selectTag = $event"
          @update:check-private="isCheckPrivate = $event" />
      </section>
    </div>
  </client-only>
</template>
