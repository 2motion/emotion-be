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
    return instnace.sendEmail(params, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  public getInstance(): SES {
    return new SES({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: 'us-east-1',
    });
  }
}

export default EmailUtil;
