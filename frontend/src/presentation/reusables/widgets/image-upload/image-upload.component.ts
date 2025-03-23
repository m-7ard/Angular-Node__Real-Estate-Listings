import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UploadImagesResponseDTO } from '../../../contracts/other/upload-images/UploadImagesResponseDTO';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import IApiError from '../../../errors/IApiError';
import { EMPTY } from 'rxjs';
import { CoverImageComponent } from '../../cover-image/cover-image.component';

@Component({
    selector: 'app-image-upload',
    standalone: true,
    imports: [PopoverModule, CommonModule, CoverImageComponent],
    templateUrl: './image-upload.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageUploadComponent),
            multi: true,
        },
    ],
})
export class ImageUploadComponent implements ControlValueAccessor {
    public errors: string[] = [];

    constructor(
        private readonly http: HttpClient,
        private readonly exceptionNoticeService: ExceptionNoticeService,
    ) {}

    // <--ControlValueAccessor

    onChange: (value: string[]) => void = null!;
    onTouched: () => void = null!;

    writeValue(obj: string[]): void {
        this.value = obj;
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ControlValueAccessor-->

    onSuccess(response: UploadImagesResponseDTO) {
        const value = response.images.map(({ url }) => url);
        this.value = [...this.value, ...value];
        this.onChange(this.value);
        this.onTouched();
    }

    async upload(event: Event) {
        this.errors = [];
        const inputEl = event.target as HTMLInputElement;
        const { files } = inputEl;
        if (files == null || files?.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append(`file`, file);

            this.http.post<UploadImagesResponseDTO>(`${environment.apiUrl}/api/upload`, formData).subscribe(
                (response) => this.onSuccess(response),
                (err: HttpErrorResponse) => {
                    if (err.status >= 400 && err.status <= 499) {
                        (err.error as IApiError[]).forEach((apiError) => this.errors.push(apiError.message));
                    } else {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    }

                    return EMPTY;
                },
            );
        }
    }

    removeImage(url: string) {
        const newValue = this.value.filter((value) => value !== url);
        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
    }

    @Input() disabled?: boolean = false;
    @Input() value: string[] = null!;
}
