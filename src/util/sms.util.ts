import { SNS } from 'aws-sdk';

class SmsUtil {
  private accessKeyId: string;
  private secretAccessKey: string;

  public constructor(accessKeyId: string, secretAccessKey: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }

  public send(param: SNS.Types.PublishInput) {
    return this.getInstance().publish(param);
  }

  public getInstance() {
    return new SNS({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: 'ap-northeast-2',
    });
  }
}

export default SmsUtil;
