import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import {SubVideo} from "./SubVideo";

interface Props {
    streams: MediaStream[];
}

export const SubVideos: React.FC<Props> = ({streams}) => {

    useEffect(() => {
    }, []);

    return (
        <Wrapper>
            {streams.map(stream => {
                return(
                    <SubVideo
                        key={stream.id}
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
