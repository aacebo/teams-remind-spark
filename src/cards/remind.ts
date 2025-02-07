import { Account } from '@teams.sdk/api';
import { Card, Choice, ChoiceSetInput, ExecuteAction, TextBlock } from '@teams.sdk/cards';

export function remind(members: Array<Account>) {
  return Card([
    TextBlock('Create a reminder', {
      size: 'medium',
      weight: 'bolder',
    }),
    ChoiceSetInput([
      Choice('5 seconds', '5'),
      Choice('15 seconds', '15'),
      Choice('30 seconds', '30'),
    ], {
      id: 'delaySeconds',
      style: 'compact',
      label: 'Remind after',
      value: '5',
    }),
    ChoiceSetInput(
      members.map(m =>
        Choice(m.name, JSON.stringify({ id: m.id, name: m.name }))
      ),
      {
        id: 'mention',
        style: 'compact',
        label: 'Who to @mention',
        placeholder: 'Select a person'
      }
    )
  ], {
    actions: [
      ExecuteAction({
        title: 'Schedule reminder',
        verb: 'schedule_reminder'
      })
    ]
  });
}
