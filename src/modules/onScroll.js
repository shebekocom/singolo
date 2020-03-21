import { SECTIONS, LINKS } from './domElemets';

const onScroll = () => {
  const curPos = window.scrollY;
  SECTIONS.forEach(el => {
    if (el.offsetTop - 95 <= curPos && el.offsetTop + el.offsetHeight > curPos) {
      LINKS.forEach(a => {
        a.classList.remove('navigation__link--active');
        if (el.getAttribute('id') === a.getAttribute('href').substring(1)) {
          a.classList.add('navigation__link--active');
        }
      });
    }
  });
};

export default onScroll;
