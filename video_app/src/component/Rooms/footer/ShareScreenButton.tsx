import React, {useCallback} from "react";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {VideoActions} from "../../../actions/video";

export const ShareScreenButton: React.FC = () => {
    const dispatch = useDispatch();

    const shareScreenButtonClicked = useCallback(() => {
        startCapture().then((stream: MediaStream) => {
            dispatch(VideoActions.shareScreenButtonClicked(stream));
        }).catch(err => {
            console.log(err)
        });
    }, [dispatch]);

    async function startCapture() {
        let captureStream = null;
        try {
            captureStream = await (navigator.mediaDevices as any).getDisplayMedia({video: true});
        } catch(err) {
            console.error("Error: " + err);
        }
        return captureStream;
    }

    return (
        <Wrapper>
            <Button onClick={shareScreenButtonClicked}>画面共有</Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
`;

const Button = styled.button`
    display: block;
    font-size: 16px;/*文字サイズ*/
    color: #FFF;/*文字色*/
    width: 56px;/*幅*/
    height: 56px;/*高さ*/
    background: #03a9f4;/*背景色*/
    text-align: center;/*中央寄せ*/
    border-radius: 50%;/*角丸く*/
    transition: .3s;/*滑らかな動きに*/
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.12), 0 2px 2px 0 rgba(0,0,0,.24);/*影*/
    &:hover {
     box-shadow: 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2);
    }
`;
