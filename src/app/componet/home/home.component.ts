// // // // // // import { Component, OnDestroy } from '@angular/core';
// // // // // // import { UploadService } from '../../shared/services/upload.service';
// // // // // // import { Subscription } from 'rxjs';
// // // // // // import { MatSnackBar } from '@angular/material/snack-bar';

// // // // // // @Component({
// // // // // //   selector: 'app-home',
// // // // // //   templateUrl: './home.component.html',
// // // // // // })
// // // // // // export class HomeComponent implements OnDestroy {
// // // // // //   selectedFile: File | null = null;
// // // // // //   uploadProgress = 0;
// // // // // //   uploading = false;
// // // // // //   uploadSuccess = false;
// // // // // //   private progressSub: Subscription;

// // // // // //   constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {
// // // // // //     // Subscribe to progress updates from the service
// // // // // //     this.progressSub = this.uploadService.uploadProgress$.subscribe({
// // // // // //       next: (progress) => {
// // // // // //         this.uploadProgress = progress;
// // // // // //         if (progress === 100) {
// // // // // //           this.uploading = false;
// // // // // //           this.uploadSuccess = true;
// // // // // //           this.snackBar.open('File upload complete!', 'Close', { duration: 3000 });
// // // // // //         }
// // // // // //       },
// // // // // //       error: (err) => {
// // // // // //         this.uploading = false;
// // // // // //         this.snackBar.open(`Upload Failed: ${err}`, 'Close', { duration: 5000 });
// // // // // //         this.reset();
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   onFileSelected(event: any): void {
// // // // // //     this.selectedFile = event.target.files[0];
// // // // // //     this.reset();
// // // // // //   }

// // // // // //   onDragOver(event: DragEvent) { event.preventDefault(); }
// // // // // //   onDragLeave(event: DragEvent) { event.preventDefault(); }

// // // // // //   onDrop(event: DragEvent) {
// // // // // //     event.preventDefault();
// // // // // //     if (event.dataTransfer?.files.length) {
// // // // // //       this.selectedFile = event.dataTransfer.files[0];
// // // // // //       this.reset();
// // // // // //     }
// // // // // //   }

// // // // // //   onUpload(): void {
// // // // // //     if (!this.selectedFile) return;

// // // // // //     this.uploading = true;
// // // // // //     this.uploadSuccess = false;
// // // // // //     this.uploadProgress = 0;

// // // // // //     // The component's job is just to start the upload.
// // // // // //     // The progress subscription will handle the rest.
// // // // // //     this.uploadService.upload(this.selectedFile).subscribe({
// // // // // //       next: () => {
// // // // // //         console.log('Upload initiated successfully.');
// // // // // //       },
// // // // // //       error: (err) => {
// // // // // //         // This error is for the initiation step only
// // // // // //         this.uploading = false;
// // // // // //         this.snackBar.open('Could not start upload. Please check the console.', 'Close', { duration: 3000 });
// // // // // //       }
// // // // // //     });
// // // // // //   }
  
// // // // // //   // We no longer need a download link immediately, as the processing happens in the background
// // // // // //   // The UI can be updated to reflect this.

// // // // // //   reset() {
// // // // // //     this.uploadProgress = 0;
// // // // // //     this.uploading = false;
// // // // // //     this.uploadSuccess = false;
// // // // // //   }

// // // // // //   ngOnDestroy(): void {
// // // // // //     // Unsubscribe to prevent memory leaks
// // // // // //     if (this.progressSub) {
// // // // // //       this.progressSub.unsubscribe();
// // // // // //     }
// // // // // //   }
// // // // // // }



// // // // // import { Component, OnDestroy } from '@angular/core';
// // // // // import { UploadService } from '../../shared/services/upload.service'; // Adjust path if needed
// // // // // import { Subscription } from 'rxjs';
// // // // // import { MatSnackBar } from '@angular/material/snack-bar';

// // // // // // Define the different states our component can be in
// // // // // type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

// // // // // @Component({
// // // // //   selector: 'app-home',
// // // // //   templateUrl: './home.component.html',
// // // // // })
// // // // // export class HomeComponent implements OnDestroy {
// // // // //   // --- State Management ---
// // // // //   public currentState: UploadState = 'idle';
// // // // //   public selectedFile: File | null = null;
  
// // // // //   // --- Progress & Result ---
// // // // //   public browserUploadProgress = 0;
// // // // //   public finalDownloadLink: string | null = null;
// // // // //   public errorMessage: string | null = null;

// // // // //   // --- Subscriptions ---
// // // // //   private uploadSub?: Subscription;
// // // // //   private progressSub?: Subscription;

// // // // //   constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {}

// // // // //   onFileSelected(event: any): void {
// // // // //     const fileList = (event.target as HTMLInputElement).files;
// // // // //     if (fileList && fileList.length > 0) {
// // // // //       this.selectedFile = fileList[0];
// // // // //       this.reset();
// // // // //       this.currentState = 'selected';
// // // // //     }
// // // // //   }

// // // // //   onUpload(): void {
// // // // //     if (!this.selectedFile) return;

// // // // //     this.currentState = 'uploading';
// // // // //     let fileId = ''; // Variable to hold the ID for this upload

// // // // //     // Subscribe to progress updates first
// // // // //     this.progressSub = this.uploadService.browserUploadProgress$.subscribe({
// // // // //         next: progress => {
// // // // //             this.browserUploadProgress = progress;
// // // // //         },
// // // // //         error: err => {
// // // // //             this.currentState = 'error';
// // // // //             this.errorMessage = err;
// // // // //         },
// // // // //         complete: () => {
// // // // //             // This 'complete' now fires when the browser-to-server part is done.
// // // // //             // At this point, the Celery task is running in the background.
// // // // //             // We can now show the success message and the link to the user.
// // // // //             this.currentState = 'success';
// // // // //             this.snackBar.open('File upload complete! Your link is ready.', 'Close', { duration: 3000 });
// // // // //         }
// // // // //     });

// // // // //     // Initiate the upload process. The most important part is getting the fileId.
// // // // //     this.uploadSub = this.uploadService.upload(this.selectedFile).subscribe({
// // // // //       next: (response) => {
// // // // //         fileId = response.file_id;
// // // // //         console.log(`Upload initiated. File ID: ${fileId}`);
        
// // // // //         // ** THE FIX IS HERE: Construct the final link immediately **
// // // // //         this.finalDownloadLink = `${window.location.origin}/download/${fileId}`;
// // // // //       },
// // // // //       error: (err) => {
// // // // //         this.currentState = 'error';
// // // // //         this.errorMessage = 'Could not start upload. Is the server running?';
// // // // //         this.progressSub?.unsubscribe(); // Clean up progress sub on initiation error
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   reset(): void {
// // // // //     this.browserUploadProgress = 0;
// // // // //     this.finalDownloadLink = null;
// // // // //     this.errorMessage = null;

// // // // //     // Set state based on whether a file is selected
// // // // //     this.currentState = this.selectedFile ? 'selected' : 'idle';
    
// // // // //     // Unsubscribe from all potential subscriptions
// // // // //     this.uploadSub?.unsubscribe();
// // // // //     this.progressSub?.unsubscribe();
// // // // //   }

// // // // //   startNewUpload(): void {
// // // // //     this.selectedFile = null;
// // // // //     this.reset();
// // // // //   }

// // // // //   copyLink(link: string): void {
// // // // //     navigator.clipboard.writeText(link).then(() => {
// // // // //       this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
// // // // //     });
// // // // //   }

// // // // //   // --- Drag and Drop Handlers ---
// // // // //   onDragOver(event: DragEvent) { event.preventDefault(); }
// // // // //   onDragLeave(event: DragEvent) { event.preventDefault(); }
// // // // //   onDrop(event: DragEvent) {
// // // // //     event.preventDefault();
// // // // //     if (this.currentState !== 'uploading' && event.dataTransfer?.files.length) {
// // // // //       this.selectedFile = event.dataTransfer.files[0];
// // // // //       this.reset();
// // // // //       this.currentState = 'selected';
// // // // //     }
// // // // //   }

// // // // //   ngOnDestroy(): void {
// // // // //     // Final cleanup when the component is destroyed
// // // // //     this.uploadSub?.unsubscribe();
// // // // //     this.progressSub?.unsubscribe();
// // // // //   }
// // // // // }


// // // // // src/app/componet/home/home.component.ts
// // // // import { Component, OnDestroy } from '@angular/core';
// // // // import { UploadService } from '../../shared/services/upload.service';
// // // // import { Subscription } from 'rxjs';
// // // // import { MatSnackBar } from '@angular/material/snack-bar';

// // // // type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

// // // // @Component({
// // // //   selector: 'app-home',
// // // //   templateUrl: './home.component.html',
// // // // })
// // // // export class HomeComponent implements OnDestroy {
// // // //   public currentState: UploadState = 'idle';
// // // //   public selectedFile: File | null = null;
  
// // // //   public browserUploadProgress = 0;
// // // //   public finalDownloadLink: string | null = null;
// // // //   public errorMessage: string | null = null;

// // // //   private uploadSub?: Subscription;
// // // //   private progressSub?: Subscription;

// // // //   constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {}

// // // //   onFileSelected(event: any): void {
// // // //     const fileList = (event.target as HTMLInputElement).files;
// // // //     if (fileList && fileList.length > 0) {
// // // //       this.selectedFile = fileList[0];
// // // //       this.reset();
// // // //       this.currentState = 'selected';
// // // //     }
// // // //   }

// // // //   onUpload(): void {
// // // //     if (!this.selectedFile) return;

// // // //     this.currentState = 'uploading';
// // // //     let fileId = '';

// // // //     this.progressSub = this.uploadService.browserUploadProgress$.subscribe({
// // // //         next: progress => {
// // // //             this.browserUploadProgress = progress;
// // // //         },
// // // //         error: err => {
// // // //             this.currentState = 'error';
// // // //             this.errorMessage = err;
// // // //         },
// // // //         complete: () => {
// // // //             this.currentState = 'success';
// // // //             this.snackBar.open('File upload complete! Your link is ready.', 'Close', { duration: 3000 });
// // // //         }
// // // //     });

// // // //     this.uploadSub = this.uploadService.upload(this.selectedFile).subscribe({
// // // //       next: (response) => {
// // // //         fileId = response.file_id;
// // // //         console.log(`Upload initiated. File ID: ${fileId}`);
// // // //         this.finalDownloadLink = `${window.location.origin}/download/${fileId}`;
// // // //       },
// // // //       error: (err) => {
// // // //         this.currentState = 'error';
// // // //         this.errorMessage = 'Could not start upload. Is the server running?';
// // // //         this.progressSub?.unsubscribe();
// // // //       }
// // // //     });
// // // //   }

// // // //   reset(): void {
// // // //     this.browserUploadProgress = 0;
// // // //     this.finalDownloadLink = null;
// // // //     this.errorMessage = null;
// // // //     this.currentState = this.selectedFile ? 'selected' : 'idle';
    
// // // //     this.uploadSub?.unsubscribe();
// // // //     this.progressSub?.unsubscribe();
// // // //   }

// // // //   startNewUpload(): void {
// // // //     this.selectedFile = null;
// // // //     this.reset();
// // // //     this.currentState = 'idle';
// // // //   }

// // // //   copyLink(link: string): void {
// // // //     navigator.clipboard.writeText(link).then(() => {
// // // //       this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
// // // //     });
// // // //   }

// // // //   onDragOver(event: DragEvent) { event.preventDefault(); }
// // // //   onDragLeave(event: DragEvent) { event.preventDefault(); }
// // // //   onDrop(event: DragEvent) {
// // // //     event.preventDefault();
// // // //     if (this.currentState !== 'uploading' && event.dataTransfer?.files.length) {
// // // //       this.selectedFile = event.dataTransfer.files[0];
// // // //       this.reset();
// // // //       this.currentState = 'selected';
// // // //     }
// // // //   }

// // // //   ngOnDestroy(): void {
// // // //     this.uploadSub?.unsubscribe();
// // // //     this.progressSub?.unsubscribe();
// // // //   }
// // // // }


// // // // src/app/componet/home/home.component.ts
// // // import { Component, OnDestroy } from '@angular/core';
// // // import { UploadService } from '../../shared/services/upload.service';
// // // import { Subscription } from 'rxjs';
// // // import { MatSnackBar } from '@angular/material/snack-bar';

// // // // Add the new 'processing' state
// // // type UploadState = 'idle' | 'selected' | 'uploading' | 'processing' | 'success' | 'error';

// // // @Component({
// // //   selector: 'app-home',
// // //   templateUrl: './home.component.html',
// // // })
// // // export class HomeComponent implements OnDestroy {
// // //   public currentState: UploadState = 'idle';
// // //   public selectedFile: File | null = null;
  
// // //   public browserUploadProgress = 0;
// // //   public serverUploadProgress = 0;
// // //   public finalDownloadLink: string | null = null;
// // //   public errorMessage: string | null = null;

// // //   // Keep track of all subscriptions to clean them up
// // //   private subscriptions = new Subscription();

// // //   constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {}

// // //   onFileSelected(event: any): void {
// // //     const fileList = (event.target as HTMLInputElement).files;
// // //     if (fileList && fileList.length > 0) {
// // //       this.selectedFile = fileList[0];
// // //       this.reset();
// // //       this.currentState = 'selected';
// // //     }
// // //   }

// // //   onUpload(): void {
// // //     if (!this.selectedFile) return;

// // //     this.currentState = 'uploading';
// // //     let fileId = '';

// // //     // Subscribe to browser-to-server progress
// // //     const progressSub = this.uploadService.browserUploadProgress$.subscribe({
// // //         next: progress => { this.browserUploadProgress = progress; },
// // //         error: err => {
// // //             this.currentState = 'error';
// // //             this.errorMessage = err;
// // //         },
// // //         complete: () => {
// // //             // ---- THIS IS THE KEY CHANGE ----
// // //             // When browser upload is done, move to 'processing' and start listening for the backend.
// // //             this.currentState = 'processing';
// // //             this.listenForServerProgress(fileId);
// // //         }
// // //     });
// // //     this.subscriptions.add(progressSub);

// // //     // Initiate the upload to get the fileId
// // //     const uploadSub = this.uploadService.upload(this.selectedFile).subscribe({
// // //       next: (response) => {
// // //         fileId = response.file_id;
// // //         console.log(`Upload initiated. File ID: ${fileId}`);
// // //         // We construct the link here but don't show it yet
// // //         this.finalDownloadLink = `${window.location.origin}/download/${fileId}`;
// // //       },
// // //       error: (err) => {
// // //         this.currentState = 'error';
// // //         this.errorMessage = 'Could not start upload. Is the server running?';
// // //       }
// // //     });
// // //     this.subscriptions.add(uploadSub);
// // //   }

// // //   // New method to listen to the progress WebSocket
// // //   listenForServerProgress(fileId: string): void {
// // //     const serverProgressSub = this.uploadService.listenForServerProgress(fileId).subscribe({
// // //       next: (message) => {
// // //         console.log('Received server message:', message);
        
// // //         // --- THIS IS THE KEY CHANGE ---
// // //         if (message.type === 'progress') {
// // //           this.serverUploadProgress = message.value; // Update server progress
// // //         } else if (message.type === 'success') {
// // //           this.currentState = 'success';
// // //           this.snackBar.open('File processing complete!', 'Close', { duration: 3000 });
// // //         } else if (message.type === 'error') {
// // //           this.currentState = 'error';
// // //           this.errorMessage = message.value || 'An unknown error occurred during processing.';
// // //         }
// // //       },
// // //       error: (err) => {
// // //         this.currentState = 'error';
// // //         this.errorMessage = 'Lost connection to server during processing.';
// // //       }
// // //     });
// // //     this.subscriptions.add(serverProgressSub);
// // //   }

// // //   reset(): void {
// // //     this.browserUploadProgress = 0;
// // //     this.serverUploadProgress = 0;
// // //     this.finalDownloadLink = null;
// // //     this.errorMessage = null;
// // //     this.currentState = this.selectedFile ? 'selected' : 'idle';
// // //     this.subscriptions.unsubscribe();
// // //     this.subscriptions = new Subscription(); // Re-create for next upload
// // //   }

// // //   startNewUpload(): void {
// // //     this.selectedFile = null;
// // //     this.reset();
// // //     this.currentState = 'idle';
// // //   }

// // //   copyLink(link: string): void {
// // //     navigator.clipboard.writeText(link).then(() => {
// // //       this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
// // //     });
// // //   }

// // //   onDragOver(event: DragEvent) { event.preventDefault(); }
// // //   onDragLeave(event: DragEvent) { event.preventDefault(); }
// // //   onDrop(event: DragEvent) {
// // //     event.preventDefault();
// // //     if (this.currentState !== 'uploading' && event.dataTransfer?.files.length) {
// // //       this.selectedFile = event.dataTransfer.files[0];
// // //       this.reset();
// // //       this.currentState = 'selected';
// // //     }
// // //   }

// // //   ngOnDestroy(): void {
// // //     this.subscriptions.unsubscribe();
// // //   }
// // // }


// // import { Component, OnDestroy } from '@angular/core';
// // import { UploadService, UploadEvent } from '../../shared/services/upload.service';
// // import { Subscription } from 'rxjs';
// // import { MatSnackBar } from '@angular/material/snack-bar';

// // // The 'uploading' state is now for the initial browser-to-server transfer (spinner).
// // // The 'processing' state is for the server-to-drive transfer (progress bar).
// // type UploadState = 'idle' | 'selected' | 'uploading' | 'processing' | 'success' | 'error';

// // @Component({
// //   selector: 'app-home',
// //   templateUrl: './home.component.html',
// // })
// // export class HomeComponent implements OnDestroy {
// //   public currentState: UploadState = 'idle';
// //   public selectedFile: File | null = null;
  
// //   public serverUploadProgress = 0;
// //   public finalDownloadLink: string | null = null;
// //   public errorMessage: string | null = null;

// //   private uploadSubscription?: Subscription;

// //   constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {}

// //   onFileSelected(event: any): void {
// //     const fileList = (event.target as HTMLInputElement).files;
// //     if (fileList && fileList.length > 0) {
// //       this.selectedFile = fileList[0];
// //       this.reset();
// //       this.currentState = 'selected';
// //     }
// //   }

// //   onUpload(): void {
// //     if (!this.selectedFile) return;

// //     // Show a generic spinner while the file is sent to the server.
// //     this.currentState = 'uploading'; 

// //     this.uploadSubscription = this.uploadService.upload(this.selectedFile).subscribe({
// //       next: (event: UploadEvent) => {
// //         // A state machine to handle events from the single WebSocket connection.
// //         if (event.type === 'processing_started') {
// //           // The server has the file and is starting the GDrive upload.
// //           // Now we switch to the progress bar UI.
// //           this.currentState = 'processing';
// //         } else if (event.type === 'progress') {
// //           this.serverUploadProgress = event.value;
// //         } else if (event.type === 'success') {
// //           this.currentState = 'success';
// //           // The backend now sends the correct download path directly.
// //           this.finalDownloadLink = `${window.location.origin}${event.value}`;
// //           this.snackBar.open('Upload complete!', 'Close', { duration: 3000 });
// //         }
// //       },
// //       error: (err) => {
// //         this.currentState = 'error';
// //         this.errorMessage = err.value || 'An unknown error occurred.';
// //       }
// //     });
// //   }

// //   reset(): void {
// //     this.serverUploadProgress = 0;
// //     this.finalDownloadLink = null;
// //     this.errorMessage = null;
    
// //     this.uploadSubscription?.unsubscribe();
// //     this.currentState = this.selectedFile ? 'selected' : 'idle';
// //   }

// //   startNewUpload(): void {
// //     this.selectedFile = null;
// //     this.reset();
// //   }

// //   copyLink(link: string): void {
// //     navigator.clipboard.writeText(link).then(() => {
// //       this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
// //     });
// //   }

// //   onDragOver(event: DragEvent) { event.preventDefault(); }
// //   onDragLeave(event: DragEvent) { event.preventDefault(); }
// //   onDrop(event: DragEvent) {
// //     event.preventDefault();
// //     if (this.currentState !== 'uploading' && this.currentState !== 'processing' && event.dataTransfer?.files.length) {
// //       this.selectedFile = event.dataTransfer.files[0];
// //       this.reset();
// //       this.currentState = 'selected';
// //     }
// //   }

// //   ngOnDestroy(): void {
// //     this.uploadSubscription?.unsubscribe();
// //   }
// // }


// ////////////07/07////////

// import { Component, OnDestroy } from '@angular/core';
// import { UploadService, UploadEvent } from '../../shared/services/upload.service';
// import { Subscription } from 'rxjs';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { environment } from '../../../environments/environment'; // <-- IMPORT ENVIRONMENT

// type UploadState = 'idle' | 'selected' | 'uploading' | 'processing' | 'success' | 'error';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
// })
// export class HomeComponent implements OnDestroy {
//   public currentState: UploadState = 'idle';
//   public selectedFile: File | null = null;
  
//   public serverUploadProgress = 0;
//   public finalDownloadLink: string | null = null;
//   public errorMessage: string | null = null;

//   private uploadSubscription?: Subscription;

//   constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {}

//   onFileSelected(event: any): void {
//     const fileList = (event.target as HTMLInputElement).files;
//     if (fileList && fileList.length > 0) {
//       this.selectedFile = fileList[0];
//       this.reset();
//       this.currentState = 'selected';
//     }
//   }

//   onUpload(): void {
//     if (!this.selectedFile) return;

//     this.currentState = 'uploading'; 

//     this.uploadSubscription = this.uploadService.upload(this.selectedFile).subscribe({
//       next: (event: UploadEvent) => {
//         if (event.type === 'processing_started') {
//           this.currentState = 'processing';
//         } else if (event.type === 'progress') {
//           this.serverUploadProgress = event.value;
//         } else if (event.type === 'success') {
//           this.currentState = 'success';
          
//           // --- THIS IS THE FIX ---
//           // Build the correct URL using the backend's URL from the environment file.
//           this.finalDownloadLink = `${environment.apiUrl}${event.value}`;
          
//           this.snackBar.open('Upload complete!', 'Close', { duration: 3000 });
//         }
//       },
//       error: (err) => {
//         this.currentState = 'error';
//         this.errorMessage = err.value || 'An unknown error occurred.';
//       }
//     });
//   }

//   reset(): void {
//     this.serverUploadProgress = 0;
//     this.finalDownloadLink = null;
//     this.errorMessage = null;
    
//     this.uploadSubscription?.unsubscribe();
//     this.currentState = this.selectedFile ? 'selected' : 'idle';
//   }

//   startNewUpload(): void {
//     this.selectedFile = null;
//     this.reset();
//   }

//   copyLink(link: string): void {
//     navigator.clipboard.writeText(link).then(() => {
//       this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
//     });
//   }

//   onDragOver(event: DragEvent) { event.preventDefault(); }
//   onDragLeave(event: DragEvent) { event.preventDefault(); }
//   onDrop(event: DragEvent) {
//     event.preventDefault();
//     if (this.currentState !== 'uploading' && this.currentState !== 'processing' && event.dataTransfer?.files.length) {
//       this.selectedFile = event.dataTransfer.files[0];
//       this.reset();
//       this.currentState = 'selected';
//     }
//   }

//   ngOnDestroy(): void {
//     this.uploadSubscription?.unsubscribe();
//   }
// }


import { Component, OnDestroy } from '@angular/core';
import { UploadService, UploadEvent } from '../../shared/services/upload.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
// No need to import environment here anymore

type UploadState = 'idle' | 'selected' | 'uploading' | 'processing' | 'success' | 'error';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {
  public currentState: UploadState = 'idle';
  public selectedFile: File | null = null;
  
  public serverUploadProgress = 0;
  public finalDownloadLink: string | null = null;
  public errorMessage: string | null = null;

  private uploadSubscription?: Subscription;

  constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {}

  onFileSelected(event: any): void {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.reset();
      this.currentState = 'selected';
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.currentState = 'uploading'; 

    this.uploadSubscription = this.uploadService.upload(this.selectedFile).subscribe({
      next: (event: UploadEvent) => {
        if (event.type === 'processing_started') {
          this.currentState = 'processing';
        } else if (event.type === 'progress') {
          this.serverUploadProgress = event.value;
        } else if (event.type === 'success') {
          this.currentState = 'success';
          
          // --- THIS IS THE FIX ---
          // The backend sends a path like "/api/v1/download/stream/some-file-id"
          const backendPath = event.value as string;
          // We extract just the file ID from the end of the path.
          const fileId = backendPath.split('/').pop();
          
          // Now, we build the correct link to OUR OWN download page.
          this.finalDownloadLink = `${window.location.origin}/download/${fileId}`;
          
          this.snackBar.open('Upload complete!', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.currentState = 'error';
        this.errorMessage = err.value || 'An unknown error occurred.';
      }
    });
  }

  reset(): void {
    this.serverUploadProgress = 0;
    this.finalDownloadLink = null;
    this.errorMessage = null;
    
    this.uploadSubscription?.unsubscribe();
    this.currentState = this.selectedFile ? 'selected' : 'idle';
  }

  startNewUpload(): void {
    this.selectedFile = null;
    this.reset();
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 2000 });
    });
  }

  onDragOver(event: DragEvent) { event.preventDefault(); }
  onDragLeave(event: DragEvent) { event.preventDefault(); }
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (this.currentState !== 'uploading' && this.currentState !== 'processing' && event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
      this.reset();
      this.currentState = 'selected';
    }
  }

  ngOnDestroy(): void {
    this.uploadSubscription?.unsubscribe();
  }
}