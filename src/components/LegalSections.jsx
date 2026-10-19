/**
 * Gizlilik / Kullanım Şartları gibi uzun metin sayfalarını çeviri
 * dosyasındaki yapıdan çizer:
 *   [{ title, paragraphs: [], list: [], links: [{ label, href }] }]
 */
const LegalSections = ({ sections }) => {
  if (!Array.isArray(sections)) return null;
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <section key={index}>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {index + 1}. {section.title}
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-3">
            {(section.paragraphs || []).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {Array.isArray(section.list) && section.list.length > 0 && (
              <ul className="list-disc pl-6 space-y-2">
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {Array.isArray(section.links) && section.links.length > 0 && (
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-medium break-words"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default LegalSections;
