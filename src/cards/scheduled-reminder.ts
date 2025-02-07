import { Account, AdaptiveCardActionInvokeActivity } from '@teams.sdk/api';
import { Card, TextBlock } from '@teams.sdk/cards';

export function scheduledReminder(activity: AdaptiveCardActionInvokeActivity) {
  const mention: Account = JSON.parse(activity.value.action.data.mention);

  return Card([
    TextBlock(
      `Reminder scheduled in ${activity.value.action.data.delaySeconds} seconds for ${mention.name}`,
      { size: 'small' }
    ),
  ]);
}
