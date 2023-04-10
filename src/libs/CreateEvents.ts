import {getOnlyStr} from '@/utils/tools';

interface Handler<T> {
  (eventData: T): void;
}

let eventCount = 0;

export function CreateEvents<T = any>(eventName?: string) {
  const _eventName = eventName || `eventName-${eventCount}`;

  let handlerMap: {[id: string]: Handler<T> | undefined} = {};
  let ids: string[] = [];

  return {
    eventName: _eventName,

    subscribe(handler: Handler<T>) {
      let id = getOnlyStr(ids);

      handlerMap[id] = handler;

      ids.push(id);
      return id;
    },

    unsubscribe(id: string) {
      handlerMap[id] = undefined;
      ids.splice(ids.indexOf(id), 1);
    },

    publish(eventData: T) {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        try {
          const handler = handlerMap[id];
          handler && handler(eventData);
        } catch (error) {
          console.error(`${_eventName} publish (id: ${id}) error:`, error);
        }
      }
    },
  } as const;
}
