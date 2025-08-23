<<<<<<< Updated upstream
import React, { useState, useCallback, useRef } from 'react';
=======
import React, { useState } from 'react';
import { ethers } from 'ethers';
>>>>>>> Stashed changes
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Database, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import { ReproScoreService } from '../services/ReproScoreService';
import { StorageService } from '../services/StorageService';
import { SupabaseService } from '../services/SupabaseService';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../App';
import SuiTokenABI from '../abi/SuiTokenABI.json';

const SUI_CONTRACT = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const BNB_TESTNET_CHAIN_HEX = '0x61';

const Upload = () => {
	const navigate = useNavigate();
	const { addResearch, addVersion } = useAppData();
	const { walletAddress } = useAuth();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [authors, setAuthors] = useState('');
	const [category, setCategory] = useState('Computer Science');
	const [type, setType] = useState('paper');
	const [tags, setTags] = useState('');
	const [files, setFiles] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const [submitting, setSubmitting] = useState(false);
<<<<<<< Updated upstream
	const [error, setError] = useState('');
	const [reproScore, setReproScore] = useState(null);
	const [scoreDetails, setScoreDetails] = useState(null);
	const fileInputRef = useRef(null);
=======
	const [rewardTx, setRewardTx] = useState('');
	const [rewardError, setRewardError] = useState('');
	const [toast, setToast] = useState('');
>>>>>>> Stashed changes

	// File handling functions
	const handleFiles = useCallback((newFiles) => {
		const validFiles = Array.from(newFiles).filter(file => {
			// Accept common research file types
			const validTypes = [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'text/csv',
				'application/json',
				'application/zip',
				'text/plain',
				'text/markdown',
				'application/x-python',
				'text/x-python',
				'application/x-r',
				'text/x-r-source',
				'image/png',
				'image/jpeg',
				'image/gif'
			];
			
			const fileType = file.type || '';
			const fileName = file.name.toLowerCase();
			
			// Check by MIME type or file extension
			return validTypes.includes(fileType) || 
				   fileName.endsWith('.py') || 
				   fileName.endsWith('.r') || 
				   fileName.endsWith('.md') || 
				   fileName.endsWith('.txt') || 
				   fileName.endsWith('.ipynb');
		});
		
		setFiles(prevFiles => [...prevFiles, ...validFiles]);
	}, []);

	const onFileChange = (e) => {
		if (e.target.files) {
			handleFiles(e.target.files);
		}
	};

	const handleDrag = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		
		if (e.dataTransfer.files) {
			handleFiles(e.dataTransfer.files);
		}
	}, [handleFiles]);

	const removeFile = useCallback((index) => {
		setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
	}, []);

	const getFileIcon = (file) => {
		const fileName = file.name.toLowerCase();
		if (fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
			return <FileText className="h-6 w-6 text-blue-400" />;
		}
		if (fileName.endsWith('.csv') || fileName.endsWith('.json') || fileName.endsWith('.xlsx')) {
			return <Database className="h-6 w-6 text-green-400" />;
		}
		if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.gif')) {
			return <Image className="h-6 w-6 text-purple-400" />;
		}
		return <FileText className="h-6 w-6 text-gray-400" />;
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setReproScore(null);
		setScoreDetails(null);
		
		if (!title || files.length === 0) {
			setError('Please provide a title and at least one file.');
			return;
		}
		
		setSubmitting(true);
		try {
	setToast('Submitting…');
			// Build a simple manifest
			const manifest = {
				title, description, category, type,
				tags: tags.split(',').map(t => t.trim()).filter(Boolean),
				authors: authors.split(',').map(a => a.trim()).filter(Boolean),
				files: files.map(f => ({ name: f.name, size: f.size })),
			};
<<<<<<< Updated upstream
			
			// Use enhanced reproducibility scoring
			const analysis = await ReproScoreService.analyzeManifest(manifest);
			setReproScore(analysis.score);
			setScoreDetails(analysis);

			// Gate uploads with STRICT minimum reproducibility score of 75 (top 15% quality)
			if (analysis.score < 75) {
				const recommendations = analysis.recommendations || [];
				const diagnostics = analysis.diagnostics || [];
				
				let errorMsg = `Research quality below premium standards (${analysis.score}/100, required: 75+). `;
				errorMsg += `Provider: ${analysis.provider || 'heuristic'}. `;
				errorMsg += `Only top-tier research is accepted on this platform. `;
				
				if (recommendations.length > 0) {
					errorMsg += `Critical improvements needed:\n• ${recommendations.join('\n• ')}`;
				} else if (diagnostics.length > 0) {
					errorMsg += `Quality issues identified:\n• ${diagnostics.join('\n• ')}`;
				}
				
				errorMsg += `\n\nPlease revise your submission to meet premium academic standards before resubmitting.`;
				
				setError(errorMsg);
				return;
			}

			const ref = await StorageService.put(manifest, { prefix: 'research-manifests' });
=======
						const { score, diagnostics } = ReproScoreService.analyzeManifest(manifest);
						const ref = await StorageService.put(manifest, { prefix: 'research-manifests' });

						// If a PDF is included, upload to Supabase storage + table
						let supabaseInfo = null
						const pdfFile = files.find(f => f.type === 'application/pdf')
						if (SupabaseService.isConfigured() && pdfFile) {
							try {
								const formPayload = { title, description, category, type, tags: manifest.tags, authors: manifest.authors }
								const up = await SupabaseService.uploadPdfAndMetadata({ file: pdfFile, form: formPayload, pathPrefix: `research/${title.replace(/[^a-z0-9-_]/gi,'_')}` })
								supabaseInfo = { publicUrl: up.publicUrl, dbRowId: up.row?.id }
							} catch (e) {
								console.warn('Supabase upload failed:', e?.message)
							}
						}
>>>>>>> Stashed changes

			const researchId = addResearch({
				title, description, category, type,
				tags: manifest.tags, authors: manifest.authors,
				isVerified: false,
			});
<<<<<<< Updated upstream
			
			const storageRef = ref?.provider === 'greenfield'
				? { provider: 'greenfield', bucket: ref.bucket, key: ref.key, url: ref.url }
				: { provider: 'none', cid: ref?.cid }
				
			addVersion(researchId, { 
				storageRef, 
				manifest, 
				score: analysis.score, 
				diagnostics: analysis.diagnostics,
				scoreDetails: analysis // Include full analysis
			});

			navigate(`/research/${researchId}`);
		} catch (err) {
			setError(`Upload failed: ${err.message}`);
=======
						const storageRef = ref?.provider === 'greenfield'
							? { provider: 'greenfield', bucket: ref.bucket, key: ref.key, url: ref.url }
							: { provider: 'none', cid: ref?.cid }
						addVersion(researchId, { storageRef, manifest, score, diagnostics, supabase: supabaseInfo });

			// Attempt token reward for upload
			setRewardTx('');
			setRewardError('');
						try {
				if (typeof window !== 'undefined' && window.ethereum && walletAddress) {
					const provider = new ethers.BrowserProvider(window.ethereum);
					// Ensure BNB Testnet
					try {
						await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BNB_TESTNET_CHAIN_HEX }] });
					} catch (_) { /* ignore if already on testnet or no permission */ }
					await provider.send('eth_requestAccounts', []);
					const signer = await provider.getSigner();
					const contract = new ethers.Contract(SUI_CONTRACT, SuiTokenABI, signer);
					const tx = await contract.rewardUser(walletAddress);
					const rec = await tx.wait();
										const hash = rec?.hash || tx?.hash || ''
										setRewardTx(hash);

										// Query updated balance and show in toast
										try {
											const dec = await contract.decimals?.() ?? 18
											const bal = await contract.balanceOf(walletAddress)
											const formatted = ethers.formatUnits(bal, Number(dec))
											setToast(`You received 100 SUI 🎉 New balance: ${formatted}`)
										} catch {
											setToast('You received 100 SUI 🎉')
										}

										// Notify other pages to refresh SUI balance
										try { window.dispatchEvent(new CustomEvent('sui:balance-bump', { detail: { delta: 100 } })) } catch {}
										try { window.dispatchEvent(new CustomEvent('sui:balance-updated', { detail: { reason: 'upload-reward' } })) } catch {}
				}
			} catch (re) {
				setRewardError(re?.reason || re?.message || 'Reward failed');
			}

      // brief delay so the toast is visible
      await new Promise(r => setTimeout(r, 1200));
      navigate(`/research/${researchId}`);
