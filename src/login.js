
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // In a real application, you'd have actual authentication logic here.
  // For now, we'll just redirect to the main page.
  window.location.href = '/main.html';
});
