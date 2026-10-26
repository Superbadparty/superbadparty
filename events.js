/* =========================================================
   SUPERBAD — events.js
   Όλα τα στοιχεία του site αλλάζουν ΜΟΝΟ από εδώ.

   NEXT_EVENT  → το επόμενο πάρτυ (αφίσα στην πρώτη οθόνη + στοιχεία).
   PAST_EVENTS → τα προηγούμενα πάρτυ (επιλογή + φωτογραφίες).

   ΑΦΙΣΑ: βάλε το αρχείο στο posters/ και γράψε το όνομα στο poster,
          π.χ. poster: "posters/superbad-oct.jpg". Άδειο = προσωρινή κάρτα.
          Μόνο πεζά γράμματα, χωρίς κενά (το GitHub ξεχωρίζει .JPG από .jpg).
   ΦΩΤΟΓΡΑΦΙΕΣ: photos/<folder>/01.jpg, 02.jpg, ... και photoCount = πόσες.
                Τα μικρά αντίγραφα μπαίνουν στο photos/<folder>/thumbs/
                με το ίδιο όνομα (αν λείπουν, χρησιμοποιείται η μεγάλη).
                Πιο εύκολα: βάλε τις φωτογραφίες όπως είναι στο
                photos/<folder>/originals/ και τρέξε το prepare-photos.bat.
   ΠΑΡΤΥ ΠΟΥ ΤΕΛΕΙΩΣΕ: αντέγραψε τα στοιχεία του NEXT_EVENT σε ένα νέο
                κομμάτι στο τέλος του PAST_EVENTS και άλλαξε το NEXT_EVENT.
   ========================================================= */

// Τα social του πάρτυ (μόνο το username, χωρίς @)
const SOCIALS = {
  instagram: "superbad_party",
  tiktok:    "superbad_party",
};

// Στατιστικά επισκεπτών (GoatCounter). Γράψε εδώ το όνομα του λογαριασμού σου,
// π.χ. "superbad" αν η σελίδα σου είναι superbad.goatcounter.com. Άδειο = κλειστό.
const GOATCOUNTER = "";

const NEXT_EVENT = {
  name:     "SUPERBAD",
  tagline:  "White Girl R&B / Greek Pop",
  poster:   "posters/superbad-31-10.jpg",         // η αφίσα: posters/superbad-31-10.jpg (ή .png)
  date:     "Σάββατο 31 Οκτωβρίου",
  iso:      "2026-10-31T22:00:00+02:00",           // για την αντίστροφη μέτρηση (+02:00 = χειμερινή ώρα)
  time:     "22:00",
  venue:    "Cactaki Bar",
  venueUrl: "https://share.google/RUbZUh9iNaPDpjkAY",
  address:  "Χαλάνδρι",                            // βάλε την ακριβή διεύθυνση αν θες
  onDeck:   ["Tiz", "Frunk"],
  sponsor:  "Moloko",
  entry:    "",                                    // π.χ. "10€" — άδειο = δεν εμφανίζεται η γραμμή «Είσοδος»
};

const PAST_EVENTS = [
  {
    folder:     "first-party",
    slug:       "first-party",
    label:      "First Party",
    name:       "PARA PERA — First Party",
    date:       "18 April 2026",
    time:       "22:00",
    lineup:     "Tiz × Spaz",
    guest:      "Frunk",
    sponsor:    "Moloko",
    photoCount: 12,
    photoExt:   "jpg",
  },
  {
    folder:     "second-party",
    slug:       "second-party",
    label:      "Second Party",
    name:       "PARA PERA — Second Party",
    date:       "11 July 2026",
    time:       "23:00",
    venue:      "Dunk Bar",
    venueUrl:   "https://maps.app.goo.gl/1PA3sMuLdSoFbnFW6",
    address:    "Πανόρμου & Αλέξη Παύλη 13Β",
    lineup:     "Spaz · Frunk · Staz",
    sponsor:    "Moloko",
    photoCount: 8,
    photoExt:   "jpg",
  },
  {
    folder:     "third-party",
    slug:       "third-party",
    label:      "Third Party",
    name:       "SUPERBAD — Third Party",
    date:       "17 October 2026",
    time:       "00:00",
    venue:      "Dunk Bar",
    venueUrl:   "https://maps.app.goo.gl/1PA3sMuLdSoFbnFW6",
    address:    "Αλέξη Παύλη 37, Αθήνα 11524",
    lineup:     "Tiz × Frunk",
    sponsor:    "Moloko",
    poster:     "posters/superbad.jpg",
    photoCount: 20,                                   // γράψε πόσες φωτογραφίες ανέβασες (το λέει το prepare-photos.bat)
    photoExt:   "jpg",
  },
];

/**
 * Επιστρέφει τα URLs των φωτογραφιών ενός event.
 * Υποστηρίζει είτε αυτόματη αρίθμηση (01.jpg / 01.jpeg)
 * είτε συγκεκριμένη λίστα αρχείων στο event.photos.
 */
function getPhotoUrls(event) {
  if (!event) return [];

  if (Array.isArray(event.photos) && event.photos.length > 0) {
    return event.photos.map(p => {
      if (p.startsWith('photos/') || p.startsWith('http')) return p;
      return `photos/${event.folder}/${p}`;
    });
  }

  const urls = [];
  const count = event.photoCount || 0;
  const ext = (event.photoExt || "jpg").replace(/^\./, '').trim();

  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(2, "0");
    urls.push(`photos/${event.folder}/${num}.${ext}`);
  }
  return urls;
}

/** Τα μικρά αντίγραφα (photos/<folder>/thumbs/...) για γρήγορο φόρτωμα. */
function getThumbUrls(event) {
  return getPhotoUrls(event).map(u => u.replace(/\/([^\/]+)$/, '/thumbs/$1'));
}

function getEventBySlug(slug) {
  return PAST_EVENTS.find(e => e.slug === slug);
}

/* Στατιστικά: φορτώνει το GoatCounter μόνο αν έχει συμπληρωθεί και μόνο στο κανονικό site (όχι τοπικά). */
if (typeof GOATCOUNTER !== 'undefined' && GOATCOUNTER && !/^(localhost|127\.0\.0\.1|)$/.test(location.hostname)) {
  const gc = document.createElement('script');
  gc.async = true;
  gc.src = 'https://gc.zgo.at/count.js';
  gc.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`;
  document.head.appendChild(gc);
}
