import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-confirm',
    imports: [],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
    title = signal('Confirmación');
    message = signal('¿Estás seguro?');
    visible = signal(false);

    private resolveFn: ((value: boolean) => void) | null = null;

    show(title: string, message: string): Promise<boolean> {
        this.title.set(title);
        this.message.set(message);
        this.visible.set(true);

        return new Promise((resolve) => {
            this.resolveFn = resolve;
        });
    }

    onConfirm() {
        this.visible.set(false);
        if (this.resolveFn) this.resolveFn(true);
    }

    onCancel() {
        this.visible.set(false);
        if (this.resolveFn) this.resolveFn(false);
    }
}
