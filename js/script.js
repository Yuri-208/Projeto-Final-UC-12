// Suporte a vários carrosséis na mesma página
function initCarousel(carousel) {
    const slides = carousel.querySelectorAll('.slide');
    const dots = carousel.querySelectorAll('.dot');
    const btnNext = carousel.querySelector('.next');
    const btnPrev = carousel.querySelector('.prev');

    if (!slides.length) return;

    let current = 0;
    let intervalId = null;

    function showSlide(index) {
        const safeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide) => slide.classList.remove('active'));
        dots.forEach((dot) => dot.classList.remove('active'));

        slides[safeIndex].classList.add('active');
        if (dots[safeIndex]) {
            dots[safeIndex].classList.add('active');
        }

        current = safeIndex;
    }

    function nextSlide() {
        showSlide(current + 1);
    }

    function prevSlide() {
        showSlide(current - 1);
    }

    function resetInterval() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(nextSlide, 4000);
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });

    showSlide(0);
    resetInterval();
}

function setupCarousels() {
    document.querySelectorAll('.carousel').forEach(initCarousel);
}

// Simple buy button handler for all pages
document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.buy-btn');
    if(!btn) return;
    const name = btn.dataset.name || btn.getAttribute('data-name') || 'produto';
    alert('Adicionar ao carrinho: ' + name);
});

// Promoções pill -> scroll to promotions section
document.querySelectorAll('.promo-pill').forEach(pill => {
    pill.style.cursor = 'pointer';
    pill.addEventListener('click', (e) => {
        const target = document.querySelector('#promocoes');
        if(target){
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// Validacao do formulario de cadastro geral
const formulario = document.getElementById('formCadastro');
const cpf = document.getElementById('cpf');
const telefone = document.getElementById('telefone');

if (formulario && cpf && telefone) {
    cpf.addEventListener('input', () => {
        let valor = cpf.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        cpf.value = valor;
    });

    telefone.addEventListener('input', () => {
        let valor = telefone.value.replace(/\D/g, '');
        valor = valor.replace(/^(\d{2})(\d)/, '$1 $2');
        valor = valor.replace(/^(\d{2}) (\d{2})(\d)/, '$1 $2 $3');
        valor = valor.replace(/^(\d{2}) (\d{2}) (\d{4})(\d)/, '$1 $2 $3 $4');
        telefone.value = valor;
    });

    function validarCPF(valor) {
        valor = valor.replace(/\D/g, '');

        if (valor.length !== 11) return false;
        if (/^(\d)\1+$/.test(valor)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) {
            soma += parseInt(valor.substring(i - 1, i)) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(valor.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(valor.substring(i - 1, i)) * (12 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(valor.substring(10, 11))) return false;

        return true;
    }

    function validarTelefoneFixo(valor) {
        const regex = /^(\d{2}) (\d{2}) (\d{4}) (\d{4})$/;
        return regex.test(valor);
    }

    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validarCPF(cpf.value)) {
            alert('CPF inválido.');
            cpf.focus();
            return;
        }

        if (!validarTelefoneFixo(telefone.value)) {
            alert('Telefone inválido.\nUse o formato:\n55 11 9999 9999');
            telefone.focus();
            return;
        }

        alert('Cadastro realizado com sucesso!');
        formulario.reset();
    });
}

// Validacao do formulario de Fale Conosco
const formContato = document.getElementById('formContato');

if (formContato) {
    const campos = {
        nomeContato: { required: true, message: 'Preencha este campo.' },
        enderecoContato: { required: true, message: 'Preencha este campo.' },
        emailContato: { required: true, message: 'Preencha este campo.', email: true },
        telefoneContato: { required: true, message: 'Preencha este campo.', telefone: true },
        mensagemContato: { required: true, message: 'Preencha este campo.' }
    };

    const sucesso = document.createElement('div');
    sucesso.className = 'mensagem-sucesso';
    sucesso.textContent = 'Mensagem enviada com sucesso.';
    sucesso.hidden = true;
    formContato.appendChild(sucesso);

    function validarEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    }

    function mascararTelefoneContato(input) {
        const digits = input.value.replace(/\D/g, '').slice(0, 11);
        if (!digits) {
            input.value = '';
            return;
        }

        let valor = digits;
        if (valor.length <= 10) {
            valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        input.value = valor;
    }

    function validarTelefoneContato(telefone) {
        const numero = telefone.replace(/\D/g, '');
        return /^(\d{10}|\d{11})$/.test(numero) && numero.length >= 10;
    }

    function mostrarErro(input, mensagem) {
        input.classList.add('erro');

        let erro = input.parentElement.querySelector('.mensagem-erro');
        if (!erro) {
            erro = document.createElement('div');
            erro.className = 'mensagem-erro';
            erro.setAttribute('role', 'alert');
            input.parentElement.appendChild(erro);
        }

        erro.textContent = mensagem;
    }

    function limparErro(input) {
        input.classList.remove('erro');
        const erro = input.parentElement.querySelector('.mensagem-erro');
        if (erro) erro.remove();
    }

    function validarCampo(input, config) {
        const valor = input.value.trim();

        if (config.required && !valor) {
            mostrarErro(input, config.message);
            return false;
        }

        if (config.email && !validarEmail(valor)) {
            mostrarErro(input, 'Digite um e-mail válido, com "@" e domínio.');
            return false;
        }

        if (config.telefone && !validarTelefoneContato(valor)) {
            mostrarErro(input, 'Digite um telefone válido no formato (99) 99999-9999.');
            return false;
        }

        limparErro(input);
        return true;
    }

    Object.entries(campos).forEach(([campoName, config]) => {
        const input = formContato.querySelector(`[name="${campoName}"]`);
        if (!input) return;

        if (campoName === 'telefoneContato') {
            input.addEventListener('input', () => {
                mascararTelefoneContato(input);
                if (input.value.trim()) {
                    validarCampo(input, config);
                }
            });
            return;
        }

        input.addEventListener('input', () => {
            if (input.value.trim()) {
                validarCampo(input, config);
            }
        });
    });

    formContato.addEventListener('submit', (event) => {
        event.preventDefault();

        let valido = true;
        sucesso.hidden = true;

        Object.entries(campos).forEach(([campoName, config]) => {
            const input = formContato.querySelector(`[name="${campoName}"]`);
            if (!input) return;

            if (!validarCampo(input, config)) {
                valido = false;
            }
        });

        if (!valido) {
            return;
        }

        sucesso.hidden = false;
        formContato.reset();
    });
}

function preventMobileLineBreaks() {
    const navList = document.querySelector('nav ul');

    if (!navList) return;

    const applyRules = () => {
        const mobile = window.matchMedia('(max-width: 640px)').matches;

        navList.style.flexWrap = mobile ? 'nowrap' : '';
        navList.style.whiteSpace = mobile ? 'nowrap' : '';
        navList.style.overflowX = mobile ? 'auto' : '';
        navList.style.WebkitOverflowScrolling = mobile ? 'touch' : '';

        navList.querySelectorAll('a').forEach((link) => {
            link.style.whiteSpace = mobile ? 'nowrap' : '';
        });

        document.querySelectorAll('.promo-pill, .feature-card h3, .product-card h4, .access-card').forEach((item) => {
            if (!item) return;
            item.style.whiteSpace = mobile ? 'nowrap' : '';
        });
    };

    applyRules();
    window.addEventListener('resize', applyRules);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupCarousels();
        preventMobileLineBreaks();
    });
} else {
    setupCarousels();
    preventMobileLineBreaks();
}