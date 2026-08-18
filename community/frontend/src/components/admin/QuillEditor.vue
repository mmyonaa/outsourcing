<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { getApiClient } from '@/utils/apiClient';
import { ALLOWED_UPLOAD_FILE_EXTENSIONS } from '@/constants';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';

// BlotFormatter/파일 아이콘 — 모듈 로드 시 1회만 등록 (마운트마다 재등록되어 overwrite 경고가 나던 것 방지)
try {
  Quill.register('modules/blotFormatter', BlotFormatter);
} catch (e) {
  console.warn('BlotFormatter 모듈 등록 실패:', e);
}
const quillIcons = Quill.import('ui/icons') as Record<string, string>;
quillIcons['file'] = '<svg viewBox="0 0 18 18"><path class="ql-stroke" d="M9,3V15M3,9H15"></path></svg>';

/**
 * 관리자 공용 Quill 에디터.
 * 이미지/파일 S3 업로드 핸들러·툴바 설정·스타일이 편집 8개 화면에 복붙되어 있던 것을 통합.
 *
 * 부모에서는 ref 로 접근한다:
 *  - getHTML() / getText() : 현재 내용
 *  - setHTML(html)         : 기존 글 로드 (clipboard.convert 경유)
 */
export default defineComponent({
  name: 'QuillEditor',
  props: {
    /** 이미지 리사이즈(BlotFormatter) 모듈 활성화 — 프로그램 편집 화면에서 사용 */
    withBlotFormatter: { type: Boolean, default: false },
    placeholder: { type: String, default: '내용을 입력하세요...' },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const apiClient = getApiClient();
    const editorRef = ref<HTMLElement | null>(null);
    let quillInstance: Quill | null = null;

    // S3에 이미지 업로드
    const uploadImageToS3 = async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await apiClient.post('/board/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0 && response.data.data?.imageUrl) {
          return response.data.data.imageUrl;
        }
        throw new Error('이미지 업로드 실패');
      } catch (error) {
        console.error('Image upload error:', error);
        alert('이미지 업로드에 실패했습니다.');
        throw error;
      }
    };

    // S3에 파일 업로드
    const uploadFileToS3 = async (file: File): Promise<{ fileUrl: string; fileName: string }> => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/board/upload-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.resultCode === 0 && response.data.data?.fileUrl) {
          return {
            fileUrl: response.data.data.fileUrl,
            fileName: response.data.data.fileName || file.name,
          };
        }
        throw new Error('파일 업로드 실패');
      } catch (error) {
        console.error('File upload error:', error);
        alert('파일 업로드에 실패했습니다.');
        throw error;
      }
    };

    // Quill 이미지 핸들러
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        if (file.size > 20 * 1024 * 1024) {
          alert('파일 크기는 20MB 이하여야 합니다.');
          return;
        }

        try {
          const imageUrl = await uploadImageToS3(file);
          const range = quillInstance?.getSelection();
          if (range) {
            quillInstance?.insertEmbed(range.index, 'image', imageUrl);
            quillInstance?.setSelection(range.index + 1, 0);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
    };

    // 파일 첨부 핸들러
    const fileHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', ALLOWED_UPLOAD_FILE_EXTENSIONS.map(e => `.${e}`).join(','));
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        // 서버 화이트리스트와 동일 검사 — 업로드 후 실패보다 선택 즉시 안내
        const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '';
        if (!ALLOWED_UPLOAD_FILE_EXTENSIONS.includes(ext)) {
          alert(`허용되지 않는 파일 형식입니다.\n허용: ${ALLOWED_UPLOAD_FILE_EXTENSIONS.join(', ')}`);
          return;
        }

        if (file.size > 20 * 1024 * 1024) {
          alert('파일 크기는 20MB 이하여야 합니다.');
          return;
        }

        try {
          const { fileUrl } = await uploadFileToS3(file);
          const range = quillInstance?.getSelection();
          if (range) {
            // 원본 파일명(file.name)을 사용하여 한글 파일명 보존
            quillInstance?.insertText(range.index, file.name, 'link', fileUrl);
            quillInstance?.setSelection(range.index + file.name.length, 0);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
    };

    onMounted(() => {
      if (!editorRef.value) return;

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image', 'file'],
        ['clean'],
      ];

      const modules: any = {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: imageHandler,
            file: fileHandler,
          },
        },
      };

      if (props.withBlotFormatter) {
        modules.blotFormatter = {};
      }

      quillInstance = new Quill(editorRef.value, {
        theme: 'snow',
        modules,
        placeholder: props.placeholder,
      });

      quillInstance.on('text-change', () => {
        emit('change', quillInstance?.root.innerHTML || '');
      });
    });

    onUnmounted(() => {
      quillInstance = null;
    });

    // ---- 부모(ref)에서 사용하는 메서드 ----
    const getHTML = (): string => quillInstance?.root.innerHTML || '';
    const getText = (): string => quillInstance?.getText() || '';
    const setHTML = (html: string) => {
      if (!quillInstance || !html) return;
      // innerHTML 직접 주입 대신 공식 경로(clipboard.convert)로 델타를 만들어 넣는다
      const delta = quillInstance.clipboard.convert({ html });
      quillInstance.setContents(delta, 'silent');
    };

    return {
      editorRef,
      getHTML,
      getText,
      setHTML,
    };
  },
});
</script>

<template>
  <div ref="editorRef" class="quill-editor"></div>
</template>

<style scoped>
.quill-editor {
  min-height: 400px;
  background: white;
}

:deep(.ql-toolbar) {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

:deep(.ql-toolbar .ql-formats) {
  margin-right: 0 !important;
  display: flex;
  gap: 4px;
  align-items: center;
}

:deep(.ql-toolbar button) {
  width: 32px !important;
  height: 32px !important;
  padding: 4px !important;
  margin: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.ql-toolbar .ql-picker) {
  height: 32px !important;
  margin: 0 !important;
}

:deep(.ql-toolbar .ql-picker-label) {
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 8px !important;
  display: inline-flex;
  align-items: center;
}

:deep(.ql-toolbar button svg) {
  width: 20px !important;
  height: 20px !important;
}

:deep(.ql-toolbar .ql-stroke) {
  stroke-width: 2 !important;
}

:deep(.ql-toolbar .ql-fill) {
  fill: currentColor !important;
}

:deep(.ql-container) {
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-size: 16px;
  min-height: 400px;
}

:deep(.ql-editor) {
  min-height: 400px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
}

:deep(.ql-editor.ql-blank::before) {
  color: #999;
  font-style: normal;
}

/* 링크 스타일 */
:deep(.ql-editor a) {
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
}

:deep(.ql-editor a:hover) {
  color: #0052a3;
}
</style>
