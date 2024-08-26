import { useState, useRef, Suspense, useEffect } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
  FlyControls,
  Html,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import { SpotLightHelper } from "three";





const CameraShift = ({ targetPosition, targetRotation }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState(0);

  useFrame(({ camera }) => {
    if (isAnimating && targetPosition && targetRotation) {
      const elapsedTime = Date.now() - animationStartTime;
      const duration = 2000; // Duration of the animation in milliseconds
      const t = Math.min(elapsedTime / duration, 0.1);

      camera.position.lerpVectors(camera.position.clone(), targetPosition, t);
      camera.rotation.x = THREE.MathUtils.lerp(
        camera.rotation.x,
        targetRotation.x,
        t
      );
      camera.rotation.y = THREE.MathUtils.lerp(
        camera.rotation.y,
        targetRotation.y,
        t
      );
      camera.rotation.z = THREE.MathUtils.lerp(
        camera.rotation.z,
        targetRotation.z,
        t
      );

      if (t === 1) {
        setIsAnimating(false);
        camera.position.copy(targetPosition);
        camera.rotation.copy(targetRotation);
      }
    }
  });

  const { camera } = useThree();

  useEffect(() => {
    if (targetPosition && targetRotation) {
      setAnimationStartTime(Date.now());
      setIsAnimating(true);
    }
  }, [targetPosition, targetRotation]);

  return null;
};

const Sky = ({ daynighttogglestate }) => {
  const radius = 100; // Size of the sky sphere

  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color={daynighttogglestate ? "#0f0f0f" : "#87CEEB"}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

function App() {
  const [targetPosition, setTargetPosition] = useState(null);
  const [targetRotation, setTargetRotation] = useState(null);
  const [HTMLRotation, setHTMLRotation] = useState([0, 0, 0]);
  const [HTMLPosition, setHTMLPosition] = useState([-0.008, -0.124, 0.025]);

  const [daynighttoggle, setDaynighttoggle] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        handleButtonClick();
      } else if (event.key === "ArrowDown") {
        handleBackClick();
      } else if (event.key === "ArrowLeft") {
        handleProjectClick();
      } else if (event.key === "ArrowRight") {
        handleContactClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDayNightToggle = () => {
    setDaynighttoggle(!daynighttoggle);
    console.log(daynighttoggle);
  };

  const handleButtonClick = () => {
    setTargetPosition(new THREE.Vector3(0.15, 2.1, 4.75)); // Define the target position for the camera shift
    setTargetRotation(new THREE.Euler(-0.4, 0.6, 0.225));
    //setHTMLRotation(new THREE.Euler(-0.30255377056249727,  0.48176162984942383,  0.14362979953155677))
    // setScreenPosition(new THREE.Vector3(0.2445, 0.8985, 4.25))
  };

  const handleBackClick = () => {
    setTargetRotation(new THREE.Euler(-0.16514867741462677, 0, 0));
    setTargetPosition(new THREE.Vector3(0, 2.5, 9));
    setHTMLPosition(new THREE.Vector3(-0.008, -0.124, 0.025));
  };

  const handleProjectClick = () => {
    setTargetPosition(new THREE.Vector3(-3.95, 2.5, 6.05));
    setTargetRotation(new THREE.Euler(0, 0, 0));
  };

  const handleContactClick = () => {
    setTargetPosition(new THREE.Vector3(3.95, 2.5, 6.05));
    setTargetRotation(new THREE.Euler(0, 0, 0));
    //  setHTMLPosition(new THREE.Vector3(0,0,0))
  };

  return (
    <>
      <div className="App flex justify-center items-center relative">
        {/* <div className="flex justify-around w-1/3 absolute bottom-2">
          <button
            className="bg-black/60 rounded-lg p-4 text-white   "
            onClick={handleProjectClick}
            style={{ zIndex: 1 }}
          >
            Projects
          </button>
          <button
            className="bg-black/60 rounded-lg p-4 text-white    "
            onClick={handleButtonClick}
            style={{ zIndex: 1 }}
          >
            About Me
          </button>
          <button
            className="bg-black/60 rounded-lg p-4 text-white   "
            onClick={handleContactClick}
            style={{ zIndex: 1 }}
          >
            Contact Me
          </button>
          <button
            className="bg-black/60 rounded-lg p-4 text-white   "
            onClick={handleBackClick}
            style={{ zIndex: 1 }}
          >
            Back
          </button>
        </div> */}
        <Canvas
          shadows
          camera={{
            position: new THREE.Vector3(0, 2.5, 9), // default z 9
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />

         

           
            <Sky daynighttogglestate={daynighttoggle} />
            {/* <OrbitControls
              enableRotate={true}
              enablePan={true}
              enableZoom={true}
            /> */}
            <FlyControls movementSpeed={5} rollSpeed={0.5} dragToLook={true} // When true, allows dragging the mouse to look around
        autoForward={false} />
            <Environment preset="city">
              <mesh>
                <sphereGeometry args={[100, 32, 32]} />
                <meshStandardMaterial
                  color={daynighttoggle ? "#0f0f0f" : "#fff3d1"}
                  side={1}
                />
              </mesh>
            </Environment>
            <CameraShift
              targetPosition={targetPosition}
              targetRotation={targetRotation}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;