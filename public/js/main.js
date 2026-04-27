document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.fake-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); //Comment out to test form submission
      alert('Just for test');
    });
  });
});