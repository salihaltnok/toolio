/**
 * Prerender (Node.js) sırasında tarayıcıya özel kütüphanelerin yerine geçen
 * boş modül. Bu fonksiyonlar prerender'da hiç çağrılmaz; sadece içe aktarma
 * (import) aşamasında hata oluşmasın diye vardır.
 */
const noop = () => null;
const Placeholder = () => null;

export default Placeholder;
export const renderAsync = noop;
export const toPng = noop;
export const toJpeg = noop;
export const toBlob = noop;
