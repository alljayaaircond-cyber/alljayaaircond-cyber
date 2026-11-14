// Vercel Serverless Function: mengambil rating & ulasan dari Google Maps.
// Butuh 2 Environment Variable di Vercel:
//   GOOGLE_MAPS_API_KEY  -> API key (aktifkan "Places API (New)")
//   GOOGLE_PLACE_ID      -> Place ID bisnis Anda
// Jika belum diisi, website tetap jalan dan hanya menampilkan tombol ke Google Maps.
module.exports = async function handler(req, res) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    res.status(204).end();
    return;
  }
  try {
    const url = "https://places.googleapis.com/v1/places/" + encodeURIComponent(placeId) + "?languageCode=id";
    const r = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri"
      }
    });
    if (!r.ok) { res.status(204).end(); return; }
    const d = await r.json();
    const reviews = (d.reviews || []).map(function (v) {
      return {
        author: v.authorAttribution && v.authorAttribution.displayName || "Pelanggan",
        photo: v.authorAttribution && v.authorAttribution.photoUri || "",
        url: v.authorAttribution && v.authorAttribution.uri || "",
        rating: v.rating || 5,
        time: v.relativePublishTimeDescription || "",
        text: (v.text && v.text.text) || (v.originalText && v.originalText.text) || ""
      };
    });
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({
      rating: d.rating || null,
      count: d.userRatingCount || 0,
      mapsUri: d.googleMapsUri || "",
      reviews: reviews
    });
  } catch (e) {
    res.status(204).end();
  }
};
