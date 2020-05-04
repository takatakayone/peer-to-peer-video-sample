import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';

interface Props {
    stream: MediaStream;
}

export const MainVideo: React.FC<Props> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        console.log("hey")
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
  
`;

const Video = styled.video`
  width: auto;
  height: auto;
`;
