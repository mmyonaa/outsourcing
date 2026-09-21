# SUIT

- 제작: Sun (sunn.us)
- 배포처: https://sunn.us/suit/ · https://github.com/sunn-us/SUIT
- 라이선스: **SIL Open Font License, Version 1.1**

## 근거

배포 저장소에는 별도 라이선스 파일이 없으나, 동봉한 폰트 바이너리의
name 테이블에 라이선스가 직접 기록돼 있다.

```
[nameID 0  저작권]      Copyright (c) 2022 Sun.
[nameID 5  버전]        Version 2.040;Glyphs 3.2.3 (3260)
[nameID 13 라이선스]    This Font Software is licensed under the SIL Open Font
                        License, Version 1.1. This Font Software is distributed
                        on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
                        ANY KIND, either express or implied. See the SIL Open
                        Font License for the specific language, permissions and
                        limitations governing your use of this Font Software.
[nameID 14 라이선스 URL] http://scripts.sil.org/OFL
```

재확인 방법:
```bash
python3 -c "from fontTools.ttLib import TTFont; n=TTFont('SUIT-Variable.woff2')['name']; print(n.getDebugName(13))"
```

## OFL 1.1 요약

- 웹폰트 임베딩·상업적 사용·수정·재배포 **모두 허용**
- 폰트 소프트웨어 자체를 단독 상품으로 판매하는 것만 금지
- 저작권/라이선스 고지 유지 필요 → 이 파일이 그 고지 역할을 한다

동봉 파일: SUIT-Variable.woff2 (가변 폰트, 굵기 100~900)
