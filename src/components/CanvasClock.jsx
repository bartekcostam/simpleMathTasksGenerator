import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const CanvasClock = ({time}) => {
    const canvasRef = useRef(null);

    const drawHand = (ctx, pos, length, width, color) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color; // Use strokeStyle instead of fillStyle for the hands
        ctx.moveTo(0, 0); // Start at the center of the clock
        ctx.rotate(pos);
        ctx.lineTo(0, -length); // Draw the line for the hand
        ctx.stroke();
        ctx.rotate(-pos); // Reset the rotation for the next hand
    };

    const drawClock = (ctx, radius) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Reset the current transform to the identity matrix before starting to draw
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(radius, radius);
        const borderOffset = 10; // Adjust this value to move the border further out
        const clockRadius = radius * 0.9 + borderOffset;
        // Draw the clock face
        ctx.beginPath();
    ctx.arc(0, 0, clockRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.05; // You can also adjust the line width if needed
    ctx.stroke();
    
        // Draw the center of the clock
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    
        // Draw the numbers
        ctx.font = `${radius * 0.15}px Arial`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        for (let num = 1; num <= 12; num++) {
            let ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }

        // Draw the ticks
        for (let num = 0; num < 60; num++) {
            let ang = (num * Math.PI / 30);
            ctx.rotate(ang);
            ctx.beginPath();
            ctx.lineWidth = num % 5 === 0 ? radius * 0.02 : radius * 0.01;
            ctx.moveTo(radius * 0.9, 0);
            ctx.lineTo(radius * 0.95, 0);
            ctx.stroke();
            ctx.rotate(-ang);
        }

        // Get current time
        const now = time || new Date();
        const hour = now.hours % 12;
        const minute = now.minutes;
        const second = now.seconds;

        // Calculate hand angles
        const secondAngle = (second * Math.PI) / 30;
        const minuteAngle = (minute * Math.PI) / 30 + (secondAngle / 60);
        const hourAngle = (hour * Math.PI) / 6 + (minuteAngle / 12);

        // Draw the hands
        drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07, '#333'); // Hour
        drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.07, '#333'); // Minute
        // Optionally, you can draw the second hand if you'd like it to be visible
        drawHand(ctx, secondAngle, radius * 0.9, radius * 0.02, 'red'); // Second
    }
        // Draw the hands in the drawClock function, before setting the interval
        useEffect(() => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const radius = canvas.height / 2;
    
            // Update the drawClock call to use the passed-in time
            const updateClock = () => {
                drawClock(context, radius, time);
            };
    
            updateClock();
            // Remove the interval if you want to display a static time
            // or adjust the interval function to update the time
    
        }, [time]); // Add time as a dependency to useEffect
    
        return (
            <div style={{ textAlign: 'center' }}>
                <canvas ref={canvasRef} width={205} height={205} />
                <div>
                    { '........ : ........ : ........'}
                </div>
            </div>
        );
    };
    
    CanvasClock.propTypes = {
        time: PropTypes.shape({
            hours: PropTypes.number.isRequired,
            minutes: PropTypes.number.isRequired,
            seconds: PropTypes.number.isRequired,
        }),
    };
    
    export default CanvasClock;