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
 * S3에 파일 업로드
 * @param file - multer file 객체
 * @param folder - S3 버킷 내 폴더 경로
 * @returns S3 URL
 */
export const uploadToS3 = async (file: Express.Multer.File, folder: string = 'performance'): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
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
    ContentType: file.mimetype,
    ContentDisposition: `attachment; filename="${encodeURIComponent(file.originalname)}"`,
    Metadata: {
      'original-filename': encodeURIComponent(file.originalname),
    },
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  // S3 URL 생성
  const s3Url = `https://${bucket}.s3.${process.env.AWS_REGION || 'ap-northeast-2'}.amazonaws.com/${fileName}`;

  return s3Url;
};
