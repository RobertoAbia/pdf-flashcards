'use client';

import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.entry';

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = worker;
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file.name);
    setIsLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument(arrayBuffer).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      const trimmedText = fullText.trim();
      if (trimmedText.length === 0) {
        throw new Error('No text was extracted from the PDF');
      }

      onTextExtracted(trimmedText);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(error instanceof Error ? error.message : 'Error processing PDF file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center">
        <label className="w-full cursor-pointer">
          <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center hover:bg-[#EEEEEE] transition-colors">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-14c0 4.418-7.163 8-16 8S8 18.418 8 14" />
              </svg>
            </div>
            <span className="text-lg font-medium">
              {selectedFile ? selectedFile : 'Selecciona un archivo PDF'}
            </span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </label>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
            <p className="mt-2 text-violet-600">Procesando PDF...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl w-full">
            <p className="text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
