import { useEffect, useRef, useState } from 'react';

const SPECIALISTS = [
  { name: 'Pulmonologist', query: 'pulmonologist near me' },
  { name: 'Chest Physician', query: 'chest physician near me' },
  { name: 'Respiratory Clinic', query: 'respiratory clinic near me' },
  { name: 'TB Specialist', query: 'tuberculosis specialist near me' },
];

export default function DoctorMap() {
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(SPECIALISTS[0]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!window.google) {
      setStatus('Map loading...');
      return;
    }
    if (!navigator.geolocation) { setStatus('Geolocation not supported.'); return; }

    navigator.geolocation.getCurrentPosition((pos) => {
      const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const map = new window.google.maps.Map(mapRef.current, { center, zoom: 13, mapTypeControl: false });
      const service = new window.google.maps.places.PlacesService(map);

      service.nearbySearch({ location: center, radius: 5000, keyword: selected.query }, (results, status) => {
        if (status !== 'OK') { setStatus('No results found nearby.'); return; }
        setStatus(`Found ${results.length} ${selected.name}(s) nearby`);
        results.forEach(place => {
          new window.google.maps.Marker({ position: place.geometry.location, map, title: place.name });
        });
      });
    }, () => setStatus('Could not get your location.'));
  }, [selected]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)', marginBottom: '0.5rem' }}>Find Nearby Specialists</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>Locate respiratory specialists and clinics near your current location.</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {SPECIALISTS.map(s => (
          <button key={s.name} onClick={() => setSelected(s)} style={{
            padding: '8px 18px', borderRadius: '20px', border: '1.5px solid', cursor: 'pointer',
            fontWeight: '500', fontSize: '13px',
            background: selected.name === s.name ? 'var(--primary)' : 'white',
            borderColor: selected.name === s.name ? 'var(--primary)' : 'var(--border)',
            color: selected.name === s.name ? 'white' : 'var(--text-dark)',
          }}>{s.name}</button>
        ))}
      </div>

      {status && <div style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--primary-dark)', marginBottom: '1rem' }}>{status}</div>}

      <div ref={mapRef} style={{ width: '100%', height: '460px', borderRadius: '14px', border: '1px solid var(--border)', background: '#e5e5e5' }}>
        {!window.google && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '14px', flexDirection: 'column', gap: '8px' }}>
            <div>🗺️</div>
            <div>Add your Google Maps API key to <code>index.html</code> to enable the map.</div>
          </div>
        )}
      </div>

      <p style={{ marginTop: '1rem', fontSize: '12px', color: 'var(--text-muted)' }}>
        Add to <code>index.html</code>: <code>&lt;script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places"&gt;&lt;/script&gt;</code>
      </p>
    </div>
  );
}