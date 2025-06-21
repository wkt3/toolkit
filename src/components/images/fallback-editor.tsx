'use client';

import { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function FallbackEditor({ imageUrl }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [brightness, setBrightness] = useState(100);
	const [contrast, setContrast] = useState(100);
	const [saturation, setSaturation] = useState(100);
	const [selectedFilter, setSelectedFilter] = useState('basic');
	const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

	// Load image and initialize canvas
	useEffect(() => {
		if (!imageUrl || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			setOriginalImage(img);
			canvas.width = img.width;
			canvas.height = img.height;
			applyFilters(ctx, img);
		};

		img.src = imageUrl;
	}, [ imageUrl]);

	// Apply filters when parameters change
	useEffect(() => {
		if (!canvasRef.current || !originalImage) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		applyFilters(ctx, originalImage);
	}, [brightness, contrast, saturation, selectedFilter, originalImage]);

	// Apply filters to canvas
	const applyFilters = (ctx, img) => {
		if (!ctx || !img) return;

		// Clear canvas
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// Build filter string based on selected filter
		let filterString = '';

		switch (selectedFilter) {
			case 'basic':
				filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
				break;
			case 'sepia':
				filterString = `sepia(${brightness / 100}) contrast(${contrast}%)`;
				break;
			case 'grayscale':
				filterString = `grayscale(${brightness / 100}) contrast(${contrast}%)`;
				break;
			case 'invert':
				filterString = `invert(${brightness / 100}) contrast(${contrast}%)`;
				break;
			default:
				filterString = `brightness(${brightness}%) contrast(${contrast}%)`;
		}

		// Apply CSS filters
		ctx.filter = filterString;
		ctx.drawImage(img, 0, 0);
		ctx.filter = 'none';
	};

	// Save the edited image
	const handleSaveImage = () => {
		if (!canvasRef.current) return;

		try {
			const link = document.createElement('a');
			link.download = 'edited-image.png';
			link.href = canvasRef.current.toDataURL('image/png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (e) {
			console.error('Error saving image:', e);
			alert('Failed to save the image. Please try again.');
		}
	};

	return (
		<div className='flex flex-col md:flex-row gap-4'>
			<div className='flex-1'>
				<div className='bg-black rounded-lg overflow-hidden'>
					<canvas
						ref={canvasRef}
						className='w-[100%] h-[100%]'
					/>
				</div>
				<div className='flex justify-between mt-2'>
					<div className='text-xs text-gray-500'>CricketON Editor</div>
					<Button
						variant='outline'
						size='sm'
						onClick={handleSaveImage}>
						Save Image
					</Button>
				</div>
			</div>

			<Card className='w-full md:w-64 bg-gray-100'>
				<div className='p-4'>
					<div className='mb-4'>
						<Label htmlFor='filter-select'>Filter Type:</Label>
						<Select
							value={selectedFilter}
							onValueChange={setSelectedFilter}>
							<SelectTrigger id='filter-select'>
								<SelectValue placeholder='Select a filter' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='basic'>Basic Adjustments</SelectItem>
								<SelectItem value='sepia'>Sepia</SelectItem>
								<SelectItem value='grayscale'>Grayscale</SelectItem>
								<SelectItem value='invert'>Invert</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-4'>
						<div className='space-y-2'>
							<div className='flex justify-between'>
								<Label htmlFor='brightness'>
									{selectedFilter !== 'basic' ? 'Effect Strength:' : 'Brightness:'}
								</Label>
								<span className='text-sm'>{brightness}%</span>
							</div>
							<Slider
								id='brightness'
								min={0}
								max={200}
								step={1}
								value={[brightness]}
								onValueChange={(value) => setBrightness(value[0])}
							/>
						</div>

						<div className='space-y-2'>
							<div className='flex justify-between'>
								<Label htmlFor='contrast'>Contrast:</Label>
								<span className='text-sm'>{contrast}%</span>
							</div>
							<Slider
								id='contrast'
								min={0}
								max={200}
								step={1}
								value={[contrast]}
								onValueChange={(value) => setContrast(value[0])}
							/>
						</div>

						{selectedFilter === 'basic' && (
							<div className='space-y-2'>
								<div className='flex justify-between'>
									<Label htmlFor='saturation'>Saturation:</Label>
									<span className='text-sm'>{saturation}%</span>
								</div>
								<Slider
									id='saturation'
									min={0}
									max={200}
									step={1}
									value={[saturation]}
									onValueChange={(value) => setSaturation(value[0])}
								/>
							</div>
						)}
					</div>

					<Button
						variant='outline'
						className='w-full mt-4'
						onClick={() => {
							setBrightness(100);
							setContrast(100);
							setSaturation(100);
						}}>
						Reset
					</Button>
				</div>
			</Card>
		</div>
	);
}
