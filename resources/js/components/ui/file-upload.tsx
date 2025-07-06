import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  label?: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onFilesChange: (files: File[]) => void;
  value?: File[];
  error?: string;
  previewType?: 'image' | 'document';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload Files',
  name,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 10,
  onFilesChange,
  value = [],
  error,
  previewType = 'image',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState<number[]>([]);

  React.useEffect(() => {
    // Clean up previews on unmount
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  React.useEffect(() => {
    // Generate previews for current value
    if (previewType === 'image') {
      const urls = value.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    } else {
      setPreviews([]);
    }
  }, [value, previewType]);

  const handleFiles = (files: FileList | File[]) => {
    let fileArr = Array.from(files);
    if (maxFiles) fileArr = fileArr.slice(0, maxFiles);
    fileArr = fileArr.filter((file) => file.size <= maxSizeMB * 1024 * 1024);
    onFilesChange(fileArr);
    // Simulate progress for browser-side load
    setProgress(fileArr.map(() => 100));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-2">
      {label && <label className="font-medium">{label}</label>}
      <div
        className={`border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Button variant="default">
              Upload
            </Button>
            <input
              ref={inputRef}
              id={name}
              name={name}
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {multiple ? `You can upload up to ${maxFiles} files.` : 'Upload a file.'} Max size: {maxSizeMB}MB
          </p>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {/* Previews */}
      {previewType === 'image' && previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              {progress[index] === 100 && (
                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {previewType === 'document' && value.length > 0 && (
        <ul className="mt-4 space-y-2">
          {value.map((file, index) => (
            <li key={index} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
              <span className="truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
              {progress[index] === 100 && (
                <span className="text-green-600 ml-2">✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
