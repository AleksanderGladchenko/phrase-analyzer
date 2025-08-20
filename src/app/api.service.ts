import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Synonym {
    word: string;
    score: number;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://api.datamuse.com/words?rel_syn=';

    constructor(private http: HttpClient) { }

    getSynonyms(word: string): Observable<Synonym[]> {
        return this.http.get<Synonym[]>(`${this.apiUrl}${word}`);
    }
}