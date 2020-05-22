import { SES } from 'aws-sdk';

class EmailUtil {
  private accessKeyId: string;
  private secretAccessKey: string;
  public constructor(accessKeyId: string, secretAccessKey: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
  }

  public send(params: SES.Types.SendEmailRequest) {
    const instnace = this.getInstance();
    return instnace.sendEmail(params);
  }

  public getInstance(): SES {
    return new SES({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: 'ap-northeast-2',
    });
  }
}

export default EmailUtil;
