import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { animationFrameScheduler, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { map, switchMap, takeWhile, endWith, distinctUntilChanged, takeUntil } from 'rxjs/operators';


import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class DestroyService extends Observable<void> implements OnDestroy {
  private readonly destroySubject$ = new ReplaySubject<void>(1);

  constructor() {
    super(subscriber => this.destroySubject$.subscribe(subscriber));
  }

  ngOnDestroy(): void {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }
}

const easeOutQuad = (x: number): number => x * (2 - x);

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[countUp]',
  providers: [DestroyService],
})
export class CountUpDirective implements OnInit {
  private readonly count$ = new BehaviorSubject(0);
  private readonly duration$ = new BehaviorSubject(2000);

  private readonly currentCount$ = combineLatest([this.count$, this.duration$]).pipe(
    switchMap(([count, duration]) => {
      const startTime = animationFrameScheduler.now();
      return interval(0, animationFrameScheduler).pipe(
        map(() => animationFrameScheduler.now() - startTime),
        map(elapsedTime => elapsedTime / duration),
        takeWhile(progress => progress <= 1),
        map(easeOutQuad),
        map(progress => Math.round(progress * count)),
        endWith(count),
        distinctUntilChanged(),
      );
    }),
  );

  @Input('countUp')
  set count(count: number) {
    this.count$.next(count);
  }

  @Input()
  set duration(duration: number) {
    this.duration$.next(duration);
  }

  @Input() kind!: string | undefined;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
    private readonly destroy$: DestroyService,
    private DecimalPipe: DecimalPipe,
  ) {}

  ngOnInit(): void {
    this.displayCurrentCount();
  }

  private displayCurrentCount(): void {
    this.currentCount$.pipe(takeUntil(this.destroy$)).subscribe(currentCount => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.convertNumberByType(currentCount));
    });
  }

  convertNumberByType(num: number): string {
    return `${this.kind === 'CASH' ? '$' : ''}${this.DecimalPipe.transform(num)}`;
  }
}

