
import styled from 'styled-components';
import KakaoIcon from 'public/kakaotalk_logo_icon_147272.svg';
import Image from 'next/image'
// import KakaoIcon from 'public/k';
import { Button } from '@chakra-ui/react';

const SButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const KakaoShareBtn = () => {
  const onClick = () => {
    const { Kakao, location } = window;
    Kakao.Link.sendScrap({
      requestUrl: location.href,
    });
  };
  return (
    <SButton borderColor="whiteYellow" onClick={onClick}>
      <KakaoIcon viewBox="0 0 60 48" width="30px" height="23px" />
      카카오톡 공유하기
    </SButton>
  );
};

export default KakaoShareBtn;