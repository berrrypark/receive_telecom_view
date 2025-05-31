import { useRef, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import FileUploadButton from "../../components/FileUploadButton/FileUploadButton";

const FileUploadPageContainer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axios.post("/api/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("업로드할 파일:", files);
      setUploadComplete(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(`파일 업로드 중 오류 발생: ${err.response?.data?.returnMsg || "알 수 없는 오류"}`);
      } else {
        alert("파일 업로드 중 알 수 없는 오류 발생:");
      }
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await axios.get("/api/sunab/lg/start");
      alert("완료되었습니다");
    } catch (err) {
      console.error(err);
      alert("정산 처리 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = (index: number) => () => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[360px] flex flex-col justify-center items-center rounded-lg border border-gray-500 p-4">
        <h2 className="mb-8 text-xl font-bold">📁 LG 수납 파일 업로드</h2>
        <div className="flex justify-between w-full">
          <FileUploadButton files={files} onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`text-blue-800 hover:text-blue-950 ${files.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          >
            업로드
          </button>
        </div>

        <div className="w-full mt-5">
          {files.length > 0 && (
            <div className="mt-5 w-full">
              <div className="w-full flex justify-between items-center">
                <h4 className="text-left font-semibold">선택된 파일:</h4>
                <button
                  className="px-2 py-1 outline outline-stone-600 rounded-lg cursor-pointer hover:outline-blue-600 hover:text-blue-600"
                  onClick={() => {
                    setFiles([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // input의 파일 선택 초기화
                    }
                  }}
                >
                  전체 삭제
                </button>
              </div>
              <ul className="mt-4 max-h-[500px] list-none p-0 text-left overflow-auto">
                {files.map((file, index) => (
                  <li key={index} className="bg-gray-200 p-2 rounded-md mb-2 flex">
                    <div className="flex-1">{file.name}</div>
                    <button onClick={handleDeleteFile(index)}>
                      <MdDelete />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {uploadComplete && (
          <div className="mt-5">
            {loading ? (
              <p className="mt-3">⏳ 수납 정산 처리 중...</p>
            ) : (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600"
                onClick={handleStart}
                disabled={loading}
              >
                수납정산 시작
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPageContainer;
