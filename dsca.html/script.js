document.addEventListener('DOMContentLoaded', () => {
  const passwordToggle = document.getElementById('toggle-eye');
  const passwordInput = document.getElementById('password');

  passwordToggle.addEventListener('click', () => {
    console.log('Eye icon clicked');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordToggle.classList.toggle('fa-eye-slash');
    passwordToggle.classList.toggle('fa-eye');
  });
});


