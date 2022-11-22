import { AfterViewInit } from '@angular/core';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
const { ScratchCard, SCRATCH_TYPE } = require('scratchcard-js');

@Component({
  selector: 'app-scratch-off',
  templateUrl: './scratch-off.component.html',
  styleUrls: ['./scratch-off.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScratchOffComponent implements AfterViewInit {
  scratchOpenChoosedNumber: any;
  scratchDone = false;
  audio = new Audio();
  isDesktop = false;
  scratchCard: any;
  scAward!: HTMLElement | null;
  data = {
    type: 'CASH',
    value: 1800,
  };
  constructor() {}

  ngAfterViewInit(): void {
    this.initSC();
  }

  initSC(): void {
    this.scAward = document.getElementById('sc-award');

    const scContainer: any = document.getElementById('sc-ticket');
    scContainer.innerHtml = '';
    this.scratchCard = new ScratchCard('#sc-ticket', {
      scratchType: SCRATCH_TYPE.LINE,
      brushSrc: 'assets/images/scratch-off/brush1.jpeg',
      containerWidth: 250,
      containerHeight: 250,
      imageForwardSrc: '',
      imageBackgroundSrc: 'assets/images/scratch-off/back-prize.png',
      htmlBackground: '',
      clearZoneRadius: 30,
      percentToFinish: 70,
      callback: () => {
        this.scratchDone = true;
        setTimeout(() => {
          // Blur award after Scratch off done
          if (this.scAward) {
            this.scAward.style.filter = 'blur(3px)';
          }
        }, 300);
      },
    });
  }

  chooseNumber(number: any) {
    this.scratchOpenChoosedNumber = number;
    this.scratchCard.config = {
      ...this.scratchCard.config,
      ...{
        imageForwardSrc: `assets/images/scratch-off/prize-${number}.svg`,
      },
    };
    this.scratchCard.init();

    let mouseStatus: any = {
      down: false,
      up: false,
      isTouched: false,
    };
    let oldPercent = 0;

    const startAction = async () => {
      const percent = this.scratchCard.getPercent();
      this.scAward?.classList.remove('d-none');
    };
    const stopAction = () => {
      // this.audio.pause();

      this.scratchCard.canvas.removeEventListener('mousemove', startAction);

      this.scratchCard.canvas.removeEventListener('touchmove', startAction);

      mouseStatus.isTouched = false;
    };

    const setActionByMouse = (action: string) => {
      mouseStatus[action] = true;
      if (mouseStatus.down && !mouseStatus.isTouched) {
        this.scratchCard.canvas.addEventListener('mousemove', startAction);
        this.scratchCard.canvas.addEventListener('touchmove', startAction);
        mouseStatus = {
          ...mouseStatus,
          isTouched: true,
          up: false,
        };
      }
      if (mouseStatus.up) {
        stopAction();
        mouseStatus = {
          ...mouseStatus,
          isTouched: false,
          up: true,
        };
      }
    };

    this.scratchCard.canvas.addEventListener('mousedown', () => {
      setActionByMouse('down');
    });
    this.scratchCard.canvas.addEventListener('mouseup', () => {
      setActionByMouse('up');
    });
    this.scratchCard.canvas.addEventListener('touchstart', () => {
      setActionByMouse('down');
    });
    this.scratchCard.canvas.addEventListener('touchend', () => {
      setActionByMouse('up');
    });
  }
}
