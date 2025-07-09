// In file: Frontend/src/app/componet/home/home.component.ts

import { Component, OnDestroy } from '@angular/core';
import { UploadService, UploadEvent } from '../../shared/services/upload.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

// --- MODIFIED: Simplified state to match the new flow ---
// 'uploading' and 'processing' are now the same thing.
type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {
  public currentState: UploadState = 'idle';
  public selectedFile: File | null = null;
  
  // --- RENAMED for clarity ---
  public uploadProgress = 0;
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

    // --- CHANGE: Immediately go to 'uploading' state.
    // This is when the progress bar should appear.
    this.currentState = 'uploading'; 

    this.uploadSubscription = this.uploadService.upload(this.selectedFile).subscribe({
      next: (event: UploadEvent) => {
        // --- THIS BLOCK IS THE FIX ---
        // We now only handle the events defined in our new UploadEvent interface.
        if (event.type === 'progress') {
          // The component is already in the 'uploading' state,
          // so we just update the progress value.
          this.uploadProgress = event.value;
        } else if (event.type === 'success') {
          this.currentState = 'success';
          
          const backendPath = event.value as string;
          const fileId = backendPath.split('/').pop();
          
          // Build the correct link to our own application's download page.
          this.finalDownloadLink = `${window.location.origin}/download/${fileId}`;
          
          this.snackBar.open('Upload complete!', 'Close', { duration: 3000 });
        }
        // NOTE: The 'error' case is handled by the `error` callback below.
      },
      error: (err) => {
        this.currentState = 'error';
        this.errorMessage = err.value || 'An unknown error occurred.';
      }
    });
  }

  reset(): void {
    this.uploadProgress = 0;
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

  // --- MODIFIED: Simplified the check for drag-and-drop ---
  onDragOver(event: DragEvent) { event.preventDefault(); }
  onDragLeave(event: DragEvent) { event.preventDefault(); }
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (this.currentState !== 'uploading' && event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
      this.reset();
      this.currentState = 'selected';
    }
  }

  ngOnDestroy(): void {
    this.uploadSubscription?.unsubscribe();
  }
}