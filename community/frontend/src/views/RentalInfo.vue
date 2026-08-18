<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import SectionTabs from '@/components/common/SectionTabs.vue';

export default defineComponent({
  name: 'RentalInfo',
  components: { SectionTabs },
  setup() {
    onMounted(() => {});
    return {};
  },
});
</script>

<template>
  <div class="page-common rental-page">
    <h1>대관 신청 링크</h1>
    <section-tabs />
    <div class="content-wrapper">
      <p class="description">아래 링크를 통해 극장 대관 신청서를 작성해 주세요.</p>
      <a
        class="rental-link"
        href="https://docs.google.com/forms/d/e/1FAIpQLScfMXsg6D2XDxpHAjClhDgyTfTvlMGMFSBuZ1zOTCOw4xRtxQ/viewform"
        target="_blank"
        rel="noopener noreferrer">
        대관 신청 바로가기
      </a>
    </div>

    <!-- 대관 절차 섹션 -->
    <div class="procedure-section">
      <h2 class="procedure-title">1. 대관 절차</h2>
      <div class="procedure-image-wrapper">
        <img src="/assets/images/theater/rental_pyo.png" alt="대관 절차" class="procedure-image" />
      </div>
    </div>

    <!-- 필수 제출 서류 섹션 -->
    <div class="documents-section">
      <h2 class="documents-title">2. 대관 시 필수 제출 서류 안내</h2>
      <div class="documents-content">
        <p>① 공연장 안전교육 수료증</p>
        <p>② 기술 질의서(지정양식)</p>
        <p>③ 공연 홍보물 및 공연 정보</p>
      </div>
    </div>

    <!-- 환불 규정 섹션 -->
    <div class="refund-section">
      <h2 class="refund-title">3. 환불 규정</h2>
      <div class="refund-content">
        <table class="refund-table">
          <thead>
            <tr>
              <th>취소 시점</th>
              <th>환불 비율</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="취소 시점">공연일로부터 14일 미만</td>
              <td data-label="환불 비율">0%</td>
              <td data-label="비고">전액 위약금 처리</td>
            </tr>
            <tr>
              <td data-label="취소 시점">공연일로부터 14일 이상 30일 미만</td>
              <td data-label="환불 비율">50%</td>
              <td data-label="비고">계약금 포함</td>
            </tr>
            <tr>
              <td data-label="취소 시점">공연일로부터 30일 이상 60일 미만</td>
              <td data-label="환불 비율">70%</td>
              <td data-label="비고">계약금 포함</td>
            </tr>
            <tr>
              <td data-label="취소 시점">공연일로부터 60일 이상</td>
              <td data-label="환불 비율">100%</td>
              <td data-label="비고">행정·심의비 등 실비 공제 가능</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 대관 절차 섹션 */
.procedure-section {
  margin-top: 5rem;
  padding: 3rem 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.procedure-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 1.75rem;
  font-family: 'Pretendard', sans-serif;
}

.procedure-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
}

.procedure-image {
  width: 100%;
  max-width: 700px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 반응형 */
@media (max-width: 768px) {
  .procedure-section {
    margin-top: 3rem;
    padding: 2rem 0;
  }

  .procedure-title {
    font-size: 20px;
    margin-bottom: 2rem;
  }

  .procedure-image-wrapper {
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .procedure-section {
    margin-top: 2rem;
    padding: 1.5rem 0;
  }

  .procedure-title {
    font-size: 18px;
    margin-bottom: 1.5rem;
  }

  .procedure-image-wrapper {
    padding: 0 1rem;
  }
}

/* 필수 제출 서류 섹션 */
.documents-section {
  margin-top: 5rem;
  padding: 3rem 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.documents-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 1.75rem;
  font-family: 'Pretendard', sans-serif;
}

.documents-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.documents-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  font-family: 'Pretendard', sans-serif;
  text-align: left;
  margin-bottom: 1rem;
}

/* 반응형 - 필수 서류 */
@media (max-width: 768px) {
  .documents-section {
    margin-top: 3rem;
    padding: 2rem 0;
  }

  .documents-title {
    font-size: 20px;
    margin-bottom: 2rem;
  }

  .documents-content {
    padding: 0 1.5rem;
  }

  .documents-content p {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .documents-section {
    margin-top: 2rem;
    padding: 1.5rem 0;
  }

  .documents-title {
    font-size: 18px;
    margin-bottom: 1.5rem;
  }

  .documents-content {
    padding: 0 1rem;
  }

  .documents-content p {
    font-size: 14px;
  }
}

/* 환불 규정 섹션 */
.refund-section {
  margin-top: 5rem;
  padding: 3rem 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.refund-title {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 1.75rem;
  font-family: 'Pretendard', sans-serif;
}

.refund-content {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 2rem;
}

.refund-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  font-family: 'Pretendard', sans-serif;
  text-align: left;
}

.refund-table {
  width: 700px;
  max-width: 100%;
  border-collapse: collapse;
  font-family: 'Pretendard', sans-serif;
  background: white;
  margin: 0 auto;
}

.refund-table thead {
  background: rgba(227, 67, 99, 0.39);
  color: #333;
}

.refund-table th {
  word-break: keep-all;
  padding: 1.5rem 1rem;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  border: 1px solid #ddd;
}

.refund-table tbody tr {
  border-bottom: 1px solid #ddd;
}

.refund-table td {
  word-break: keep-all;
  padding: 1.5rem 1rem;
  font-size: 16px;
  text-align: center;
  color: #333;
  border: 1px solid #ddd;
}

.refund-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

/* 반응형 - 환불 규정 */
@media (max-width: 768px) {
  .refund-section {
    margin-top: 3rem;
    padding: 2rem 0;
  }

  .refund-title {
    font-size: 20px;
    margin-bottom: 2rem;
  }

  .refund-content {
    padding: 0 1.5rem;
  }

  .refund-content p {
    font-size: 15px;
  }

  .refund-table {
    width: 100%;
  }

  .refund-table th {
    padding: 1.2rem 0.8rem;
    font-size: 15px;
  }

  .refund-table td {
    padding: 1.2rem 0.8rem;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .refund-section {
    margin-top: 2rem;
    padding: 1.5rem 0;
  }

  .refund-title {
    font-size: 18px;
    margin-bottom: 1.5rem;
  }

  .refund-content {
    padding: 0 1rem;
  }

  .refund-content p {
    font-size: 14px;
  }

  .refund-table {
    width: 100%;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .refund-table thead,
  .refund-table tbody,
  .refund-table tr {
    display: block;
  }

  .refund-table thead {
    display: none;
  }

  .refund-table tbody tr {
    margin-bottom: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }

  .refund-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-size: 14px;
    border: none;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  .refund-table td:last-child {
    border-bottom: none;
  }

  .refund-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: #333;
    margin-right: 1rem;
    min-width: 100px;
  }

  .refund-table tbody tr:nth-child(even) {
    background: #fff;
  }
}
</style>
