import { useRef, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import * as Tooltip from '@radix-ui/react-tooltip';

import type { CollectionData } from "../../common/types/lg/collection";
import type { ReceiveDetail } from "../../common/types/lg/receive";
import type { ReconcileData } from "../../common/types/lg/reconcile";
import type { CompareResultType } from "../../common/types/lg/compare";
import FileUploadButton from "../../components/FileUploadButton/FileUploadButton";

const FileUploadPageContainer = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [overdueSuamtLoaded, setOverdueSuamtLoaded] = useState(false);
  const [debtLoaded, setDebtLoaded] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);

  const [compareResult, setCompareResult] = useState<CompareResultType | null>(null);

  const [offLineDebtData, setOffLineDebtData] = useState<CollectionData[]>([]);
  const [offLineOverdueSuamtData, setOffLineOverdueSuamtData] = useState<ReconcileData[]>([]);

  const [offlineAmtChecked, setOfflineAmtChecked] = useState(false);
  const [offlineSuAmtChecked, setOfflineSuAmtChecked] = useState(false);
  const [onlineAmtChecked, setOnlineAmtChecked] = useState(false);
  const [onlineSuAmtChecked, setOnlineSuAmtChecked] = useState(false);

  const allChecked = offlineAmtChecked && offlineSuAmtChecked && onlineAmtChecked && onlineSuAmtChecked;

  const [onLineDebtData, setOnLineDebtData] = useState<CollectionData[]>([]);
  const [onLineOverdueSuamtData, setOnLineOverdueSuamtData] = useState<ReconcileData[]>([]);
  const [detailData, setDetailData] = useState<ReceiveDetail[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCompareResultCheck = () => {

    const debtOfflineAfter1Month = offLineDebtData.reduce((acc, item) => acc + Number(item.after1MonthSuAmt ?? 0), 0);
    const overdueSuamtOfflineAfter1Month = offLineOverdueSuamtData.slice(0, 3).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);

    const debtOfflineAfter4Month = offLineDebtData.reduce((acc, item) => acc + Number(item.after4MonthSuAmt ?? 0), 0);
    const overdueSuamtOfflineAfter4Month = offLineOverdueSuamtData.slice(3, 11).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);
    
    const debtOfflineAfter12Month = offLineDebtData.reduce((acc, item) => acc + Number(item.after12MonthSuAmt ?? 0), 0);
    const overdueSuamtOfflineAfter12Month = offLineOverdueSuamtData.slice(11, 35).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);

    const debtOfflineAfter36Month = offLineDebtData.reduce((acc, item) => acc + Number(item.after36MonthSuAmt ?? 0), 0);
    const overdueSuamtOfflineAfter36Month = offLineOverdueSuamtData.slice(35, offLineOverdueSuamtData.length).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);

    const debtOnlineAfter1Month = onLineDebtData.reduce((acc, item) => acc + Number(item.after1MonthSuAmt ?? 0), 0);
    const overdueSuamtOnlineAfter1Month = onLineOverdueSuamtData.slice(0, 3).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);

    const debtOnlineAfter4Month = onLineDebtData.reduce((acc, item) => acc + Number(item.after4MonthSuAmt ?? 0), 0);
    const overdueSuamtOnlineAfter4Month = onLineOverdueSuamtData.slice(3, 11).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);
    
    const debtOnlineAfter12Month = onLineDebtData.reduce((acc, item) => acc + Number(item.after12MonthSuAmt ?? 0), 0);
    const overdueSuamtOnlineAfter12Month = onLineOverdueSuamtData.slice(11, 35).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);

    const debtOnlineAfter36Month = onLineDebtData.reduce((acc, item) => acc + Number(item.after36MonthSuAmt ?? 0), 0);
    const overdueSuamtOnlineAfter36Month = onLineOverdueSuamtData.slice(35, onLineOverdueSuamtData.length).reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0);

    setCompareResult({
        offline: {
          after1Month: {
            debtSum: debtOfflineAfter1Month,
            overdueSuamtSum: overdueSuamtOfflineAfter1Month,
            match: Number(debtOfflineAfter1Month.toFixed(2)) === Number(overdueSuamtOfflineAfter1Month.toFixed(2)),
          },
          after4Month: {
            debtSum: debtOfflineAfter4Month,
            overdueSuamtSum: overdueSuamtOfflineAfter4Month,
            match: Number(debtOfflineAfter4Month.toFixed(2)) === Number(overdueSuamtOfflineAfter4Month.toFixed(2)),
          },
          after12Month: {
            debtSum: debtOfflineAfter12Month,
            overdueSuamtSum: overdueSuamtOfflineAfter12Month,
            match: Number(debtOfflineAfter12Month.toFixed(2)) === Number(overdueSuamtOfflineAfter12Month.toFixed(2)),
          },
          after36Month: {
            debtSum: debtOfflineAfter36Month,
            overdueSuamtSum: overdueSuamtOfflineAfter36Month,
            match: Number(debtOfflineAfter36Month.toFixed(2)) === Number(overdueSuamtOfflineAfter36Month.toFixed(2)),
          },
          offlineTotalAmt: offLineDebtData.reduce((acc, item) => acc + Number(item.thisMonthAmt ?? 0) + Number(item.after1MonthAmt ?? 0) 
                            + Number(item.after4MonthAmt ?? 0) + Number(item.after12MonthAmt ?? 0) + Number(item.after36MonthAmt ?? 0), 0),
          offlineTotalSuAmt: offLineDebtData.reduce((acc, item) => acc + Number(item.after1MonthSuAmt ?? 0) 
                            + Number(item.after4MonthSuAmt ?? 0) + Number(item.after12MonthSuAmt ?? 0) + Number(item.after36MonthSuAmt ?? 0), 0),

        },
        online: {
          after1Month: {
            debtSum: debtOnlineAfter1Month,
            overdueSuamtSum: overdueSuamtOnlineAfter1Month,
            match: Number(debtOnlineAfter1Month.toFixed(2)) === Number(overdueSuamtOnlineAfter1Month.toFixed(2)),
          },
          after4Month: {
            debtSum: debtOnlineAfter4Month,
            overdueSuamtSum: overdueSuamtOnlineAfter4Month,
            match: Number(debtOnlineAfter4Month.toFixed(2)) === Number(overdueSuamtOnlineAfter4Month.toFixed(2)),
          },
          after12Month: {
            debtSum: debtOnlineAfter12Month,
            overdueSuamtSum: overdueSuamtOnlineAfter12Month,
            match: Number(debtOnlineAfter12Month.toFixed(2)) === Number(overdueSuamtOnlineAfter12Month.toFixed(2)),
          },
          after36Month: {
            debtSum: debtOnlineAfter36Month,
            overdueSuamtSum: overdueSuamtOnlineAfter36Month,
            match: Number(debtOnlineAfter36Month.toFixed(2)) === Number(overdueSuamtOnlineAfter36Month.toFixed(2)),
          },
          onlineTotalAmt: onLineDebtData.reduce((acc, item) => acc + Number(item.thisMonthAmt ?? 0) + Number(item.after1MonthAmt ?? 0) 
                            + Number(item.after4MonthAmt ?? 0) + Number(item.after12MonthAmt ?? 0) + Number(item.after36MonthAmt ?? 0), 0),
          onlineTotalSuAmt: onLineDebtData.reduce((acc, item) => acc + Number(item.after1MonthSuAmt ?? 0) 
                            + Number(item.after4MonthSuAmt ?? 0) + Number(item.after12MonthSuAmt ?? 0) + Number(item.after36MonthSuAmt ?? 0), 0),
        },
      });

      setShowStartButton(true);
  };

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
      alert("수납 데이터 정산 완료! " + response.data + "건");
      setDataLoaded(true);
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
      if (!response.data || !Array.isArray(response.data.offLine) || !Array.isArray(response.data.onLine)) {
        console.error("API 응답 포맷 오류:", response.data);
        alert("데이터 포맷 오류");
        return;
      }
      setOffLineDebtData(response.data.offLine);
      setOnLineDebtData(response.data.onLine);
      setDebtLoaded(true);
    } catch (err) {
      console.error("채권추심 상세내역 조회 실패:", err);
      alert("채권추심 상세내역 조회 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleOverdueSuamt = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/receive/lg/overdue");
      if (!response.data || !Array.isArray(response.data.offLine) || !Array.isArray(response.data.onLine)) {
        console.error("API 응답 포맷 오류:", response.data);
        alert("데이터 포맷 오류");
        return;
      }
      setOffLineOverdueSuamtData(response.data.offLine);
      setOnLineOverdueSuamtData(response.data.onLine);
      setOverdueSuamtLoaded(true);
    } catch (err) {
      console.error("수납연체가산금 대사 실패:", err);
      alert("수납연체가산금 대사 실패!");
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

  const handleStartButtonClick = async () => {
    const userConfirmed = window.confirm("대사를 완료하셨습니까?");
    if (userConfirmed) {
      setLoading(true);
      try {
        await axios.post("/api/sunab/start");
        alert("수납이 시작되었습니다!");
      } catch (err) {
        console.error("수납 시작 실패:", err);
        alert("수납 시작 실패!");
      } finally {
        setLoading(false);
      }
    } else {
      alert("수납이 취소되었습니다.");
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
                        {`1. 수납 파일 업로드
            2. 수납 데이터 적재
            3. 채권추심 상세내역 조회 + 수납연체가산금 조회 = 대사 가능
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
        <h2 className="mb-8 text-xl font-bold">📁 LG 수납 파일 업로드</h2>
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
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading || !dataLoaded ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
          onClick={handleDetail}
          disabled={loading || !dataLoaded}
        >
          상세내역 조회
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading || !dataLoaded ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={handleCollectionDetail}
          disabled={loading || !dataLoaded}
        >
          채권추심 상세내역 조회
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading || !dataLoaded ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          onClick={handleOverdueSuamt}
          disabled={loading || !dataLoaded}
        >
          수납연체가산금 조회
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-lg ${
            loading || !(overdueSuamtLoaded && debtLoaded)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
          onClick={handleCompareResultCheck}
          disabled={loading || !(overdueSuamtLoaded && debtLoaded)}
        >
          🔄 대사
        </button>
        {compareResult && showStartButton && (
          <button
            onClick={handleStartButtonClick}
            className={`px-4 py-2 rounded-lg text-lg ${
              loading || !allChecked ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            disabled={loading || !allChecked}
          >
            🚨 수납시작
          </button>
        )}
      </div>

      {/* 3분할 레이아웃 */}
      {(detailData.length > 0 || offLineDebtData.length > 0 || onLineDebtData.length > 0 
           || offLineOverdueSuamtData.length > 0 || onLineOverdueSuamtData.length > 0) && (
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
          {(offLineDebtData.length > 0 || onLineDebtData.length > 0 || offLineOverdueSuamtData.length > 0 || onLineOverdueSuamtData.length > 0) && (
            <div className="flex-1 flex flex-col gap-4">
              {/* 위쪽 (B) */}
              {/* (B) 오프라인 채권추심 상세내역 */}
              {offLineDebtData.length > 0 && (
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
                      {offLineDebtData.map((item, index) => {
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
                          const colSum = offLineDebtData.reduce(
                            (acc, item) => acc + Number(item[field as keyof CollectionData] ?? 0),
                            0
                          );
                          return (
                            <td key={`offline-sum-${idx}`} className="px-2 py-1 border text-right">
                              {colSum.toLocaleString()}
                            </td>
                          );
                        })}
                        <td className="px-2 py-1 border text-right">
                          {offLineDebtData
                            .reduce((acc, item) => {
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
                            }, 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {/* 아래쪽 (C) */}
              {/* (C) 온라인 채권추심 상세내역 */}
              {onLineDebtData.length > 0 && (
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
                      {onLineDebtData.map((item, index) => {
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
                          const colSum = onLineDebtData.reduce(
                            (acc, item) => acc + Number(item[field as keyof CollectionData] ?? 0),
                            0
                          );
                          return (
                            <td key={`online-sum-${idx}`} className="px-2 py-1 border text-right">
                              {colSum.toLocaleString()}
                            </td>
                          );
                        })}
                        <td className="px-2 py-1 border text-right">
                          {onLineDebtData
                            .reduce((acc, item) => {
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
                            }, 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex gap-4">
                {offLineOverdueSuamtData.length > 0 && (
                  <div className="border p-2 overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-2">📊 연체가산금 내역 (OffLine)</h3>
                    <table className="min-w-full text-xs text-left border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 border">거래월</th>
                          <th className="px-2 py-1 border text-right">연체가산금</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 누적합계 행 */}
                        <tr className="bg-gray-100 font-semibold">
                          <td className="px-2 py-1 border text-right">1개월 경과</td>
                          <td className="px-2 py-1 border text-right">
                            {offLineOverdueSuamtData
                              .slice(0, 3)
                              .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-gray-100 font-semibold">
                          <td className="px-2 py-1 border text-right">4개월 경과</td>
                          <td className="px-2 py-1 border text-right">
                            {offLineOverdueSuamtData
                              .slice(3, 11)
                              .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-gray-100 font-semibold">
                          <td className="px-2 py-1 border text-right">12개월 경과</td>
                          <td className="px-2 py-1 border text-right">
                            {offLineOverdueSuamtData
                              .slice(11, 35)
                              .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-gray-100 font-semibold">
                          <td className="px-2 py-1 border text-right">36개월 경과</td>
                          <td className="px-2 py-1 border text-right">
                            {offLineOverdueSuamtData
                              .slice(35, offLineOverdueSuamtData.length)
                              .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                        {offLineOverdueSuamtData.map((item, index) => (
                          <tr key={`offline-${index}`}>
                            <td className="px-2 py-1 border">{item.cyearmon}</td>
                            <td className="px-2 py-1 border text-right">{Number(item.overdueSuamt ?? 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {onLineOverdueSuamtData.length > 0 && (
                    <div className="border p-2 overflow-x-auto">
                      <h3 className="text-lg font-semibold mb-2">📊 연체가산금 내역 (OnLine)</h3>
                      <table className="min-w-full text-xs text-left border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-2 py-1 border">거래월</th>
                            <th className="px-2 py-1 border text-right">연체가산금</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 누적합계 행 */}
                          <tr className="bg-gray-100 font-semibold">
                            <td className="px-2 py-1 border text-right">1개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {onLineOverdueSuamtData
                                .slice(0, 3)
                                .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                                .toLocaleString()}
                            </td>
                          </tr>
                          <tr className="bg-gray-100 font-semibold">
                            <td className="px-2 py-1 border text-right">4개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {onLineOverdueSuamtData
                                .slice(3, 11)
                                .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                                .toLocaleString()}
                            </td>
                          </tr>
                          <tr className="bg-gray-100 font-semibold">
                            <td className="px-2 py-1 border text-right">12개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {onLineOverdueSuamtData
                                .slice(11, 35)
                                .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                                .toLocaleString()}
                            </td>
                          </tr>
                          <tr className="bg-gray-100 font-semibold">
                            <td className="px-2 py-1 border text-right">36개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {onLineOverdueSuamtData
                                .slice(35, onLineOverdueSuamtData.length)
                                .reduce((acc, item) => acc + Number(item.overdueSuamt ?? 0), 0)
                                .toLocaleString()}
                            </td>
                          </tr>
                          {onLineOverdueSuamtData.map((item, index) => (
                            <tr key={`online-${index}`}>
                              <td className="px-2 py-1 border">{item.cyearmon}</td>
                              <td className="px-2 py-1 border text-right">{Number(item.overdueSuamt ?? 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                )}
                {compareResult && (
                  <div className="w-full max-w-7xl border p-4 mt-4">
                    <h3 className="text-lg font-bold mb-2">📊 대사 결과</h3>

                    {/* Offline */}
                    <div className="mb-4">
                      <h4 className="text-md font-semibold mb-1">🔍 오프라인</h4>
                      <table className="min-w-full text-xs text-left border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-2 py-1 border">구분</th>
                            <th className="px-2 py-1 border text-right">채권추심 합계</th>
                            <th className="px-2 py-1 border text-right">연체가산금 합계</th>
                            <th className="px-2 py-1 border text-center">일치 여부</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 border">1개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after1Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after1Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.offline.after1Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border">4개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after4Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after4Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.offline.after4Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border">12개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after12Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after12Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.offline.after12Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border">36개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after36Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.offline.after36Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.offline.after36Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Online */}
                    <div>
                      <h4 className="text-md font-semibold mb-1">🔍 온라인</h4>
                      <table className="min-w-full text-xs text-left border">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-2 py-1 border">구분</th>
                            <th className="px-2 py-1 border text-right">채권추심 합계</th>
                            <th className="px-2 py-1 border text-right">연체가산금 합계</th>
                            <th className="px-2 py-1 border text-center">일치 여부</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 border">1개월 경과</td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.online.after1Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.online.after1Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.online.after1Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border">4개월 경과</td>
                             <td className="px-2 py-1 border text-right">
                              {compareResult.online.after4Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.online.after4Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.online.after4Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border">12개월 경과</td>
                             <td className="px-2 py-1 border text-right">
                              {compareResult.online.after12Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.online.after12Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.online.after12Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border">36개월 경과</td>
                             <td className="px-2 py-1 border text-right">
                              {compareResult.online.after36Month.debtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-right">
                              {compareResult.online.after36Month.overdueSuamtSum.toLocaleString()}
                            </td>
                            <td className="px-2 py-1 border text-center">
                              {compareResult.online.after36Month.match ? '✔️' : '❌'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 정산서 비교용 */}
                    <div className="w-full max-w-7xl border p-4 mt-4">
                      <h3 className="text-lg font-bold mb-2">📊 정산서 비교용</h3>
                      <div>
                        <div>
                          <h4 className="text-md font-semibold mb-1">🔍 오프라인 당월청구수납 + 연체수납</h4>
                            <div className="px-2 py-1 border text-right">
                              <p>{Number(compareResult.offline.offlineTotalAmt).toLocaleString()} 원
                              확인 완료<input type="checkbox" checked={offlineAmtChecked} onChange={(e) => setOfflineAmtChecked(e.target.checked)} /></p>
                            </div>
                          <h4 className="text-md font-semibold mb-1">🔍 오프라인 연체가산금 수납</h4>
                            <div className="px-2 py-1 border text-right">
                              <p>{Number(compareResult.offline.offlineTotalSuAmt).toLocaleString()} 원
                              확인 완료<input type="checkbox" checked={offlineSuAmtChecked} onChange={(e) => setOfflineSuAmtChecked(e.target.checked)} /></p>
                            </div>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold mb-1">🔍 온라인 당월청구수납 + 연체수납</h4>
                            <div className="px-2 py-1 border text-right">
                              <p>{Number(compareResult.online.onlineTotalAmt).toLocaleString()} 원
                              확인 완료<input type="checkbox" checked={onlineAmtChecked} onChange={(e) => setOnlineAmtChecked(e.target.checked)} /></p>
                            </div>
                          <h4 className="text-md font-semibold mb-1">🔍 온라인 연체가산금 수납</h4>
                            <div className="px-2 py-1 border text-right">
                              <p>{Number(compareResult.online.onlineTotalSuAmt).toLocaleString()} 원
                              확인 완료<input type="checkbox" checked={onlineSuAmtChecked} onChange={(e) => setOnlineSuAmtChecked(e.target.checked)} /></p>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadPageContainer;
