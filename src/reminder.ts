export interface Reminder {
  conversationId: string;
  delaySeconds: number;
  mention: {
    id: string;
    name: string;
  };
}

export function isReminder(value: any): value is Reminder {
  return (
    !!value &&
    typeof value.conversationId === 'string' &&
    typeof value.delaySeconds === 'number' &&
    typeof value.mention === 'object'
  );
}
