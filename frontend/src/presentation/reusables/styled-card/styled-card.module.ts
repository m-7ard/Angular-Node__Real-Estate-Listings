import { NgModule } from '@angular/core';
import { MixinStyledCardSectionDirective } from './styled-card-section.directive';
import { MixinStyledCardDirective } from './styled-card.directive';

@NgModule({
  declarations: [MixinStyledCardDirective, MixinStyledCardSectionDirective],
  exports: [MixinStyledCardDirective, MixinStyledCardSectionDirective],
})
export class MixinStyledCardDirectivesModule {}