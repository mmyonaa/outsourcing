import { nextTick } from 'vue';

/**
 * 본문(v-html) 안의 첨부파일 링크에 download 속성과 강제 다운로드 처리를 건다.
 * (기존에 상세 4종에 60줄씩 복붙되어 있던 로직을 한 곳으로 모음)
 *
 * 본문이 실제 DOM에 반영된 다음 틱에 링크를 찾는다.
 */
export async function setupFileDownloadLinks() {
  await nextTick();

  const fileLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.notice-content a[href*="amazonaws.com"], .notice-content a[href*="/uploads/"], .notice-content a[href*="/files/"]',
  );

  fileLinks.forEach(link => {
    const url = link.href;
    // 링크 텍스트를 파일명으로 사용 (Quill에서 원본 파일명으로 링크를 생성했으므로)
    const fileName = link.textContent?.trim() || url.split('/').pop()?.split('?')[0] || 'download';

    // download 속성 추가
    link.setAttribute('download', fileName);

    // 클릭 이벤트로 강제 다운로드
    link.addEventListener('click', async e => {
      e.preventDefault();

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('파일 다운로드 오류:', error);
        // 다운로드 실패 시 새 탭에서 열기
        window.open(url, '_blank');
      }
    });
  });
}
