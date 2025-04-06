<script lang="ts">
import { uploadFileImg } from '@/api/file.api';
import AppConfig from '@/constants';
import { initStore } from '@/stores/store-manager';
import { getApiClient } from '@/utils/apiClient';
import { convertYoutubeToEmbedUrl, isApocUrl, setQuillIcon } from '@/utils/quill-utill';
import { Logger } from 'sass';
import { PropType, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

export default {
  name: 'TextEditor',
  emits: ['update:body', 'focus', 'update:imageList'],
  props: {
    defaultText: {
      type: String as PropType<string>,
      required: false,
      default: '',
    },
  },
  setup(props, ctx) {
    const storeManager = initStore();
    const apiClient = getApiClient(AppConfig.API_SERVER, storeManager);

    const quillEditor = ref<HTMLElement | null>(null);
    const toolbar = ref<HTMLElement | null>(null);
    const isQuillReady = ref<boolean>(false);

    let quill: any = null;
    let blotFormatter: any = null;

    const quillFocus = () => {
      if (quill) {
        ctx.emit('focus');
        quill.focus();
      }
    };

    onMounted(async () => {
      if (typeof window === undefined || !quillEditor.value) return;
      if (quillEditor.value instanceof HTMLElement) {
        const Quill = (await import('quill')).default;
        const MagicUrl = (await import('quill-magic-url')).default;
        // @ts-ignore
        const BlotFormatter = (await import('quill-blot-formatter/dist/BlotFormatter')).default;
        // @ts-ignore
        const imageUploader = (await import('quill-image-uploader')).default;

        // Quill에 모듈을 등록
        Quill.register('modules/magicUrl', MagicUrl); // url 링크 자동 생성기

        Quill.register('modules/blotFormatter', BlotFormatter); // 이미지 위치 사이즈 조절

        Quill.register('modules/imageUploader', imageUploader); // 이미지 저장시 aws 저장

        const fonts = ['pretendard', 'poppins', 'gothica1', 'ibmplexsanskr'];
        const Font: any = Quill.import('formats/font');

        Font.whitelist = fonts;
        Quill.register(Font, true); // 폰트 적용

        const BlockEmbed: any = Quill.import('blots/block/embed');

        // 구분 선 기능
        class DividerBlot extends BlockEmbed {
          static create(value: any) {
            const node = super.create(value);
            node.setAttribute('src', value.url);
            node.setAttribute('class', value.className);
            return node;
          }

          static value(node: any) {
            return {
              url: node.getAttribute('src'),
              className: node.getAttribute('class'),
            };
          }
        }

        DividerBlot.blotName = 'divider';
        DividerBlot.tagName = 'img';

        Quill.register(DividerBlot);

        class removeListBlot extends BlockEmbed {
          static blotName = 'removeList';
          static tagName = 'none';
        }

        Quill.register(removeListBlot); // 리스트 항목 삭제

        const customIcons = setQuillIcon(Quill);
        Quill.register('modules/customIcons', customIcons); // 커스텀 아이콘 적용

        quill = new Quill(quillEditor.value, {
          theme: 'snow',
          modules: {
            // 한글 엔터 동작시 나타나던 에러
            keyboard: {
              bindings: {
                handleEnter: {
                  key: 'Enter', // 엔터 키
                  handler: function (range: any, context: any) {
                    const selection = document.getSelection();
                    selection?.removeAllRanges();
                    quill.setSelection(range.index, 0);
                    selection?.addRange(range);
                  },
                },
              },
            },
            toolbar: {
              container: toolbar.value,
              handlers: {
                hr: () => {
                  const range = quill.getSelection(true);
                  const imageURL = '/assets/images/editor/icon/editor-hr.svg';
                  quill.insertEmbed(range.index, 'divider', { url: imageURL, className: 'divider-class' });
                  quill.insertText(range.index + 1, '\n');
                  quill.setSelection(range.index + 2);
                },
                none: () => {
                  const range = quill.getSelection();
                  if (range) {
                    const format = quill.getFormat(range);
                    if (format['list']) {
                      quill.format('list', false); // 리스트 포맷 제거
                      quill.format('block', ''); // 블록 포맷 초기화
                    }
                  }
                },
              },
            },
            magicUrl: {
              urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)|(tel:[\S]+)/g,
              globalRegularExpression: /(https?:\/\/|www\.|tel:)[\S]+/g,
            },
            blotFormatter: {
              overlay: {
                className: 'blot-formatter__overlay',
                style: {
                  position: 'absolute',
                  boxSizing: 'border-box',
                  border: '2px solid rgba(137, 118, 253, 1)',
                  boxShadow: '0 0 0 4px rgba(137, 118, 253, 0.3)',
                  borderRadius: '6px',
                },
              },
              align: {
                attribute: 'data-align',
                aligner: {
                  applyStyle: true,
                },
                icons: {
                  left: `<img src="/assets/images/editor/icon/editor-icon_align_left.svg" alt="Left">`,
                  center: `<img src="/assets/images/editor/icon/editor-icon_align_center.svg" alt="Center">`,
                  right: `<img src="/assets/images/editor/icon/editor-icon_align_right.svg" alt="Right">`,
                },
                toolbar: {
                  allowDeselect: true,
                  mainClassName: 'blot-formatter__toolbar',
                  mainStyle: {
                    position: 'absolute',
                    top: '-12px',
                    right: '0',
                    left: '0',
                    height: '0',
                    minWidth: '100px',
                    font: '12px/1.0 Arial, Helvetica, sans-serif',
                    textAlign: 'center',
                    color: '#333',
                    boxSizing: 'border-box',
                    cursor: 'default',
                  },
                  buttonClassName: 'blot-formatter__toolbar-button',
                  addButtonSelectStyle: true,
                  buttonStyle: {
                    display: 'none',
                    width: '24px',
                    height: '24px',
                    background: 'none',
                    border: 'none',
                    verticalAlign: 'middle',
                  },
                  svgStyle: {
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    background: 'white',
                    border: '1px solid #999',
                    verticalAlign: 'middle',
                  },
                },
              },
              resize: {
                handleClassName: 'blot-formatter__resize-handle',
                handleStyle: {
                  position: 'absolute',
                  height: '12px',
                  width: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #777',
                  boxSizing: 'border-box',
                  opacity: '0',
                },
              },
            },
            imageUploader: {
              upload: async (file: File) => {
                const formData = new FormData();
                formData.append('imageFile', file);
                const imgSrc = await uploadFileImg(apiClient, formData).then(res => {
                  ctx.emit('update:imageList', res.data.saveFileName);
                  return AppConfig.FILE_SERVER + res.data.saveFileName;
                });
                return imgSrc;
              },
            },
          },
        });

        quill.on('text-change', (delta: any, oldDelta: any, source: string) => {
          if (source === 'user') {
            // 텍스트 업데이트
            const editorElement = quill.root;
            // 임베드 관련
            const links = editorElement.querySelectorAll('a');
            links.forEach((link: HTMLElement) => {
              const href = link.getAttribute('href');
              if (href) {
                const embedUrl = convertYoutubeToEmbedUrl(href) || isApocUrl(href);
                if (embedUrl) {
                  const blot: any = Quill.find(link);
                  const index = quill.getIndex(blot);
                  quill.deleteText(index, blot.length(), Quill.sources.USER);
                  quill.insertEmbed(index, 'video', embedUrl, Quill.sources.USER);
                }
              }
            });
            let textChanged = false;
            // 텍스트가 변경 돠었는지
            delta.ops.forEach((op: any) => {
              if (op.insert || op.delete) {
                textChanged = true;
              }
            });
            if (textChanged) {
              // 이미지 포커스 삭제
              if (!blotFormatter) {
                blotFormatter = quill.getModule('blotFormatter');
              }
              if (blotFormatter) {
                blotFormatter.hide();
              }
            }
          }
        });
      }
      if (props.defaultText) quill.root.innerHTML = props.defaultText;

      isQuillReady.value = true; // Quill이 준비되었음을 표시
    });

    return {
      isQuillReady,
      quillEditor,
      toolbar,
      quillFocus,
    };
  },
};
</script>

