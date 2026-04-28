import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function XRayUpload() {
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files[0] || e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const analyze = async () => {
    if (!file) return toast.error('Please upload a file first');
    setLoading(true);

    const steps = ['Preprocessing image...', 'Running CNN analysis...', 'Generating report...'];
    for (const s of steps) {
      setProgress(s);
      await new Promise(r => setTimeout(r, 800));
    }

    const fd = new FormData();
    fd.append('xray', file);

    try {
      const { data } = await api.post('/xray/analyze', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Analysis complete!');
      navigate(`/report/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload X-Ray / Scan</h1>
      <p className="text-gray-500 mb-8">Upload a chest X-ray, CT scan or MRI image for AI analysis</p>

      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
        }`}>
        {preview ? (
          <div>
            <img src={preview} alt="X-ray preview" className="max-h-64 mx-auto rounded-lg object-contain mb-4" />
            <p className="text-sm text-gray-500">{file.name}</p>
          </div>
        ) : (
          <>
            <Image className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600 font-medium mb-1">Drag & drop your X-ray here</p>
            <p className="text-gray-400 text-sm mb-4">JPEG, PNG or DICOM up to 10MB</p>
          </>
        )}
        <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition inline-block mt-2">
          {preview ? 'Change File' : 'Browse File'}
          <input type="file" accept=".jpg,.jpeg,.png,.dcm" className="hidden" onChange={onDrop} />
        </label>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-amber-800">
          Our AI analyzes your image alongside your health profile for accurate predictions.
          Results are AI-assisted and should always be reviewed by a qualified doctor.
        </p>
      </div>

      {loading && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-blue-700 font-medium">{progress}</p>
        </div>
      )}

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">
        {loading ? 'Analyzing...' : '🔬 Analyze with AI'}
      </button>
    </div>
  );
}