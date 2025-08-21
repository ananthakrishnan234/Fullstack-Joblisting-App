import { useState } from 'react';

export default function AddPostForm({ onAdd }) {
  const [form, setForm] = useState({ profile: '', desc: '', exp: '', techs: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = {
      profile: form.profile,
      desc: form.desc,
      exp: parseInt(form.exp),
      techs: form.techs.split(',').map(t => t.trim()),
    };
    onAdd(post);
    setForm({ profile: '', desc: '', exp: '', techs: '' });
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">Add Job Post</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input type="text" className="form-control" name="profile" placeholder="Profile" value={form.profile} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <textarea className="form-control" name="desc" placeholder="Description" value={form.desc} onChange={handleChange} required></textarea>
          </div>
          <div className="mb-2">
            <input type="number" className="form-control" name="exp" placeholder="Experience (years)" value={form.exp} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <input type="text" className="form-control" name="techs" placeholder="Techs (comma-separated)" value={form.techs} onChange={handleChange} required />
          </div>
          <button className="btn btn-success">Post Job</button>
        </form>
      </div>
    </div>
  );
}
