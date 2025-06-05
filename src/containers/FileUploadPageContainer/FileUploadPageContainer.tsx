import { useRef, useState } from "react";
import axios from "axios";
import { MdOutlineFileUpload, MdDelete } from "react-icons/md";

const SamplePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [offLineCollectionData, setOffLineCollectionData] = useState<any[]>([]);
  const [onLineCollectionData, setOnLineCollectionData] = useState<any[]>([]);
  const [detailData, setDetailData] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    try {
      await axios.post("/api/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("파일 업로드 완료!");
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
      await axios.post("/api/receive/lg/start");
      alert("수납 데이터 정산 완료!");
    } catch (err) {
      console.error("수납 데이터 처리 실패:", err);
      alert("수납 데이터 처리 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/receive/lg/detail");
      if (!Array.isArray(response.data)) {
        console.error("API 응답이 배열이 아닙니다:", response.data);
        alert("데이터 포맷 오류");
        return;
      }
      setDetailData(response.data);
    } catch (err) {
      console.error("상세내역 조회 실패:", err);
      alert("상세내역 조회 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/debt/lg/collection-detail");
      if (
        !response.data ||
        !Array.isArray(response.data.offLine) ||
        !Array.isArray(response.data.onLine)
      ) {
        console.error("API 응답 포맷 오류:", response.data);
        alert("데이터 포맷 오류");
        return;
      }
      setOffLineCollectionData(response.data.offLine);
      setOnLineCollectionData(response.data.onLine);
    } catch (err) {
      console.error("채권추심 상세내역 조회 실패:", err);
      alert("채권추심 상세내역 조회 실패!");
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
    <div className="h-full w-full flex flex-col items-center">
      {/* 파일 업로드 */}
      <div className="w-[360px] flex flex-col justify-center items-center rounded-lg border border-gray-500 p-4 mb-4">
        <h2 className="mb-8 text-xl font-bold">📁 LG 수납 파일 업로드</h2>
        <div className="flex justify-between w-full">
          <button
            onClick={openFileDialog}
            className="text-cyan-800 hover:text-cyan-950 flex items-center"
            disabled={files.length > 0}
          >
            <MdOutlineFileUpload className="mr-2" />
            파일 선택
          </button>
          <input
            type="file"
            accept=".layout"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
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
              <button
                onClick={() => {
                  setFiles([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
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
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
          onClick={handleDetail}
          disabled={loading}
        >
          상세내역 조회
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={handleCollectionDetail}
          disabled={loading}
        >
          채권추심 상세내역 조회
        </button>
      </div>

      {/* 3분할 레이아웃 */}
      {(detailData.length > 0 || offLineCollectionData.length > 0 || onLineCollectionData.length > 0) && (
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4">
          {/* 왼쪽 (A) */}
          {detailData.length > 0 && (
            <div className="flex-1 border p-2 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-2">📊 상세내역</h3>
              <table className="min-w-full text-xs text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-1 border">회차</th>
                    <th className="px-2 py-1 border">거래월</th>
                    <th className="px-2 py-1 border">거래금액</th>
                    <th className="px-2 py-1 border">수납금액</th>
                    <th className="px-2 py-1 border">연체가산금</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.map((item, index) => (
                    <tr key={`detail-${item.month}-${index}`}>
                      <td className="px-2 py-1 border">{item.count}</td>
                      <td className="px-2 py-1 border">{item.month}</td>
                      <td className="px-2 py-1 border text-right">{Number(item.amt ?? 0).toLocaleString()}</td>
                      <td className="px-2 py-1 border text-right">{Number(item.suAmt ?? 0).toLocaleString()}</td>
                      <td className="px-2 py-1 border text-right">{Number(item.overdueSuamt ?? 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* 오른쪽 (B+C) */}
          {(offLineCollectionData.length > 0 || onLineCollectionData.length > 0) && (
            <div className="flex-1 flex flex-col gap-4">
              {/* 위쪽 (B) */}
              {/* (B) 오프라인 채권추심 상세내역 */}
              {offLineCollectionData.length > 0 && (
                <div className="border p-2 overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-2">📊 채권추심 상세내역 (OffLine)</h3>
                  <table className="min-w-full text-xs text-left border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 border">PG코드</th>
                        <th className="px-2 py-1 border">당월청구/수납</th>
                        <th className="px-2 py-1 border">1개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(1개월)</th>
                        <th className="px-2 py-1 border">4개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(4개월)</th>
                        <th className="px-2 py-1 border">12개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(12개월)</th>
                        <th className="px-2 py-1 border">36개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(36개월)</th>
                        <th className="px-2 py-1 border font-semibold">행 합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offLineCollectionData.map((item, index) => {
                        const rowSum = [
                          item.thisMonthAmt,
                          item.after1MonthAmt,
                          item.after1MonthSuAmt,
                          item.after4MonthAmt,
                          item.after4MonthSuAmt,
                          item.after12MonthAmt,
                          item.after12MonthSuAmt,
                          item.after36MonthAmt,
                          item.after36MonthSuAmt,
                        ].reduce((acc, val) => acc + (val ?? 0), 0);

                        return (
                          <tr key={`collection-${index}`}>
                            <td className="px-2 py-1 border">{item.co}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.thisMonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after1MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after1MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after4MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after4MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after12MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after12MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after36MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after36MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right font-semibold">{rowSum.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      {/* 합계 행 */}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-2 py-1 border">합계</td>
                        {[
                          "thisMonthAmt",
                          "after1MonthAmt",
                          "after1MonthSuAmt",
                          "after4MonthAmt",
                          "after4MonthSuAmt",
                          "after12MonthAmt",
                          "after12MonthSuAmt",
                          "after36MonthAmt",
                          "after36MonthSuAmt",
                        ].map((field, idx) => {
                          const colSum = offLineCollectionData.reduce(
                            (acc, item) => acc + (item[field] ?? 0),
                            0
                          );
                          return (
                            <td key={`offline-sum-${idx}`} className="px-2 py-1 border text-right">
                              {colSum.toLocaleString()}
                            </td>
                          );
                        })}
                        <td className="px-2 py-1 border text-right">
                          {offLineCollectionData.reduce((acc, item) => {
                            return (
                              acc +
                              [
                                item.thisMonthAmt,
                                item.after1MonthAmt,
                                item.after1MonthSuAmt,
                                item.after4MonthAmt,
                                item.after4MonthSuAmt,
                                item.after12MonthAmt,
                                item.after12MonthSuAmt,
                                item.after36MonthAmt,
                                item.after36MonthSuAmt,
                              ].reduce((rowAcc, val) => rowAcc + (val ?? 0), 0)
                            );
                          }, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {/* 아래쪽 (C) */}
              {/* (C) 온라인 채권추심 상세내역 */}
              {onLineCollectionData.length > 0 && (
                <div className="border p-2 overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-2">📊 채권추심 상세내역 (OnLine)</h3>
                  <table className="min-w-full text-xs text-left border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 border">PG코드</th>
                        <th className="px-2 py-1 border">당월청구/수납</th>
                        <th className="px-2 py-1 border">1개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(1개월)</th>
                        <th className="px-2 py-1 border">4개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(4개월)</th>
                        <th className="px-2 py-1 border">12개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(12개월)</th>
                        <th className="px-2 py-1 border">36개월 경과</th>
                        <th className="px-2 py-1 border">연체가산금(36개월)</th>
                        <th className="px-2 py-1 border font-semibold">행 합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onLineCollectionData.map((item, index) => {
                        const rowSum = [
                          item.thisMonthAmt,
                          item.after1MonthAmt,
                          item.after1MonthSuAmt,
                          item.after4MonthAmt,
                          item.after4MonthSuAmt,
                          item.after12MonthAmt,
                          item.after12MonthSuAmt,
                          item.after36MonthAmt,
                          item.after36MonthSuAmt,
                        ].reduce((acc, val) => acc + (val ?? 0), 0);

                        return (
                          <tr key={`collection-online-${index}`}>
                            <td className="px-2 py-1 border">{item.co}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.thisMonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after1MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after1MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after4MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after4MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after12MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after12MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after36MonthAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.after36MonthSuAmt ?? 0).toLocaleString()}</td>
                            <td className="px-2 py-1 border text-right font-semibold">{rowSum.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      {/* 합계 행 */}
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-2 py-1 border">합계</td>
                        {[
                          "thisMonthAmt",
                          "after1MonthAmt",
                          "after1MonthSuAmt",
                          "after4MonthAmt",
                          "after4MonthSuAmt",
                          "after12MonthAmt",
                          "after12MonthSuAmt",
                          "after36MonthAmt",
                          "after36MonthSuAmt",
                        ].map((field, idx) => {
                          const colSum = onLineCollectionData.reduce(
                            (acc, item) => acc + (item[field] ?? 0),
                            0
                          );
                          return (
                            <td key={`online-sum-${idx}`} className="px-2 py-1 border text-right">
                              {colSum.toLocaleString()}
                            </td>
                          );
                        })}
                        <td className="px-2 py-1 border text-right">
                          {onLineCollectionData.reduce((acc, item) => {
                            return (
                              acc +
                              [
                                item.thisMonthAmt,
                                item.after1MonthAmt,
                                item.after1MonthSuAmt,
                                item.after4MonthAmt,
                                item.after4MonthSuAmt,
                                item.after12MonthAmt,
                                item.after12MonthSuAmt,
                                item.after36MonthAmt,
                                item.after36MonthSuAmt,
                              ].reduce((rowAcc, val) => rowAcc + (val ?? 0), 0)
                            );
                          }, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SamplePage;
