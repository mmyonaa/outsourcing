import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// 환경변수 디버깅
console.log('S3 Configuration:', {
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_S3_BUCKET,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
});

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * multer(busboy)가 originalname을 latin1로 디코딩하므로 한글 파일명이 깨진다(mojibake).
 * utf8로 재해석해 원래 파일명을 복원한다.
 */
export const decodeOriginalName = (originalname: string): string => {
  return Buffer.from(originalname, 'latin1').toString('utf8');
};

/**
 * S3에 파일 업로드
 * @param file - multer file 객체
 * @param folder - S3 버킷 내 폴더 경로
 * @returns S3 URL
 */
export const uploadToS3 = async (file: Express.Multer.File, folder: string = 'performance'): Promise<string> => {
  const originalName = decodeOriginalName(file.originalname);

  // 확장자는 영숫자 1~10자만 허용 — 점 없는 파일명(파일명 전체가 확장자가 되던 버그),
  // 특수문자 섞인 확장자는 'bin' 으로 대체해 S3 키를 안전하게 유지
  const rawExt = file.originalname.includes('.')
    ? file.originalname.split('.').pop()!.toLowerCase()
    : '';
  const fileExtension = /^[a-z0-9]{1,10}$/.test(rawExt) ? rawExt : 'bin';
  const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

  const bucket = process.env.AWS_S3_BUCKET || '';

  console.log('Upload params:', {
    bucket,
    fileName,
    hasBuffer: !!file.buffer,
    bufferSize: file.buffer?.length
  });

  if (!bucket) {
    throw new Error('AWS_S3_BUCKET environment variable is not set');
  }

  const uploadParams: PutObjectCommandInput = {
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype || 'application/octet-stream',
    ContentDisposition: `attachment; filename="${encodeURIComponent(originalName)}"`,
    Metadata: {
      'original-filename': encodeURIComponent(originalName),
    },
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  // S3 URL 생성
  const s3Url = `https://${bucket}.s3.${process.env.AWS_REGION || 'ap-northeast-2'}.amazonaws.com/${fileName}`;

  return s3Url;
};
