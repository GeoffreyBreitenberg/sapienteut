import { EventEmitter } from 'events';
import pMap from 'p-map';

export interface ITaskRunnterConfig {
  concurrency?: number;
}

export type TaskFunType<T = undefined> = (stopTask?: () => void) => Promise<T>;

export class TaskRunner<S> extends EventEmitter {
  static DefaultConcurrency: number = 10;

  static TASK_FINISH: string = 'task-finish';

  _tasks: TaskFunType<S>[];

  _concurrency: number;

  _useableConcurrency: number;

  private _stopFlag: boolean;

  constructor(tasks: TaskFunType<S>[], { concurrency }: ITaskRunnterConfig) {
    super();
    this._tasks = tasks;
    this._concurrency = concurrency || TaskRunner.DefaultConcurrency;
    this._useableConcurrency = this._concurrency;
    this._stopFlag = false;
  }

  async run() {
    const tasks = this._tasks.splice(0, this._concurrency);
    this._useableConcurrency = this._concurrency - tasks.length;

    await pMap(
      tasks,
      async task => {
        await this._runTask(task);
      },
      { concurrency: tasks.length },
    );
  }

  addTask(task: TaskFunType<S>) {
    this._tasks.push(task);
  }

  private async _runTask(task: TaskFunType<S>) {
    if (this._stopFlag) {
      return;
    }

    const emitValue = await task(this._stopTask.bind(this));
    this._useableConcurrency--;
    this.emit(TaskRunner.TASK_FINISH, emitValue);
    if (this._tasks.length > 0) {
      const nextTasks = this._tasks.splice(0, this._useableConcurrency);
      this._useableConcurrency -= nextTasks.length;
      if (nextTasks.length > 0) {
        await pMap(
          nextTasks,
          async _task => {
            await this._runTask(_task);
          },
          { concurrency: nextTasks.length },
        );
      }
    }
  }

  private _stopTask() {
    this._stopFlag = true;
  }
}
