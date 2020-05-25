import { S3 } from 'aws-sdk';
import tinify from 'tinify';
import { v4 as uuidv4 } from 'uuid';
import * as mimeType from 'mime-types';
import * as moment from 'moment';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

class FileStorageUtil {
  public static optimize(buffer: Buffer): Promise<Uint8Array> {
    const config = new ConfigService();
    tinify.key = config.get('TINYPNG_API_KEY');
    const source = tinify.fromBuffer(buffer);
    return source.toBuffer();
  }

  public static async saveToRemote(
    fileName: string,
    buffer: Buffer,
  ): Promise<string> {
    const config = new ConfigService();

    const instance = FileStorageUtil.getInstance({
      accessKeyId: config.get('APP_AWS_ACCESS_KEY_ID'),
      secretAccessKey: config.get('APP_AWS_SECRET_ACCESS_KEY'),
    });

    const fileExtName = path.extname(fileName);

    console.log('fileExtName', fileExtName);
    const hashKey = `${Number(
      moment.utc().format('x'),
    )}-${uuidv4()}${fileExtName}`;
    return new Promise((resolve, reject) => {
      instance.putObject(
        {
          Body: buffer,
          Key: hashKey,
          CacheControl: 'max-age=31536000',
          ContentType: mimeType.lookup(fileName) as string,
          Bucket: config.get('AWS_S3_IMAGE_UPLOAD_BUCKET'),
        },
        (err, _data) => {
          err ? reject(err) : resolve(hashKey);
        },
      );
    });
  }

  public static getInstance(options?: S3.Types.ClientConfiguration): S3 {
    return new S3(options);
  }
}

export default FileStorageUtil;
