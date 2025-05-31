import { useRef, useState } from "react";
import axios from "axios";
import { MdOutlineFileUpload, MdDelete } from "react-icons/md";

const SamplePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const res = await axios.post("/api/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status !== 200) {
        const errorData = res.data;
        if (errorData && errorData.returnCode === "9999") {
          console.log("업로드 실패:", res.status, res.data);
          alert(`업로드 실패 : ${errorData.returnMsg}`);
        }
      }

      console.log("업로드 응답:", res.data);

      // if (res.status == 200) {
      //   setIsModalOpen(true);
      // }

      // setIsModalOpen(true);

      console.log("업로드할 파일:", files);
      setUploadComplete(true);
    } catch (err) {
      console.error(err);
      alert("업로드 실패!");
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

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-[360px] flex flex-col justify-center items-center rounded-lg border border-gray-500 p-4">
        <h2 className="mb-8 text-xl font-bold">📁 LG 수납 파일 업로드</h2>
        <div className="flex justify-between w-full">
          <button onClick={openFileDialog} className="text-cyan-800 hover:text-cyan-950 flex items-center" disabled={files.length > 0}>
            <MdOutlineFileUpload className="mr-2" />
            파일 선택
          </button>
          <input type="file" accept=".layout" multiple onChange={handleFileChange} ref={fileInputRef} className="hidden" />

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
              <div className="w-full flex justify-between">
                <h4 className="text-left font-semibold">선택된 파일:</h4>
                <button
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

export default SamplePage;
