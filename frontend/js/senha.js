document.addEventListener('DOMContentLoaded', function() {
  const etapa1 = document.getElementById('recuperar-senha');
  const etapa2 = document.getElementById('verifica-codigo');
  const etapa3 = document.getElementById('digite');
  const formRecuperar = document.getElementById('form-recuperar');
  const formVerifica = document.getElementById('form-verifica');
  const formNova = document.getElementById('form-nova-senha');
  const mensagem = document.getElementById('mensagem');
  const mensagemCodigo = document.getElementById('mensagem-codigo');
  const mensagemNova = document.getElementById('mensagem-nova-senha');

  function hideAll() {
    etapa1?.classList.add('hidden');
    etapa2?.classList.add('hidden');
    etapa3?.classList.add('hidden');
  }

  if (formRecuperar) {
    formRecuperar.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = formRecuperar.email.value;
      mensagem.textContent = 'Enviamos um código para ' + email;
      etapa1.classList.add('hidden');
      etapa2.classList.remove('hidden');
    });
  }

  if (formVerifica) {
    formVerifica.addEventListener('submit', function(e) {
      e.preventDefault();
      const codigo = formVerifica.codigo.value.trim();
      if (codigo === '' || codigo.length < 3) {
        mensagemCodigo.textContent = 'Código inválido';
        return;
      }
      mensagemCodigo.textContent = '';
      etapa2.classList.add('hidden');
      etapa3.classList.remove('hidden');
    });
  }

  if (formNova) {
    formNova.addEventListener('submit', function(e) {
      e.preventDefault();
      const nova = formNova['nova-senha'].value;
      mensagemNova.textContent = 'Senha alterada com sucesso! Redirecionando para tela inicial...';
      setTimeout(() => {
        window.location.href = '/frontend/pages/inicial.html';
      }, 2000);
    });
  }
});
