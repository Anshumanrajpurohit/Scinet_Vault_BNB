import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReproScoreService } from '../services/ReproScoreService';
import { StorageService } from '../services/StorageService';
import { useAppData } from '../context/AppDataContext';

const Upload = () => {
	const navigate = useNavigate();
	const { addResearch, addVersion } = useAppData();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [authors, setAuthors] = useState('');
	const [category, setCategory] = useState('Computer Science');
	const [type, setType] = useState('paper');
	const [tags, setTags] = useState('');
	const [files, setFiles] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	const onFileChange = (e) => setFiles(Array.from(e.target.files || []));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title || files.length === 0) return;
		setSubmitting(true);
		try {
			// Build a simple manifest
			const manifest = {
				title, description, category, type,
				tags: tags.split(',').map(t => t.trim()).filter(Boolean),
				authors: authors.split(',').map(a => a.trim()).filter(Boolean),
				files: files.map(f => ({ name: f.name, size: f.size })),
			};
			const { score, diagnostics } = ReproScoreService.analyzeManifest(manifest);
			const { cid } = await StorageService.put(manifest);

			const researchId = addResearch({
				title, description, category, type,
				tags: manifest.tags, authors: manifest.authors,
				isVerified: false,
			});
			addVersion(researchId, { cid, manifest, score, diagnostics });

			navigate(`/research/${researchId}`);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="bg-gradient-to-br from-black via-slate-900 to-black py-8 text-gray-100">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-gray-100 mb-4">Upload Research</h1>
			<form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 p-6 rounded-2xl border border-white/10">
					<div>
						<label className="block text-sm mb-1">Title</label>
						<input className="w-full px-3 py-2 rounded bg-black border border-white/10" value={title} onChange={(e)=>setTitle(e.target.value)} required />
					</div>
					<div>
						<label className="block text-sm mb-1">Description</label>
						<textarea className="w-full px-3 py-2 rounded bg-black border border-white/10" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">Authors (comma-separated)</label>
							<input className="w-full px-3 py-2 rounded bg-black border border-white/10" value={authors} onChange={(e)=>setAuthors(e.target.value)} />
						</div>
						<div>
							<label className="block text-sm mb-1">Category</label>
							<select className="w-full px-3 py-2 rounded bg-black border border-white/10" value={category} onChange={(e)=>setCategory(e.target.value)}>
								{['Computer Science','Biology','Chemistry','Physics','Mathematics','Medicine','Engineering','Environmental Science'].map(c=> <option key={c} value={c}>{c}</option>)}
							</select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">Type</label>
							<select className="w-full px-3 py-2 rounded bg-black border border-white/10" value={type} onChange={(e)=>setType(e.target.value)}>
								<option value="paper">Paper</option>
								<option value="dataset">Dataset</option>
							</select>
						</div>
						<div>
							<label className="block text-sm mb-1">Tags (comma-separated)</label>
							<input className="w-full px-3 py-2 rounded bg-black border border-white/10" value={tags} onChange={(e)=>setTags(e.target.value)} />
						</div>
					</div>
					<div>
						<label className="block text-sm mb-1">Files</label>
						<input type="file" multiple onChange={onFileChange} className="block" />
					</div>
					<button type="submit" disabled={submitting} className="btn-primary text-white px-6 py-2 rounded-lg">
						{submitting ? 'Submitting...' : 'Submit & Analyze'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Upload;
