import React from "react";
import * as S from "./style";
const PhotoRevealComponent = ({ img, blur }) => {
  return <S.BoxPhoto blur={blur} img={img}></S.BoxPhoto>;
};

export { PhotoRevealComponent };
