import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFrontpageResolverData } from './frontpage.resolver';
import { RESOLVER_DATA_KEY } from '../../utils/RESOLVER_DATA';
import { PageDirective } from '../../reusables/page/page.directive';
import { PageSectionDirective } from '../../reusables/page/page-section.directive';
import { MixinStyledButtonDirective } from '../../reusables/styled-button/styled-button.directive';

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [PageDirective, PageSectionDirective, MixinStyledButtonDirective],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {}
}
