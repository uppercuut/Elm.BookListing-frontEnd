import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../models/PaginationResult.model';
import { Book } from '../models/book.model';
@Injectable({
  providedIn: 'root',
})
export class BooksServiceService {
  host: string = environment.BackEndUrl;
  constructor(private httpClient: HttpClient) {}

  public getBooks(term:string,pageNumber :number =1) {
    return this.httpClient.get<PaginationResult<Book>>(
      `${this.host}/Books?term=${term}&pageNumber=${pageNumber}`
    );
  }
}
