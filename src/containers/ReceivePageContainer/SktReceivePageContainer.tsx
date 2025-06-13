import { useRef, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import * as Tooltip from '@radix-ui/react-tooltip';

import FileUploadButton from "../../components/FileUploadButton/FileUploadButton";

const FileUploadPageContainer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    try {
      await axios.post("/api/upload/multiple/lg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("파일 업로드 완료!");
      handleDeleteAllFiles();
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("파일 업로드 오류 발생!");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/receive/lg/start");
      alert("수납 데이터 적재 완료! " + response.data + "건");
    } catch (err) {
      console.error("수납 데이터 처리 실패:", err);
      alert("수납 데이터 처리 실패!");
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

  const handleDeleteAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function TooltipExample() {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className="ml-2 text-blue-500 font-bold">❓</button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              className="bg-gray-100 p-3 rounded shadow text-sm max-w-xd whitespace-pre-line text-black z-50"
            >
                        {`1. 정산서와 거래대사 비교
                        2. 수납 데이터 업로드 (.dat)
                        3. 수납 데이터 적재
                        4. 대사 완료 이후 수납시작 가능`}
              <Tooltip.Arrow className="fill-gray-100" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      {/* 파일 업로드 */}
      <div className="w-[360px] flex flex-col justify-center items-center rounded-lg border border-gray-500 p-4 mb-4">
        <h2 className="mb-8 text-xl font-bold">📁 SKT 수납 파일 업로드</h2>
        <div className="flex justify-between w-full">
          <FileUploadButton files={files} inputRef={fileInputRef} onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
            className={`text-blue-800 hover:text-blue-950 ${
              files.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            업로드
          </button>
        </div>
        {files.length > 0 && (
          <div className="w-full mt-5">
            <div className="w-full flex justify-between">
              <h4 className="text-left font-semibold">선택된 파일:</h4>
              <button onClick={handleDeleteAllFiles}>전체 삭제</button>
            </div>
            <ul className="list-none p-0 text-left">
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

      {/* 주의 사항 */}
      <div className="w-full flex flex-col items-center">
        <h2 className="mb-2 text-xl font-bold">주의 사항</h2>
        <p className="mb-8 text-red-500 font-bold">임시 테이블에 적재하여 데이터를 비교하는 공간입니다. 정산월이 지나면 데이터가 틀어질 수 있습니다.
          <TooltipExample />
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          onClick={handleStart}
          disabled={loading}
        >
          수납 데이터 적재
        </button>
      </div>
    </div>
  );
};

export default FileUploadPageContainer;
