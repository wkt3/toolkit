'use client';

import { useEffect, useState } from 'react';
import { useGlfx } from '@/lib/use-glfx';

export default function ScriptLoader({ children, fallback }) {
	const glfxStatus = useGlfx();
	const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false);

	useEffect(() => {
		// Check if html2canvas is already loaded
		if (typeof window !== 'undefined' && window.html2canvas) {
			setHtml2canvasLoaded(true);
			return;
		}

		// Create script element to load html2canvas
		const script = document.createElement('script');
		script.src = '/html2canvas.min.js';
		script.async = true;
		script.onload = () => setHtml2canvasLoaded(true);
		document.body.appendChild(script);

		return () => {
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, []);

	if (glfxStatus === 'error') {
		return fallback ? (
			fallback
		) : (
			<div className='p-4 text-center'>
				<p className='text-red-500'>
					Failed to load WebGL editor. Please try the Standard Editor instead.
				</p>
			</div>
		);
	}

	if (glfxStatus === 'loading' || !html2canvasLoaded) {
		return (
			<div className='p-4 text-center'>
				<p>Loading WebGL editor...</p>
			</div>
		);
	}

	return <>{children}</>;
}
