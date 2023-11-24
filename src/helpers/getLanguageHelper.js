const getLanguageFromHeader = (header, changeMyToMm = true) => {
  let lang = 'en';

  if (header) {
    const acceptedLanguages = header.split(',');
    if (acceptedLanguages.length > 0) {
      lang = acceptedLanguages[0].trim().split('-')[0];
    }
  }

  if (changeMyToMm === true && lang === 'my') {
    lang = 'mm';
  } else if (changeMyToMm === false && lang === 'mm') {
    lang = 'my';
  }

  if (
    !lang ||
    (lang !== 'en' && lang !== 'mm' && lang !== 'zh' && lang !== 'my')
  ) {
    lang = 'en';
  }

  return lang;
};

module.exports = {
  getLanguageFromHeader,
};
