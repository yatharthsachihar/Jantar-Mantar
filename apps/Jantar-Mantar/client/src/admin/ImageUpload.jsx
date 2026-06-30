import { useState } from 'react';
import toast from 'react-hot-toast';
import { mediaApi } from '../api';
import { mediaUrl } from '../api/axios';
import { FiUploadCloud, FiX } from 'react-icons/fi';

// Reusable uploader. `value` is an array of stored URLs; `onChange` receives
// the updated array. Single-image mode caps at one entry.
export default function ImageUpload({ value = [], onChange, single = false }) {
  const [busy, setBusy] = useState(false);

  const upload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = [];
      for (const f of files) {
        const media = await mediaApi.upload(f);
        urls.push(media.url);
      }
      onChange(single ? [urls[0]] : [...value, ...urls]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="row" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
        {value.map((u) => (
          <div key={u} style={{ position: 'relative' }}>
            <img src={mediaUrl(u)} alt="" className="adm-thumb" style={{ width: 64, height: 64 }} />
            <button type="button" onClick={() => onChange(value.filter((x) => x !== u))}
              style={{ position: 'absolute', top: -6, right: -6, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'grid', placeItems: 'center' }}>
              <FiX size={12} />
            </button>
          </div>
        ))}
      </div>
      <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
        <FiUploadCloud /> {busy ? 'Uploading…' : single ? 'Upload Image' : 'Upload Images'}
        <input type="file" accept="image/*" multiple={!single} hidden onChange={upload} disabled={busy} />
      </label>
    </div>
  );
}
