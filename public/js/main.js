document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.fake-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Just for test');
    });
  });
});