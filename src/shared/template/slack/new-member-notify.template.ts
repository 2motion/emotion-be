import { IncomingWebhookSendArguments } from '@slack/webhook';

const newMemberNotifyTemplate = (
  totalMember: number,
  name: string = '',
): IncomingWebhookSendArguments => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `새로운 멤버 *${name}* 가 가입했긔 :ghost:`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Last updated: ${new Date().toISOString()} Total member: ${totalMember}`,
          },
        ],
      },
    ],
  };
};

export default newMemberNotifyTemplate;
