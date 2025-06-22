<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ApocInput from '@/components/common/ApocInput.vue';
import ApocButton from '@/components/common/ApocButton.vue';
import { UserInfoEntityDto } from '@/api/dto/user.dto';
import { getPasswordCheck, getUserInfo, updateUserInfo } from '@/api/user.api';
import { getApiClient } from '@/utils/apiClient';
import { initStore } from '@/stores/store-manager';
import AppConfig from '@/constants';
import { loadLocalData, removeLocalData, saveLocalData } from '@/utils/common-util';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ProfileEdit',
  components: { ApocButton, ApocInput },
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const router = useRouter();

    const password = ref<string>('');
    const nickname = ref<string>('');
    const newPassword = ref<string>('');
    const newPasswordCheck = ref<string>('');
    const isPasswordCheck = ref<boolean>(false);

    const getUser = async () => {
      await getUserInfo(apiClient, {}).then(res => {
        if (res.resultCode === 0) {
          if (res.data) {
            nickname.value = res.data.userNickname !== undefined ? res.data.userNickname : '';
          }
        } else {
          console.error('error');
        }
      });
    };

    const onClickCheck = async () => {
      const param = new UserInfoEntityDto();
      param.pwd = password.value;
      await getPasswordCheck(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          isPasswordCheck.value = true;
        } else if (res.resultCode === 95) {
          // window.alert('비밀번호가 일치하지 않습니다.');
          password.value = '';
        }
      });
    };
    // 본인 정보 수정
    const onClickUpdateUser = async () => {
      if (newPassword.value !== newPasswordCheck.value) return alert('different password !');
      const param = new UserInfoEntityDto();
      param.pwd = newPassword.value;
      param.userNickname = nickname.value;
      await updateUserInfo(apiClient, param).then(res => {
        if (res.resultCode === 0) {
          // alert('변경 완료');
          router.push('/');
        } else {
          // alert('에러');
        }
      });
    };

    onMounted(() => {
      getUser();
    });

    return {
      password,
      nickname,
      newPassword,
      newPasswordCheck,
      isPasswordCheck,
      onClickCheck,
      onClickUpdateUser,
    };
  },
});
</script>

<template>
  <section class="profile-edit-section">
    <div v-if="!isPasswordCheck" class="password-check-wrapper">
      <apoc-input :model-value="password" placeholder="비밀번호를 입력해주세요." @update="value => (password = value)"></apoc-input>
      <apoc-button @click="onClickCheck">확인</apoc-button>
    </div>
    <div v-else-if="isPasswordCheck" class="profile-edit-wrapper">
      <div class="nickname">
        닉네임<apoc-input :model-value="nickname" placeholder="닉네임을 입력해주세요" @update="value => (nickname = value)"></apoc-input>
      </div>
      <div class="new-password">
        새 비밀번호 입력<apoc-input
          :model-value="newPassword"
          placeholder="변경할 비밀번호를 입력해주세요"
          @update="value => (newPassword = value)"></apoc-input>
      </div>
      <div class="new-password-check">
        새 비밀번호 확인<apoc-input
          :model-value="newPasswordCheck"
          placeholder="변경할 비밀번호를 다시 입력해주세요"
          @update="value => (newPasswordCheck = value)"></apoc-input>
      </div>
      <apoc-button @click="onClickUpdateUser" class="save-btn">저장</apoc-button>
    </div>
  </section>
</template>
