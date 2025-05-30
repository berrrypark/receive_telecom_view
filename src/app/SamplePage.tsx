'use client';

import { useState } from 'react';
import axios from 'axios';

const SamplePage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (file.name.endsWith('.layout')) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      console.warn(`다음 파일들은 업로드할 수 없습니다: ${invalidFiles.join(', ')}`);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await axios.post('http://localhost:8081/api/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('업로드할 파일:', files);
      alert('파일 업로드 완료!');
      setUploadComplete(true);
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert('업로드 실패!');
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await axios.get('http://localhost:8081/api/sunab/lg/start');
      alert('완료되었습니다');
    } catch (err) {
      console.error(err);
      alert('정산 처리 실패!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>📁 LG 수납 파일 업로드</h2>

        <input
          type="file"
          accept=".layout"
          multiple
          onChange={handleFileChange}
          style={styles.fileInput}
        />

        <button onClick={handleUpload} disabled={files.length === 0} style={styles.button}>
          업로드
        </button>

        {files.length > 0 && (
          <div style={{ marginTop: '20px', width: '100%' }}>
            <h4>선택된 파일:</h4>
            <ul style={styles.fileList}>
              {files.map((file, index) => (
                <li key={index} style={styles.fileItem}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {uploadComplete && (
          <div style={{ marginTop: '20px' }}>
            {loading ? (
              <p style={{ marginTop: '12px' }}>⏳ 수납 정산 처리 중...</p>
            ) : (
              <button
                style={{ ...styles.button, backgroundColor: '#28a745' }}
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

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f6f8fa',
    fontFamily: 'sans-serif',
  } as React.CSSProperties,
  card: {
    background: '#fff',
    color: '#000', // ✅ 글자색 고정
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '400px',
  } as React.CSSProperties,
  fileInput: {
    marginBottom: '16px',
    display: 'block',
    margin: '0 auto 20px auto',
  } as React.CSSProperties,
  button: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  } as React.CSSProperties,
  fileList: {
    listStyleType: 'none',
    padding: 0,
    textAlign: 'left',
  } as React.CSSProperties,
  fileItem: {
    background: '#f1f3f5',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
  } as React.CSSProperties,
};

export default SamplePage;
