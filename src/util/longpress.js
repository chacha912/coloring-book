export function longpress(node) {
  let timer;
  let isClick = false;

  const handleMousedown = () => {
    isClick = true;
    timer = setInterval(() => {
      isClick = false;
      node.dispatchEvent(new CustomEvent('longpress'));
    }, 100);

    node.addEventListener('mouseup', handleMouseup);
    node.addEventListener('mouseleave', handleMouseup);
  };

  const handleMouseup = () => {
    if (isClick) {
      node.dispatchEvent(new CustomEvent('longpress'));
    }
    isClick = false;
    clearInterval(timer);
    node.removeEventListener('mouseup', handleMouseup);
    node.removeEventListener('mouseleave', handleMouseup);
  };

  node.addEventListener('mousedown', handleMousedown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
    },
  };
}
