import { Autocomplete, Box, Typography } from "@mui/material";
import styled from "styled-components";

export const PageWrapper = styled(Box)`
  && {
    width: 100vw;
    height: 92vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 2rem 0;
  }
`;
export const BoxPhoto = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
`;

export const BoxInfoPhoto = styled(Box)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }
`;

export const MovieInfo = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 30%;
    border: solid 3px;
    padding: 2rem;
  }
`;

export const Input = styled(Autocomplete)`
  && {
    background-color: #fff;
    width: 100%;
    color: #fff;
  }
`;

export const Text = styled(Typography)`
  && {
    font-size: 1.25rem;
    color: #7f7f7f;
  }
`;

export const Title = styled(Typography)`
  && {
    font-size: 1.5rem;
    font-weight: bold;
    color: #585858;
  }
`;

export const Tip = styled(Typography)`
  && {
    font-size: 1.15rem;
    color: #7f7f7f;
  }
`;
export const BoxTips = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;
