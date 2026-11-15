"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function NeuralScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Generate subtle constellation nodes in 3D space
    const nodeCount = 34;
    const nodeGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const originalPositions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    // Subtle sky-cyan accents matching dark navy backdrop
    const palette = [
      new THREE.Color("#0ea5e9"), // Sky Cyan
      new THREE.Color("#38bdf8"), // Light Sky
      new THREE.Color("#0284c7"), // Deep Sky
    ];

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 110;
      const y = (Math.random() - 0.5) * 75;
      const z = (Math.random() - 0.5) * 55;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    nodeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Circle Sprite Material for soft neural dots
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(pointCloud);

    // Subtle Constellation Connections (LineSegments)
    const maxConnections = 65;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 20;
      targetY = y * 15;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera interpolation
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      camera.position.x = mouseX * 0.5;
      camera.position.y = mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      // Subtle wave movement across nodes
      const posAttr = nodeGeometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        posArray[i * 3] = ox + Math.sin(elapsedTime * 0.8 + oy * 0.05) * 2.2;
        posArray[i * 3 + 1] = oy + Math.cos(elapsedTime * 0.7 + ox * 0.05) * 2.2;
        posArray[i * 3 + 2] = oz + Math.sin(elapsedTime * 0.6 + oz * 0.05) * 2.0;
      }
      posAttr.needsUpdate = true;

      // Update connecting synaptic lines dynamically
      let connectionCount = 0;
      const connectionDist = 28;
      const linePosAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
      const linePosArr = linePosAttr.array as Float32Array;
      const lineColorAttr = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
      const lineColorArr = lineColorAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (connectionCount >= maxConnections) break;

          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist) {
            const idx = connectionCount * 6;
            linePosArr[idx] = posArray[i * 3];
            linePosArr[idx + 1] = posArray[i * 3 + 1];
            linePosArr[idx + 2] = posArray[i * 3 + 2];

            linePosArr[idx + 3] = posArray[j * 3];
            linePosArr[idx + 4] = posArray[j * 3 + 1];
            linePosArr[idx + 5] = posArray[j * 3 + 2];

            const alpha = 1.0 - dist / connectionDist;
            lineColorArr[idx] = 0.02 * alpha;
            lineColorArr[idx + 1] = 0.71 * alpha;
            lineColorArr[idx + 2] = 0.83 * alpha;

            lineColorArr[idx + 3] = 0.06 * alpha;
            lineColorArr[idx + 4] = 0.73 * alpha;
            lineColorArr[idx + 5] = 0.51 * alpha;

            connectionCount++;
          }
        }
      }

      lineGeometry.setDrawRange(0, connectionCount * 2);
      linePosAttr.needsUpdate = true;
      lineColorAttr.needsUpdate = true;

      // Slow overall rotation
      pointCloud.rotation.y = elapsedTime * 0.03;
      lines.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up memory
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden opacity-50"
      aria-hidden="true"
    />
  );
}
