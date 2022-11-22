import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScratchOffComponent } from './components/scratch-off/scratch-off.component';
import { LottieModule } from 'ngx-lottie';
import player, { LottiePlayer } from 'lottie-web'
import { CountUpDirective } from './directives/count-up.directive';
import { DecimalPipe } from '@angular/common';
export function playerFactory(): LottiePlayer {
  return player;
}
@NgModule({
  declarations: [
    AppComponent,
    ScratchOffComponent,
    CountUpDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
