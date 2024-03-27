import {getOnlyStr} from '@/utils/tools';
import {JSONConstraint} from 'types/global';

let serialNumber = 0;

export function createSubscribeEvents<T extends JSONConstraint>(mark?: string) {
  serialNumber++;
  const _mark = mark ?? `SerialNumber-${serialNumber}`;

  type EventName = keyof T;
  type Handler<E extends EventName> = (eventData: T[E]) => void;
  interface HandlerMap<E extends EventName> {
    [id: string]: Handler<E> | undefined;
  }
  type EventMap = {
    [E in EventName]?: HandlerMap<E>;
  };

  const eventMap: EventMap = {};
  const ids: string[] = [];

  return {
    _mark,

    /**
     *
     * @param eventName
     * @param handler
     * @returns function unsubscribe
     */
    subscribe<E extends EventName>(eventName: E, handler: Handler<E>) {
      let id = getOnlyStr(ids);

      const eventHandlerMap = eventMap[eventName];
      if (eventHandlerMap) {
        eventHandlerMap[id] = handler;
      } else {
        eventMap[eventName] = {
          [id]: handler,
        };
      }

      ids.push(id);

      return () => {
        if (eventHandlerMap) {
          eventHandlerMap[id] = undefined;
        }
        ids.splice(ids.indexOf(id), 1);
      };
    },

    publish<E extends EventName>(eventName: E, eventData: T[E]) {
      const eventHandlerMap = eventMap[eventName];
      if (!eventHandlerMap) {
        console.error(`${_mark} publish event: ${String(eventName)} not found`);
        return;
      }
      for (const id in eventHandlerMap) {
        try {
          const handler = eventHandlerMap[id];
          handler && handler(eventData);
        } catch (error) {
          console.error(
            `${_mark} publish (event: ${String(eventName)}) (id: ${id}) error:`,
            error,
          );
        }
      }
    },
  } as const;
}
