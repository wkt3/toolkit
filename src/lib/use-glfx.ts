'use client';

import { useState, useEffect } from 'react';

export function useGlfx() {
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

	// Add a function to check if WebGL is supported
	const isWebGLSupported = () => {
		try {
			const canvas = document.createElement('canvas');
			return !!(
				window.WebGLRenderingContext &&
				(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
			);
		} catch (e) {
			return false;
		}
	};

	useEffect(() => {
		// First check if WebGL is supported
		if (!isWebGLSupported()) {
			console.error('WebGL is not supported in this browser');
			setStatus('error');
			return;
		}

		// Check if glfx is already loaded
		if (window.fx) {
			setStatus('success');
			return;
		}

		// Function to load glfx.js directly
		const loadGlfx = () => {
			const script = document.createElement('script');
			script.src = 'https://evanw.github.io/glfx.js/glfx.js';
			script.async = true;

			script.onload = () => {
				// Check if window.fx is available after script loads
				setTimeout(() => {
					if (window.fx) {
						setStatus('success');
					} else {
						console.error('glfx.js loaded but fx object not available');
						setStatus('error');
					}
				}, 300);
			};

			script.onerror = () => {
				console.error('Failed to load glfx.js');
				setStatus('error');
			};

			document.body.appendChild(script);
			return script;
		};

		// Try to load the script
		const scriptElement = loadGlfx();

		// Set a timeout for the load attempt
		const timeout = setTimeout(() => {
			if (status === 'loading') {
				console.error('glfx.js load timed out');
				setStatus('error');
			}
		}, 5000);

		return () => {
			clearTimeout(timeout);
			if (scriptElement && scriptElement.parentNode) {
				scriptElement.parentNode.removeChild(scriptElement);
			}
		};
	}, [status]);

	return status;
}
