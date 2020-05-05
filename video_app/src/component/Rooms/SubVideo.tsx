import styled from 'styled-components';
import React, {useEffect, useRef} from "react";

interface Props {
    stream: MediaStream;
}

export const SubVideo: React.FC<Props> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video === null) {
            return;
        }

        video.srcObject = stream;
        video.play().catch(err => console.log(err));
    }, [stream]);

    return (
        <Wrapper>
            <Video
                playsInline
                ref={videoRef}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
  margin: 0 0 8px 0; 
`;

const Video = styled.video`
  width: 500px;
  height: 32vh;
`;
