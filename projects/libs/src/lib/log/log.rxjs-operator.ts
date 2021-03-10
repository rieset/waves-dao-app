/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import {Observable} from 'rxjs'
import {isDevMode} from '@angular/core'

class Log {

  public log (name: string = '') {
    return (source: any): Observable<any> => {
      if (!isDevMode()) {
        return source
      }

      return new Observable(observer => source.subscribe({
          next: (x: any) => {
            if (isDevMode()) {
              console.log(name, x)
            }

            observer.next(x)
          },
          error: (err: any) => { observer.error(err) },
          complete: () => { observer.complete() }
        }))
    }
  }
}

export const logger = new Log()
export const log = logger.log.bind(logger)







