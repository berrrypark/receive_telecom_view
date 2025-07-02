import SktReceivePageContainer from "./containers/ReceivePageContainer/SktReceivePageContainer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      {/* 전체 앱 렌더링 */}
      <SktReceivePageContainer />
      
      {/* 토스트 컨테이너는 앱 하단에 한번만! */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
