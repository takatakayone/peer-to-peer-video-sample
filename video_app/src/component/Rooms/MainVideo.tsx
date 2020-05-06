import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';

interface Props {
    stream: MediaStream;
}

export const MainVideo: React.FC<Props> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video === null) {
            return;
        }
        video.muted = true;
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
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
  height:100%;
  background:#282c34;
`;

const Video = styled.video`
  width: 100%;
  background:#282c34;
`;
