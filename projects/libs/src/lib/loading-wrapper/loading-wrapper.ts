import { Observable, Subject, EMPTY } from 'rxjs'
import {
  catchError,
  takeUntil,
  publishReplay,
  refCount
} from 'rxjs/operators'

export interface LoadingWrapperModel<T> {
  data$: Observable<T>
  error$: Observable<boolean>
  destroy: () => void
}

export class LoadingWrapper<T> {
  readonly data$: Observable<T>
  private readonly errorLoading$ = new Subject<boolean>()
  private readonly destroyed$ = new Subject()
  readonly error$: Observable<boolean> = this.errorLoading$.pipe(
    takeUntil(this.destroyed$),
    publishReplay(1),
    refCount()
  )

  constructor (data: Observable<T>) {
    console.log('----')
    this.data$ = data.pipe(
      takeUntil(this.destroyed$),
      publishReplay(1),
      refCount(),
      catchError((error) => {
        // Todo решить где и как обрабатывать ошибку
        console.log('LoadingWrapper::Error\n', error)
        setTimeout(() => {
          this.errorLoading$.next(true)
        })
        return EMPTY
      })
    )
  }

  destroy (): void {
    this.destroyed$.next(null)
    this.destroyed$.complete()
  }
}
