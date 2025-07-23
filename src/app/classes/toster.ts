import Toastify from 'toastify-js'


export class Toaster {

  static showSuccess(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "center",
      className: 'success-toast-clipMods',
    }).showToast();
  }

  static showError(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "center",
      className: "error-toast-clipMods",
    }).showToast();
  }

}
