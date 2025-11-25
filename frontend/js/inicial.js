// ========== ESTADO DA APLICAÇÃO ==========
const appState = {
  cart: [],
  user: null,
  filters: {
    category: 'all',
    searchTerm: ''
  }
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  atualizarCarrinho();
});

// ========== SETUP DE EVENT LISTENERS ==========
function setupEventListeners() {
  // Botões de compra
  const botoesComprar = document.querySelectorAll('.btn-comprar');
  botoesComprar.forEach((btn) => {
    btn.addEventListener('click', (e) => adicionarAoCarrinho(e));
  });

  // Navegação de categorias
  const linksCategorias = document.querySelectorAll('.categorias-nav a');
  linksCategorias.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const categoria = link.getAttribute('href');
      scrollParaCategoria(categoria);
    });
  });

  // Botão de carrinho
  const botaoCarrinho = document.querySelector('.carrinho');
  if (botaoCarrinho) {
    botaoCarrinho.addEventListener('click', abrirCarrinho);
  }

  // Botão de logout
  const botaoSair = document.querySelector('.exit');
  if (botaoSair) {
    botaoSair.addEventListener('click', fazerLogout);
  }
}

// ========== CARRINHO ==========
function adicionarAoCarrinho(event) {
  const botao = event.target;
  const produto = botao.closest('.produto');
  
  if (!produto) return;

  const nome = produto.querySelector('h3').textContent;
  const preco = produto.querySelector('.preco').textContent;
  const imagem = produto.querySelector('img').src;

  const itemCarrinho = {
    id: Date.now(),
    nome: nome,
    preco: preco,
    imagem: imagem,
    quantidade: 1,
    dataAdicionado: new Date().toLocaleString('pt-BR')
  };

  // Verificar se já existe no carrinho
  const itemExistente = appState.cart.find(item => item.nome === nome);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    appState.cart.push(itemCarrinho);
  }

  mostrarNotificacao(`${nome} adicionado ao carrinho!`, 'success');
  atualizarCarrinho();
  salvarCarrinho();
}

function atualizarCarrinho() {
  const botaoCarrinho = document.querySelector('.carrinho');
  const totalItens = appState.cart.length;
  
  if (botaoCarrinho && totalItens > 0) {
    let badge = botaoCarrinho.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      botaoCarrinho.appendChild(badge);
    }
    badge.textContent = totalItens;
  }
}

function abrirCarrinho() {
  const modal = document.createElement('div');
  modal.id = 'modal-carrinho';
  modal.className = 'modal';
  modal.innerHTML = `
    <div id="modal-content" class="modal-content" style="max-width: 600px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2><i class="fas fa-shopping-cart"></i> Meu Carrinho</h2>
        <button class="btn-fechar" onclick="fecharModal('modal-carrinho')" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>

      <div id="conteudo-carrinho" style="background: no-repeat;">
        ${appState.cart.length === 0 
          ? '<p style="text-align: center; color: #999;">Seu carrinho está vazio</p>' 
          : gerarHTMLCarrinho()}
      </div>

      ${appState.cart.length > 0 ? `
        <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 15px;">
            <span>Total:</span>
            <span>R$ ${calcularTotalCarrinho().toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="btn btn-primary" style="width: 100%; padding: 12px;" onclick="finalizarCompra()">
            <i class="fas fa-check"></i> Finalizar Compra
          </button>
        </div>
      ` : ''}
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Adicionar animação de entrada
  const modalContent = modal.querySelector('#modal-content');
  modalContent.classList.add('slideIn');

  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      fecharModal('modal-carrinho');
    }
  });



  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      fecharModal('modal-carrinho');
    }
  });
}

function gerarHTMLCarrinho() {
  return appState.cart.map((item, index) => `
    <div style="display: flex; gap: 15px; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 6px;">
      <img src="${item.imagem}" alt="${item.nome}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
      <div style="flex: 1;">
        <strong>${item.nome}</strong>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">Adicionado: ${item.dataAdicionado}</p>
        <p style="font-weight: bold; color: #27ae60;">${item.preco}</p>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 5px; align-items: center;">
          <button class="btn-qty" onclick="alterarQuantidade(${index}, -1)" style="width: 25px; height: 25px; padding: 0;">−</button>
          <span style="min-width: 30px; text-align: center;">${item.quantidade}</span>
          <button class="btn-qty" onclick="alterarQuantidade(${index}, 1)" style="width: 25px; height: 25px; padding: 0;">+</button>
        </div>
        <button class="btn-remover" onclick="removerDoCarrinho(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
          <i class="fas fa-trash"></i> Remover
        </button>
      </div>
    </div>
  `).join('');
}

function alterarQuantidade(index, delta) {
  if (index >= 0 && index < appState.cart.length) {
    appState.cart[index].quantidade += delta;
    if (appState.cart[index].quantidade <= 0) {
      removerDoCarrinho(index);
    } else {
      salvarCarrinho();
      abrirCarrinho(); // Reabrir para atualizar
    }
  }
}

function removerDoCarrinho(index) {
  if (index >= 0 && index < appState.cart.length) {
    const item = appState.cart[index];
    appState.cart.splice(index, 1);
    mostrarNotificacao(`${item.nome} removido do carrinho`, 'info');
    salvarCarrinho();
    atualizarCarrinho();
    
    const modal = document.getElementById('modal-carrinho');
    if (modal) abrirCarrinho(); // Reabrir para atualizar
  }
}

function calcularTotalCarrinho() {
  return appState.cart.reduce((total, item) => {
    const preco = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
    return total + (preco * item.quantidade);
  }, 0);
}

function salvarCarrinho() {
  localStorage.setItem('carrinho_loja', JSON.stringify(appState.cart));
}

function carregarCarrinho() {
  const carrinho = localStorage.getItem('carrinho_loja');
  if (carrinho) {
    appState.cart = JSON.parse(carrinho);
    atualizarCarrinho();
  }
}

function finalizarCompra() {
  if (appState.cart.length === 0) {
    mostrarNotificacao('Carrinho vazio!', 'warning');
    return;
  }

  mostrarNotificacao('Redirecionando para checkout...', 'info');
  setTimeout(() => {
    // Aqui você pode redirecionar para página de pagamento/checkout
    fecharModal('modal-carrinho');
    window.location.href = '/frontend/pages/caixa.html';
  }, 1500);
}

// ========== MODAL ==========
function fecharModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    const modalContent = modal.querySelector('#modal-content');
    if (modalContent) {
      modalContent.classList.remove('slideIn');
      modalContent.classList.add('slideOut');
      setTimeout(() => {
        modal.style.display = 'none';
        modal.remove();
      }, 300);
    } else {
      modal.style.display = 'none';
      modal.remove();
    }
  }
}

// ========== NOTIFICAÇÕES ==========
function mostrarNotificacao(mensagem, tipo = 'info') {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.textContent = mensagem;
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 6px;
    background: ${tipo === 'success' ? '#27ae60' : tipo === 'error' ? '#e74c3c' : tipo === 'warning' ? '#f39c12' : '#3498db'};
    color: white;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}

// ========== NAVEGAÇÃO ==========
function scrollParaCategoria(selector) {
  const elemento = document.querySelector(selector);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========== LOGOUT ==========
function fazerLogout() {
  if (confirm('Deseja realmente sair?')) {
    localStorage.removeItem('usuario_logado');
    localStorage.removeItem('carrinho_loja');
    window.location.href = '/frontend/pages/login.html';
  }
}

// ========== CARREGAR DADOS INICIAIS ==========
carregarCarrinho();