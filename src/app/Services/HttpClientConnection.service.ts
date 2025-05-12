import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, throwError } from 'rxjs';
import { createUrl } from 'src/utility/common';

@Injectable({
  providedIn: 'root'
})
export class HttpClientConnectionService {



  constructor(
    private http: HttpClient
  ) {

  }

  GetData(_url: string) {
    _url = createUrl(_url);

    const headers = new HttpHeaders({
      'X-Client-Url': window.location.href // or any custom header
    });

    return this.http.get(_url, {
      headers,
      withCredentials: true
    }).pipe(first());
  }

 GetDataById(_url: string, _id: string) {
  _url = createUrl(_url) + "/" + _id;
  return this.http.get(_url, {
    headers: this.getClientUrlHeaders(),
    withCredentials: true
  }).pipe(catchError(this.handleError));
}


 GetDataByParams(_url: string, _params: any) {
  _url = createUrl(_url);
  return this.http.get(_url, {
    params: _params,
    headers: this.getClientUrlHeaders(),
    withCredentials: true
  }).pipe(catchError(this.handleError));
}

PostData(_url: string, _postdata: any) {
  _url = createUrl(_url);
  return this.http.post(_url, _postdata, {
    headers: this.getClientUrlHeaders(),
    withCredentials: true
  }).pipe(catchError(this.handleError));
}

  PostDataWithFile(_url: string, _postdata: any) {
  const headers = this.getClientUrlHeaders().set('Accept', 'application/json');

  _url = createUrl(_url);
  return this.http.post(_url, _postdata, {
    headers,
    withCredentials: true
  }).pipe(catchError(this.handleError));
}


  PutData(_url: string, _params: any, _putdata: any) {
  _url = createUrl(_url) + "/" + _params;
  return this.http.put(_url, _putdata, {
    headers: this.getClientUrlHeaders(),
    withCredentials: true
  }).pipe(catchError(this.handleError));
}


  PutDataWithFile(_url: string, _putdata: any, _params: any) {
  const headers = this.getClientUrlHeaders().set('Accept', 'application/json');

  _url = createUrl(_url) + "/" + _params;
  return this.http.put(_url, _putdata, {
    headers
  }).pipe(catchError(this.handleError));
}


  DeleteData(_url: string) {
  _url = createUrl(_url);
  return this.http.delete(_url, {
    headers: this.getClientUrlHeaders(),
    withCredentials: true
  }).pipe(catchError(this.handleError));
}

  private handleError(error: Response) {
    return throwError(error);
  }


  private getClientUrlHeaders(): HttpHeaders {
  return new HttpHeaders({
    'X-Client-Url': window.location.href
  });
}


}
