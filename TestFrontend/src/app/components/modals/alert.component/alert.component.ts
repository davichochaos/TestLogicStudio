import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-alert',
    imports: [],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.css'
})
export class AlertComponent {
    title = signal('Alerta');
    message = signal('');
    visible = signal(false);

    show(title: string, message: string) {
        this.title.set(title);
        this.message.set(message);
        this.visible.set(true);
    }
    close(){
        this.visible.set(false);
    }
}
