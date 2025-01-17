import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  NgZone,
} from '@angular/core';
import type { OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import type {
  RangeChangeEventDetail,
  RangeKnobMoveStartEventDetail,
  RangeKnobMoveEndEventDetail,
  Components,
} from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-range.js';

/**
 * Value accessor components should not use ProxyCmp
 * and should call defineCustomElement and proxyInputs
 * manually instead. Using both the @ProxyCmp and @Component
 * decorators and useExisting (where useExisting refers to the
 * class) causes ng-packagr to output multiple component variables
 * which breaks treeshaking.
 * For example, the following would be generated:
 * let IonRange = IonRange_1 = class IonRange extends ValueAccessor {
 * Instead, we want only want the class generated:
 * class IonRange extends ValueAccessor {
 */
import { proxyInputs, proxyOutputs } from './angular-component-lib/utils';

const RANGE_INPUTS = [
  'activeBarStart',
  'color',
  'debounce',
  'disabled',
  'dualKnobs',
  'label',
  'labelPlacement',
  'legacy',
  'max',
  'min',
  'mode',
  'name',
  'pin',
  'pinFormatter',
  'snaps',
  'step',
  'ticks',
  'value',
];

@Component({
  selector: 'ion-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RANGE_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonRange,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonRange extends ValueAccessor implements OnInit {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    defineCustomElement();
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionFocus', 'ionBlur', 'ionKnobMoveStart', 'ionKnobMoveEnd']);
  }

  ngOnInit(): void {
    /**
     * Data-bound input properties are set
     * by Angular after the constructor, so
     * we need to run the proxy in ngOnInit.
     */
    proxyInputs(IonRange, RANGE_INPUTS);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonRangeElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonRange extends Components.IonRange {
  /**
   * The `ionChange` event is fired for `<ion-range>` elements when the user
modifies the element's value:
- When the user releases the knob after dragging;
- When the user moves the knob with keyboard arrows

`ionChange` is not fired when the value is changed programmatically.
   */
  ionChange: EventEmitter<CustomEvent<RangeChangeEventDetail>>;
  /**
   * The `ionInput` event is fired for `<ion-range>` elements when the value
is modified. Unlike `ionChange`, `ionInput` is fired continuously
while the user is dragging the knob.
   */
  ionInput: EventEmitter<CustomEvent<RangeChangeEventDetail>>;
  /**
   * Emitted when the range has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the range loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user starts moving the range knob, whether through
mouse drag, touch gesture, or keyboard interaction.
   */
  ionKnobMoveStart: EventEmitter<CustomEvent<RangeKnobMoveStartEventDetail>>;
  /**
   * Emitted when the user finishes moving the range knob, whether through
mouse drag, touch gesture, or keyboard interaction.
   */
  ionKnobMoveEnd: EventEmitter<CustomEvent<RangeKnobMoveEndEventDetail>>;
}