<template>
  <!-- 툴바 영역 -->
  <div class="toolbar-area" :class="{ 'is-hidden': !isQuillReady }">
    <div id="toolbar" ref="toolbar">
      <span class="ql-formats">
        <select class="ql-header" @click-="() => {}">
          <option value="1">Header 1</option>
          <option value="2">Header 2</option>
          <option value="3">Header 3</option>
          <option value="7" selected>Normal</option>
        </select>
        <select class="ql-font" @click-="() => {}">
          <option value="pretendard" selected></option>
          <option value="poppins"></option>
          <option value="gothica1"></option>
          <option value="ibmplexsanskr"></option>
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-align" value=""></button>
      </span>
      <span class="ql-formats">
        <button class="ql-align" value="center"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-align" value="right"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-align" value="justify"></button>
      </span>
      <span class="ql-formats separator"></span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
        <button class="ql-none"></button>
      </span>
      <span class="ql-formats separator"></span>
      <span class="ql-formats"> <button class="ql-bold"></button> </span>
      <span class="ql-formats"> <button class="ql-italic"></button> </span>
      <span class="ql-formats"> <button class="ql-underline"></button> </span>
      <span class="ql-formats"> <button class="ql-strike"></button> </span>
      <span class="ql-formats">
        <button class="ql-blockquote"></button>
      </span>
      <span class="ql-formats separator"></span>
      <span class="ql-formats">
        <select class="ql-color" @click="()=>{console.log()}">
          <option value="#FFFFFF"></option>
          <option value="#DBDADE"></option>
          <option value="#2F2C41"></option>
          <option value="#FEB74D"></option>
          <option value="#EA5455"></option>
          <option value="#25C76F"></option>
          <option value="#1CCAE2"></option>
          <option value="#0C99FF"></option>
          <option value="#8976FD"></option>
        </select>
        <select class="ql-background" @click="()=>{console.log()}">
          <option value="#FFFFFF"></option>
          <option value="#DBDADE"></option>
          <option value="#2F2C41"></option>
          <option value="#FFF1E3"></option>
          <option value="#FFEBEB"></option>
          <option value="#DEF7E9"></option>
          <option value="#DAF8FC"></option>
          <option value="#D2ECFF"></option>
          <option value="#F4F3FF"></option>
        </select>
      </span>
      <span class="ql-formats separator"></span>
      <span class="ql-formats"> <button class="ql-link"></button> </span>
      <span class="ql-formats"> <button class="ql-image"></button> </span>
      <span class="ql-formats">
        <button class="ql-video"></button>
      </span>
      <span class="ql-formats separator"></span>
      <span class="ql-formats">
        <button class="ql-hr"></button>
      </span>
    </div>
  </div>
  <!-- 글작성 영역 -->
  <!-- 화면 클릭시 자동으로 quill로 포커스 -->
  <section class="editor-area">
    <slot/>
    <div ref="quillEditor" @click.self="quillFocus"/>
    <div class="editor-divider"/>
    <div class="empty-area"/>
  </section>
</template>
