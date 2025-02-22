import { NgModule } from '@angular/core';
import { PageSectionDirective } from './page-section.directive';
import { PageDirective } from './page.directive';

@NgModule({
  declarations: [PageDirective, PageSectionDirective],
  exports: [PageDirective, PageSectionDirective],
})
export class PageDirectivesModule {}