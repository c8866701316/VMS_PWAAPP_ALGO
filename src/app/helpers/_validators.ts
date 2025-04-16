import { FormGroup,AbstractControl } from '@angular/forms';

export const fileTypeValidator = (control: any): { [key: string]: any } | null =>{
    const file = control.value;
    if (file) {
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      const fileNameParts = file.name.split('.');
      const fileExtension = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1].toLowerCase() : '';

      if (allowedExtensions.includes(fileExtension)) {
        return null;
      } else {
        return { invalidFileType: true };
      }
    }
    return null;
}

export const isControlInvalid = (control: AbstractControl): boolean => {
  return control.invalid && (control.dirty || control.touched);
}

export const dateTimeValidator = (startControlName: string, endControlName: string): any => {
  return (group: FormGroup): { [key: string]: any } | null => {
    const startControl = group.controls[startControlName];
    const endControl = group.controls[endControlName];

    if (startControl.value && endControl.value) {
      const startTime = new Date(startControl.value);
      const endTime = new Date(endControl.value);

      if (endTime.getTime() <= startTime.getTime()) {
        return { 'dateTimeMismatch': true };
      }
    }

    return null;
  };
}