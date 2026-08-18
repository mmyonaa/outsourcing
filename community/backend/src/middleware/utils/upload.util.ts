import multer from "@koa/multer";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// 이미지 허용 MIME/확장자 — svg는 스크립트 포함이 가능해 제외
const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];
export const ALLOWED_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
];

// 첨부파일 허용 확장자 화이트리스트 — html/svg/실행파일 등 차단
export const ALLOWED_FILE_EXTENSIONS = [
  ...ALLOWED_IMAGE_EXTENSIONS,
  "pdf",
  "hwp",
  "hwpx",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
  "txt",
];

export const getExtension = (originalname: string): string =>
  originalname.includes(".")
    ? originalname.split(".").pop()!.toLowerCase()
    : "";

// 전역 에러 핸들러가 400 + 메시지 노출로 응답하도록 status/expose 를 지정
const badRequest = (message: string) => {
  const err: any = new Error(message);
  err.status = 400;
  err.expose = true;
  return err;
};

// 이미지 업로드 (게시글 본문 이미지, 배너, 공연 썸네일 공용)
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    const ext = getExtension(file.originalname);
    if (
      ALLOWED_IMAGE_MIMES.includes(file.mimetype) &&
      ALLOWED_IMAGE_EXTENSIONS.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(badRequest("허용되지 않는 이미지 형식입니다."));
    }
  },
});

// 일반 첨부파일 업로드 (게시글 첨부)
export const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    const ext = getExtension(file.originalname);
    if (ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(badRequest(`허용되지 않는 파일 형식입니다: .${ext || "(없음)"}`));
    }
  },
});
