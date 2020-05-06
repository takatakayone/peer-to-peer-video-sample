import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';

// interface Props {
//     stream: MediaStream;
// }

export const PreparationVideo: React.FC = ({}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // useEffect(() => {
    //     const video = videoRef.current;
    //     if (video === null) {
    //         return;
    //     }
    //     video.muted = true;
    //     video.srcObject = stream;
    //     video.play().catch(err => console.log(err));
    // }, [stream]);

    return (
      <Video
          playsInline
          ref={videoRef}
      />
    );
};

const Video = styled.video`
  width: 100%;
  height: 70%;
  background-color: #000000;
  border-radius: 32px;
`;
