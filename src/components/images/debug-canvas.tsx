'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface DebugCanvasProps {
	imageUrl: string;
}

export default function DebugCanvas({ imageUrl }: DebugCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!imageUrl || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			console.error('Could not get 2D context');
			return;
		}

		const img = new Image();
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			// Set canvas dimensions
			canvas.width = img.width;
			canvas.height = img.height;

			// Draw the image
			ctx.drawImage(img, 0, 0);

			console.log('Image loaded in debug canvas', {
				width: img.width,
				height: img.height,
				naturalWidth: img.naturalWidth,
				naturalHeight: img.naturalHeight,
			});
		};

		img.onerror = (e) => {
			console.error('Error loading image in debug canvas:', e);
		};

		img.src = imageUrl;
	}, [imageUrl]);

	const handleSaveImage = () => {
		if (!canvasRef.current) return;

		try {
			const link = document.createElement('a');
			link.download = 'debug-image.png';
			link.href = canvasRef.current.toDataURL('image/png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (e) {
			console.error('Error saving debug image:', e);
		}
	};

	return (
		<div className='mt-4 p-4 border border-gray-300 rounded-lg'>
			<h3 className='text-lg font-medium mb-2'>Debug Canvas</h3>
			<div className='bg-black rounded-lg overflow-hidden'>
				<canvas
					ref={canvasRef}
					className='w-full h-auto'
				/>
			</div>
			<div className='mt-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={handleSaveImage}>
					Save Debug Image
				</Button>
			</div>
		</div>
	);
}
