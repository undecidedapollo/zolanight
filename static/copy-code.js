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

  // Inline `code` spans: clicking anywhere in the box copies the text.
  // Selecting text by hand is preserved -- if there's an active selection
  // inside the element, the click is treated as a selection, not a copy.
  function attachInline(code) {
    if (code.dataset.inlineCopy) return;
    if (code.closest('pre')) return; // block code is handled by attach()
    code.dataset.inlineCopy = '1';
    code.classList.add('inline-copy');
    code.setAttribute('title', 'Click to copy');

    code.addEventListener('click', async () => {
      const sel = window.getSelection();
      if (
        sel &&
        !sel.isCollapsed &&
        sel.toString().trim() !== '' &&
        sel.anchorNode &&
        code.contains(sel.anchorNode)
      ) {
        return; // user is selecting part of the text -- leave them be
      }
      try {
        await navigator.clipboard.writeText(code.textContent.trim());
        code.classList.add('inline-copy--done');
        setTimeout(() => code.classList.remove('inline-copy--done'), 1500);
      } catch (err) {
        /* clipboard unavailable -- nothing to do */
      }
    });
  }

  function init() {
    document.querySelectorAll('pre').forEach(attach);
    document.querySelectorAll('code').forEach(attachInline);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
