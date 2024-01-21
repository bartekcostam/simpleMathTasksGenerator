import { useRef, useEffect } from 'react';

export function Draw(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Draw canvas here...

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  
    context.fillStyle = 'red';
    context.fillRect(0, 0, props.width, props.height);
  }, []);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}