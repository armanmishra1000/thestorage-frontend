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
  
  // Browser compatibility warning for large files
  public showBrowserWarning = false;
  public isUnsupportedBrowser = false;
  
  // Size limit for browser warning (4GB in bytes)
  private readonly LARGE_FILE_SIZE_LIMIT = 4 * 1024 * 1024 * 1024;

  private uploadSubscription?: Subscription;

  constructor(private uploadService: UploadService, private snackBar: MatSnackBar) {
    // Check browser compatibility on component initialization
    this.isUnsupportedBrowser = this.detectUnsupportedBrowser();
  }

  /**
   * Detect browsers with known issues handling large files (>4GB)
   * @returns true if browser is Safari or has known issues with large files
   */
  private detectUnsupportedBrowser(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for Safari
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
    
    // Check for older browsers (could add more checks as needed)
    const isIE = userAgent.includes('trident') || userAgent.includes('msie');
    
    return isSafari || isIE;
  }
  
  onFileSelected(event: any): void {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.reset();
      this.currentState = 'selected';
      
      // Check if file is large and browser might have issues
      this.showBrowserWarning = this.isUnsupportedBrowser && 
                               this.selectedFile.size > this.LARGE_FILE_SIZE_LIMIT;
      
      if (this.showBrowserWarning) {
        this.snackBar.open(
          'Warning: Your browser may not support uploads larger than 4GB. Consider using Chrome or Firefox.', 
          'Dismiss', 
          { duration: 8000 }
        );
      }
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
          
          // The upload service now returns the complete share URL
          this.finalDownloadLink = event.value as string;
          
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