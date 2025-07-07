// // // import { HttpClient } from '@angular/common/http';
// // // import { Injectable } from '@angular/core';
// // // import { Observable, Subject, throwError } from 'rxjs';
// // // import { catchError, switchMap, tap } from 'rxjs/operators';
// // // // import { environment } from 'src/environments/environment'; // We'll create this soon

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class UploadService {
// // //   // Define API and WebSocket URLs
// // //   private apiUrl = 'http://localhost:5000/api/v1'; // Or use environment file
// // //   private wsUrl = 'ws://localhost:5000/ws_api/ws';      // Or use environment file

// // //   // Subject to emit upload progress percentage (0-100)
// // //   private uploadProgress = new Subject<number>();
// // //   public uploadProgress$ = this.uploadProgress.asObservable();

// // //   constructor(private http: HttpClient) { }

// // //   /**
// // //    * Main method to orchestrate the entire file upload process.
// // //    * @param file The file to be uploaded.
// // //    * @returns An observable that completes when the upload process is initiated successfully.
// // //    */
// // //   public upload(file: File): Observable<any> {
// // //     const fileInfo = {
// // //       filename: file.name,
// // //       size: file.size,
// // //       content_type: file.type || 'application/octet-stream'
// // //     };

// // //     // Step 1: Initiate the upload and get a file_id
// // //     return this.initiateUpload(fileInfo).pipe(
// // //       tap(response => {
// // //         // Step 2: Once we have the file_id, start streaming the file
// // //         this.streamFileViaWebSocket(file, response.file_id);
// // //       }),
// // //       catchError(err => {
// // //         console.error('Initiation failed', err);
// // //         this.uploadProgress.error('Failed to start upload.');
// // //         return throwError(() => new Error('Failed to start upload.'));
// // //       })
// // //     );
// // //   }

// // //   /**
// // //    * Calls the backend to initiate the upload session.
// // //    * @param fileInfo Metadata about the file.
// // //    * @returns An observable with the server's response, containing the file_id.
// // //    */
// // //   private initiateUpload(fileInfo: { filename: string; size: number; content_type: string; }): Observable<{ file_id: string }> {
// // //     return this.http.post<{ file_id: string }>(`${this.apiUrl}/upload/initiate`, fileInfo);
// // //   }

// // //   /**
// // //    * Connects to the WebSocket and streams the file in chunks.
// // //    * @param file The file to be uploaded.
// // //    * @param fileId The unique ID for this upload session.
// // //    */
// // //     private streamFileViaWebSocket(file: File, fileId: string): void {
// // //     const wsUrl = `${this.wsUrl}/upload/${fileId}`;
// // //     console.log(`[Uploader] Attempting to connect to WebSocket at: ${wsUrl}`);

// // //     const ws = new WebSocket(wsUrl);
// // //     ws.binaryType = 'blob';

// // //     // Reset progress to 0 when starting
// // //     this.uploadProgress.next(0);

// // //     ws.onopen = () => {
// // //       console.log(`[Uploader] WebSocket opened successfully for fileId: ${fileId}`);
// // //       // Start the slicing and sending process
// // //       this.sliceAndSend(file, ws);
// // //     };

// // //     ws.onmessage = (event) => {
// // //       // The server shouldn't be sending messages, but we log it just in case.
// // //       console.log('[Uploader] Received message from server:', event.data);
// // //     };

// // //     ws.onclose = (event) => {
// // //       // This part is very important for debugging.
// // //       console.log(`[Uploader] WebSocket is closing. Clean: ${event.wasClean}, Code: ${event.code}, Reason: ${event.reason}`);
// // //       if (event.wasClean) {
// // //         console.log('[Uploader] WebSocket closed cleanly by server.');
// // //         this.uploadProgress.next(100);
// // //         this.uploadProgress.complete();
// // //       } else {
// // //         console.error('[Uploader] WebSocket connection died unexpectedly.');
// // //         this.uploadProgress.error('Network connection lost.');
// // //       }
// // //     };

// // //     ws.onerror = (error) => {
// // //       // This will now catch any errors during the connection.
// // //       console.error('[Uploader] WebSocket Error Event:', error);
// // //       this.uploadProgress.error('A WebSocket error occurred during upload.');
// // //     };

// // //     // A check after a short delay to see if the connection was established
// // //     setTimeout(() => {
// // //         if (ws.readyState !== WebSocket.OPEN) {
// // //             console.error('[Uploader] WebSocket is not in OPEN state after 2 seconds. Current state:', ws.readyState);
// // //             // We can infer that the connection failed to open.
// // //             if(this.uploadProgress){
// // //               // This might already have an error, so check first
// // //               // this.uploadProgress.error('Failed to establish WebSocket connection.');
// // //             }
// // //         }
// // //     }, 2000);
// // //   }

// // //   /**
// // //    * A recursive function to slice the file and send chunks over the WebSocket.
// // //    * @param file The file being sent.
// // //    * @param ws The active WebSocket connection.
// // //    * @param start The starting byte of the next chunk.
// // //    */
// // //   private sliceAndSend(file: File, ws: WebSocket, start: number = 0): void {
// // //     const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
    
// // //     // Check if we are done
// // //     if (start >= file.size) {
// // //       // All chunks have been sent. Send the DONE signal.
// // //       console.log('All file chunks sent. Sending DONE signal.');
// // //       ws.send('DONE'); 
// // //       // We don't close from the client side. The server will close the connection.
// // //       return;
// // //     }

// // //     // Prepare the next chunk
// // //     const end = start + CHUNK_SIZE;
// // //     const chunk = file.slice(start, end);

// // //     const reader = new FileReader();
// // //     reader.onload = (e) => {
// // //       if (ws.readyState === WebSocket.OPEN) {
// // //         ws.send(e.target?.result as ArrayBuffer);
        
// // //         const progress = Math.min(Math.round((end / file.size) * 100), 99);
// // //         this.uploadProgress.next(progress);
        
// // //         // Recurse for the next chunk
// // //         this.sliceAndSend(file, ws, end);
// // //       }
// // //     };
// // //     reader.readAsArrayBuffer(chunk);
// // //   }
// // // }


// // import { HttpClient } from '@angular/common/http';
// // import { Injectable } from '@angular/core';
// // import { Observable, Subject, throwError, Observer } from 'rxjs';
// // import { catchError, tap } from 'rxjs/operators';
// // import { environment } from '../../../environments/environment';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class UploadService {
// //   // URLs for backend services
// //   // private apiUrl = 'http://localhost:5000/api/v1';
// //   // private wsUrl = 'ws://localhost:5000/ws_api/ws';
// //   private apiUrl = environment.apiUrl;
// //   private wsUrl = environment.wsUrl;

// //   // Subject for the initial BROWSER-TO-SERVER upload progress
// //   private browserUploadProgress = new Subject<number>();
// //   public browserUploadProgress$ = this.browserUploadProgress.asObservable();

// //   constructor(private http: HttpClient) { }

// //   /**
// //    * STAGE 1: Orchestrates the browser-to-server upload.
// //    * @param file The file to upload.
// //    * @returns An Observable that emits the file_id upon successful initiation.
// //    */
// //   public upload(file: File): Observable<{ file_id: string }> {
// //     const fileInfo = {
// //       filename: file.name,
// //       size: file.size,
// //       content_type: file.type || 'application/octet-stream'
// //     };

// //     return this.initiateUpload(fileInfo).pipe(
// //       tap(response => {
// //         // Once initiation is successful, start the WebSocket stream.
// //         this.streamFileViaWebSocket(file, response.file_id);
// //       }),
// //       catchError(err => {
// //         console.error('Initiation failed', err);
// //         this.browserUploadProgress.error('Failed to start upload.');
// //         return throwError(() => new Error('Failed to start upload.'));
// //       })
// //     );
// //   }

// //   /**
// //    * STAGE 2: Listens for server-to-drive progress updates.
// //    * @param fileId The unique ID for the file being processed.
// //    * @returns An Observable that emits real-time progress events.
// //    */
// //   public listenForServerProgress(fileId: string): Observable<any> {
// //     const ws = new WebSocket(`${this.wsUrl}/progress/${fileId}`);

// //     return new Observable((observer: Observer<any>) => {
// //       ws.onopen = () => console.log(`[Progress WS] Connection opened for ${fileId}`);
      
// //       ws.onmessage = (event) => {
// //         const message = JSON.parse(event.data);
// //         observer.next(message); // Push the message to subscribers
// //         if (message.type === 'success' || message.type === 'error') {
// //           observer.complete(); // End the stream on final message
// //         }
// //       };

// //       ws.onerror = (error) => observer.error('Progress connection failed.');
// //       ws.onclose = () => observer.complete();

// //       // Teardown logic: close the socket if the subscriber unsubscribes
// //       return () => {
// //         if (ws.readyState === WebSocket.OPEN) {
// //           ws.close();
// //         }
// //       };
// //     });
// //   }

// //   // --- Private Helper Methods ---

// //   private initiateUpload(fileInfo: { filename: string; size: number; content_type: string; }): Observable<{ file_id: string }> {
// //     return this.http.post<{ file_id: string }>(`${this.apiUrl}/upload/initiate`, fileInfo);
// //   }

// //   private streamFileViaWebSocket(file: File, fileId: string): void {
// //     const ws = new WebSocket(`${this.wsUrl}/upload/${fileId}`);
// //     ws.binaryType = 'blob';

// //     this.browserUploadProgress.next(0);

// //     ws.onopen = () => {
// //       console.log(`[Uploader WS] Connection opened for ${fileId}`);
// //       this.sliceAndSend(file, ws);
// //     };

// //     ws.onclose = (event) => {
// //       if (event.wasClean) {
// //         this.browserUploadProgress.next(100);
// //         this.browserUploadProgress.complete(); // Signal that this stage is done
// //         // Re-initialize for the next upload
// //         this.browserUploadProgress = new Subject<number>();
// //         this.browserUploadProgress$ = this.browserUploadProgress.asObservable();
// //       } else {
// //         this.browserUploadProgress.error('Network connection lost during upload.');
// //       }
// //     };

// //     ws.onerror = (error) => {
// //       console.error('[Uploader WS] Error:', error);
// //       this.browserUploadProgress.error('A WebSocket error occurred.');
// //     };
// //   }

// //   private sliceAndSend(file: File, ws: WebSocket, start: number = 0): void {
// //     const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB

// //     if (start >= file.size) {
// //       ws.send('DONE');
// //       return;
// //     }

// //     const end = start + CHUNK_SIZE;
// //     const chunk = file.slice(start, end);

// //     const reader = new FileReader();
// //     reader.onload = (e) => {
// //       if (ws.readyState === WebSocket.OPEN) {
// //         ws.send(e.target?.result as ArrayBuffer);
// //         const progress = Math.min(Math.round((end / file.size) * 100), 99);
// //         this.browserUploadProgress.next(progress);
// //         this.sliceAndSend(file, ws, end);
// //       }
// //     };
// //     reader.readAsArrayBuffer(chunk);
// //   }
// // }


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, Observer, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// export interface UploadEvent {
//   type: 'processing_started' | 'progress' | 'success' | 'error';
//   value: any;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UploadService {
//   private apiUrl = environment.apiUrl;
//   private wsUrl = environment.wsUrl;

//   constructor(private http: HttpClient) { }

//   /**
//    * Main method to handle the entire upload and progress tracking flow.
//    * @param file The file to upload.
//    * @returns An Observable that emits UploadEvent objects from the server.
//    */
//   public upload(file: File): Observable<UploadEvent> {
//     const fileInfo = {
//       filename: file.name,
//       size: file.size,
//       content_type: file.type || 'application/octet-stream'
//     };

//     // This returns a new Observable that wraps the entire lifecycle.
//     return this.initiateUpload(fileInfo).pipe(
//       switchMap(response => {
//         // The switchMap operator switches from the HTTP observable to the WebSocket observable.
//         return new Observable((observer: Observer<UploadEvent>) => {
//           const fileId = response.file_id;
//           const ws = new WebSocket(`${this.wsUrl}/upload/${fileId}`);
          
//           ws.onopen = () => {
//             console.log(`[Uploader WS] Connection opened for ${fileId}. Starting file stream.`);
//             // Begin sending the file chunks.
//             this.sliceAndSend(file, ws);
//           };

//           // This is the crucial part: listening for messages from the backend.
//           ws.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             observer.next(message as UploadEvent); // Forward the message to the component.
//           };

//           ws.onerror = (error) => {
//             console.error('[Uploader WS] Error:', error);
//             observer.error({ type: 'error', value: 'Connection to server failed.' });
//           };

//           ws.onclose = (event) => {
//             if (!event.wasClean) {
//                 // This handles unexpected connection drops.
//                 observer.error({ type: 'error', value: 'Lost connection to server during processing.' });
//             } else {
//                 // Clean closure means the server finished its sequence (success or error message sent).
//                 observer.complete();
//             }
//           };

//           // Teardown logic for when the subscriber unsubscribes.
//           return () => {
//             if (ws.readyState === WebSocket.OPEN) {
//               ws.close();
//             }
//           };
//         });
//       }),
//       catchError(err => {
//         console.error('HTTP Initiation failed', err);
//         return throwError(() => ({ type: 'error', value: 'Could not initiate upload with the server.' }));
//       })
//     );
//   }

//   // --- Private Helper Methods ---

//   private initiateUpload(fileInfo: { filename: string; size: number; content_type: string; }): Observable<{ file_id: string }> {
//     return this.http.post<{ file_id: string }>(`${this.apiUrl}/upload/initiate`, fileInfo);
//   }

//   private sliceAndSend(file: File, ws: WebSocket, start: number = 0): void {
//     const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB

//     if (start >= file.size) {
//       // All chunks are sent, signal 'DONE' to the backend.
//       // The backend will then start the GDrive upload and send back progress messages.
//       ws.send('DONE');
//       return;
//     }

//     const end = start + CHUNK_SIZE;
//     const chunk = file.slice(start, end);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(e.target?.result as ArrayBuffer);
//         // Recursively call to send the next chunk.
//         this.sliceAndSend(file, ws, end);
//       }
//     };
//     reader.readAsArrayBuffer(chunk);
//   }
// }

////////////07/07////////

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UploadEvent {
  type: 'processing_started' | 'progress' | 'success' | 'error';
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  // Use the new, clean environment variables
  private apiUrl = environment.apiUrl;
  private wsUrl = environment.wsUrl;

  constructor(private http: HttpClient) { }

  /**
   * Main method to handle the entire upload and progress tracking flow.
   * @param file The file to upload.
   * @returns An Observable that emits UploadEvent objects from the server.
   */
  public upload(file: File): Observable<UploadEvent> {
    const fileInfo = {
      filename: file.name,
      size: file.size,
      content_type: file.type || 'application/octet-stream'
    };

    // This returns a new Observable that wraps the entire lifecycle.
    return this.initiateUpload(fileInfo).pipe(
      switchMap(response => {
        // The switchMap operator switches from the HTTP observable to the WebSocket observable.
        return new Observable((observer: Observer<UploadEvent>) => {
          const fileId = response.file_id;
          const ws = new WebSocket(`${this.wsUrl}/upload/${fileId}`);
          
          ws.onopen = () => {
            console.log(`[Uploader WS] Connection opened for ${fileId}. Starting file stream.`);
            // Begin sending the file chunks.
            this.sliceAndSend(file, ws);
          };

          // This is the crucial part: listening for messages from the backend.
          ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            observer.next(message as UploadEvent); // Forward the message to the component.
          };

          ws.onerror = (error) => {
            console.error('[Uploader WS] Error:', error);
            observer.error({ type: 'error', value: 'Connection to server failed.' });
          };

          ws.onclose = (event) => {
            if (!event.wasClean) {
                // This handles unexpected connection drops.
                observer.error({ type: 'error', value: 'Lost connection to server during processing.' });
            } else {
                // Clean closure means the server finished its sequence (success or error message sent).
                observer.complete();
            }
          };

          // Teardown logic for when the subscriber unsubscribes.
          return () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          };
        });
      }),
      catchError(err => {
        console.error('HTTP Initiation failed', err);
        return throwError(() => ({ type: 'error', value: 'Could not initiate upload with the server.' }));
      })
    );
  }

  // --- Private Helper Methods ---

  private initiateUpload(fileInfo: { filename: string; size: number; content_type: string; }): Observable<{ file_id: string }> {
    // Construct the specific path for this call
    return this.http.post<{ file_id: string }>(`${this.apiUrl}/api/v1/upload/initiate`, fileInfo);
  }

  private sliceAndSend(file: File, ws: WebSocket, start: number = 0): void {
    const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB

    if (start >= file.size) {
      // All chunks are sent, signal 'DONE' to the backend.
      // The backend will then start the GDrive upload and send back progress messages.
      ws.send('DONE');
      return;
    }

    const end = start + CHUNK_SIZE;
    const chunk = file.slice(start, end);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(e.target?.result as ArrayBuffer);
        // Recursively call to send the next chunk.
        this.sliceAndSend(file, ws, end);
      }
    };
    reader.readAsArrayBuffer(chunk);
  }
}