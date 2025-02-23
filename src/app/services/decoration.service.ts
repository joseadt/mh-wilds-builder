import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Decoration } from '../models/decoration.model';

@Injectable({
    providedIn: 'root',
})
export class DecorationService {
    private decorations!: Decoration[];

    constructor(private httpClient: HttpClient) {}

    loadDecorations() {
        this.httpClient
            .get<Decoration[]>(environment.baseUrl + 'decorations.json')
            .subscribe((result) => (this.decorations = result));
    }

    get(slotLevel: number) {
        return this.decorations.filter((d) => d.slotLevel <= slotLevel);
    }
}
