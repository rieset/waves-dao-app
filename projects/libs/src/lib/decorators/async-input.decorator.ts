import 'reflect-metadata'
import { ReplaySubject } from 'rxjs'
import { publishReplay, refCount } from 'rxjs/operators'
import { destroyQueue } from './common.decorator'

// https://habr.com/ru/post/494668/
// http://typescript-lang.ru/docs/Decorators.html
export function Async<PropertyDecorator> (): (target: any, propertyKey: string) => void { // eslint-disable-line
  return (target: any, propName: string) => { // eslint-disable-line
    const name = '_async_prop_' + propName
    const stream = '_async_stream_' + propName

    // Create subject
    Reflect.defineProperty(target, name, {
      value: new ReplaySubject(1),
      writable: true
    })

    // Create stream subject with destroy
    Reflect.defineProperty(target, stream, {

      value: target[name].pipe(publishReplay(1), refCount()),
      writable: true
    })

    Reflect.defineProperty(target, propName, {
      set: (item): void => {
        target[name].next(item)
      },
      get: (): any => target[stream] // eslint-disable-line
    })

    destroyQueue(
      target,
      () => {
        // @ts-expect-error: Undefined objects in decorators
        this[name].complete()
      }
    )
  }
}
