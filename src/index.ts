import { MessageSendActivity } from '@teams.sdk/api';
import { App, HttpPlugin } from '@teams.sdk/apps';
import { Client } from '@teams.sdk/common/http';
import { DevtoolsPlugin } from '@teams.sdk/dev';

import * as cards from './cards';
import { isReminder, Reminder } from './reminder';

const server = new HttpPlugin();
const http = new Client();
const app = new App({
  plugins: [new DevtoolsPlugin(), server],
});

app.message('remind', async ({ activity, api, send }) => {
  const members = await api.conversations.members(activity.conversation.id).get();
  await send(
    MessageSendActivity('')
      .card('adaptive', cards.remind(members))
      .build()
  );
});

app.message('help', async ({ activity, send }) => {
  await send(
    MessageSendActivity('')
      .card('adaptive', cards.intro(activity.from))
      .build()
  );
});

app.on('message', async ({ send }) => {
  await send(`Use 'remind' to schedule a reminder, or use 'help' for more information.`);
});

app.on('conversationUpdate', async ({ activity, send }) => {
  const members = activity.membersAdded?.filter(m => m.id !== activity.recipient.id) || [];

  for (const member of members) {
    await send(MessageSendActivity('').card('adaptive', cards.intro(member)).build());
  }
});

app.on('install.add', async ({ activity, send }) => {
  await send(MessageSendActivity('').card('adaptive', cards.intro(activity.from)).build());
});

app.on('card.action', async ({ activity }) => {
  if (activity.value.action.verb === 'schedule_reminder') {
    await http.post('http://localhost:3000/api/remind', {
      conversationId: activity.conversation.id,
      delaySeconds: parseInt(activity.value.action.data.delaySeconds),
      mention: JSON.parse(activity.value.action.data.mention)
    });

    return {
      status: 200,
      body: cards.scheduledReminder(activity),
    };
  }

  return { status: 500 };
});

server.post('/api/remind', (req, res) => {
  if (!isReminder(req.body)) {
    res.status(400).send();
    return;
  }

  res.status(200).send('<html><body><h1>Proactive messages have been sent.</h1></body></html>');
  remindWithDelay(req.body);
});

(async () => {
  await app.start();
})();

async function remindWithDelay(body: Reminder) {
  // wait for the number of seconds before sending the proactive message
  await new Promise((resolve) => setTimeout(resolve, body.delaySeconds * 1000));

  const message = MessageSendActivity(`This is a reminder for <at>${body.mention.name}</at>!`)
    .mention({
      id: body.mention.id,
      name: body.mention.name,
      role: 'user',
    }).build();

  await app.api.conversations.activities(body.conversationId).create(message);
}
