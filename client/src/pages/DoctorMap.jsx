import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useSearchParams } from 'react-router-dom';

const SPECIALITY_QUERIES = {
  respiratory:    'pulmonologist',
  cardiac:        'cardiologist',
  neurological:   'neurologist',
  metabolic:      'endocrinologist diabetologist',
  oncological:    'oncologist',
  musculoskeletal:'orthopedic surgeon',
};

export default function DoctorMap() {
  const mapRef      = useRef(null);
  const [doctors, setDoctors]       = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [speciality, setSpeciality] = useState('general physician');

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      libraries: ['places']
    });

    loader.load().then(google => {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const map = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 13,
          styles: [{ featureType:'poi.medical', elementType:'geometry', stylers:[{ color:'#e8f4f8' }] }]
        });

        // User location marker
        new google.maps.Marker({
          position: { lat, lng },
          map,
          icon: { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor:'#3b82f6', fillOpacity:1, strokeColor:'white', strokeWeight:2 },
          title: 'You are here'
        });

        // Places search
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: { lat, lng },
          radius: 5000,
          keyword: speciality,
          type: 'doctor'
        }, (results, status) => {
          setLoading(false);
          if (status !== google.maps.places.PlacesServiceStatus.OK) return;

          const infoWindow = new google.maps.InfoWindow();
          const found = results.slice(0, 10).map(place => {
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
              icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
            });
            marker.addListener('click', () => {
              setSelected(place);
              infoWindow.setContent(`
                <div style="padding:8px;max-width:200px">
                  <strong>${place.name}</strong><br/>
                  <small>${place.vicinity}</small><br/>
                  <small>⭐ ${place.rating || 'N/A'} · ${place.opening_hours?.isOpen?.() ? '🟢 Open' : '🔴 Closed'}</small>
                </div>
              `);
              infoWindow.open(map, marker);
            });
            return place;
          });
          setDoctors(found);
        });
      }, () => setLoading(false));
    });
  }, [speciality]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Nearby Doctors</h1>
      <p className="text-gray-500 mb-6">Based on your diagnosis, find the right specialist near you</p>

      {/* Speciality Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['general physician', ...Object.values(SPECIALITY_QUERIES)].map(s => (
          <button key={s}
            onClick={() => setSpeciality(s)}
            className={`px-3 py-1.5 rounded-full text-sm capitalize border transition ${
              speciality === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-blue-400'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div className="col-span-2">
          <div ref={mapRef} className="w-full h-96 rounded-2xl bg-gray-100 overflow-hidden">
            {loading && (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading map...
              </div>
            )}
          </div>
        </div>

        {/* Doctor List */}
        <div className="space-y-3 overflow-y-auto max-h-96">
          {doctors.length === 0 && !loading && (
            <p className="text-gray-400 text-sm text-center pt-8">No results found nearby</p>
          )}
          {doctors.map((doc, i) => (
            <div key={i}
              onClick={() => setSelected(doc)}
              className={`bg-white rounded-xl border p-3 cursor-pointer transition ${
                selected?.place_id === doc.place_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-blue-300'
              }`}>
              <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{doc.vicinity}</p>
              <div className="flex items-center gap-2 mt-1">
                {doc.rating && <span className="text-xs text-amber-600">⭐ {doc.rating}</span>}
                {doc.opening_hours && (
                  <span className={`text-xs ${doc.opening_hours.isOpen?.() ? 'text-green-600' : 'text-red-500'}`}>
                    {doc.opening_hours.isOpen?.() ? '● Open' : '● Closed'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}