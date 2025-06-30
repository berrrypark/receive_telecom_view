import { MdOutlineFileUpload } from "react-icons/md";

interface FileUploadButtonProps {
  files: File[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (files: File[]) => void;
}

const FileUploadButton = ({ inputRef, files, onChange }: FileUploadButtonProps) => {
  const handleClickInput = () => {
    inputRef?.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (!selectedFiles) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".layout") || fileName.endsWith(".dat")) {
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
      <input type="file" accept=".layout,.dat" multiple onChange={handleFileChange} ref={inputRef} className="hidden" />
    </>
  );
};

export default FileUploadButton;
