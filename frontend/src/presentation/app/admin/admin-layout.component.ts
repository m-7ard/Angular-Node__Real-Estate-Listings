import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MixinStyledButtonDirective } from '../../reusables/styled-button/styled-button.directive';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MixinStyledButtonDirective, RouterModule, RouterOutlet],
    templateUrl: './admin-layout.component.html',
    hostDirectives: [],
})
export class AdminLayoutComponent {}
