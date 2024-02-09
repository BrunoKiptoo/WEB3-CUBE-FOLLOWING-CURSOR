import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import ComingSoonPoster from '../Assets/K4D-logo.png';
import BackgroundImage from '../Assets/Bard_Generated_Image (29).jpeg';

const FOX3D = () => {
  const containerRef = useRef();
  const mouse = new THREE.Vector2();
  const imagePlaneRef = useRef();

  useEffect(() => {
    let scene, camera, renderer, imagePlane;

    // Initialize Three.js scene
    scene = new THREE.Scene();

    // Add light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    containerRef.current.appendChild(renderer.domElement);

    // Create image plane
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(ComingSoonPoster, (texture) => {
      texture.minFilter = THREE.LinearFilter; // Set minification filter
      texture.magFilter = THREE.LinearFilter; // Set magnification filter
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Enable anisotropic filtering
    });
    const geometry = new THREE.PlaneGeometry(4, 4); // Adjust size as needed
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    imagePlane = new THREE.Mesh(geometry, material);
    imagePlane.position.set(0, 0, 0); // Adjust position as needed
    scene.add(imagePlane);
    imagePlaneRef.current = imagePlane;

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Attach mouse move event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate image plane towards the cursor
      const imagePlanePosition = new THREE.Vector3();
      imagePlaneRef.current.getWorldPosition(imagePlanePosition);
      const targetRotation = Math.atan2(mouse.y - imagePlanePosition.y, mouse.x - imagePlanePosition.x);
      imagePlane.rotation.z = targetRotation;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default FOX3D;
