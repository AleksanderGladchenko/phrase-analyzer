import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, Synonym } from './api.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ApiService]
})
export class AppComponent {
    text: string = 'The quick brown fox jumps over the lazy dog.';
    charCount: number = 0;
    wordCount: number = 0;
    selectedText: string = '';
    private selectionStart: number = 0;
    private selectionEnd: number = 0;
    synonyms: Synonym[] = [];
    isLoading: boolean = false;

    constructor(private apiService: ApiService) {
        this.analyzeText();
    }

    analyzeText(): void {
        this.charCount = this.text.length;
        const words = this.text.trim().split(/\s+/).filter(word => word);
        this.wordCount = words[0] === '' ? 0 : words.length;
    }

    captureSelection(event: Event): void {
        const target = event.target as HTMLTextAreaElement;
        this.selectionStart = target.selectionStart;
        this.selectionEnd = target.selectionEnd;
        this.selectedText = this.text.substring(this.selectionStart, this.selectionEnd);
    }

    fetchSynonyms(): void {
        if (!this.selectedText.trim()) {
            alert('Please select a word or phrase.'); // Translated
            return;
        }
        this.isLoading = true;
        this.synonyms = [];
        this.apiService.getSynonyms(this.selectedText.trim()).subscribe({
            next: (data) => {
                this.synonyms = data;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching synonyms:', error); // Translated
                alert('Could not fetch synonyms. Please try again later.'); // Translated
                this.isLoading = false;
            }
        });
    }

    replaceWithSynonym(synonym: string): void {
        const before = this.text.substring(0, this.selectionStart);
        const after = this.text.substring(this.selectionEnd);
        const synonymWithSpaces = ` ${synonym} `;
        this.text = before + synonymWithSpaces + after;
        this.synonyms = [];
        this.selectedText = '';
        this.analyzeText();
    }

    copyText(): void {
        navigator.clipboard.writeText(this.text)
            .then(() => alert('Text copied!')) // Translated
            .catch(err => console.error('Copying error:', err)); // Translated
    }
}