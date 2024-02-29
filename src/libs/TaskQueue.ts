/**
 *
 * @param taskHandle
 * @returns
 * @example
 * const taskQueue1 = createTaskQueue<string>(async (task) => {
 *   console.log(task)
 * })
 * taskQueue1.add('task1')
 * taskQueue1.add('task2')
 *
 * const taskQueue2 = createTaskQueue<() => void>(async (task) => task())
 * taskQueue2.add(() => { console.log('task3') })
 * taskQueue2.add(() => { console.log('task4') })
 */
export function createTaskQueue<T>(taskHandle: (task: T) => Promise<void>) {
  let queue: T[] = [];
  let taskActive: T | undefined;
  let pause: boolean = false;

  async function execute() {
    if (taskActive) {
      return;
    }
    if (pause) {
      return;
    }
    if (queue.length === 0) {
      return;
    }
    taskActive = queue.shift();
    if (taskActive !== undefined) {
      try {
        await taskHandle(taskActive);
      } catch (error) {
        console.error(error);
      }
      taskActive = undefined;
    }
    execute();
  }

  return {
    add: (task: T) => {
      queue.push(task);
      execute();
    },
    reset: (taskQueue: T[]) => {
      queue = taskQueue;
      execute();
    },
    clear: () => {
      queue = [];
    },
    pause: () => {
      pause = true;
    },
    resume: () => {
      pause = false;
      execute();
    },
    skipCurrentTask: () => {
      taskActive = undefined;
      execute();
    },
    getQueue: () => queue,
    getActive: () => taskActive,
  };
}
