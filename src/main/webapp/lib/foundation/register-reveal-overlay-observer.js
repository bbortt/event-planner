// @flow
export const registerRevealOverlayObserver = () => {
  const eventListener = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      let { target } = mutation;
      target = ((target: any): Element);
      if (target.className === 'reveal-overlay' && target.parentElement === document.body) {
        const body = document.body;
        const next = document.getElementById('__next');
        if (body && next) {
          body.removeChild(target);
          next.appendChild(target);
        }
      }
    }
  };

  const mutationObserver = new MutationObserver(eventListener);
  const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
  mutationObserver.observe(document, observerConfig);
};

export default registerRevealOverlayObserver;
