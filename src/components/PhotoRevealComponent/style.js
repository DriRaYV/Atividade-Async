import { Box } from "@mui/material";
import styled, { css } from "styled-components";

export const BoxPhoto = styled(Box)(
  ({ img, blur }) => css`
    && {
      width: 26rem;
      height: 35rem;
      position: relative;
      overflow: hidden;
      border: solid 4px #000;
    }

    &&::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${img});
      background-position: center;
      background-size: cover;
      filter: blur(${blur + "px"});
      z-index: -1;
    }
  `
);
