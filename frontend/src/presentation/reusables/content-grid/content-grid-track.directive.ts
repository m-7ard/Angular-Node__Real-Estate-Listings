import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[appContentGridTrack]',
})
export class ContentGridTrackDirective {
    @Input() appContentGridTrack!: {
        contentGridTrack: 'base' | 'full' | 'sm' | 'lg';
    }

    @HostBinding('attr.data-track')
    get dataTrack(): string | null {
        return this.appContentGridTrack.contentGridTrack;
    }
}
