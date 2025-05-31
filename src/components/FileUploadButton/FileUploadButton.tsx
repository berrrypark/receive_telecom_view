import { useRef } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

interface FileUploadButtonProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const FileUploadButton = ({ files, onChange }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickInput = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (file.name.endsWith(".layout")) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`다음 파일들은 업로드할 수 없습니다: ${invalidFiles.join(", ")}`);
    }

    onChange(validFiles);
  };

  return (
    <>
      <button onClick={handleClickInput} className="text-cyan-800 hover:text-cyan-950 flex items-center" disabled={files.length > 0}>
        <MdOutlineFileUpload className="mr-2" />
        파일 선택
      </button>
      <input type="file" accept=".layout" multiple onChange={handleFileChange} ref={fileInputRef} className="hidden" />
    </>
  );
};

export default FileUploadButton;
