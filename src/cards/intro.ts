import { Account } from '@teams.sdk/api';
import { Card, Image, OpenUrlAction, TextBlock } from '@teams.sdk/cards';

export function intro(account: Account) {
  return Card([
    Image('https://aka.ms/bf-welcome-card-image', { size: 'stretch' }),
    TextBlock(`Welcome, ${account.name}!`, { weight: 'bolder', size: 'medium' }),
    TextBlock(`Use the 'remind' command to schedule a reminder.`, { size: 'small' }),
  ], {
    actions: [
      OpenUrlAction(
        'https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0',
        { title: 'Get an overview' }
      )
    ]
  });
}
