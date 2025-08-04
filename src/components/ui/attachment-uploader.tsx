import React, { useRef } from 'react';
import { Button } from './button';
import { Trash2, Paperclip } from 'lucide-react';

/**
 * A simple attachment uploader component. It accepts a list of attachments
 * and notifies the parent whenever the list changes. Attachments are stored
 * in memory only; no files are persisted. When a user selects files, each
 * file is assigned a unique ID and converted to an object with a data URL
 * so that it can be previewed or downloaded if needed.
 */

export interface Attachment {
  id: string;
  name: string;
  file: File;
  url: string;
}

export interface AttachmentUploaderProps {
  /**
   * Optional label displayed next to the upload button.
   */
  label?: string;
  /**
   * The current list of attachments. Controlled by the parent component.
   */
  attachments: Attachment[];
  /**
   * Called when attachments are added or removed. Receives the new list
   * of attachments.
   */
  onChange: (attachments: Attachment[]) => void;
  /**
   * Determines whether multiple files can be uploaded at once. Defaults to true.
   */
  multiple?: boolean;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  label = 'Upload Files',
  attachments,
  onChange,
  multiple = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Converts an array of File objects into Attachment objects with data URLs.
   */
  const processFiles = async (files: FileList): Promise<Attachment[]> => {
    const results: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const url = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      results.push({
        id: `${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        file,
        url,
      });
    }
    return results;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newAttachments = await processFiles(files);
    onChange([...attachments, ...newAttachments]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((att) => att.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Paperclip className="h-4 w-4" /> {label}
        </Button>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>
      {attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-2 bg-muted rounded"
            >
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium truncate"
              >
                {att.name}
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(att.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;