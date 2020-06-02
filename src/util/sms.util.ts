import { SNS } from 'aws-sdk';

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
      apiVersion: '2010-03-31',
    });
  }
}

export default SmsUtil;
