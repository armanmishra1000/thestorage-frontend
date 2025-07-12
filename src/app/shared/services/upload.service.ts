// In file: Frontend/src/app/shared/services/upload.service.ts

import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Event emitted during the upload process
 */
export interface UploadEvent {
  type: 'progress' | 'success' | 'error';
  value: any; // progress percentage, download URL, or error message
}

/**
 * Response from the upload endpoint
 */
interface UploadResponse {
  file_id: string;
  share_url: string;
}

/**
 * Service for handling file uploads to the DirectDrive backend
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;
  private downloadBaseUrl = environment.downloadBaseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Upload a file using HTTP multipart/form-data
   * 
   * @param file The file to upload
   * @returns Observable that emits progress, success, or error events
   */
  public upload(file: File): Observable<UploadEvent> {
    // Create form data
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Create the HTTP request with reportProgress option
    const req = new HttpRequest('POST', `${this.apiUrl}/api/v1/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    // Send the request and map the events
    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => this.getEventFromResponse(event)),
      catchError(error => {
        console.error('Upload error:', error);
        const errorMsg = error.error?.detail || 'File upload failed. Please try again.';
        return throwError(() => ({ type: 'error', value: errorMsg }));
      })
    );
  }

  /**
   * Convert HTTP events to UploadEvent objects
   * 
   * @param event HTTP event from the request
   * @returns Mapped UploadEvent
   */
  private getEventFromResponse(event: HttpEvent<any>): UploadEvent {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        // Calculate and return the upload progress percentage
        const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        return { type: 'progress', value: progress };

      case HttpEventType.Response:
        // Return the success event with the share URL
        const body = event.body as UploadResponse;
        return { 
          type: 'success', 
          value: body.share_url 
        };

      default:
        // Ignore other event types
        return { type: 'progress', value: 0 };
    }
  }

  /**
   * Get the download URL for a file
   * 
   * @param remotePath The remote path of the file
   * @returns The full download URL
   */
  public getDownloadUrl(remotePath: string): string {
    return `${this.downloadBaseUrl}/${remotePath}`;
  }
}