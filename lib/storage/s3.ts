import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "boostmycv-cvs";

export async function uploadCVToS3(
  cvId: string,
  userId: string,
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `cvs/${userId}/${cvId}/${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      ServerSideEncryption: "AES256",
    })
  );

  const region = process.env.AWS_S3_REGION || process.env.AWS_REGION || "us-east-1";
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}

export async function deleteCVFromS3(
  cvId: string,
  userId: string,
  fileName: string
): Promise<void> {
  const key = `cvs/${userId}/${cvId}/${fileName}`;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
