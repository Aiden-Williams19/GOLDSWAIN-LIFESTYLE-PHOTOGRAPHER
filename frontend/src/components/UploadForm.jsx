import React, { useState } from 'react';
import API from '../api';
import '../styles/UploadForm.css';

const UploadForm = () => {
  const [category, setCategory] = useState('Weddings');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey') || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setBusy(true);
    const data = new FormData();
    data.append('image', file);
    data.append('category', category);
    data.append('title', title);
    data.append('description', description);

    try {
      const res = await API.post('/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(adminKey ? { 'x-admin-key': adminKey } : {})
        }
      });
      alert('Uploaded successfully');
      setTitle(''); setDescription(''); setFile(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="upload-section">
      <h2>Admin Upload</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input value={adminKey} onChange={e => { setAdminKey(e.target.value); localStorage.setItem('adminKey', e.target.value); }} placeholder="Admin key" />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Weddings</option>
          <option>Lifestyle</option>
          <option>Portraits</option>
          <option>Commercials</option>
        </select>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
      </form>
    </section>
  );
};

export default UploadForm;
