
document.addEventListener('DOMContentLoaded', function () {
  const cadastroSection = document.getElementById('cadastro-section');
  const loginSection = document.getElementById('login-section');
  const showLoginLink = document.getElementById('show-login');
  const showCadastroLink = document.getElementById('show-cadastro');

  if (showLoginLink && cadastroSection && loginSection) {
    showLoginLink.addEventListener('click', function (e) {
      e.preventDefault();
      cadastroSection.classList.add('hidden');
      loginSection.classList.remove('hidden');
    });
  }

  if (showCadastroLink && cadastroSection && loginSection) {
    showCadastroLink.addEventListener('click', function (e) {
      e.preventDefault();
      loginSection.classList.add('hidden');
      cadastroSection.classList.remove('hidden');
    });
  }

  const cadastroForm = document.getElementById('cadastro-form');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Login feito com sucesso! Redirecionando para página inicial...');
      setTimeout(() => {
        window.location.href = '/frontend/pages/inicial.html';
      }, 1000);
    })
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Login feito com sucesso! Redirecionando para página inicial...');
      setTimeout(() => {
        window.location.href = '/frontend/pages/inicial.html';
      }, 1000);
    });
  }
});
