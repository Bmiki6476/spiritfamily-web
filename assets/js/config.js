/* Nastavenia webu Spirit Family */
window.SF_CONFIG = {
  // Adresa Google Apps Script web aplikácie (postup v NAVOD.md, časť A).
  // Kým je prázdna, web beží v ukážkovom režime z data/akcie.json a data/novinky.json.
  API_URL: 'https://script.google.com/macros/s/AKfycbyDsLbxlkW6W8Apq6QCfx36QYcPm5KqYcEC2OmhtpqC5iA0AIUddIj87dGg40tVzdbj1A/exec',

  // true = kým nie je API_URL, rezervácia sa odošle e-mailom na adresu nižšie (web funguje aj bez Googlu)
  REZERVACIA_MAILOM: true,

  TELEFON: '0914 365 920',
  EMAIL: 'miroslav.balaj@spiritfamily.sk',
  FACEBOOK: 'https://www.facebook.com/Spirit.Family.Trencin',
  INSTAGRAM: 'https://instagram.com/spirit_family_tn',
  YOUTUBE: 'https://www.youtube.com/channel/UCdaCXXBIjzJ_YnHXy_MoJWQ',

  // Najviac miest na jednu rezerváciu (musí sedieť s MAX_OSOB_NA_REZERVACIU v backend/Code.gs)
  MAX_OSOB: 6,

  // Online degustácia: vzorky treba objednať aspoň toľko dní vopred (musí sedieť s Code.gs)
  ONLINE_UZAVIERKA_DNI: 5,

  // Online degustácia: doprava vzoriek cez Packetu (€ za balíček, pripočíta sa k cene akcie)
  ONLINE_DOPRAVA: 3,

  // Súkromná degustácia (sekcia Súkromné akcie)
  SUKROMNA_CENA: '120 € pre 4 osoby',

  // Degustácia u vás (degustacia-u-vas.html) – len na zobrazenie, platná cena sa ráta v Code.gs (NASTAVENIA.OSLAVA), musí sedieť
  OSLAVA: {
    CENA_VLASTNE_FLASE: 169,
    CENA_OSOBA: 29,
    VZORKY: 7,
    ML: 25,
    ZADARMO_KM: 30,
    CENA_KM: 0.4,
    LEN_NAD_LIMIT: false,
    TAM_A_SPAT: false,
    MIN_OSOB: 1,
    MAX_OSOB: 80,
    MIN_DNI_VOPRED: 2
  }
};
