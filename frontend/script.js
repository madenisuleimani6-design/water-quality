const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const showRegisterButton = document.getElementById('show-register');
const showLoginButton = document.getElementById('show-login');
const messageBox = document.getElementById('message-box');

function showForm(type) {
  const isRegister = type === 'register';
  registerForm.classList.toggle('active', isRegister);
  loginForm.classList.toggle('active', !isRegister);
  showRegisterButton.classList.toggle('active', isRegister);
  showLoginButton.classList.toggle('active', !isRegister);
  setMessage('', '');
}

function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = 'message-box';
  if (type === 'success') {
    messageBox.classList.add('success');
  } else if (type === 'error') {
    messageBox.classList.add('error');
  }
}

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

async function submitForm(url, payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!result.success) {
      setMessage(result.message || 'An error occurred.', 'error');
      return null;
    }

    setMessage(result.message || 'Success!', 'success');
    return result.user || null;
  } catch (error) {
    setMessage('Unable to connect to the server.', 'error');
    return null;
  }
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fullName = event.target.fullName.value.trim();
  const email = event.target.email.value.trim();
  const password = event.target.password.value;

  if (!fullName) {
    setMessage('Full name is required.', 'error');
    return;
  }
  if (!validateEmail(email)) {
    setMessage('Please enter a valid email address.', 'error');
    return;
  }
  if (!validatePassword(password)) {
    setMessage('Password must be at least 8 characters.', 'error');
    return;
  }

  const user = await submitForm('/api/register', { fullName, email, password });
  if (user) {
    registerForm.reset();
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = event.target.email.value.trim();
  const password = event.target.password.value;

  if (!validateEmail(email)) {
    setMessage('Please enter a valid email address.', 'error');
    return;
  }
  if (!validatePassword(password)) {
    setMessage('Password must be at least 8 characters.', 'error');
    return;
  }

  const user = await submitForm('/api/login', { email, password });
  if (user) {
    loginForm.reset();
  }
});

showRegisterButton.addEventListener('click', () => showForm('register'));
showLoginButton.addEventListener('click', () => showForm('login'));

showForm('register');
