<script lang="ts">
import { deleteBoard, getBoardList, updateBoard } from '@/api/board.api';
import { BoardEntity, SearchBoardDto } from '@/api/dto/board.dto';
import { STATE_YN } from '@/types';
import { getApiClient } from '@/utils/apiClient';
import { ALLOWED_UPLOAD_FILE_EXTENSIONS } from '@/constants';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// 커스텀 파일 첨부 아이콘 — 모듈 로드 시 1회만 등록 (마운트마다 재등록되어 경고가 나던 것 방지)
const quillIcons = Quill.import('ui/icons') as Record<string, string>;
quillIcons['file'] = '<svg viewBox="0 0 18 18"><path class="ql-stroke" d="M9,3V15M3,9H15"></path></svg>';

export default defineComponent({
  name: 'adminNewsDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const notice = ref<BoardEntity>(new BoardEntity());
    const apiClient = getApiClient();
    const bestValue = ref<boolean>(false);
    const noticeIdx = route.query.id;
    const editorRef = ref<HTMLElement | null>(null);
    let quillInstance: Quill | null = null;

    const goBack = () => {
      router.push('/admin/news'); // 보도자료 목록 페이지 경로
    };

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
            fileName: response.data.data.fileName || file.name
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

    // Quill 에디터 초기화
    const initQuillEditor = () => {
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

      quillInstance = new Quill(editorRef.value, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
              file: fileHandler,
            },
          },
        },
        placeholder: '내용을 입력하세요...',
      });

      // 기존 내용을 Quill에 로드 — innerHTML 직접 주입 대신 공식 경로(clipboard.convert)로
      // 델타를 만들어 넣는다 (내부 델타와 DOM 불일치 방지)
      if (notice.value.body) {
        const delta = quillInstance.clipboard.convert({ html: notice.value.body });
        quillInstance.setContents(delta, 'silent');
      }

      // 콘텐츠 변경 시 notice.body 업데이트
      quillInstance.on('text-change', () => {
        notice.value.body = quillInstance?.root.innerHTML || '';
      });
    };

    const loadBoardDetail = async () => {
      // id 누락·잘못된 id·삭제된 글은 편집 화면을 띄우지 않고 목록으로 돌려보낸다
      if (!noticeIdx) {
        alert('글을 찾을 수 없습니다.');
        goBack();
        return;
      }

      const param = new SearchBoardDto();
      param.boardIdx = String(noticeIdx);

      await getBoardList(apiClient, param)
        .then(res => {
          if (res.resultCode === 0 && res.data && res.data.length > 0) {
            notice.value = res.data[0];
            bestValue.value = notice.value.bestYn === STATE_YN.Y ? true : false;

            // 데이터 로드 후 Quill 에디터 초기화
            initQuillEditor();
          } else {
            alert('글을 찾을 수 없습니다. 삭제되었거나 잘못된 주소일 수 있습니다.');
            goBack();
          }
        })
        .catch(e => {
          console.error(e);
          alert('글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
          goBack();
        });
    };

    const submitNotice = async () => {
      if (!notice.value.title || !notice.value.title.trim()) {
        alert('제목을 입력하세요.');
        return;
      }

      if (!quillInstance || !quillInstance.getText().trim()) {
        alert('내용을 입력하세요.');
        return;
      }

      notice.value.body = quillInstance.root.innerHTML;
      notice.value.bestYn = bestValue.value ? STATE_YN.Y : STATE_YN.N;

      // 실패 시에도 반드시 사용자에게 알린다 — 무반응이면 저장된 줄 알고
      // 이탈해 작성 내용을 잃을 수 있다
      await updateBoard(apiClient, notice.value)
        .then(res => {
          if (res.resultCode === 0 && res.data) {
            alert('보도자료 수정이 완료되었습니다.');
            router.push('/admin/news');
          } else {
            alert('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        })
        .catch(e => {
          console.error(e);
          alert('수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        });
    };

    const delNotice = async () => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deleteBoard(apiClient, { boardIdx: String(noticeIdx) })
          .then(res => {
            if (res.resultCode === 0 && res.data) {
              alert('보도자료 삭제가 완료되었습니다.');
              router.push('/admin/news');
            } else {
              alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
            }
          })
          .catch(e => {
            console.error(e);
            alert('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          });
      }
    };

    onMounted(() => {
      loadBoardDetail();
    });

    onUnmounted(() => {
      quillInstance = null;
    });

    return {
      notice,
      bestValue,
      editorRef,
      submitNotice,
      goBack,
      delNotice,
    };
  },
});
</script>

<template>
  <div class="page-common notice-page admin">
    <h1>보도자료 수정</h1>
    <div class="notice-detail">
      <!-- 중요 보도자료 여부 -->
      <div class="form-section">
        <label class="checkbox">
          <input type="checkbox" v-model="bestValue" /> 중요 보도자료 여부
        </label>
      </div>

      <!-- 제목 -->
      <div class="form-section">
        <label class="section-title">제목</label>
        <input v-model="notice.title" class="notice-input" placeholder="제목을 입력하세요" />
      </div>

      <!-- Quill 에디터 -->
      <div class="form-section">
        <label class="section-title">내용</label>
        <div ref="editorRef" class="quill-editor"></div>
      </div>

      <!-- 버튼 -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="goBack">← 목록으로 돌아가기</button>
        <button class="back-button delete" @click="delNotice">삭제</button>
        <button class="back-button submit" @click="submitNotice">수정</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 폼 섹션 공통 스타일 */
.form-section {
  margin-bottom: 1.5rem;
}

.form-section:last-of-type {
  margin-bottom: 2rem;
}

/* 라벨 스타일 */
.section-title {
  display: block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: #333;
}

/* 체크박스 */
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.checkbox input[type='checkbox'] {
  cursor: pointer;
}

/* Quill 에디터 */
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

/* 툴바 버튼 크기 증가 */
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

/* 아이콘 크기 증가 */
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
