import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {SubVideo} from "./SubVideo";
import {VideoMedia} from "../../models/videoMedia";

interface Props {
    streams: VideoMedia[];
}

export const SubVideos: React.FC<Props> = ({streams}) => {

    useEffect(() => {
    }, []);

    return (
        <Wrapper>
            {streams.map((stream, index) => {
                return(
                    <SubVideo
                        key={index}
                        stream={stream}
                    />
                )
            })
            }
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 0;
`;
