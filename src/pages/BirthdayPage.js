import PixelAnimator from "../PixelAnimator";
import "../App.css";
import Confetti from "../Confetti";
import PhotoOverlay from "../components/PhotoOverlay";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Asset paths from public folder
const cake1 = "/images/cake1.png";
const cake2 = "/images/cake2.png";
const cake3 = "/images/cake3.png";
const cake100 = "/images/100.png";
const cake80 = "/images/80.png";
const cake60 = "/images/60.png";
const cake40 = "/images/40.png";
const cake20 = "/images/20.png";
const birthdayText = "/images/birthdaytext.png";
const birthdaySong = "/audio/bdayaudio.mp3";

export default function BirthdayPage() {
  const audioRef = useRef(null);
  const [currentCakeFrame, setCurrentCakeFrame] = useState(null);
  const [showPhotoOverlay, setShowPhotoOverlay] = useState(false);
  const [searchParams] = useSearchParams();

  const micStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const gainNodeRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Get photo URL from query parameter
  const photoUrl = searchParams.get('photo');

  // Debug: Log the photo URL
  useEffect(() => {
    console.log('Photo URL from params:', photoUrl);
    if (photoUrl) {
      console.log('Decoded URL:', decodeURIComponent(photoUrl));
    }
  }, [photoUrl]);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.log("Autoplay blocked, waiting for user interaction:", err);
      }
    };
    playAudio();
  }, []);

  useEffect(() => {
    startMicMonitoring();
    return () => {
      stopMicMonitoring();
    };
  }, []);

  const handleCakeClick = async () => {
    const audio = audioRef.current;
    audio.play();
  };

  const selectCakeFrameByVolume = (volumeLevel) => {
    if (volumeLevel < 0.02) return null;
    if (volumeLevel >= 0.30) return cake20;
    if (volumeLevel >= 0.22) return cake40;
    if (volumeLevel >= 0.15) return cake60;
    if (volumeLevel >= 0.08) return cake80;
    return cake100;
  };

  const startMicMonitoring = async () => {
    if (micStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const gainNode = audioCtx.createGain();
      const sensitivity = 3.0;
      gainNode.gain.value = sensitivity;
      gainNodeRef.current = gainNode;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(gainNode);
      gainNode.connect(analyser);

      const data = new Float32Array(analyser.fftSize);

      const analyzeAudioLoop = () => {
        analyser.getFloatTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = data[i];
          sum += v * v;
        }
        const volumeLevel = Math.sqrt(sum / data.length);

        try { console.debug('mic volume level=', volumeLevel.toFixed(4)); } catch (e) {}
        const selectedFrame = selectCakeFrameByVolume(volumeLevel);
        setCurrentCakeFrame((prev) => {
          if (prev === selectedFrame) return prev;
          return selectedFrame;
        });
        animationFrameRef.current = requestAnimationFrame(analyzeAudioLoop);
      };

      animationFrameRef.current = requestAnimationFrame(analyzeAudioLoop);
    } catch (err) {
      console.warn("Microphone access denied or failed:", err);
    }
  };

  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (currentCakeFrame === cake20) {
      stopMicMonitoring(false);
      setShowConfetti(true);
    }
  }, [currentCakeFrame]);

  const stopMicMonitoring = (resetAnimation = true) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
        if (gainNodeRef.current) {
          try { gainNodeRef.current.disconnect(); } catch (e) {}
          gainNodeRef.current = null;
        }
      } catch (e) {}
      analyserRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (resetAnimation) {
      setCurrentCakeFrame(null);
    }
  };

  return (
    <div className="App">
      <audio ref={audioRef} src={birthdaySong} loop />
      <img src={birthdayText} alt="Happy Birthday" className="birthdayText" draggable={false} />
      <div className="cakeLoop">
        {currentCakeFrame ? (
          <PixelAnimator
            className="cake"
            frames={[currentCakeFrame]}
            fps={3}
            scale={4}
            mode="img"
            onClick={handleCakeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleCakeClick();
            }}
          />
        ) : (
          <PixelAnimator
            className="cake"
            frames={[cake1, cake2, cake3]}
            fps={3}
            scale={4}
            mode="img"
            onClick={handleCakeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleCakeClick();
            }}
          />
        )}
      </div>
      {showConfetti && (
        <Confetti
          pieces={48}
          duration={8000}
          onDone={() => {
            console.log('Confetti done! Photo URL:', photoUrl);
            setShowConfetti(false);
            if (photoUrl) {
              console.log('Setting showPhotoOverlay to true');
              setTimeout(() => setShowPhotoOverlay(true), 250);
            } else {
              console.log('No photo URL found');
            }
          }}
        />
      )}
      
      {showPhotoOverlay && photoUrl && (
        <PhotoOverlay 
          photoUrl={decodeURIComponent(photoUrl)}
          onClose={() => {
            console.log('Closing photo overlay');
            setShowPhotoOverlay(false);
          }}
        />
      )}
    </div>
  );
}

