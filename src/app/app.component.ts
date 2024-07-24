import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { BooksServiceService } from './services/books-service.service';
import { Book } from './models/book.model';
import { environment } from '../environments/environment';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    SkeletonModule,
    DataViewModule,
    CommonModule,
    RouterOutlet,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,
    ProgressBarModule,
  ],
  providers: [BooksServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Elm.BookListing';
  layout: 'list' | 'grid' = 'list';
  term: string = '';
  books: Book[] = [];
  topLoading: boolean = true;
  botLoading = false;
  imagesCDN: string = environment.BackEndUrl;
  currentPage: number = 1;
  totalCount: number = 0;
  currentCount: number = 0;
  searchedTyped = new Subject<string>();
  constructor(private booksServiceService: BooksServiceService) {

    this.searchedTyped
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((value) => {

        this.currentPage =1;
            this.topLoading = true;
            this.booksServiceService
              .getBooks(this.term, this.currentPage)
              .subscribe({
                next: (res) => {
                  this.books = res.data;
                  this.totalCount = res.total;
                },
                complete: () => {
                  this.topLoading = false;
                },
              });


      });

  }
  ngOnInit(): void {
    this.booksServiceService.getBooks(this.term, this.currentPage).subscribe({
      next: (res) => {
        this.books = res.data;
        this.totalCount = res.total;
      },
      complete: () => {
        this.topLoading = false;
      },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !this.topLoading &&
      this.books.length < this.totalCount
    ) {
      this.currentPage++;
      this.botLoading = true;
      this.booksServiceService.getBooks(this.term, this.currentPage).subscribe({
        next: (res) => {
          this.books.push(...res.data);
        },
        complete: () => {
          this.botLoading = false;
        },
      });
    }
  }
}

