import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {NotifyDropoffService} from "../services/notify-dropoff.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-notify-dropoff',
  templateUrl: './notify-dropoff.component.html',
  styleUrl: './notify-dropoff.component.css'
})
export class NotifyDropoffComponent {
  dropoffForm: FormGroup;
  email: string | null | undefined
  file: File | undefined;
  originalFilename: string = 'No file selected';
  username: string = '';


  constructor(private fb: FormBuilder, private notifyDropoffService: NotifyDropoffService,  private route: Router,
              private authService: AuthService) {
    this.dropoffForm = this.fb.group({
      itemLeft: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      email: ['', Validators.required],
      consentCheckbox: [false, Validators.requiredTrue],
      file: [null, [Validators.required, this.fileSizeValidator(5 * 1024 * 1024), this.fileTypeValidator(['image/jpeg', 'image/png'])]]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe(userEmail => {
      this.dropoffForm.get('email')?.setValue(userEmail);
      if(userEmail != ''){
        this.dropoffForm.get('email')?.disable();
      }
    });
  }

  onFileChange(event: any): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.originalFilename = file.name;
      this.dropoffForm.patchValue({ file: file });
      this.dropoffForm.get('file')!.updateValueAndValidity();
    } else {
      this.dropoffForm.patchValue({ file: null });
      this.originalFilename = 'No file selected';
      this.dropoffForm.get('file')!.updateValueAndValidity();
    }
  }


  onSubmit() {
    if (this.dropoffForm.valid) {
      const formData = new FormData();

      const fileInput = this.dropoffForm.get('file')?.value;
      if (fileInput && fileInput instanceof File) {
        formData.append('file', fileInput);
      } else {
        console.error('No file selected or invalid file input.');
        return;
      }

      const uploadData = {
        userEmail: this.dropoffForm.get('email')!.value,
        itemName: this.dropoffForm.get('itemLeft')!.value,
        street: this.dropoffForm.get('street')!.value,
        city: this.dropoffForm.get('city')!.value,
        state: this.dropoffForm.get('state')!.value,
        zipcode: this.dropoffForm.get('zipcode')!.value
      };

      formData.append('data', new Blob([JSON.stringify(uploadData)], { type: 'application/json' }));

      this.notifyDropoffService.createAvailableItem(formData).subscribe({
        next: (response) => {
          console.log('Available Item recorded successfully:', response);
          if (response.resultSummary.success) {
            this.route.navigate(['/items-outside']);
          }
        },
        error: (error) => {
          console.error('Available Item record Failed ', error);
        }
      });

      // this.verifyAddress(this.dropoffForm.value.street, this.dropoffForm.value.city, this.dropoffForm.value.state, this.dropoffForm.value.zipCode).subscribe(
      //   (response: any) => {
      //     if (response.status === 'OK') {
      //       console.log('Valid address:', response.results);
      //       // Proceed with form submission
      //     } else {
      //       console.error('Invalid address');
      //       // Handle invalid address
      //     }
      //   },
      //   (error) => {
      //     console.error('Error verifying address:', error);
      //   }
      // );
    } else {
      console.log('Form is invalid or photo not uploaded.');
    }
  }


  fileSizeValidator(maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (file && file.size > maxSize) {
        return { 'fileSize': true };
      }
      return null;
    };
  }

   fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (file && !allowedTypes.includes(file.type)) {
        return { 'fileType': true };
      }
      return null;
    };
  }

  // verifyAddress(street: string, city: string, state: string, zipcode: string) {
  //   const address = `${street}, ${city}, ${state}, ${zipcode}`;
  //   return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=YOUR_API_KEY`);
  // }



}
