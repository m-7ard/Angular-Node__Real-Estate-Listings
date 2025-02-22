import { NgModule } from '@angular/core';
import { ContentGridTrackDirective } from './content-grid-track.directive';
import { ContentGridDirective } from './content-grid.directive';

@NgModule({
  declarations: [ContentGridDirective, ContentGridTrackDirective],
  exports: [ContentGridDirective, ContentGridTrackDirective],
})
export class ContentGridDirectivesModule {}