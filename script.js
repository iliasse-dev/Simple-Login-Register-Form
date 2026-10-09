// ---------- small helpers ----------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

const toast = $('#toast');
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setError(input, hasError) {
  input.closest('.input-wrap').classList.toggle('error', hasError);
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ---------- tabs ----------
const tabsBox = $('#tabs');

$$('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;

    $$('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    tabsBox.classList.toggle('register', target === 'register');

    $$('form').forEach((f) => f.classList.remove('show'));
    $('#' + target).classList.add('show');
  });
});

// ---------- show / hide password ----------
$$('.eye').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const icon = btn.querySelector('i');
    const hidden = input.type === 'password';

    input.type = hidden ? 'text' : 'password';
    icon.className = hidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
  });
});

// ---------- password strength ----------
const passInput = $('#regPass');
const bars = $$('#bars span');
const label = $('#strengthLabel');
const ruleItems = $$('#rules li');

const levels = [
  { text: '-',      color: '#e6e9f1' },
  { text: 'Weak',   color: '#e5484d' },
  { text: 'Fair',   color: '#f0a020' },
  { text: 'Good',   color: '#5b8def' },
  { text: 'Strong', color: '#1fa971' }
];

function checkPassword(pw) {
  return {
    length:  pw.length >= 8,
    letter:  /[A-Za-z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  };
}

function updateStrength() {
  const pw = passInput.value;
  const result = checkPassword(pw);
  let score = Object.values(result).filter(Boolean).length;

  // nothing typed = no score
  if (pw.length === 0) score = 0;

  // update checklist
  ruleItems.forEach((li) => {
    const passed = result[li.dataset.rule];
    li.classList.toggle('ok', passed);
    li.querySelector('i').className = passed
      ? 'fa-solid fa-circle-check'
      : 'fa-regular fa-circle';
  });

  // update bars
  bars.forEach((bar, i) => {
    bar.style.background = i < score ? levels[score].color : levels[0].color;
  });

  label.textContent = levels[score].text;
  label.style.color = score ? levels[score].color : '';
}

passInput.addEventListener('input', () => {
  updateStrength();
  setError(passInput, false);
});

// ---------- login submit ----------
$('#login').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = $('#loginEmail');
  const pass = $('#loginPass');

  const emailBad = !emailOk(email.value.trim());
  const passBad = pass.value === '';

  setError(email, emailBad);
  setError(pass, passBad);

  if (emailBad || passBad) return;

  // TODO: send the data to your server here
  showToast('Signed in successfully!');
});

// ---------- register submit ----------
$('#register').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = $('#regName');
  const email = $('#regEmail');
  const confirm = $('#regConfirm');

  const nameBad = name.value.trim().length < 2;
  const emailBad = !emailOk(email.value.trim());
  const passBad = !Object.values(checkPassword(passInput.value)).every(Boolean);
  const confirmBad = confirm.value !== passInput.value || confirm.value === '';

  setError(name, nameBad);
  setError(email, emailBad);
  setError(passInput, passBad);
  setError(confirm, confirmBad);

  const terms = $('#regTerms');
  const termsBad = !terms.checked;
  $('#termsBox').classList.toggle('error', termsBad);

  if (nameBad || emailBad || passBad || confirmBad || termsBad) return;

  // TODO: send the data to your server here
  showToast('Account created. Welcome aboard!');
});

// remove red border while typing
$$('.input-wrap input').forEach((inp) => {
  inp.addEventListener('input', () => setError(inp, false));
});

// hide the terms error once the box is checked
$('#regTerms').addEventListener('change', () => {
  $('#termsBox').classList.remove('error');
});

// ---------- social buttons ----------
$$('.social button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('aria-label');
    showToast(name + ' login is not connected yet');
  });
});

// ---------- about modal ----------
const overlay = $('#aboutOverlay');

$('#openAbout').addEventListener('click', () => overlay.classList.add('open'));
$('#closeAbout').addEventListener('click', () => overlay.classList.remove('open'));

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') overlay.classList.remove('open');
});