import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export default function CanvasCom() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      host.classList.add('orbital-3d-unavailable')
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 30)
    camera.position.set(0, 0, 7.6)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(Math.max(host.clientWidth, 1), Math.max(host.clientHeight, 1))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xfff4fc, 0x3b2937, 2.1))
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2)
    keyLight.position.set(-3, 4, 6)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0xff76d9, 12, 12)
    fillLight.position.set(2.5, 1.2, 2.5)
    scene.add(fillLight)

    const shell = new THREE.MeshStandardMaterial({ color: 0xfff8f1, roughness: 0.27, metalness: 0.2 })
    const shadowShell = new THREE.MeshStandardMaterial({ color: 0xd9cbd7, roughness: 0.32, metalness: 0.35 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x211b26, roughness: 0.24, metalness: 0.55 })
    const pink = new THREE.MeshStandardMaterial({ color: 0xffa1e9, emissive: 0xf23cc3, emissiveIntensity: 1.15, roughness: 0.22, metalness: 0.25 })
    const metal = new THREE.MeshStandardMaterial({ color: 0xb9a9b7, roughness: 0.25, metalness: 0.8 })
    const robot = new THREE.Group()
    scene.add(robot)

    const roundedBox = (parent: THREE.Object3D, size: [number, number, number], radius: number, material: THREE.Material, position: [number, number, number]) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 5, radius), material)
      mesh.position.set(...position)
      parent.add(mesh)
      return mesh
    }
    const sphere = (parent: THREE.Object3D, radius: number, material: THREE.Material, position: [number, number, number], scale: [number, number, number] = [1, 1, 1]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 20), material)
      mesh.position.set(...position)
      mesh.scale.set(...scale)
      parent.add(mesh)
      return mesh
    }
    const cylinder = (parent: THREE.Object3D, radiusTop: number, radiusBottom: number, height: number, material: THREE.Material, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 24), material)
      mesh.position.set(...position)
      mesh.rotation.set(...rotation)
      parent.add(mesh)
      return mesh
    }

    // Backpack details peek out around the body.
    roundedBox(robot, [0.72, 0.72, 0.35], 0.16, shadowShell, [0, -0.14, -0.31])
    for (const side of [-1, 1]) {
      roundedBox(robot, [0.08, 0.34, 0.1], 0.035, dark, [side * 0.3, -0.12, -0.5])
      sphere(robot, 0.075, pink, [side * 0.38, 0.22, -0.2], [0.7, 1, 0.8])
    }

    // Compact armored torso with a recessed mission-status panel.
    roundedBox(robot, [0.92, 0.91, 0.7], 0.26, shell, [0, -0.23, 0])
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.055, 12, 40), metal)
    collar.position.set(0, 0.23, 0.03)
    collar.rotation.x = Math.PI / 2
    robot.add(collar)
    roundedBox(robot, [0.61, 0.43, 0.07], 0.13, metal, [0, -0.19, 0.36])
    roundedBox(robot, [0.54, 0.36, 0.055], 0.1, dark, [0, -0.19, 0.398])
    roundedBox(robot, [0.11, 0.1, 0.035], 0.045, pink, [-0.16, -0.17, 0.438])
    for (let i = 0; i < 3; i += 1) {
      roundedBox(robot, [0.07, 0.025, 0.025], 0.01, metal, [0.04 + i * 0.1, -0.12, 0.43])
    }
    cylinder(robot, 0.055, 0.055, 0.07, metal, [0, 0.25, 0])

    // Helmet with a single glass visor and bright, friendly eye lenses.
    const head = new THREE.Group()
    head.position.set(0, 0.65, 0.02)
    robot.add(head)
    roundedBox(head, [1.12, 0.82, 0.86], 0.31, shell, [0, 0, 0])
    roundedBox(head, [0.88, 0.42, 0.12], 0.17, dark, [0, -0.02, 0.438])
    sphere(head, 0.085, pink, [-0.22, 0.015, 0.51], [0.78, 1.12, 0.5])
    sphere(head, 0.085, pink, [0.22, 0.015, 0.51], [0.78, 1.12, 0.5])
    roundedBox(head, [0.13, 0.025, 0.025], 0.01, shell, [0, -0.17, 0.514])

    // Low profile antenna and circular side sensors.
    cylinder(head, 0.035, 0.045, 0.23, metal, [0, 0.5, 0])
    sphere(head, 0.085, pink, [0, 0.63, 0])
    for (const side of [-1, 1]) {
      cylinder(head, 0.14, 0.14, 0.12, metal, [side * 0.57, 0, 0], [0, 0, Math.PI / 2])
      sphere(head, 0.095, dark, [side * 0.65, 0, 0])
      sphere(head, 0.045, pink, [side * 0.69, 0, 0.015])
    }

    // Shoulder pivots and separated forearms make the wave read clearly.
    const arms: THREE.Group[] = []
    for (const side of [-1, 1]) {
      sphere(robot, 0.19, metal, [side * 0.51, 0.1, 0])
      sphere(robot, 0.215, shell, [side * 0.53, 0.1, 0.015], [1, 0.9, 0.84])
      sphere(robot, 0.045, pink, [side * 0.53, 0.1, 0.19], [1, 1, 0.55])
      const arm = new THREE.Group()
      arm.position.set(side * 0.53, 0.08, 0.025)
      robot.add(arm)
      roundedBox(arm, [0.22, 0.43, 0.24], 0.1, shell, [0, -0.22, 0])
      sphere(arm, 0.13, dark, [0, -0.46, 0])
      roundedBox(arm, [0.23, 0.22, 0.22], 0.1, shell, [0, -0.59, 0.015])
      sphere(arm, 0.035, pink, [0, -0.59, 0.13])
      for (let finger = -1; finger <= 1; finger += 1) {
        roundedBox(arm, [0.045, 0.095, 0.055], 0.02, shell, [finger * 0.055, -0.7, 0.07])
      }
      arms.push(arm)
    }

    // Short articulated legs and broad boots ground the silhouette.
    for (const side of [-1, 1]) {
      cylinder(robot, 0.13, 0.13, 0.18, metal, [side * 0.22, -0.77, 0])
      roundedBox(robot, [0.24, 0.33, 0.29], 0.105, shell, [side * 0.22, -0.94, 0.015])
      roundedBox(robot, [0.27, 0.11, 0.36], 0.045, dark, [side * 0.22, -1.12, 0.085])
    }

    // Orbital halo and soft stars frame the mascot without competing with it.
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.012, 8, 128), new THREE.MeshBasicMaterial({ color: 0xff90e8 }))
    orbit.rotation.set(1.12, -0.25, -0.32)
    orbit.position.y = -0.06
    scene.add(orbit)
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(54 * 3)
    for (let i = 0; i < 54; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.75 + Math.random() * 1.2
      starPositions[i * 3] = Math.cos(angle) * radius
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.2
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2 - 0.9
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffe4f8, size: 0.035, transparent: true, opacity: 0.9 })))

    const clock = new THREE.Clock()
    let pointerX = 0
    let pointerY = 0
    let waveUntil = 0
    let dragging = false
    let activePointer = -1
    let lastPointerX = 0
    let lastPointerY = 0
    let movedDuringPress = false
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      if (dragging && event.pointerId === activePointer) {
        const deltaX = event.clientX - lastPointerX
        const deltaY = event.clientY - lastPointerY
        if (Math.abs(deltaX) + Math.abs(deltaY) > 2) movedDuringPress = true
        pointerX = THREE.MathUtils.clamp(pointerX + deltaX * 0.012, -0.85, 0.85)
        pointerY = THREE.MathUtils.clamp(pointerY + deltaY * 0.01, -0.55, 0.55)
        lastPointerX = event.clientX
        lastPointerY = event.clientY
      } else {
        pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.55
        pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.32
      }
    }
    const onPointerLeave = () => { if (!dragging) { pointerX = 0; pointerY = 0 } }
    const wave = () => { waveUntil = clock.getElapsedTime() + 2.3 }
    const onPointerDown = (event: PointerEvent) => {
      dragging = true
      activePointer = event.pointerId
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      movedDuringPress = false
      host.setPointerCapture(event.pointerId)
    }
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return
      if (!movedDuringPress) wave()
      dragging = false
      activePointer = -1
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        wave()
      } else if (event.key === 'ArrowLeft') { event.preventDefault(); pointerX = Math.max(-0.55, pointerX - 0.14) }
      else if (event.key === 'ArrowRight') { event.preventDefault(); pointerX = Math.min(0.55, pointerX + 0.14) }
      else if (event.key === 'ArrowUp') { event.preventDefault(); pointerY = Math.max(-0.32, pointerY - 0.1) }
      else if (event.key === 'ArrowDown') { event.preventDefault(); pointerY = Math.min(0.32, pointerY + 0.1) }
    }
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointerup', onPointerUp)
    host.addEventListener('pointercancel', onPointerUp)
    host.addEventListener('keydown', onKeyDown)

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(host.clientWidth, 1)
      const height = Math.max(host.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    })
    resizeObserver.observe(host)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setAnimationLoop(() => {
      const time = clock.getElapsedTime()
      if (!reducedMotion) {
        robot.position.y = Math.sin(time * 1.35) * 0.045
        robot.rotation.y += (pointerX - robot.rotation.y) * 0.075
        robot.rotation.x += (pointerY - robot.rotation.x) * 0.075
        head.rotation.z = Math.sin(time * 0.7) * 0.018
        arms[0].rotation.z = -0.04 + Math.sin(time * 1.1) * 0.025
        arms[1].rotation.z = time < waveUntil ? 2.45 + Math.sin(time * 13) * 0.32 : 0.04 + Math.sin(time * 1.1 + 0.7) * 0.025
        orbit.rotation.z = -0.32 + Math.sin(time * 0.35) * 0.02
      }
      renderer.render(scene, camera)
    })

    return () => {
      resizeObserver.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointerup', onPointerUp)
      host.removeEventListener('pointercancel', onPointerUp)
      host.removeEventListener('keydown', onKeyDown)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div className="robot-widget">
      <div className="orbital-3d" ref={hostRef} aria-label="Interactive mission robot. Drag to rotate, click or press Enter to wave, and use arrow keys to look around." role="button" tabIndex={0} />
      <span className="robot-hint"><i /> DRAG TO ROTATE · CLICK TO WAVE</span>
    </div>
  )
}