>>>>>>> Stashed changes
		} finally {
			setSubmitting(false);
		}
	};	return (
		<div className="bg-transparent py-8 text-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-gray-100 mb-4">Upload Research</h1>
			<form onSubmit={handleSubmit} className="space-y-4 glass-card p-6 rounded-2xl border border-white/10">
					<div>
						<label className="block text-sm mb-1">Title</label>
						<input className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={title} onChange={(e)=>setTitle(e.target.value)} required />
					</div>
					<div>
						<label className="block text-sm mb-1">Description</label>
						<textarea className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">Authors (comma-separated)</label>
							<input className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={authors} onChange={(e)=>setAuthors(e.target.value)} />
						</div>
						<div>
							<label className="block text-sm mb-1">Category</label>
							<select className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={category} onChange={(e)=>setCategory(e.target.value)}>
								{['Computer Science','Biology','Chemistry','Physics','Mathematics','Medicine','Engineering','Environmental Science'].map(c=> <option key={c} value={c}>{c}</option>)}
							</select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">Type</label>
							<select className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={type} onChange={(e)=>setType(e.target.value)}>
								<option value="paper">Paper</option>
								<option value="dataset">Dataset</option>
							</select>
						</div>
						<div>
							<label className="block text-sm mb-1">Tags (comma-separated)</label>
							<input className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={tags} onChange={(e)=>setTags(e.target.value)} />
						</div>
					</div>

					{/* Enhanced File Upload Section */}
					<div className="space-y-4">
						<label className="block text-sm font-medium text-gray-200 mb-2">Research Files</label>
						
						{/* Drag & Drop Area */}
						<div
							className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
								dragActive 
									? 'border-primary-400 bg-primary-400/10' 
									: 'border-white/20 bg-white/5 hover:border-white/30'
							}`}
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
						>
							<input
								ref={fileInputRef}
								type="file"
								multiple
								onChange={onFileChange}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								accept=".pdf,.doc,.docx,.csv,.json,.zip,.txt,.md,.py,.r,.ipynb,.png,.jpg,.jpeg,.gif"
							/>
							
							<div className="space-y-4">
								<div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
									<UploadIcon className="h-8 w-8 text-white" />
								</div>
								
								<div>
									<h3 className="text-lg font-semibold text-gray-200 mb-2">
										{dragActive ? 'Drop your files here' : 'Upload Research Files'}
									</h3>
									<p className="text-gray-400 text-sm mb-3">
										Drag and drop your files here, or click to browse
									</p>
									<p className="text-xs text-gray-500">
										Supported: PDF, DOC, CSV, JSON, ZIP, TXT, MD, PY, R, IPYNB, Images (max 10MB each)
									</p>
								</div>
								
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="btn-primary text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
								>
									Choose Files
								</button>
							</div>
						</div>

						{/* File List */}
						{files.length > 0 && (
							<div className="space-y-3">
								<h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-green-400" />
									Selected Files ({files.length})
								</h4>
								
								<div className="space-y-2 max-h-60 overflow-y-auto">
									{files.map((file, index) => (
										<div
											key={`${file.name}-${index}`}
											className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
										>
											<div className="flex items-center space-x-3 flex-1 min-w-0">
												{getFileIcon(file)}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-200 truncate">
														{file.name}
													</p>
													<p className="text-xs text-gray-400">
														{formatFileSize(file.size)}
													</p>
												</div>
											</div>
											
											<button
												type="button"
												onClick={() => removeFile(index)}
												className="ml-3 p-1 text-gray-400 hover:text-red-400 transition-colors"
												title="Remove file"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* File Upload Tips */}
						{files.length === 0 && (
							<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
								<div className="flex items-start space-x-3">
									<AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
									<div>
										<h4 className="text-sm font-medium text-blue-400 mb-1">
											Upload Tips for Better Reproducibility Score
										</h4>
										<ul className="text-xs text-blue-300 space-y-1">
											<li>• Include README.md with clear instructions</li>
											<li>• Add requirements.txt or environment.yml for dependencies</li>
											<li>• Upload source code files (.py, .r, .ipynb)</li>
											<li>• Include sample data or data documentation</li>
											<li>• Add validation scripts or test files</li>
										</ul>
									</div>
								</div>
							</div>
						)}
					</div>
					{error && <p className="text-red-400 text-sm whitespace-pre-line">{error}</p>}
					{scoreDetails && !error && (
						<div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Reproducibility Analysis</span>
								<span className={`text-sm font-bold ${scoreDetails.score > 80 ? 'text-emerald-400' : scoreDetails.score > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
									{scoreDetails.score}/100
								</span>
							</div>
							
							{scoreDetails.category && (
								<p className="text-xs text-gray-300">
									Category: <span className="capitalize">{scoreDetails.category}</span>
									{scoreDetails.provider && ` • Analyzed by: ${scoreDetails.provider}`}
									{scoreDetails.confidence && ` • Confidence: ${scoreDetails.confidence}%`}
								</p>
							)}
							
							{scoreDetails.strengths && scoreDetails.strengths.length > 0 && (
								<div className="text-xs">
									<p className="text-emerald-400 font-medium">✅ Strengths:</p>
									<ul className="text-gray-300 ml-2">
										{scoreDetails.strengths.map((strength, i) => (
											<li key={i}>• {strength}</li>
										))}
									</ul>
								</div>
							)}
							
							{scoreDetails.recommendations && scoreDetails.recommendations.length > 0 && (
								<div className="text-xs">
									<p className="text-yellow-400 font-medium">💡 Recommendations:</p>
									<ul className="text-gray-300 ml-2">
										{scoreDetails.recommendations.map((rec, i) => (
											<li key={i}>• {rec}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}
					<button type="submit" disabled={submitting} className="btn-primary text-white px-6 py-2 rounded-lg">
						{submitting ? 'Submitting...' : 'Submit & Analyze'}
					</button>
					{rewardTx && (
						<div className="text-xs text-gray-400 mt-2 break-all">Reward tx: {rewardTx}</div>
					)}
					{rewardError && (
						<div className="text-xs text-red-400 mt-2 break-all">{rewardError}</div>
					)}
				</form>

				{/* Bottom toast */}
				{toast && (
					<div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/80 text-gray-100 border border-white/10 shadow-xl">
						{toast}
					</div>
				)}
			</div>
		</div>
	);
};

export default Upload;
