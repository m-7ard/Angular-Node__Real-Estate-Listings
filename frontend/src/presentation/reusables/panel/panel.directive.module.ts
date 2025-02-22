import { NgModule } from '@angular/core';
import { PanelSectionDirective } from './panel-section.directive';
import { PanelDirective } from './panel.directive';

@NgModule({
  declarations: [PanelDirective, PanelSectionDirective],
  exports: [PanelDirective, PanelSectionDirective],
})
export class PanelDirectivesModule {}