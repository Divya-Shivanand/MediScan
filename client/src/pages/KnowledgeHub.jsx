import { useState, useEffect } from 'react';
import { ChevronRight, Heart, Search } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  respiratory: '🫁', cardiac: '❤️', neurological: '🧠',
  metabolic: '🩸', oncological: '🔬', musculoskeletal: '🦴'
};

export default function KnowledgeHub() {
  const [categories, setCategories]   = useState({});
  const [selected, setSelected]       = useState(null);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [posts, setPosts]             = useState([]);
  const [newPost, setNewPost]         = useState({ title:'', body:'' });
  const [view, setView]               = useState('diseases'); // 'diseases' | 'community'
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    api.get('/knowledge/categories').then(r => setCategories(r.data));
  }, []);

  const loadDisease = async (name) => {
    setLoading(true);
    setDiseaseInfo(null);
    try {
      const { data } = await api.get(`/knowledge/disease/${encodeURIComponent(name)}`);
      setDiseaseInfo({ ...data, name });
    } catch { toast.error('Failed to load info'); }
    finally { setLoading(false); }
  };

  const loadPosts = async (cat) => {
    const { data } = await api.get(`/knowledge/posts/${cat}`);
    setPosts(data);
  };

  const selectCategory = (cat) => {
    setSelected(cat);
    setDiseaseInfo(null);
    loadPosts(cat);
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.body) return;
    const { data } = await api.post('/knowledge/posts', { ...newPost, category: selected });
    setPosts(prev => [data, ...prev]);
    setNewPost({ title:'', body:'' });
    toast.success('Post shared with the community!');
  };

  const likePost = async (id) => {
    await api.post(`/knowledge/posts/${id}/like`);
    loadPosts(selected);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Hub</h1>
      <p className="text-gray-500 mb-8">Learn about diseases and connect with your community</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(categories).map(([cat, diseases]) => (
          <button key={cat}
            onClick={() => selectCategory(cat)}
            className={`p-4 rounded-xl border text-left transition ${
              selected === cat
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 bg-white hover:border-blue-300'
            }`}>
            <span className="text-2xl mb-2 block">{CATEGORY_ICONS[cat]}</span>
            <p className="font-medium text-gray-900 capitalize">{cat}</p>
            <p className="text-xs text-gray-500">{diseases.length} conditions</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Disease List */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 capitalize">{selected} Diseases</h3>
            <div className="space-y-1">
              {(categories[selected] || []).map(d => (
                <button key={d} onClick={() => loadDisease(d)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
                    diseaseInfo?.name === d
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}>
                  {d} <ChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Disease Info + Community */}
          <div className="col-span-2 space-y-6">
            {/* View Toggle */}
            <div className="flex gap-2">
              {['diseases','community'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                    view === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {v === 'diseases' ? '📚 Disease Info' : '💬 Community'}
                </button>
              ))}
            </div>

            {view === 'diseases' && (
              <>
                {loading && (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                  </div>
                )}
                {diseaseInfo && !loading && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">{diseaseInfo.name}</h2>
                    <p className="text-gray-600 text-sm">{diseaseInfo.overview}</p>
                    {[
                      { label: '🔍 Causes',        data: diseaseInfo.causes },
                      { label: '⚠️ Symptoms',      data: diseaseInfo.symptoms },
                      { label: '🛡️ Prevention',    data: diseaseInfo.prevention },
                      { label: '💊 Treatments',    data: diseaseInfo.treatments },
                    ].map(({ label, data }) => (
                      <div key={label}>
                        <h4 className="font-medium text-gray-800 mb-2">{label}</h4>
                        <ul className="space-y-1">
                          {data?.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-blue-400">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {!diseaseInfo && !loading && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
                    Select a disease from the list to view information
                  </div>
                )}
              </>
            )}

            {view === 'community' && (
              <div className="space-y-4">
                {/* Create Post */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Share your experience</h3>
                  <input type="text" placeholder="Post title..."
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  <textarea rows={3} placeholder="Share your story, question or tip..."
                    value={newPost.body}
                    onChange={e => setNewPost({...newPost, body: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                  <button onClick={createPost}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    Post to Community
                  </button>
                </div>

                {/* Posts */}
                {posts.map(post => (
                  <div key={post._id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{post.title}</h4>
                        <p className="text-xs text-gray-400">
                          {post.author?.name} · {post.author?.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'} · {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{post.body}</p>
                    <button onClick={() => likePost(post._id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition">
                      <Heart size={14} /> {post.likes?.length || 0}
                    </button>
                    {post.comments?.length > 0 && (
                      <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-2">
                        {post.comments.map((c, i) => (
                          <p key={i} className="text-xs text-gray-600">
                            <span className="font-medium">{c.author?.name}:</span> {c.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}