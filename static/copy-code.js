(function () {
  const COPY_SRC = '/icons/copy.svg';
  const CHECK_SRC = '/icons/check.svg';

  function extractCode(pre) {
    const clone = pre.cloneNode(true);
    clone.querySelectorAll('.giallo-ln').forEach(n => n.remove());
    return clone.textContent.replace(/\n+$/, '');
  }

  function attach(pre) {
    if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy code');

    const icon = document.createElement('img');
    icon.src = COPY_SRC;
    icon.alt = '';
    icon.width = 16;
    icon.height = 16;
    btn.appendChild(icon);

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(extractCode(pre));
        icon.src = CHECK_SRC;
        btn.classList.add('copy-btn--done');
        setTimeout(() => {
          icon.src = COPY_SRC;
          btn.classList.remove('copy-btn--done');
        }, 1500);
      } catch (err) {
        btn.setAttribute('aria-label', 'Copy failed');
      }
    });
    wrap.appendChild(btn);
  }

  function init() {
    document.querySelectorAll('pre').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
