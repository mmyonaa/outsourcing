<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getApiClient } from '@/utils/apiClient';
import { initStore } from '@/stores/store-manager';
import { uploadFileImg } from '@/api/file.api';
import AppConfig from '@/constants';

export default defineComponent({
  name: 'Test',
  setup() {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);
    const file = ref<File | undefined>(undefined);
    const fileChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        file.value = input.files[0];
      }
    };
    const onClickSubmit = async () => {
      if (!file.value) {
        console.error('No file selected');
        return;
      }
      const formData = new FormData();
      formData.append('imageFile', file.value);
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      await uploadFileImg(apiClient, formData).then(res => {
        console.log(res);
      });
    };

    return {
      file,
      fileChange,
      onClickSubmit,
    };
  },
});
</script>

<template>
  <div class="wrapper">
    <div>file:{{ file }}}</div>
    <input id="upload-image" type="file" accept="image/*" @change="fileChange" />
    <button @click="onClickSubmit">submit</button>
  </div>
</template>

<style lang="scss">
@import '../assets/css/quillSnow.scss';
</style>
