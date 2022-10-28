import { useRouter } from "next/dist/client/router";

// 접근해보기
// http://localhost:3000/dynamic/1
// http://localhost:3000/dynamic/abc

const Dynamic = () => {
  // useRouter 불러오기
  const router = useRouter();
  
  // path로 전달받은 value 가져오기
  const { id } = router.query;
  
  const moveHome = () => {
  // router.push를 활용해 페이지 이동 가능
    router.push("/");
  };

  return (
    <div>
      <button onClick={moveHome}>홈으로</button>
      <p>Hello Dynamic-{id}</p>
    </div>
  )
  
};
export default Dynamic;