import { SNS } from 'aws-sdk';
import { bindNodeCallback } from 'rxjs';

class SmsUtil {
  private accessKeyId: string;
  private secretAccessKey: string;

  public constructor(accessKeyId: string, secretAccessKey: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }

  public send(param: SNS.Types.PublishInput) {
    return this.getInstance().publish(param, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  public getInstance() {
    return new SNS({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: 'us-east-1',
    });
  }
}

export default SmsUtil;
