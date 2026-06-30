import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { mediaApi } from '../api';
import { mediaUrl } from '../api/axios';
import ImageUpload from './ImageUpload';

export default function AdminMedia() {
  const qc = useQueryClient();
  const { data: media = [], isLoading } = useQuery({ queryKey: ['adm-media'], queryFn: mediaApi.list });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['adm-media'] });

  const delMut = useMutation({
    mutationFn: (id) => mediaApi.remove(id),
    onSuccess: () => { invalidate(); toast.success('Deleted'); },
  });

  const copy = (url) => { navigator.clipboard?.writeText(mediaUrl(url)); toast.success('URL copied'); };

  return (
    <div>
      <div className="spread" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Media Library</h2>
        <ImageUpload value={[]} onChange={invalidate} />
      </div>
      {isLoading ? <div className="empty">Loading…</div> : (
        <div className="product-grid">
          {media.map((m) => (
            <div key={m._id} className="card">
              <div className="card-img"><img src={mediaUrl(m.url)} alt={m.originalName} /></div>
              <div className="card-body" style={{ gap: 8 }}>
                <span className="muted" style={{ fontSize: 12, wordBreak: 'break-all' }}>{m.originalName}</span>
                <div className="row">
                  <button className="adm-btn-sm" onClick={() => copy(m.url)}>Copy URL</button>
                  <button className="adm-btn-sm danger" onClick={() => { if (confirm('Delete this image?')) delMut.mutate(m._id); }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!media.length && <div className="empty" style={{ gridColumn: '1/-1' }}>No media uploaded yet.</div>}
        </div>
      )}
    </div>
  );
}
