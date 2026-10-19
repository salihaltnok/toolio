import { createElement } from "react";

/**
 * React.lazy benzeri, ama önceden yüklenebilen (preload) bir bileşen sarmalayıcı.
 *
 * Neden React.lazy değil?
 *  - Sayfa ilk açıldığında, prerender edilmiş HTML'in yerine React geçerken
 *    React.lazy en az bir kez "askıya alınır" ve içerik kısa süreliğine kaybolur.
 *  - Burada main.jsx, açılan sayfanın araç kodunu render'dan ÖNCE yükler
 *    (preload). Böylece ilk render'da bileşen hazırdır ve ekranda titreme olmaz.
 */
export function lazyTool(load) {
  let Component = null;
  let promise = null;
  let error = null;

  const preload = () => {
    if (!promise) {
      promise = load().then(
        (mod) => {
          Component = mod.default;
          return Component;
        },
        (err) => {
          error = err;
          throw err;
        },
      );
    }
    return promise;
  };

  function LazyTool(props) {
    if (Component) return createElement(Component, props);
    if (error) throw error;
    // Suspense, fırlatılan promise çözülene kadar fallback gösterir.
    throw preload();
  }

  LazyTool.preload = preload;
  return LazyTool;
}
