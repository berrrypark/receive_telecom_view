import { useState } from "react";
import axios from "axios";
import ConfirmModal from "./components/ConfirmModal/ConfirmModal";

const SamplePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      console.warn(`다음 파일들은 업로드할 수 없습니다: ${invalidFiles.join(", ")}`);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // const res = await axios.post("http://localhost:8081/api/upload/multiple", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // if (res.status == 200) {
      //   setIsModalOpen(true);
      // }

      setIsModalOpen(true);

      console.log("업로드할 파일:", files);
      alert("파일 업로드 완료!");
      setUploadComplete(true);
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("업로드 실패!");
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await axios.get("http://localhost:8081/api/sunab/lg/start");
      alert("완료되었습니다");
    } catch (err) {
      console.error(err);
      alert("정산 처리 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    console.log("Confirm button clicked");
    // 여기에 확인 버튼 클릭 시 처리할 로직을 추가하세요.
    setIsModalOpen(false);
  };
  const handleClose = () => {
    console.log("Close button clicked");
    // 여기에 모달 닫기 버튼 클릭 시 처리할 로직을 추가하세요.
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gray-100 font-sans">
        <div className="bg-white text-black p-10 rounded-lg shadow-lg text-center w-96">
          <h2 className="mb-5 text-xl font-bold">📁 LG 수납 파일 업로드</h2>

          <input type="file" accept=".layout" multiple onChange={handleFileChange} className="mb-4 block mx-auto" />

          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg text-lg ${
              files.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            업로드
          </button>

          {files.length > 0 && (
            <div className="mt-5 w-full">
              <h4 className="text-left font-semibold">선택된 파일:</h4>
              <ul className="list-none p-0 text-left">
                {files.map((file, index) => (
                  <li key={index} className="bg-gray-200 p-2 rounded-md mb-2">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
      <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} onClose={handleClose} />
    </>
  );
};

export default SamplePage;
